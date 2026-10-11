const test = require('node:test');
const assert = require('node:assert/strict');
const {
  AUDIT_EVENT_CATEGORIES,
  buildOwnerTelemetryPayload
} = require('../src/clinic-telemetry');

test('builds clinic telemetry from aggregates without private record data', () => {
  const state = {
    patients: [{
      fullName: 'Patient Name',
      nationalId: '123456789',
      notes: 'Private note'
    }],
    sessions: [
      { id: 'session-1', patientId: 'patient-1', date: '2026-10-11', status: 'open' },
      { id: 'session-2', patientId: 'patient-2', date: '2026-10-11', status: 'closed', amount: 200 },
      { id: 'session-3', patientId: 'patient-3', date: '2026-10-12', status: 'open', followUpDate: '2026-10-11' }
    ],
    payments: [
      { id: 'payment-1', sessionId: 'session-2', date: '2026-10-11', method: 'cash', status: 'paid', amount: 120 },
      {
        id: 'payment-2',
        sessionId: 'session-2',
        date: '2026-10-11',
        method: 'insurance',
        status: 'pending',
        insuranceAmount: 80,
        settledAmount: 20,
        participationFee: 10
      }
    ],
    medicalFiles: [{ id: 'file-1', originalName: 'diagnosis.pdf', size: 10 }],
    auditLog: [
      { entityType: 'patient', action: 'created', entityId: 'patient-1', after: { fullName: 'Patient Name' } },
      { entityType: 'session', action: 'closed', entityId: 'session-2', after: { note: 'Private note' } },
      { entityType: 'payment', action: 'created', entityId: 'payment-2', after: { paymentId: 'payment-2' } }
    ]
  };

  const payload = buildOwnerTelemetryPayload(state, {
    appVersion: '1.0.11',
    now: new Date(2026, 9, 11, 12, 0, 0)
  });

  assert.equal(payload.generatedAt, new Date(2026, 9, 11, 12, 0, 0).toISOString());
  assert.equal(payload.appVersion, '1.0.11');
  assert.equal(payload.metrics.appointmentsToday, 3);
  assert.equal(payload.metrics.waitingCount, 1);
  assert.equal(payload.metrics.completedSessionsToday, 1);
  assert.equal(payload.metrics.followUpsDue, 1);
  assert.equal(payload.metrics.collectionsToday, 150);
  assert.equal(payload.metrics.outstandingInsurance, 60);
  assert.equal(payload.metrics.openSessions, 2);
  assert.equal(payload.eventCounters.auditEvents, 3);
  assert.equal(payload.eventCounters.sessionsCompleted, 1);
  assert.equal(payload.eventCounters.paymentsRecorded, 1);

  const serialized = JSON.stringify(payload);
  for (const forbidden of [
    'Patient Name',
    '123456789',
    'Private note',
    'diagnosis.pdf',
    'payment-2',
    'patient-1',
    'session-2'
  ]) {
    assert.equal(serialized.includes(forbidden), false, `telemetry leaked ${forbidden}`);
  }
  assert.equal(JSON.stringify(payload).includes(AUDIT_EVENT_CATEGORIES[0]), false);
});

test('includes active accounts only when an aggregate source is available', () => {
  const payload = buildOwnerTelemetryPayload({
    activeAccounts: 4,
    accounts: [
      { username: 'admin', active: true },
      { username: 'disabled', active: false }
    ]
  }, { now: new Date(2026, 9, 11) });

  assert.equal(payload.metrics.activeAccounts, 4);

  const derived = buildOwnerTelemetryPayload({
    staff: [
      { username: 'admin', status: 'active' },
      { username: 'staff', status: 'active' },
      { username: 'disabled', status: 'disabled' }
    ]
  }, { now: new Date(2026, 9, 11) });
  assert.equal(derived.metrics.activeAccounts, 2);
});
