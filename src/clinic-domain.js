'use strict';

function amount(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

function clinicPrefix(clinicId) {
  const normalized = String(clinicId || '')
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase();
  return (normalized || 'CLINIC').slice(0, 6).padEnd(4, 'X');
}

function patientFileNumber(clinicId, sequence) {
  const safeSequence = Number.isSafeInteger(Number(sequence)) && Number(sequence) > 0
    ? Number(sequence)
    : 1;
  return `${clinicPrefix(clinicId)}-${String(safeSequence).padStart(6, '0')}`;
}

function ageFromDate(dateOfBirth, asOf = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth || '')) return null;
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  const birth = new Date(year, month - 1, day);
  if (
    birth.getFullYear() !== year
    || birth.getMonth() !== month - 1
    || birth.getDate() !== day
  ) return null;
  let age = asOf.getFullYear() - year;
  if (asOf.getMonth() < month - 1 || (asOf.getMonth() === month - 1 && asOf.getDate() < day)) age -= 1;
  return age >= 0 && age <= 130 ? age : null;
}

function normalizePayment(payment = {}) {
  const method = ['cash', 'debit', 'insurance'].includes(payment.method) ? payment.method : 'cash';
  const status = ['paid', 'pending', 'rejected', 'void'].includes(payment.status) ? payment.status : 'paid';
  if (method !== 'insurance') {
    return {
      ...payment,
      method,
      status,
      amount: amount(payment.amount),
      participationFee: 0,
      insuranceAmount: 0,
      settledAmount: 0
    };
  }
  const insuranceAmount = amount(payment.insuranceAmount ?? payment.amount);
  const settledAmount = Math.min(insuranceAmount, amount(
    payment.settledAmount ?? (status === 'paid' ? insuranceAmount : 0)
  ));
  return {
    ...payment,
    method,
    status,
    amount: insuranceAmount,
    participationFee: amount(payment.participationFee),
    insuranceAmount,
    settledAmount
  };
}

function paymentCollected(payment = {}) {
  const normalized = normalizePayment(payment);
  if (normalized.status === 'void') return 0;
  if (normalized.method === 'insurance') {
    return amount(normalized.participationFee + normalized.settledAmount);
  }
  return normalized.status === 'paid' ? normalized.amount : 0;
}

function paymentPendingInsurance(payment = {}) {
  const normalized = normalizePayment(payment);
  if (normalized.method !== 'insurance' || normalized.status !== 'pending') return 0;
  return amount(Math.max(normalized.insuranceAmount - normalized.settledAmount, 0));
}

function sessionFinancials(session = {}, payments = []) {
  const active = payments.filter((payment) => payment.sessionId === session.id && payment.status !== 'void');
  const received = amount(active.reduce((sum, payment) => sum + paymentCollected(payment), 0));
  const pendingInsurance = amount(active.reduce((sum, payment) => sum + paymentPendingInsurance(payment), 0));
  const requestedInsurance = amount(active
    .filter((payment) => payment.method === 'insurance')
    .reduce((sum, payment) => sum + normalizePayment(payment).insuranceAmount, 0));
  const total = amount(session.status === 'closed' ? session.amount : 0);
  return {
    total,
    received,
    pendingInsurance,
    requestedInsurance,
    outstanding: amount(Math.max(total - received, 0)),
    unclaimed: amount(Math.max(total - received - pendingInsurance, 0))
  };
}

function paymentTotals(payments = [], filters = {}) {
  const byMethod = { cash: 0, debit: 0, insurance: 0 };
  let requestedInsurance = 0;
  let pendingInsurance = 0;
  payments
    .filter((payment) => payment.status !== 'void')
    .filter((payment) => !filters.from || payment.date >= filters.from)
    .filter((payment) => !filters.to || payment.date <= filters.to)
    .filter((payment) => !filters.providerId || payment.insuranceId === filters.providerId)
    .forEach((payment) => {
      const normalized = normalizePayment(payment);
      if (normalized.method === 'insurance') {
        byMethod.insurance = amount(byMethod.insurance + normalized.settledAmount);
        requestedInsurance = amount(requestedInsurance + normalized.insuranceAmount);
        pendingInsurance = amount(pendingInsurance + paymentPendingInsurance(normalized));
      } else if (normalized.status === 'paid') {
        byMethod[normalized.method] = amount(byMethod[normalized.method] + normalized.amount);
      }
    });
  const participation = amount(payments
    .filter((payment) => payment.status !== 'void' && payment.method === 'insurance')
    .filter((payment) => !filters.from || payment.date >= filters.from)
    .filter((payment) => !filters.to || payment.date <= filters.to)
    .filter((payment) => !filters.providerId || payment.insuranceId === filters.providerId)
    .reduce((sum, payment) => sum + normalizePayment(payment).participationFee, 0));
  return {
    byMethod,
    participation,
    requestedInsurance,
    pendingInsurance,
    total: amount(Object.values(byMethod).reduce((sum, value) => sum + value, 0) + participation)
  };
}

module.exports = {
  ageFromDate,
  amount,
  clinicPrefix,
  normalizePayment,
  patientFileNumber,
  paymentCollected,
  paymentPendingInsurance,
  paymentTotals,
  sessionFinancials
};
