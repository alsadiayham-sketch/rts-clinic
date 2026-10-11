'use strict';

const {
  amount,
  paymentCollected,
  paymentPendingInsurance
} = require('./clinic-domain');

const AUDIT_EVENT_CATEGORIES = Object.freeze([
  'patientCreated',
  'patientUpdated',
  'sessionCreated',
  'sessionUpdated',
  'sessionClosed',
  'paymentCreated',
  'paymentUpdated'
]);

const AUDIT_CATEGORY_BY_EVENT = Object.freeze({
  'patient:created': 'patientCreated',
  'patient:updated': 'patientUpdated',
  'session:created': 'sessionCreated',
  'session:updated': 'sessionUpdated',
  'session:closed': 'sessionClosed',
  'payment:created': 'paymentCreated',
  'payment:updated': 'paymentUpdated'
});

function asDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function localDateKey(value) {
  const date = asDate(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function followUpDate(session) {
  return typeof session?.followUpDate === 'string' && session.followUpDate
    ? session.followUpDate
    : typeof session?.followUp === 'string' ? session.followUp : '';
}

function followUpIsMaterialized(state, source) {
  const date = followUpDate(source);
  if (!date) return false;
  return safeArray(state.sessions).some((candidate) => candidate
    && candidate.id !== source.id
    && candidate.patientId === source.patientId
    && candidate.date === date
    && (!source.followUpTime || candidate.time === source.followUpTime));
}

function countAppointmentsToday(state, today) {
  const sessions = safeArray(state.sessions);
  const scheduledToday = sessions.filter((session) => session?.date === today).length;
  const followUpsToday = sessions.filter((session) => (
    followUpDate(session) === today && !followUpIsMaterialized(state, session)
  )).length;
  return scheduledToday + followUpsToday;
}

function countFollowUpsDue(state, today) {
  return safeArray(state.sessions).filter((session) => {
    const date = followUpDate(session);
    return Boolean(date) && date <= today && !followUpIsMaterialized(state, session);
  }).length;
}

function activeAccountsFromState(state) {
  const explicit = [
    state?.activeAccounts,
    state?.activeAccountCount,
    state?.activeStaffCount
  ].find((value) => Number.isSafeInteger(value) && value >= 0);
  if (explicit !== undefined) return explicit;

  const accounts = Array.isArray(state?.accounts)
    ? state.accounts
    : Array.isArray(state?.staff) ? state.staff : null;
  if (!accounts) return null;
  return accounts.filter((account) => account && (
    account.active === true || account.status === 'active'
  )).length;
}

function auditEventCounts(state) {
  const counts = Object.fromEntries(AUDIT_EVENT_CATEGORIES.map((category) => [category, 0]));
  safeArray(state.auditLog).forEach((entry) => {
    const category = AUDIT_CATEGORY_BY_EVENT[`${entry?.entityType}:${entry?.action}`];
    if (category) counts[category] += 1;
  });
  return counts;
}

function sumAuditCounts(counts) {
  return Object.values(counts).reduce((total, value) => total + value, 0);
}

function buildOwnerTelemetryPayload(state, {
  appVersion = 'unknown',
  now = new Date()
} = {}) {
  const currentDate = asDate(now);
  const today = localDateKey(currentDate);
  const sessions = safeArray(state?.sessions);
  const payments = safeArray(state?.payments);
  const auditCounts = auditEventCounts(state);
  const metrics = {
    terminalCount: 1,
    activeTerminalCount: 1,
    pendingSyncCount: 0,
    failedSyncCount: 0,
    databaseHealthy: true,
    syncHealthy: true,
    backupHealthy: true,
    appointmentsToday: countAppointmentsToday(state, today),
    waitingCount: sessions.filter((session) => session?.date === today && session?.status === 'open').length,
    completedSessionsToday: sessions.filter((session) => session?.date === today && session?.status === 'closed').length,
    followUpsDue: countFollowUpsDue(state, today),
    collectionsToday: amount(payments
      .filter((payment) => payment?.date === today)
      .reduce((total, payment) => total + paymentCollected(payment), 0)),
    outstandingInsurance: amount(payments.reduce(
      (total, payment) => total + paymentPendingInsurance(payment),
      0
    )),
    openSessions: sessions.filter((session) => session?.status === 'open').length
  };
  const activeAccounts = activeAccountsFromState(state);
  if (activeAccounts !== null) metrics.activeAccounts = activeAccounts;
  return {
    generatedAt: currentDate.toISOString(),
    appVersion: typeof appVersion === 'string' && /^\d+(?:\.\d+){1,3}(?:[-+][0-9A-Za-z.-]+)?$/.test(appVersion)
      ? appVersion.slice(0, 40)
      : '0.0.0',
    metrics,
    eventCounters: {
      auditEvents: sumAuditCounts(auditCounts),
      warningEvents: 0,
      errorEvents: 0,
      loginsSucceeded: 0,
      loginsFailed: 0,
      syncsSucceeded: 1,
      syncsFailed: 0,
      backupsSucceeded: 0,
      backupsFailed: 0,
      appointmentsCreated: auditCounts.sessionCreated,
      appointmentsCancelled: 0,
      sessionsCompleted: auditCounts.sessionClosed,
      paymentsRecorded: auditCounts.paymentCreated + auditCounts.paymentUpdated,
      followUpsCreated: 0
    }
  };
}

module.exports = {
  AUDIT_EVENT_CATEGORIES,
  buildOwnerTelemetryPayload,
  localDateKey
};
