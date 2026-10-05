const storeKey = 'rts_clinic_workspace_v1';
const state = JSON.parse(localStorage.getItem(storeKey) || 'null') || {
  patients: [], sessions: [], payments: [], insurance: [], bills: []
};

let dialogMode = '';
let pendingPaymentSessionId = '';
let calendarDate = new Date();

const $ = (id) => document.getElementById(id);
const money = (value) => `₪${Number(value || 0).toFixed(2)}`;
const today = () => new Date().toISOString().slice(0, 10);
const id = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const patientName = (patientId) => patientId === 'guest' ? 'Guest / unidentified' : state.patients.find((patient) => patient.id === patientId)?.name || 'Unknown patient';
const sessionById = (sessionId) => state.sessions.find((session) => session.id === sessionId);
const sessionLabel = (sessionId) => {
  const session = sessionById(sessionId);
  return session ? `${session.date} ${session.time || ''} · ${patientName(session.patientId)}` : 'Unknown session';
};

function migrateState() {
  state.sessions.forEach((session) => {
    if (!session.status) session.status = session.amount == null ? 'open' : 'closed';
    if (session.amount === undefined) session.amount = null;
  });
  state.payments.forEach((payment) => {
    if (!payment.patientId) payment.patientId = sessionById(payment.sessionId)?.patientId || 'guest';
  });
}

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
  $('syncState').textContent = 'Saved locally';
  renderAll();
}

function collectedPayments() {
  return state.payments.filter((payment) => payment.status !== 'void');
}

function sessionPayments(sessionId) {
  return collectedPayments().filter((payment) => payment.sessionId === sessionId);
}

function sessionCollected(sessionId) {
  return sessionPayments(sessionId).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function totals(from, to) {
  const payments = collectedPayments().filter((payment) => (!from || payment.date >= from) && (!to || payment.date <= to));
  const byMethod = { cash: 0, debit: 0, insurance: 0 };
  payments.forEach((payment) => { byMethod[payment.method] = (byMethod[payment.method] || 0) + Number(payment.amount || 0); });
  return { total: Object.values(byMethod).reduce((sum, value) => sum + value, 0), byMethod };
}

function renderDashboard() {
  const day = totals(today(), today());
  $('todayCollected').textContent = money(day.total);
  $('todaySessions').textContent = state.sessions.filter((session) => session.date === today()).length;
  $('totalPatients').textContent = state.patients.length;
  $('insuranceReceivable').textContent = money(state.payments.filter((payment) => payment.method === 'insurance' && payment.status !== 'paid' && payment.status !== 'void').reduce((sum, payment) => sum + Number(payment.amount || 0), 0));
  $('recentSessions').innerHTML = state.sessions.slice().reverse().slice(0, 6).map(sessionRow).join('') || '<p class="muted">No sessions yet.</p>';
  const max = Math.max(day.total, 1);
  $('paymentMix').innerHTML = Object.entries(day.byMethod).map(([method, amount]) => `<div><div class="row-card"><span>${method === 'debit' ? 'Debit card' : method[0].toUpperCase() + method.slice(1)}</span><strong>${money(amount)}</strong></div><div class="mix-bar"><span style="width:${Math.round(amount / max * 100)}%"></span></div></div>`).join('');
  renderCalendar();
  const upcoming = state.sessions.filter((session) => session.date >= today()).sort((a, b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`)).slice(0, 5);
  $('upcomingSessions').innerHTML = upcoming.map(sessionRow).join('') || '<p class="muted">No upcoming sessions.</p>';
}

function sessionRow(session) {
  const label = session.status === 'closed' ? money(session.amount) : 'Open';
  return `<button type="button" class="row-card row-button" data-session-id="${esc(session.id)}"><div><strong>${esc(patientName(session.patientId))}</strong><small>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</small></div><span class="pill">${label}</span></button>`;
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = (firstDay.getDay() + 6) % 7;
  $('calendarMonth').textContent = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(calendarDate);
  const cells = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => `<div class="calendar-weekday">${label}</div>`);
  for (let index = 0; index < leadingDays; index += 1) cells.push('<div class="calendar-day is-empty"></div>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const sessions = state.sessions.filter((session) => session.date === date);
    const classes = ['calendar-day'];
    if (date === today()) classes.push('is-today');
    cells.push(`<div class="${classes.join(' ')}"><span class="calendar-date">${day}</span>${sessions.slice(0, 3).map((session) => `<button type="button" class="calendar-event" data-session-id="${esc(session.id)}">${esc(session.time || '')} ${esc(patientName(session.patientId))}</button>`).join('')}${sessions.length > 3 ? `<small class="calendar-more">+${sessions.length - 3} more</small>` : ''}</div>`);
  }
  $('calendar').innerHTML = cells.join('');
}

function renderPatients() {
  const search = ($('patientSearch').value || '').toLowerCase();
  const patients = state.patients.filter((patient) => `${patient.name} ${patient.phone} ${patient.fileNumber}`.toLowerCase().includes(search));
  const rows = patients.map((patient) => {
    const sessions = state.sessions.filter((session) => session.patientId === patient.id);
    const collected = state.payments.filter((payment) => payment.patientId === patient.id && payment.status !== 'void').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return `<tr><td><span class="pill">${esc(patient.fileNumber || 'Not assigned')}</span></td><td><strong>${esc(patient.name)}</strong><br><small>${esc(patient.notes || '')}</small></td><td>${esc(patient.phone)}</td><td>${sessions.length}</td><td>${money(collected)}</td></tr>`;
  }).join('');
  $('patientsTable').innerHTML = rows ? `<table><thead><tr><th>File number</th><th>Patient</th><th>Phone</th><th>Sessions</th><th>Collected</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No patients found.</p>';
}

function renderSessions() {
  const rows = state.sessions.slice().reverse().map((session) => {
    const collected = sessionCollected(session.id);
    return `<tr class="clickable-row" data-session-id="${esc(session.id)}"><td>${esc(session.date)}<br><small>${esc(session.time || '')}</small></td><td>${esc(patientName(session.patientId))}</td><td>${esc(session.service)}</td><td>${session.status === 'closed' ? money(session.amount) : '<span class="pill">Open</span>'}</td><td>${money(collected)}</td><td>${session.status === 'closed' ? money(Number(session.amount) - collected) : '—'}</td></tr>`;
  }).join('');
  $('sessionsTable').innerHTML = rows ? `<table><thead><tr><th>Date / time</th><th>Patient</th><th>Service</th><th>Session value</th><th>Collected</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No sessions yet.</p>';
}

function renderPayments() {
  $('paymentsTable').innerHTML = `<table><thead><tr><th>Date</th><th>Patient</th><th>Session</th><th>Method</th><th>Insurance</th><th>Amount</th><th>Status</th></tr></thead><tbody>${collectedPayments().slice().reverse().map((payment) => `<tr><td>${esc(payment.date)}</td><td>${esc(patientName(payment.patientId))}</td><td>${esc(sessionLabel(payment.sessionId))}</td><td>${esc(payment.method)}</td><td>${esc(state.insurance.find((provider) => provider.id === payment.insuranceId)?.name || '')}</td><td>${money(payment.amount)}</td><td><span class="pill">${esc(payment.status || 'paid')}</span></td></tr>`).join('')}</tbody></table>`;
}

function renderInsurance() {
  $('insuranceList').innerHTML = state.insurance.map((provider) => `<div class="row-card"><div><strong>${esc(provider.name)}</strong><small>${esc(provider.contact || '')}</small></div><span class="pill">${state.payments.filter((payment) => payment.insuranceId === provider.id).length} claims</span></div>`).join('') || '<p class="muted">No providers configured.</p>';
  $('claimsList').innerHTML = state.payments.filter((payment) => payment.method === 'insurance' && payment.status !== 'void').map((payment) => `<div class="claim"><strong>${esc(patientName(payment.patientId))} · ${money(payment.amount)}</strong><small>${esc(state.insurance.find((provider) => provider.id === payment.insuranceId)?.name || 'Provider not selected')} · ${esc(payment.status || 'pending')}</small></div>`).join('') || '<p class="muted">No insurance claims.</p>';
}

function renderReports() {
  const from = $('reportFrom').value;
  const to = $('reportTo').value;
  const selectedSessions = state.sessions.filter((session) => (!from || session.date >= from) && (!to || session.date <= to));
  const result = totals(from, to);
  $('reportSummary').innerHTML = `<div class="metric-grid"><div class="metric"><span>Sessions</span><strong>${selectedSessions.length}</strong></div><div class="metric"><span>Collected</span><strong>${money(result.total)}</strong></div><div class="metric"><span>Cash</span><strong>${money(result.byMethod.cash)}</strong></div><div class="metric"><span>Insurance</span><strong>${money(result.byMethod.insurance)}</strong></div></div>`;
  $('reportsTable').innerHTML = `<table><thead><tr><th>Patient</th><th>Sessions</th><th>Session value</th><th>Collected</th><th>Balance</th></tr></thead><tbody>${state.patients.map((patient) => {
    const sessions = selectedSessions.filter((session) => session.patientId === patient.id);
    const value = sessions.reduce((sum, session) => sum + Number(session.amount || 0), 0);
    const collected = state.payments.filter((payment) => payment.patientId === patient.id && payment.status !== 'void' && (!from || payment.date >= from) && (!to || payment.date <= to)).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return sessions.length ? `<tr><td>${esc(patient.name)}</td><td>${sessions.length}</td><td>${money(value)}</td><td>${money(collected)}</td><td>${money(value - collected)}</td></tr>` : '';
  }).join('')}</tbody></table>`;
}

function renderAll() {
  renderDashboard();
  renderPatients();
  renderSessions();
  renderPayments();
  renderInsurance();
  renderReports();
}

function patientOptions() {
  return `<option value="guest">Guest / unidentified</option>${state.patients.map((patient) => `<option value="${esc(patient.id)}">${esc(patient.name)}</option>`).join('')}`;
}

function sessionOptions() {
  return state.sessions.filter((session) => session.status === 'closed').map((session) => `<option value="${esc(session.id)}">${esc(sessionLabel(session.id))} · ${money(session.amount)}</option>`).join('');
}

function openRecord(type, sessionId = '') {
  dialogMode = type;
  pendingPaymentSessionId = sessionId;
  const fields = {
    patient: `<label>Name<input name="name" required></label><label>File number<input name="fileNumber" required placeholder="e.g. CL-000123"></label><label>Phone<input name="phone"></label><label>Notes<textarea name="notes"></textarea></label>`,
    session: `<label>Patient<select name="patientId" required>${patientOptions()}</select></label><label>Date<input name="date" type="date" value="${today()}" required></label><label>Time<input name="time" type="time" required></label><label>Service<input name="service" required></label><label>Session note<textarea name="note"></textarea></label>`,
    payment: `<label>Session<select name="sessionId" required><option value="">Select closed session</option>${sessionOptions()}</select></label><label>Date<input name="date" type="date" value="${today()}" required></label><label>Amount<input name="amount" type="number" min="0.01" step="0.01" required></label><label>Method<select name="method"><option value="cash">Cash</option><option value="debit">Debit card</option><option value="insurance">Insurance</option></select></label><label>Insurance provider<select name="insuranceId"><option value="">Select provider</option>${state.insurance.map((provider) => `<option value="${esc(provider.id)}">${esc(provider.name)}</option>`).join('')}</select></label><label>Status<select name="status"><option value="paid">Paid</option><option value="pending">Pending / claim submitted</option><option value="rejected">Rejected</option></select></label>`
  };
  $('dialogTitle').textContent = type === 'patient' ? 'Add patient' : type === 'session' ? 'Add session' : 'Record payment';
  $('dialogFields').innerHTML = fields[type];
  if (type === 'payment' && sessionId) $('dialogFields').querySelector('[name="sessionId"]').value = sessionId;
  $('recordDialog').showModal();
}

function openSessionDetails(sessionId) {
  const session = sessionById(sessionId);
  if (!session) return;
  const payments = sessionPayments(session.id);
  const collected = sessionCollected(session.id);
  const remaining = session.status === 'closed' ? Number(session.amount) - collected : 0;
  $('sessionDetails').innerHTML = `<div class="detail-grid"><div><span class="muted">Patient</span><strong>${esc(patientName(session.patientId))}</strong></div><div><span class="muted">Date & time</span><strong>${esc(session.date)} ${esc(session.time || '')}</strong></div><div><span class="muted">Service</span><strong>${esc(session.service)}</strong></div><div><span class="muted">Status</span><strong>${session.status === 'closed' ? 'Closed' : 'Open'}</strong></div></div><p>${esc(session.note || 'No session note.')}</p><h4>Payments</h4>${payments.map((payment) => `<div class="row-card"><span>${esc(payment.method)} · ${esc(payment.status || 'paid')}</span><strong>${money(payment.amount)}</strong></div>`).join('') || '<p class="muted">No payments recorded.</p>'}${session.status === 'closed' ? `<div class="detail-total"><span>Collected / balance</span><strong>${money(collected)} / ${money(remaining)}</strong></div><div class="dialog-actions"><button type="button" class="primary" data-record-payment="${esc(session.id)}">Record payment</button></div>` : `<form id="closeSessionForm" class="form-grid"><label>Final session amount<input name="amount" type="number" min="0.01" step="0.01" required></label><label>Closing note<textarea name="closingNote"></textarea></label><div class="dialog-actions"><button class="primary" type="submit">Close session</button></div></form>`}`;
  $('sessionDialog').showModal();
  $('closeSessionForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    session.amount = Number(data.amount);
    session.closingNote = data.closingNote;
    session.status = 'closed';
    $('sessionDialog').close('saved');
    persist();
  });
}

migrateState();
$('enterApp').addEventListener('click', () => { $('login').classList.add('hidden'); $('app').classList.remove('hidden'); renderAll(); });
$('nav').addEventListener('click', (event) => { const button = event.target.closest('[data-page]'); if (!button) return; document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item === button)); document.querySelectorAll('.page').forEach((page) => page.classList.toggle('active', page.id === `page-${button.dataset.page}`)); $('pageTitle').textContent = button.textContent; });
document.querySelectorAll('[data-page-link]').forEach((button) => button.addEventListener('click', () => document.querySelector('[data-page="sessions"]').click()));
$('newPatient').addEventListener('click', () => openRecord('patient'));
$('newSession').addEventListener('click', () => openRecord('session'));
$('newPayment').addEventListener('click', () => openRecord('payment'));
$('closeRecord').addEventListener('click', () => { $('recordDialog').close('cancel'); dialogMode = ''; });
$('cancelRecord').addEventListener('click', () => { $('recordDialog').close('cancel'); dialogMode = ''; });
$('closeSession').addEventListener('click', () => $('sessionDialog').close('cancel'));
$('calendarPrev').addEventListener('click', () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1); renderCalendar(); });
$('calendarNext').addEventListener('click', () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1); renderCalendar(); });
$('patientSearch').addEventListener('input', renderPatients);
$('insuranceForm').addEventListener('submit', (event) => { event.preventDefault(); const name = $('insuranceName').value.trim(); if (!name) return; state.insurance.push({ id: id('ins'), name, contact: $('insuranceContact').value.trim() }); event.target.reset(); persist(); });
$('generateReport').addEventListener('click', () => { const bill = { id: id('bill'), from: $('reportFrom').value, to: $('reportTo').value, generatedAt: new Date().toISOString(), totals: totals($('reportFrom').value, $('reportTo').value) }; state.bills.push(bill); persist(); alert(`Bill generated: ${bill.id}`); });
$('exportData').addEventListener('click', () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `rts-clinic-${today()}.json`; link.click(); URL.revokeObjectURL(link.href); });
$('recordForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  if (dialogMode === 'patient') state.patients.push({ id: id('patient'), ...data });
  if (dialogMode === 'session') state.sessions.push({ id: id('session'), ...data, status: 'open', amount: null });
  if (dialogMode === 'payment') {
    const session = sessionById(data.sessionId);
    const amount = Number(data.amount);
    if (!session || session.status !== 'closed' || amount <= 0 || amount > Number(session.amount) - sessionCollected(session.id)) {
      alert('Payment must belong to a closed session and cannot exceed its remaining balance.');
      return;
    }
    if (data.method === 'insurance' && !data.insuranceId) {
      alert('Select an insurance provider for insurance payments.');
      return;
    }
    state.payments.push({ id: id('payment'), ...data, patientId: session.patientId, amount });
  }
  $('recordDialog').close('saved');
  dialogMode = '';
  persist();
});
document.addEventListener('click', (event) => {
  const sessionTarget = event.target.closest('[data-session-id]');
  if (sessionTarget) openSessionDetails(sessionTarget.dataset.sessionId);
  const paymentTarget = event.target.closest('[data-record-payment]');
  if (paymentTarget) { $('sessionDialog').close('cancel'); openRecord('payment', paymentTarget.dataset.recordPayment); }
});
renderAll();
