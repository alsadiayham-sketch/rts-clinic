const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ageFromDate,
  patientFileNumber,
  paymentTotals,
  sessionFinancials
} = require('../src/clinic-domain');

test('creates stable readable clinic-scoped patient file numbers', () => {
  assert.equal(patientFileNumber('north-clinic', 12), 'NORTHC-000012');
  assert.equal(patientFileNumber('north-clinic', 12), 'NORTHC-000012');
  assert.notEqual(patientFileNumber('south-clinic', 12), patientFileNumber('north-clinic', 12));
});

test('calculates age at the requested date', () => {
  assert.equal(ageFromDate('2000-10-09', new Date(2026, 9, 8)), 25);
  assert.equal(ageFromDate('2000-10-08', new Date(2026, 9, 8)), 26);
  assert.equal(ageFromDate('not-a-date', new Date(2026, 9, 8)), null);
});

test('keeps pending insurance in outstanding while separating participation and settlement', () => {
  const session = { id: 'session-1', status: 'closed', amount: 200 };
  const payments = [{
    id: 'payment-1',
    sessionId: session.id,
    method: 'insurance',
    status: 'pending',
    participationFee: 30,
    insuranceAmount: 170,
    settledAmount: 40
  }];
  assert.deepEqual(sessionFinancials(session, payments), {
    total: 200,
    received: 70,
    pendingInsurance: 130,
    requestedInsurance: 170,
    outstanding: 130,
    unclaimed: 0
  });
});

test('insurance totals exclude participation from requested and received claim totals', () => {
  const totals = paymentTotals([{
    method: 'insurance',
    status: 'pending',
    date: '2026-10-08',
    participationFee: 20,
    insuranceAmount: 100,
    settledAmount: 30
  }], { from: '2026-10-01', to: '2026-10-31' });
  assert.equal(totals.requestedInsurance, 100);
  assert.equal(totals.byMethod.insurance, 30);
  assert.equal(totals.participation, 20);
  assert.equal(totals.pendingInsurance, 70);
  assert.equal(totals.total, 50);
});
