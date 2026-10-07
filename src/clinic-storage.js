const fs = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');
const {
  amount,
  normalizePayment,
  patientFileNumber,
  paymentTotals,
  sessionFinancials
} = require('./clinic-domain');

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_FILES = {
  'application/pdf': { extensions: ['.pdf'], extension: '.pdf' },
  'image/jpeg': { extensions: ['.jpg', '.jpeg'], extension: '.jpg' },
  'image/png': { extensions: ['.png'], extension: '.png' },
  'image/webp': { extensions: ['.webp'], extension: '.webp' }
};
const PATIENT_FIELDS = [
  'fullName', 'fileNumber', 'dateOfBirth', 'sex', 'phone', 'nationalId', 'address',
  'emergencyContact', 'emergencyPhone', 'insuranceId', 'criticalNote', 'allergies',
  'conditions', 'medications', 'medicalNotes', 'notes'
];

function emptyState() {
  return {
    patients: [],
    sessions: [],
    payments: [],
    insurance: [],
    services: [],
    bills: [],
    medicalFiles: [],
    settings: { nextPatientSequence: 1 }
  };
}

function clinicKey(clinicId) {
  return createHash('sha256').update(String(clinicId)).digest('hex');
}

function safeChild(root, ...segments) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, ...segments);
  const relative = path.relative(resolvedRoot, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Unsafe storage path.');
  }
  return resolved;
}

function text(value, maxLength = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function validId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,120}$/.test(value);
}

function newId(prefix) {
  return `${prefix}-${randomUUID()}`;
}

function sanitizePatient(input = {}, existing = null, state = null) {
  const patient = {};
  PATIENT_FIELDS.forEach((field) => {
    patient[field] = text(input[field] ?? existing?.[field], field.includes('Notes') || field === 'notes' ? 20000 : 1000);
  });
  patient.fullName = patient.fullName.replace(/\s+/g, ' ');
  if (!patient.fullName) throw new Error('Patient name is required.');
  patient.sex = ['Male', 'Female'].includes(patient.sex) ? patient.sex : '';
  if (patient.insuranceId && state && !state.insurance.some((provider) => provider.id === patient.insuranceId)) {
    throw new Error('Select an insurance provider that belongs to this clinic.');
  }
  patient.name = patient.fullName;
  patient.criticalAlerts = Array.isArray(input.criticalAlerts)
    ? input.criticalAlerts.filter((item) => typeof item === 'string').slice(0, 20).map((item) => item.slice(0, 80))
    : Array.isArray(existing?.criticalAlerts) ? existing.criticalAlerts : [];
  patient.id = existing?.id || newId('patient');
  return patient;
}

function sanitizeSession(input = {}, state, existing = null) {
  const patientId = text(input.patientId ?? existing?.patientId, 120);
  if (patientId !== 'guest' && !state.patients.some((patient) => patient.id === patientId)) {
    throw new Error('Select a patient that belongs to this clinic.');
  }
  const date = text(input.date ?? existing?.date, 10);
  const time = text(input.time ?? existing?.time, 5);
  const service = text(input.service ?? existing?.service, 500);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !service) {
    throw new Error('Session date, time, patient, and service are required.');
  }
  const followUpDate = text(input.followUpDate ?? input.followUp ?? existing?.followUpDate ?? existing?.followUp, 10);
  const followUpTime = text(input.followUpTime ?? existing?.followUpTime, 5);
  if (followUpDate && !/^\d{4}-\d{2}-\d{2}$/.test(followUpDate)) throw new Error('Select a valid follow-up date.');
  if (followUpTime && !/^\d{2}:\d{2}$/.test(followUpTime)) throw new Error('Select a valid follow-up time.');
  return {
    id: existing?.id || newId('session'),
    patientId,
    date,
    time,
    service,
    treatment: text(input.treatment ?? existing?.treatment, 20000),
    note: text(input.note ?? existing?.note, 20000),
    followUp: followUpDate,
    followUpDate,
    followUpTime,
    closingNote: text(existing?.closingNote, 20000),
    status: existing?.status === 'closed' ? 'closed' : 'open',
    amount: existing?.status === 'closed' ? Number(existing.amount) : null
  };
}

function sanitizeMetadata(metadata = {}) {
  if (!validId(metadata.id) || !validId(metadata.recordId)) return null;
  if (!['patient', 'session'].includes(metadata.recordType)) return null;
  if (!/^[a-f0-9-]{36}\.(?:pdf|jpg|png|webp)$/.test(metadata.storageName || '') || !ALLOWED_FILES[metadata.mimeType]) return null;
  const size = Number(metadata.size);
  if (!Number.isFinite(size) || size <= 0 || size > MAX_UPLOAD_BYTES) return null;
  return {
    id: metadata.id,
    recordType: metadata.recordType,
    recordId: metadata.recordId,
    originalName: text(metadata.originalName, 180),
    storageName: metadata.storageName,
    mimeType: metadata.mimeType,
    size,
    uploadedAt: text(metadata.uploadedAt, 40),
    uploadedBy: text(metadata.uploadedBy, 200)
  };
}

function sanitizeService(input = {}) {
  const name = text(input.name, 500).replace(/\s+/g, ' ');
  if (!name) return null;
  return {
    id: validId(input.id) ? input.id : newId('service'),
    name
  };
}

function nextPatientSequence(patients) {
  return patients.reduce((highest, patient) => {
    const match = String(patient.fileNumber || '').match(/-(\d{1,12})$/);
    return match ? Math.max(highest, Number(match[1]) + 1) : highest;
  }, 1);
}

function normaliseState(raw) {
  const state = emptyState();
  if (!raw || typeof raw !== 'object') return state;
  state.patients = Array.isArray(raw.patients)
    ? raw.patients.filter((item) => item && typeof item === 'object').map((item) => {
      const patient = { ...item };
      delete patient.photo;
      patient.insuranceId = text(patient.insuranceId, 120);
      return patient;
    })
    : [];
  state.sessions = Array.isArray(raw.sessions) ? raw.sessions.filter((item) => item && typeof item === 'object') : [];
  state.payments = Array.isArray(raw.payments)
    ? raw.payments.filter((item) => item && typeof item === 'object').map(normalizePayment)
    : [];
  state.insurance = Array.isArray(raw.insurance) ? raw.insurance.filter((item) => item && typeof item === 'object') : [];
  state.services = Array.isArray(raw.services) ? raw.services.map(sanitizeService).filter(Boolean) : [];
  state.bills = Array.isArray(raw.bills)
    ? raw.bills.filter((item) => item && typeof item === 'object').map((bill) => ({
      ...bill,
      totals: bill.totals || paymentTotals(state.payments, { from: bill.from, to: bill.to }),
      summary: bill.summary || billSummary(state, bill.from, bill.to)
    }))
    : [];
  state.medicalFiles = Array.isArray(raw.medicalFiles) ? raw.medicalFiles.map(sanitizeMetadata).filter(Boolean) : [];
  const configuredSequence = Number(raw.settings?.nextPatientSequence);
  state.settings.nextPatientSequence = Number.isSafeInteger(configuredSequence) && configuredSequence > 0
    ? Math.max(configuredSequence, nextPatientSequence(state.patients))
    : nextPatientSequence(state.patients);
  return state;
}

function sanitizeLegacyState(raw, clinicId = 'legacy') {
  const source = normaliseState(raw);
  const state = emptyState();
  const patientIds = new Set();
  source.patients.slice(0, 10000).forEach((input) => {
    const fullName = text(input.fullName || input.name, 1000);
    if (!fullName) return;
    const patient = sanitizePatient({ ...input, fullName });
    if (validId(input.id)) patient.id = input.id;
    if (!patient.fileNumber) patient.fileNumber = allocatePatientFileNumber(state, clinicId);
    state.patients.push(patient);
    patientIds.add(patient.id);
  });
  source.sessions.slice(0, 50000).forEach((input) => {
    const date = text(input.date, 10);
    const time = text(input.time, 5);
    const service = text(input.service, 500);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !service) return;
    const patientId = input.patientId === 'guest' || patientIds.has(input.patientId) ? input.patientId : 'guest';
    const followUpDate = /^\d{4}-\d{2}-\d{2}$/.test(input.followUpDate || input.followUp || '')
      ? input.followUpDate || input.followUp
      : '';
    const followUpTime = /^\d{2}:\d{2}$/.test(input.followUpTime || '') ? input.followUpTime : '';
    const session = sanitizeSession({ ...input, patientId, date, time, service, followUpDate, followUpTime }, state);
    if (validId(input.id)) session.id = input.id;
    if (input.status === 'closed' && Number(input.amount) > 0) {
      session.status = 'closed';
      session.amount = Number(input.amount);
      session.closingNote = text(input.closingNote, 20000);
    }
    state.sessions.push(session);
  });
  const sessionIds = new Set(state.sessions.map((session) => session.id));
  source.insurance.slice(0, 5000).forEach((provider) => {
    const name = text(provider.name, 500);
    if (!name) return;
    state.insurance.push({
      id: validId(provider.id) ? provider.id : newId('ins'),
      name,
      contact: text(provider.contact, 1000)
    });
  });
  const insuranceIds = new Set(state.insurance.map((provider) => provider.id));
  source.services.slice(0, 5000).forEach((service) => {
    const sanitized = sanitizeService(service);
    if (sanitized && !state.services.some((item) => item.name.toLowerCase() === sanitized.name.toLowerCase())) {
      state.services.push(sanitized);
    }
  });
  source.payments.slice(0, 100000).forEach((payment) => {
    const session = state.sessions.find((item) => item.id === payment.sessionId);
    const amount = Number(payment.amount);
    if (!session || !sessionIds.has(payment.sessionId) || session.status !== 'closed' || !Number.isFinite(amount) || amount <= 0) return;
    const method = ['cash', 'debit', 'insurance'].includes(payment.method) ? payment.method : 'cash';
    const status = ['paid', 'pending', 'rejected', 'void'].includes(payment.status) ? payment.status : 'paid';
    state.payments.push(normalizePayment({
      id: validId(payment.id) ? payment.id : newId('payment'),
      sessionId: session.id,
      patientId: session.patientId,
      date: /^\d{4}-\d{2}-\d{2}$/.test(payment.date || '') ? payment.date : session.date,
      amount,
      method,
      insuranceId: method === 'insurance' && insuranceIds.has(payment.insuranceId) ? payment.insuranceId : '',
      status,
      participationFee: payment.participationFee,
      insuranceAmount: payment.insuranceAmount,
      settledAmount: payment.settledAmount,
      settlementDate: /^\d{4}-\d{2}-\d{2}$/.test(payment.settlementDate || '') ? payment.settlementDate : ''
    }));
  });
  source.bills.slice(0, 10000).forEach((bill) => {
    const from = /^\d{4}-\d{2}-\d{2}$/.test(bill.from || '') ? bill.from : '';
    const to = /^\d{4}-\d{2}-\d{2}$/.test(bill.to || '') ? bill.to : '';
    state.bills.push({
      id: validId(bill.id) ? bill.id : newId('bill'),
      from,
      to,
      generatedAt: text(bill.generatedAt, 40),
      totals: paymentTotals(state.payments, { from, to }),
      summary: billSummary(state, from, to),
      generatedBy: text(bill.generatedBy, 200)
    });
  });
  state.settings.nextPatientSequence = Math.max(
    Number(source.settings?.nextPatientSequence) || 1,
    nextPatientSequence(state.patients)
  );
  return state;
}

function billSummary(state, from, to) {
  const sessions = state.sessions.filter((session) => (
    session.status === 'closed'
    && (!from || session.date >= from)
    && (!to || session.date <= to)
  ));
  const sessionValue = amount(sessions.reduce((sum, session) => sum + Number(session.amount || 0), 0));
  const received = amount(sessions.reduce(
    (sum, session) => sum + sessionFinancials(session, state.payments).received,
    0
  ));
  return {
    sessionCount: sessions.length,
    sessionValue,
    received,
    outstanding: amount(Math.max(sessionValue - received, 0))
  };
}

function verifyFile(buffer, mimeType, originalName) {
  const extension = path.extname(originalName || '').toLowerCase();
  const extensionType = Object.entries(ALLOWED_FILES).find(([, candidate]) => candidate.extensions.includes(extension))?.[0];
  const normalizedType = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType;
  const detectedType = ALLOWED_FILES[normalizedType] ? normalizedType : extensionType;
  const rule = ALLOWED_FILES[detectedType];
  if (!rule || (ALLOWED_FILES[normalizedType] && !rule.extensions.includes(extension))) {
    throw new Error('Only PDF, JPG, PNG, and WebP files are allowed.');
  }
  if (!buffer.length || buffer.length > MAX_UPLOAD_BYTES) throw new Error('Medical files must be smaller than 10 MB.');
  const validSignature = detectedType === 'application/pdf'
    ? buffer.subarray(0, 5).toString() === '%PDF-'
    : detectedType === 'image/jpeg'
      ? buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
      : detectedType === 'image/png'
        ? buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        : buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP';
  if (!validSignature) throw new Error('The selected file content does not match its file type.');
  return { ...rule, mimeType: detectedType };
}

function allocatePatientFileNumber(state, clinicId) {
  let sequence = Math.max(1, Number(state.settings?.nextPatientSequence) || 1);
  let fileNumber = patientFileNumber(clinicId, sequence);
  const used = new Set(state.patients.map((patient) => patient.fileNumber));
  while (used.has(fileNumber)) {
    sequence += 1;
    fileNumber = patientFileNumber(clinicId, sequence);
  }
  state.settings.nextPatientSequence = sequence + 1;
  return fileNumber;
}

class ClinicStorage {
  constructor(userDataPath) {
    this.root = path.join(userDataPath, 'clinic-workspaces');
    this.migrationMarker = path.join(userDataPath, 'legacy-workspace-migration-v1.json');
    this.queues = new Map();
  }

  workspace(clinicId) {
    const directory = path.join(this.root, clinicKey(clinicId));
    return {
      directory,
      stateFile: path.join(directory, 'workspace.json'),
      filesDirectory: path.join(directory, 'medical-files')
    };
  }

  async load(clinicId) {
    const { stateFile } = this.workspace(clinicId);
    try {
      return normaliseState(JSON.parse(await fs.readFile(stateFile, 'utf8')));
    } catch (error) {
      if (error.code === 'ENOENT') return emptyState();
      if (error instanceof SyntaxError) throw new Error('The clinic workspace data is corrupted.');
      throw error;
    }
  }

  async save(clinicId, state) {
    const { directory, stateFile } = this.workspace(clinicId);
    await fs.mkdir(directory, { recursive: true });
    const temporary = safeChild(directory, `workspace-${randomUUID()}.tmp`);
    await fs.writeFile(temporary, JSON.stringify(normaliseState(state), null, 2), { encoding: 'utf8', mode: 0o600 });
    try {
      await fs.rename(temporary, stateFile);
    } catch (error) {
      if (!['EEXIST', 'EPERM'].includes(error.code)) {
        await fs.rm(temporary, { force: true });
        throw error;
      }
      await fs.rm(stateFile, { force: true });
      await fs.rename(temporary, stateFile);
    }
  }

  enqueue(clinicId, operation) {
    const key = clinicKey(clinicId);
    const previous = this.queues.get(key) || Promise.resolve();
    const result = previous.then(operation);
    const queueTail = result.then(() => undefined, () => undefined);
    this.queues.set(key, queueTail);
    queueTail.then(() => {
      if (this.queues.get(key) === queueTail) this.queues.delete(key);
    });
    return result;
  }

  async mutate(clinicId, session, action, payload = {}) {
    return this.enqueue(clinicId, async () => {
      const state = await this.load(clinicId);
      if (action === 'patient-upsert') {
        const existing = payload.patient?.id ? state.patients.find((patient) => patient.id === payload.patient.id) : null;
        if (payload.patient?.id && !existing) throw new Error('The patient record no longer exists.');
        const patient = sanitizePatient(payload.patient, existing, state);
        patient.fileNumber = existing?.fileNumber || allocatePatientFileNumber(state, clinicId);
        if (existing) state.patients[state.patients.indexOf(existing)] = patient;
        else state.patients.push(patient);
      } else if (action === 'session-create') {
        state.sessions.push(sanitizeSession(payload.session, state));
      } else if (action === 'session-close') {
        const target = state.sessions.find((item) => item.id === payload.sessionId);
        const amount = Number(payload.amount);
        if (!target || target.status !== 'open') throw new Error('This session cannot be closed.');
        if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a valid final session amount.');
        target.amount = amount;
        target.closingNote = text(payload.closingNote, 20000);
        target.status = 'closed';
      } else if (action === 'payment-create' || action === 'payment-update') {
        if (session.role !== 'admin') throw new Error('Only clinic administrators can manage payments.');
        const input = payload.payment || {};
        const existing = action === 'payment-update'
          ? state.payments.find((payment) => payment.id === input.id)
          : null;
        if (action === 'payment-update' && !existing) throw new Error('The payment record no longer exists.');
        const target = state.sessions.find((item) => item.id === input.sessionId);
        const method = input.method;
        const requestedStatus = input.status;
        if (!target || target.status !== 'closed') throw new Error('Payment must belong to a closed session.');
        if (!['cash', 'debit', 'insurance'].includes(method) || !['paid', 'pending', 'rejected'].includes(requestedStatus)) {
          throw new Error('Select a valid payment method and status.');
        }
        if (method === 'insurance' && !state.insurance.some((provider) => provider.id === input.insuranceId)) {
          throw new Error('Select an insurance provider for insurance payments.');
        }
        if (method !== 'insurance' && requestedStatus !== 'paid') throw new Error('Cash and debit payments must be recorded as paid.');
        const otherPayments = state.payments.filter((payment) => payment.id !== existing?.id);
        const financials = sessionFinancials(target, otherPayments);
        let normalized;
        if (method === 'insurance') {
          const participationFee = amount(input.participationFee);
          const insuranceAmount = amount(input.insuranceAmount);
          const settledAmount = amount(input.settledAmount);
          if (participationFee < 0 || insuranceAmount <= 0 || settledAmount < 0 || settledAmount > insuranceAmount) {
            throw new Error('Enter valid participation, insurance, and settled amounts.');
          }
          if (participationFee + insuranceAmount > financials.outstanding - financials.pendingInsurance + 0.005) {
            throw new Error('Insurance and participation amounts cannot exceed the unclaimed session balance.');
          }
          if (requestedStatus === 'paid' && settledAmount + 0.005 < insuranceAmount) {
            throw new Error('A received insurance payment must include the full insurance amount.');
          }
          normalized = normalizePayment({
            ...input,
            status: requestedStatus,
            amount: insuranceAmount,
            participationFee,
            insuranceAmount,
            settledAmount
          });
        } else {
          const directAmount = amount(input.amount);
          if (directAmount <= 0 || directAmount > financials.outstanding + 0.005) {
            throw new Error('Payment cannot exceed the outstanding session balance.');
          }
          normalized = normalizePayment({ ...input, amount: directAmount, status: 'paid' });
        }
        const payment = {
          ...normalized,
          id: existing?.id || newId('payment'),
          sessionId: target.id,
          patientId: target.patientId,
          date: /^\d{4}-\d{2}-\d{2}$/.test(input.date || '') ? input.date : target.date,
          method,
          insuranceId: method === 'insurance' ? input.insuranceId : '',
          settlementDate: method === 'insurance' && /^\d{4}-\d{2}-\d{2}$/.test(input.settlementDate || '')
            ? input.settlementDate
            : ''
        };
        if (existing) state.payments[state.payments.indexOf(existing)] = payment;
        else state.payments.push(payment);
      } else if (action === 'insurance-create') {
        if (session.role !== 'admin') throw new Error('Only clinic administrators can manage insurance providers.');
        const name = text(payload.provider?.name, 500);
        if (!name) throw new Error('Enter an insurance provider name.');
        if (state.insurance.some((provider) => provider.name.toLowerCase() === name.toLowerCase())) {
          throw new Error('This insurance provider already exists.');
        }
        state.insurance.push({ id: newId('ins'), name, contact: text(payload.provider.contact, 1000) });
      } else if (action === 'service-create') {
        if (session.role !== 'admin') throw new Error('Only clinic administrators can manage clinic services.');
        const service = sanitizeService(payload.service);
        if (!service) throw new Error('Enter a clinic service name.');
        if (state.services.some((item) => item.name.toLowerCase() === service.name.toLowerCase())) {
          throw new Error('This clinic service already exists.');
        }
        state.services.push(service);
      } else if (action === 'service-delete') {
        if (session.role !== 'admin') throw new Error('Only clinic administrators can manage clinic services.');
        const index = state.services.findIndex((service) => service.id === payload.serviceId);
        if (index < 0) throw new Error('The clinic service no longer exists.');
        state.services.splice(index, 1);
      } else if (action === 'bill-create') {
        if (session.role !== 'admin') throw new Error('Only clinic administrators can generate bills.');
        const from = text(payload.from, 10);
        const to = text(payload.to, 10);
        if ((from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) || (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) || (from && to && from > to)) {
          throw new Error('Select a valid report date range.');
        }
        state.bills.push({
          id: newId('bill'),
          from,
          to,
          generatedAt: new Date().toISOString(),
          totals: paymentTotals(state.payments, { from, to }),
          summary: billSummary(state, from, to),
          generatedBy: session.userId
        });
      } else {
        throw new Error('Unsupported clinic data operation.');
      }
      await this.save(clinicId, state);
      return state;
    });
  }

  async importLegacy(clinicId, raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('The legacy workspace data is invalid.');
    const serialized = JSON.stringify(raw);
    if (Buffer.byteLength(serialized, 'utf8') > MAX_IMPORT_BYTES) throw new Error('The legacy workspace is too large to migrate safely.');
    try {
      await fs.access(this.migrationMarker);
      return { imported: false, reason: 'already-handled', state: await this.load(clinicId) };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    return this.enqueue(clinicId, async () => {
      const current = await this.load(clinicId);
      const hasData = ['patients', 'sessions', 'payments', 'insurance', 'bills'].some((key) => current[key].length);
      if (hasData) return { imported: false, reason: 'workspace-not-empty', state: current };
      const migrated = sanitizeLegacyState(raw, clinicId);
      await this.save(clinicId, migrated);
      await fs.writeFile(this.migrationMarker, JSON.stringify({
        clinicKey: clinicKey(clinicId),
        migratedAt: new Date().toISOString()
      }), { encoding: 'utf8', mode: 0o600 });
      return { imported: true, state: migrated };
    });
  }

  assertRecord(state, recordType, recordId) {
    if (recordType === 'patient' && state.patients.some((patient) => patient.id === recordId)) return;
    if (recordType === 'session' && state.sessions.some((session) => session.id === recordId)) return;
    throw new Error('The requested medical record does not belong to this clinic.');
  }

  async listFiles(clinicId, recordType, recordId) {
    const state = await this.load(clinicId);
    this.assertRecord(state, recordType, recordId);
    return state.medicalFiles.filter((file) => file.recordType === recordType && file.recordId === recordId);
  }

  async uploadFile(clinicId, session, input = {}) {
    return this.enqueue(clinicId, async () => {
      const state = await this.load(clinicId);
      this.assertRecord(state, input.recordType, input.recordId);
      const buffer = Buffer.from(input.bytes || []);
      const rule = verifyFile(buffer, input.mimeType, input.originalName);
      const workspace = this.workspace(clinicId);
      await fs.mkdir(workspace.filesDirectory, { recursive: true });
      const storageName = `${randomUUID()}${rule.extension}`;
      const target = safeChild(workspace.filesDirectory, storageName);
      await fs.writeFile(target, buffer, { flag: 'wx', mode: 0o600 });
      const metadata = {
        id: newId('file'),
        recordType: input.recordType,
        recordId: input.recordId,
        originalName: path.basename(text(input.originalName, 180)).replace(/[\u0000-\u001f<>:"/\\|?*]/g, '_'),
        storageName,
        mimeType: rule.mimeType,
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
        uploadedBy: session.userId
      };
      state.medicalFiles.push(metadata);
      try {
        await this.save(clinicId, state);
      } catch (error) {
        await fs.rm(target, { force: true });
        throw error;
      }
      return metadata;
    });
  }

  async getFile(clinicId, fileId) {
    const state = await this.load(clinicId);
    const metadata = state.medicalFiles.find((file) => file.id === fileId);
    if (!metadata) throw new Error('The medical file no longer exists.');
    const workspace = this.workspace(clinicId);
    const source = safeChild(workspace.filesDirectory, metadata.storageName);
    const fileInfo = await fs.lstat(source);
    if (!fileInfo.isFile() || fileInfo.isSymbolicLink()) throw new Error('The medical file storage entry is invalid.');
    return { metadata, source };
  }

  async deleteFile(clinicId, session, fileId) {
    if (session.role !== 'admin') throw new Error('Only clinic administrators can delete medical files.');
    return this.enqueue(clinicId, async () => {
      const state = await this.load(clinicId);
      const index = state.medicalFiles.findIndex((file) => file.id === fileId);
      if (index < 0) throw new Error('The medical file no longer exists.');
      const [metadata] = state.medicalFiles.splice(index, 1);
      await this.save(clinicId, state);
      const workspace = this.workspace(clinicId);
      await fs.rm(safeChild(workspace.filesDirectory, metadata.storageName), { force: true });
      return { ok: true };
    });
  }
}

module.exports = {
  ALLOWED_FILES,
  MAX_UPLOAD_BYTES,
  ClinicStorage,
  clinicKey,
  emptyState,
  normaliseState,
  safeChild,
  sanitizeLegacyState,
  verifyFile
};
