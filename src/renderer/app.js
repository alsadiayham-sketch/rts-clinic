const storeKey = 'rts_clinic_workspace_v1';
const state = JSON.parse(localStorage.getItem(storeKey) || 'null') || {
  patients: [], sessions: [], payments: [], insurance: [], bills: []
};
let dialogMode = '';

const $ = (id) => document.getElementById(id);
const money = (value) => `₪${Number(value || 0).toFixed(2)}`;
const today = () => new Date().toISOString().slice(0, 10);
const id = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const patientName = (patientId) => state.patients.find((p) => p.id === patientId)?.name || 'Unknown patient';
const sessionLabel = (sessionId) => state.sessions.find((s) => s.id === sessionId)?.date || 'Unknown session';

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
  $('syncState').textContent = 'Saved locally';
  renderAll();
}

function collectedPayments() {
  return state.payments.filter((payment) => payment.status !== 'void');
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
  $('insuranceReceivable').textContent = money(state.payments.filter((p) => p.method === 'insurance' && p.status !== 'paid').reduce((sum, p) => sum + Number(p.amount || 0), 0));
  $('recentSessions').innerHTML = state.sessions.slice().reverse().slice(0, 6).map((session) => `<div class="row-card"><div><strong>${esc(patientName(session.patientId))}</strong><small>${esc(session.date)} · ${esc(session.service)}</small></div><span class="pill">${money(session.amount)}</span></div>`).join('') || '<p class="muted">No sessions yet.</p>';
  const mix = day.byMethod;
  const max = Math.max(day.total, 1);
  $('paymentMix').innerHTML = Object.entries(mix).map(([method, amount]) => `<div><div class="row-card"><span>${method === 'debit' ? 'Debit card' : method[0].toUpperCase() + method.slice(1)}</span><strong>${money(amount)}</strong></div><div class="mix-bar"><span style="width:${Math.round(amount / max * 100)}%"></span></div></div>`).join('');
}

function renderPatients() {
  const search = ($('patientSearch').value || '').toLowerCase();
  const patients = state.patients.filter((patient) => `${patient.name} ${patient.phone}`.toLowerCase().includes(search));
  $('patientsTable').innerHTML = `<table><thead><tr><th>Patient</th><th>Phone</th><th>Sessions</th><th>Collected</th></tr></thead><tbody>${patients.map((patient) => {
    const sessions = state.sessions.filter((session) => session.patientId === patient.id);
    const collected = state.payments.filter((payment) => payment.patientId === patient.id).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return `<tr><td><strong>${esc(patient.name)}</strong><br><small>${esc(patient.notes || '')}</small></td><td>${esc(patient.phone)}</td><td>${sessions.length}</td><td>${money(collected)}</td></tr>`;
  }).join('')}</tbody></table>` || '<p class="muted">No patients found.</p>';
}

function renderSessions() {
  $('sessionsTable').innerHTML = `<table><thead><tr><th>Date</th><th>Patient</th><th>Service</th><th>Session value</th><th>Collected</th><th>Balance</th></tr></thead><tbody>${state.sessions.slice().reverse().map((session) => {
    const collected = state.payments.filter((payment) => payment.sessionId === session.id).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return `<tr><td>${esc(session.date)}</td><td>${esc(patientName(session.patientId))}</td><td>${esc(session.service)}</td><td>${money(session.amount)}</td><td>${money(collected)}</td><td>${money(Number(session.amount) - collected)}</td></tr>`;
  }).join('')}</tbody></table>`;
}

function renderPayments() {
  $('paymentsTable').innerHTML = `<table><thead><tr><th>Date</th><th>Patient</th><th>Session</th><th>Method</th><th>Insurance</th><th>Amount</th><th>Status</th></tr></thead><tbody>${collectedPayments().slice().reverse().map((payment) => `<tr><td>${esc(payment.date)}</td><td>${esc(patientName(payment.patientId))}</td><td>${esc(sessionLabel(payment.sessionId))}</td><td>${esc(payment.method)}</td><td>${esc(state.insurance.find((i) => i.id === payment.insuranceId)?.name || '')}</td><td>${money(payment.amount)}</td><td><span class="pill">${esc(payment.status || 'paid')}</span></td></tr>`).join('')}</tbody></table>`;
}

function renderInsurance() {
  $('insuranceList').innerHTML = state.insurance.map((provider) => `<div class="row-card"><div><strong>${esc(provider.name)}</strong><small>${esc(provider.contact || '')}</small></div><span class="pill">${state.payments.filter((p) => p.insuranceId === provider.id).length} claims</span></div>`).join('') || '<p class="muted">No providers configured.</p>';
  $('claimsList').innerHTML = state.payments.filter((p) => p.method === 'insurance').map((payment) => `<div class="claim"><strong>${esc(patientName(payment.patientId))} · ${money(payment.amount)}</strong><small>${esc(state.insurance.find((i) => i.id === payment.insuranceId)?.name || 'Provider not selected')} · ${esc(payment.status || 'pending')}</small></div>`).join('') || '<p class="muted">No insurance claims.</p>';
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
    const collected = state.payments.filter((payment) => payment.patientId === patient.id && (!from || payment.date >= from) && (!to || payment.date <= to)).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return sessions.length ? `<tr><td>${esc(patient.name)}</td><td>${sessions.length}</td><td>${money(value)}</td><td>${money(collected)}</td><td>${money(value - collected)}</td></tr>` : '';
  }).join('')}</tbody></table>`;
}

function renderAll() { renderDashboard(); renderPatients(); renderSessions(); renderPayments(); renderInsurance(); renderReports(); }

function patientOptions() { return state.patients.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join(''); }
function sessionOptions(patientId = '') { return state.sessions.filter((s) => !patientId || s.patientId === patientId).map((s) => `<option value="${s.id}">${esc(s.date)} · ${esc(patientName(s.patientId))}</option>`).join(''); }

function openRecord(type) {
  dialogMode = type;
  const fields = {
    patient: `<label>Name<input name="name" required></label><label>Phone<input name="phone"></label><label>Notes<textarea name="notes"></textarea></label>`,
    session: `<label>Patient<select name="patientId" required>${patientOptions()}</select></label><label>Date<input name="date" type="date" value="${today()}" required></label><label>Service<input name="service" required></label><label>Session amount<input name="amount" type="number" min="0" step="0.01" required></label><label>Session note<textarea name="note"></textarea></label>`,
    payment: `<label>Patient<select name="patientId" required>${patientOptions()}</select></label><label>Session<select name="sessionId" required>${sessionOptions()}</select></label><label>Date<input name="date" type="date" value="${today()}" required></label><label>Amount<input name="amount" type="number" min="0" step="0.01" required></label><label>Method<select name="method"><option value="cash">Cash</option><option value="debit">Debit card</option><option value="insurance">Insurance</option></select></label><label>Insurance provider<select name="insuranceId"><option value="">Select provider</option>${state.insurance.map((i) => `<option value="${i.id}">${esc(i.name)}</option>`).join('')}</select></label><label>Status<select name="status"><option value="paid">Paid</option><option value="pending">Pending / claim submitted</option><option value="rejected">Rejected</option></select></label>`
  };
  $('dialogTitle').textContent = type === 'patient' ? 'Add patient' : type === 'session' ? 'Add session' : 'Record payment';
  $('dialogFields').innerHTML = fields[type];
  $('recordDialog').showModal();
}

$('enterApp').addEventListener('click', () => { $('login').classList.add('hidden'); $('app').classList.remove('hidden'); renderAll(); });
$('nav').addEventListener('click', (event) => { const button = event.target.closest('[data-page]'); if (!button) return; document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item === button)); document.querySelectorAll('.page').forEach((page) => page.classList.toggle('active', page.id === `page-${button.dataset.page}`)); $('pageTitle').textContent = button.textContent; });
document.querySelectorAll('[data-page-link]').forEach((button) => button.addEventListener('click', () => document.querySelector('[data-page="sessions"]').click()));
$('newPatient').addEventListener('click', () => openRecord('patient'));
$('newSession').addEventListener('click', () => openRecord('session'));
$('newPayment').addEventListener('click', () => openRecord('payment'));
$('patientSearch').addEventListener('input', renderPatients);
$('insuranceForm').addEventListener('submit', (event) => { event.preventDefault(); const name = $('insuranceName').value.trim(); if (!name) return; state.insurance.push({ id: id('ins'), name, contact: $('insuranceContact').value.trim() }); event.target.reset(); persist(); });
$('generateReport').addEventListener('click', () => { const bill = { id: id('bill'), from: $('reportFrom').value, to: $('reportTo').value, generatedAt: new Date().toISOString(), totals: totals($('reportFrom').value, $('reportTo').value) }; state.bills.push(bill); persist(); alert(`Bill generated: ${bill.id}`); });
$('exportData').addEventListener('click', () => { const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'}); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `rts-clinic-${today()}.json`; link.click(); URL.revokeObjectURL(link.href); });
$('recordForm').addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target).entries()); if (dialogMode === 'patient') state.patients.push({id:id('patient'), ...data}); if (dialogMode === 'session') state.sessions.push({id:id('session'), ...data, amount:Number(data.amount)}); if (dialogMode === 'payment') state.payments.push({id:id('payment'), ...data, amount:Number(data.amount)}); $('recordDialog').close(); persist(); });
renderAll();
