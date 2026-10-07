const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');
const {
  ClinicStorage,
  clinicKey,
  normaliseState,
  safeChild,
  verifyFile
} = require('../src/clinic-storage');

const testRoot = path.join(__dirname, '.data');
const admin = { role: 'admin', userId: 'admin-1' };
const staff = { role: 'staff', userId: 'staff-1' };

before(async () => fs.rm(testRoot, { recursive: true, force: true }));
after(async () => fs.rm(testRoot, { recursive: true, force: true }));

test('namespaces persisted workspaces by clinic identity', async () => {
  const storage = new ClinicStorage(path.join(testRoot, 'namespaces'));
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
  const storage = new ClinicStorage(path.join(testRoot, 'legacy'));
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
  const storage = new ClinicStorage(path.join(testRoot, 'authorization'));
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

test('stores validated medical files with generated contained names', async () => {
  const storage = new ClinicStorage(path.join(testRoot, 'files'));
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
  const storage = new ClinicStorage(path.join(testRoot, 'file-numbers'));
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
  const storage = new ClinicStorage(path.join(testRoot, 'insurance-settlement'));
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
    }
  });
  assert.equal(state.payments[0].settledAmount, 170);
  assert.equal(state.payments[0].status, 'paid');
});

test('persists generated bill summaries for later listing and printing', async () => {
  const storage = new ClinicStorage(path.join(testRoot, 'bills'));
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
