const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');
const {
  ClinicStorage,
  clinicKey,
  isEncrypted,
  normaliseState,
  safeChild,
  verifyFile
} = require('../src/clinic-storage');

const testRoot = path.join(__dirname, '.data');
const admin = { role: 'admin', userId: 'admin-1', userName: 'Clinic Admin' };
const staff = { role: 'staff', userId: 'staff-1', userName: 'Clinic Staff' };

function testKeyProtector(key = Buffer.alloc(32, 7)) {
  return {
    getKey: async () => key,
    exportWrappedKey: async () => key,
    unwrapKey: async (wrappedKey) => Buffer.from(wrappedKey)
  };
}

function createStorage(name, keyProtector = testKeyProtector()) {
  return new ClinicStorage(path.join(testRoot, name), keyProtector);
}

before(async () => fs.rm(testRoot, { recursive: true, force: true }));
after(async () => fs.rm(testRoot, { recursive: true, force: true }));

test('namespaces persisted workspaces by clinic identity', async () => {
  const storage = createStorage('namespaces');
  await storage.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Patient A', fileNumber: 'A-1' }
  });

  const clinicA = await storage.load('clinic-a');
  const clinicB = await storage.load('clinic-b');
  assert.equal(clinicA.patients.length, 1);
  assert.equal(clinicB.patients.length, 0);
  assert.notEqual(clinicKey('clinic-a'), clinicKey('clinic-b'));
});

test('drops deprecated profile photo data during normalization', () => {
  const state = normaliseState({
    patients: [{ id: 'patient-1', fullName: 'Patient A', photo: 'data:image/png;base64,AAAA' }]
  });
  assert.equal('photo' in state.patients[0], false);
});

test('allows legacy unscoped data to be claimed by only one clinic namespace', async () => {
  const storage = createStorage('legacy');
  const first = await storage.importLegacy('clinic-a', {
    patients: [{ id: 'patient-legacy', fullName: 'Legacy Patient', fileNumber: 'L-1' }]
  });
  const second = await storage.importLegacy('clinic-b', {
    patients: [{ id: 'patient-other', fullName: 'Other Patient', fileNumber: 'O-1' }]
  });

  assert.equal(first.imported, true);
  assert.equal(first.state.patients.length, 1);
  assert.equal(second.imported, false);
  assert.equal(second.reason, 'already-handled');
  assert.equal(second.state.patients.length, 0);
});

test('enforces admin-only payment mutations in the persistence layer', async () => {
  const storage = createStorage('authorization');
  let state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Patient A', fileNumber: 'A-1' }
  });
  state = await storage.mutate('clinic-a', staff, 'session-create', {
    session: {
      patientId: state.patients[0].id,
      date: '2026-10-07',
      time: '12:00',
      service: 'Consultation'
    }
  });
  await storage.mutate('clinic-a', staff, 'session-close', {
    sessionId: state.sessions[0].id,
    expectedRevision: state.sessions[0].revision,
    amount: 100
  });

  await assert.rejects(
    storage.mutate('clinic-a', staff, 'payment-create', {
      payment: {
        sessionId: state.sessions[0].id,
        date: '2026-10-07',
        amount: 50,
        method: 'cash',
        status: 'paid'
      }
    }),
    /administrators/
  );
  const paidState = await storage.mutate('clinic-a', admin, 'payment-create', {
    payment: {
      sessionId: state.sessions[0].id,
      date: '2026-10-07',
      amount: 50,
      method: 'cash',
      status: 'paid'
    }
  });
  assert.equal(paidState.payments.length, 1);
});

test('prevents direct payments from consuming pending insurance allocation', async () => {
  const storage = createStorage('mixed-payment-allocation');
  let state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Patient A' }
  });
  state = await storage.mutate('clinic-a', staff, 'session-create', {
    session: {
      patientId: state.patients[0].id,
      date: '2026-10-14',
      time: '12:00',
      service: 'Consultation'
    }
  });
  state = await storage.mutate('clinic-a', staff, 'session-close', {
    sessionId: state.sessions[0].id,
    expectedRevision: state.sessions[0].revision,
    amount: 100
  });
  state = await storage.mutate('clinic-a', admin, 'insurance-create', {
    provider: { name: 'Provider A' }
  });
  state = await storage.mutate('clinic-a', admin, 'payment-create', {
    payment: {
      sessionId: state.sessions[0].id,
      date: '2026-10-14',
      method: 'insurance',
      status: 'pending',
      insuranceId: state.insurance[0].id,
      insuranceAmount: 80,
      participationFee: 0,
      settledAmount: 0
    }
  });

  await assert.rejects(
    storage.mutate('clinic-a', admin, 'payment-create', {
      payment: {
        sessionId: state.sessions[0].id,
        date: '2026-10-14',
        amount: 50,
        method: 'cash',
        status: 'paid'
      }
    }),
    /unclaimed session balance/
  );

  const paidState = await storage.mutate('clinic-a', admin, 'payment-create', {
    payment: {
      sessionId: state.sessions[0].id,
      date: '2026-10-14',
      amount: 20,
      method: 'cash',
      status: 'paid'
    }
  });
  assert.equal(paidState.payments.length, 2);
});

test('stores validated medical files with generated contained names', async () => {
  const storage = createStorage('files');
  const state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Patient A', fileNumber: 'A-1' }
  });
  const pdf = Buffer.from('%PDF-1.7\nmedical record');
  const metadata = await storage.uploadFile('clinic-a', staff, {
    recordType: 'patient',
    recordId: state.patients[0].id,
    originalName: '..\\unsafe-name.pdf',
    mimeType: 'application/pdf',
    bytes: pdf
  });

  assert.match(metadata.storageName, /^[a-f0-9-]{36}\.pdf$/);
  assert.equal(metadata.originalName, 'unsafe-name.pdf');
  assert.equal((await storage.listFiles('clinic-a', 'patient', state.patients[0].id)).length, 1);
  assert.throws(() => safeChild(path.join(testRoot, 'files'), '..', 'escape.pdf'), /Unsafe storage path/);
  assert.throws(() => verifyFile(Buffer.from('not a pdf'), 'application/pdf', 'fake.pdf'), /does not match/);
  await assert.rejects(storage.deleteFile('clinic-a', staff, metadata.id), /administrators/);
  await storage.deleteFile('clinic-a', admin, metadata.id);
  assert.equal((await storage.listFiles('clinic-a', 'patient', state.patients[0].id)).length, 0);
});

test('auto-generates sequential clinic-scoped patient file numbers', async () => {
  const storage = createStorage('file-numbers');
  let state = await storage.mutate('north-clinic', staff, 'patient-upsert', {
    patient: { fullName: 'First Patient' }
  });
  state = await storage.mutate('north-clinic', staff, 'patient-upsert', {
    patient: { fullName: 'Second Patient' }
  });
  const otherClinic = await storage.mutate('south-clinic', staff, 'patient-upsert', {
    patient: { fullName: 'Third Patient' }
  });

  assert.deepEqual(state.patients.map((patient) => patient.fileNumber), [
    'NORTHC-000001',
    'NORTHC-000002'
  ]);
  assert.equal(otherClinic.patients[0].fileNumber, 'SOUTHC-000001');
});

test('tracks partial insurance settlement without clearing the outstanding balance', async () => {
  const storage = createStorage('insurance-settlement');
  let state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Patient A' }
  });
  state = await storage.mutate('clinic-a', staff, 'session-create', {
    session: {
      patientId: state.patients[0].id,
      date: '2026-10-08',
      time: '10:00',
      service: 'Consultation'
    }
  });
  state = await storage.mutate('clinic-a', staff, 'session-close', {
    sessionId: state.sessions[0].id,
    expectedRevision: state.sessions[0].revision,
    amount: 200
  });
  state = await storage.mutate('clinic-a', admin, 'insurance-create', {
    provider: { name: 'Provider A' }
  });
  state = await storage.mutate('clinic-a', admin, 'payment-create', {
    payment: {
      sessionId: state.sessions[0].id,
      date: '2026-10-08',
      method: 'insurance',
      insuranceId: state.insurance[0].id,
      participationFee: 30,
      insuranceAmount: 170,
      settledAmount: 40,
      status: 'pending'
    }
  });

  assert.equal(state.payments[0].participationFee, 30);
  assert.equal(state.payments[0].insuranceAmount, 170);
  assert.equal(state.payments[0].settledAmount, 40);
  assert.equal(state.payments[0].status, 'pending');

  state = await storage.mutate('clinic-a', admin, 'payment-update', {
    payment: {
      id: state.payments[0].id,
      sessionId: state.sessions[0].id,
      date: '2026-10-08',
      settlementDate: '2026-10-10',
      method: 'insurance',
      insuranceId: state.insurance[0].id,
      participationFee: 30,
      insuranceAmount: 170,
      settledAmount: 170,
      status: 'paid'
    },
    expectedRevision: state.payments[0].revision,
    changeReason: 'Insurance company settled the claim.'
  });
  assert.equal(state.payments[0].settledAmount, 170);
  assert.equal(state.payments[0].status, 'paid');
});

test('persists generated bill summaries for later listing and printing', async () => {
  const storage = createStorage('bills');
  let state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Patient A' }
  });
  state = await storage.mutate('clinic-a', staff, 'session-create', {
    session: {
      patientId: state.patients[0].id,
      date: '2026-10-08',
      time: '10:00',
      service: 'Consultation'
    }
  });
  state = await storage.mutate('clinic-a', staff, 'session-close', {
    sessionId: state.sessions[0].id,
    expectedRevision: state.sessions[0].revision,
    amount: 150
  });
  await storage.mutate('clinic-a', admin, 'bill-create', {
    from: '2026-10-01',
    to: '2026-10-31'
  });

  const reloaded = await storage.load('clinic-a');
  assert.equal(reloaded.bills.length, 1);
  assert.deepEqual(reloaded.bills[0].summary, {
    sessionCount: 1,
    sessionValue: 150,
    received: 0,
    outstanding: 150
  });
});

test('preserves immutable patient, session, and payment versions with before and after snapshots', async () => {
    const storage = createStorage('audit-history');
    let state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
      patient: { fullName: 'Patient A', phone: '0500000000' }
    });
    const patient = state.patients[0];
    state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
      patient: { ...patient, phone: '0501111111' },
      expectedRevision: patient.revision,
      changeReason: 'Patient provided a new phone number.'
    });
    assert.equal(state.patients[0].revision, 2);

    state = await storage.mutate('clinic-a', staff, 'session-create', {
      session: {
        patientId: state.patients[0].id,
        date: '2026-10-08',
        time: '09:30',
        service: 'Consultation',
        note: 'Initial note'
      }
    });
    let clinicalSession = state.sessions[0];
    state = await storage.mutate('clinic-a', staff, 'session-update', {
      session: { ...clinicalSession, note: 'Corrected clinical note' },
      expectedRevision: clinicalSession.revision,
      changeReason: 'Corrected the visit summary.'
    });
    clinicalSession = state.sessions[0];
    state = await storage.mutate('clinic-a', staff, 'session-close', {
      sessionId: clinicalSession.id,
      expectedRevision: clinicalSession.revision,
      amount: 120,
      closingNote: 'Completed'
    });

    state = await storage.mutate('clinic-a', admin, 'payment-create', {
      payment: {
        sessionId: state.sessions[0].id,
        date: '2026-10-08',
        amount: 120,
        method: 'cash',
        status: 'paid'
      }
    });
    const payment = state.payments[0];
    state = await storage.mutate('clinic-a', admin, 'payment-update', {
      payment: { ...payment, date: '2026-10-09' },
      expectedRevision: payment.revision,
      changeReason: 'Corrected the receipt date.'
    });

    const patientEdit = state.auditLog.find((entry) => entry.entityType === 'patient' && entry.action === 'updated');
    assert.equal(patientEdit.before.phone, '0500000000');
    assert.equal(patientEdit.after.phone, '0501111111');
    assert.equal(patientEdit.reason, 'Patient provided a new phone number.');
    assert.equal(patientEdit.changedByName, 'Clinic Staff');

    const sessionVersions = state.auditLog.filter((entry) => entry.entityType === 'session');
    assert.deepEqual(sessionVersions.map((entry) => entry.version), [1, 2, 3]);
    assert.equal(sessionVersions[1].before.note, 'Initial note');
    assert.equal(sessionVersions[1].after.note, 'Corrected clinical note');

    const paymentEdit = state.auditLog.find((entry) => entry.entityType === 'payment' && entry.action === 'updated');
    assert.equal(paymentEdit.before.date, '2026-10-08');
    assert.equal(paymentEdit.after.date, '2026-10-09');
    assert.equal(paymentEdit.version, 2);

    const reloaded = await storage.load('clinic-a');
    assert.deepEqual(reloaded.auditLog, state.auditLog);
});

test('rejects stale edits and unsafe closed-session financial corrections', async () => {
    const storage = createStorage('version-conflicts');
    let state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
      patient: { fullName: 'Patient A' }
    });

    const stalePatient = { ...state.patients[0] };
    state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
      patient: { ...stalePatient, phone: '0500000000' },
      expectedRevision: stalePatient.revision,
      changeReason: 'Added phone.'
    });

    await assert.rejects(
      storage.mutate('clinic-a', staff, 'patient-upsert', {
        patient: { ...stalePatient, phone: '0509999999' },
        expectedRevision: stalePatient.revision,
        changeReason: 'Stale edit.'
      }),
      /changed after you opened/
    );

    state = await storage.mutate('clinic-a', staff, 'session-create', {
      session: {
        patientId: state.patients[0].id,
        date: '2026-10-08',
        time: '10:00',
        service: 'Consultation'
      }
    });
    state = await storage.mutate('clinic-a', staff, 'session-close', {
      sessionId: state.sessions[0].id,
      expectedRevision: state.sessions[0].revision,
      amount: 200
    });
    state = await storage.mutate('clinic-a', admin, 'payment-create', {
      payment: {
        sessionId: state.sessions[0].id,
        date: '2026-10-08',
        amount: 150,
        method: 'cash',
        status: 'paid'
      }
    });

    await assert.rejects(
      storage.mutate('clinic-a', staff, 'session-update', {
        session: { ...state.sessions[0], amount: 180 },
        expectedRevision: state.sessions[0].revision,
        changeReason: 'Staff correction.'
      }),
      /administrators/
    );
    await assert.rejects(
      storage.mutate('clinic-a', staff, 'session-update', {
        session: { ...state.sessions[0], date: '2026-11-15' },
        expectedRevision: state.sessions[0].revision,
        changeReason: 'Move historical revenue.'
      }),
      /date, time, or service/
    );
    await assert.rejects(
      storage.mutate('clinic-a', admin, 'session-update', {
        session: { ...state.sessions[0], amount: 100 },
        expectedRevision: state.sessions[0].revision,
        changeReason: 'Invalid correction.'
      }),
      /cannot be lower/
    );
});

test('persists the next-session appointment when a session is closed', async () => {
  const storage = createStorage('follow-up-calendar');
  let state = await storage.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Patient A' }
  });
  state = await storage.mutate('clinic-a', staff, 'session-create', {
    session: {
      patientId: state.patients[0].id,
      date: '2026-10-08',
      time: '10:00',
      service: 'Consultation'
    }
  });
  state = await storage.mutate('clinic-a', staff, 'session-close', {
    sessionId: state.sessions[0].id,
    expectedRevision: state.sessions[0].revision,
    amount: 100,
    followUpDate: '2026-10-15',
    followUpTime: '11:30'
  });

  assert.equal(state.sessions[0].followUpDate, '2026-10-15');
  assert.equal(state.sessions[0].followUpTime, '11:30');
  assert.equal(state.auditLog.at(-1).after.followUpDate, '2026-10-15');
});

test('migrates plaintext workspaces and medical files to authenticated encryption', async () => {
  const userDataPath = path.join(testRoot, 'plaintext-migration');
  const storage = new ClinicStorage(userDataPath, testKeyProtector());
  const workspace = storage.workspace('clinic-a');
  const pdf = Buffer.from('%PDF-1.7\nlegacy medical record');
  const state = normaliseState({
    patients: [{ id: 'patient-1', fullName: 'Sensitive Patient', fileNumber: 'A-1' }],
    medicalFiles: [{
      id: 'file-1',
      recordType: 'patient',
      recordId: 'patient-1',
      originalName: 'record.pdf',
      storageName: '00000000-0000-4000-8000-000000000001.pdf',
      mimeType: 'application/pdf',
      size: pdf.length,
      uploadedAt: '2026-10-14T10:00:00.000Z',
      uploadedBy: 'staff-1'
    }]
  });
  await fs.mkdir(workspace.filesDirectory, { recursive: true });
  await fs.writeFile(workspace.stateFile, JSON.stringify(state));
  await fs.writeFile(path.join(workspace.filesDirectory, '00000000-0000-4000-8000-000000000001.pdf'), pdf);

  const loaded = await storage.load('clinic-a');
  const encryptedState = await fs.readFile(workspace.stateFile);
  const encryptedFile = await fs.readFile(path.join(workspace.filesDirectory, '00000000-0000-4000-8000-000000000001.pdf'));
  assert.equal(loaded.patients[0].fullName, 'Sensitive Patient');
  assert.equal(isEncrypted(encryptedState), true);
  assert.equal(isEncrypted(encryptedFile), true);
  assert.equal(encryptedState.includes(Buffer.from('Sensitive Patient')), false);
  assert.equal(encryptedFile.includes(Buffer.from('legacy medical record')), false);
  assert.deepEqual((await storage.getFile('clinic-a', 'file-1')).bytes, pdf);
});

test('fails closed when encrypted workspace integrity or the encryption key is wrong', async () => {
  const userDataPath = path.join(testRoot, 'decryption-failure');
  const storage = new ClinicStorage(userDataPath, testKeyProtector(Buffer.alloc(32, 3)));
  await storage.mutate('clinic-a', staff, 'patient-upsert', { patient: { fullName: 'Patient A' } });

  const wrongKeyStorage = new ClinicStorage(userDataPath, testKeyProtector(Buffer.alloc(32, 4)));
  await assert.rejects(wrongKeyStorage.load('clinic-a'), /could not be decrypted|integrity check/);

  const workspace = storage.workspace('clinic-a');
  const encrypted = await fs.readFile(workspace.stateFile);
  encrypted[encrypted.length - 1] ^= 0xff;
  await fs.writeFile(workspace.stateFile, encrypted);
  await assert.rejects(storage.load('clinic-a'), /could not be decrypted|integrity check/);
});

test('exports and restores an authenticated OS-bound backup with medical files', async () => {
  const source = createStorage('backup-source', testKeyProtector(Buffer.alloc(32, 5)));
  let state = await source.mutate('clinic-a', staff, 'patient-upsert', {
    patient: { fullName: 'Backup Patient' }
  });
  const pdf = Buffer.from('%PDF-1.7\nprotected backup file');
  await source.uploadFile('clinic-a', staff, {
    recordType: 'patient',
    recordId: state.patients[0].id,
    originalName: 'backup.pdf',
    mimeType: 'application/pdf',
    bytes: pdf
  });

  const backup = await source.exportProtected('clinic-a');
  assert.equal(backup.includes(Buffer.from('Backup Patient')), false);
  assert.equal(backup.includes(Buffer.from('protected backup file')), false);

  const destination = createStorage('backup-destination', testKeyProtector(Buffer.alloc(32, 9)));
  state = await destination.restoreProtected('clinic-a', backup);
  assert.equal(state.patients[0].fullName, 'Backup Patient');
  const restored = await destination.getFile('clinic-a', state.medicalFiles[0].id);
  assert.deepEqual(restored.bytes, pdf);
  await assert.rejects(destination.restoreProtected('clinic-b', backup), /does not belong/);
});
