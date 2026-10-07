const storeKey = 'rts_clinic_workspace_v1';
const languageKey = 'rts_clinic_language';
let language = localStorage.getItem(languageKey) === 'ar' ? 'ar' : 'en';
const translations = {
  'RTS Clinic': 'عيادة RTS',
  'Royal Technology Solutions': 'رويال للتقنية والحلول',
  'Dashboard': 'لوحة التحكم',
  'Patients': 'المرضى',
  'Sessions': 'الجلسات',
  'Payments': 'المدفوعات',
  'Insurance': 'التأمين',
  'Bills & reports': 'الفواتير والتقارير',
  'Clinic user': 'مستخدم العيادة',
  'Local data': 'بيانات محلية',
  'Export data': 'تصدير البيانات',
  'Sign out': 'تسجيل الخروج',
  'Today collected': 'المحصّل اليوم',
  'Sessions today': 'جلسات اليوم',
  'Insurance receivable': 'مستحقات التأمين',
  'Recent sessions': 'الجلسات الأخيرة',
  'View all': 'عرض الكل',
  'Appointments calendar': 'تقويم المواعيد',
  'Payment mix today': 'مزيج مدفوعات اليوم',
  'Upcoming sessions': 'الجلسات القادمة',
  'Add patient': 'إضافة مريض',
  'Search patients by name, phone, file number, or national ID': 'ابحث بالاسم أو الهاتف أو رقم الملف أو الهوية الوطنية',
  'Add session': 'إضافة جلسة',
  'Record payment': 'تسجيل دفعة',
  'A session can have multiple payment rows. This supports cash + debit card + insurance combinations without losing the audit trail.': 'يمكن أن تحتوي الجلسة على عدة دفعات، بما في ذلك النقد والبطاقة والتأمين، مع الحفاظ على سجل التدقيق.',
  'Insurance providers': 'مزودو التأمين',
  'Name': 'الاسم',
  'Claim contact': 'جهة اتصال المطالبة',
  'Add provider': 'إضافة مزود',
  'Outstanding claims': 'المطالبات المستحقة',
  'Bill and revenue report': 'تقرير الفواتير والإيرادات',
  'Generate bill': 'إنشاء فاتورة',
  'From': 'من',
  'To': 'إلى',
  'Record': 'سجل',
  'Save': 'حفظ',
  'Cancel': 'إلغاء',
  'Session details': 'تفاصيل الجلسة',
  'Patient record': 'ملف المريض',
  'Update available': 'يتوفر تحديث',
  'Download update': 'تنزيل التحديث',
  'Later': 'لاحقاً',
  'This update is required to continue.': 'هذا التحديث مطلوب للمتابعة.',
  'Sign in to your clinic workspace.': 'سجّل الدخول إلى مساحة عيادتك.',
  'Clinic ID': 'معرّف العيادة',
  'Username': 'اسم المستخدم',
  'Password': 'كلمة المرور',
  'Sign in': 'تسجيل الدخول',
  'No sessions yet.': 'لا توجد جلسات بعد.',
  'No upcoming sessions.': 'لا توجد جلسات قادمة.',
  'Open': 'مفتوحة',
  'Closed': 'مغلقة',
  'Guest / unidentified': 'زائر / غير محدد',
  'Unknown patient': 'مريض غير معروف',
  'Not assigned': 'غير مخصص',
  'Not recorded': 'غير مسجل',
  'Sex not recorded': 'الجنس غير مسجل',
  'View record': 'عرض الملف',
  'No patients found.': 'لم يتم العثور على مرضى.',
  'No payments recorded.': 'لا توجد دفعات مسجلة.',
  'No providers configured.': 'لم تتم إضافة مزودين.',
  'No outstanding insurance claims.': 'لا توجد مطالبات تأمين مستحقة.',
  'Patient': 'المريض',
  'Date / time': 'التاريخ والوقت',
  'Service': 'الخدمة',
  'Session value': 'قيمة الجلسة',
  'Received': 'المستلم',
  'To allocate': 'المتبقي للتوزيع',
  'Insurance': 'التأمين',
  'Amount': 'المبلغ',
  'Status': 'الحالة',
  'Cash': 'نقداً',
  'Debit card': 'بطاقة خصم',
  'Pending / claim submitted': 'معلّق / تم إرسال المطالبة',
  'Paid': 'مدفوع',
  'Rejected': 'مرفوض',
  'English': 'الإنجليزية',
  'Switch to English': 'التبديل إلى الإنجليزية',
  'Switch to Arabic': 'التبديل إلى العربية',
  'File number': 'رقم الملف',
  'Phone': 'الهاتف',
  'Collected': 'المحصّل',
  'Actions': 'الإجراءات',
  'Method': 'الطريقة',
  'Balance': 'الرصيد',
  'Claim pending': 'المطالبة معلّقة',
  'No treatment recorded.': 'لم يتم تسجيل علاج.',
  'No follow-up date recorded.': 'لم يتم تسجيل موعد متابعة.',
  'No session note.': 'لا توجد ملاحظة للجلسة.',
  'Payments': 'الدفعات',
  'Open patient file': 'فتح ملف المريض',
  'Received / pending claim / to allocate': 'المستلم / مطالبة معلّقة / المتبقي للتوزيع',
  'Identity and contact': 'الهوية وبيانات الاتصال',
  'Full legal name': 'الاسم القانوني الكامل',
  'Date of birth': 'تاريخ الميلاد',
  'Sex': 'الجنس',
  'Female': 'أنثى',
  'Male': 'ذكر',
  'Intersex': 'ثنائي الجنس',
  'Prefer not to say': 'أفضل عدم الإفصاح',
  'Address': 'العنوان',
  'Emergency contact': 'جهة اتصال للطوارئ',
  'Emergency phone': 'هاتف الطوارئ',
  'Profile photo': 'الصورة الشخصية',
  'Optional. Stored locally as a small profile image.': 'اختياري. تحفظ محلياً كصورة شخصية صغيرة.',
  'Critical clinical alerts': 'تنبيهات سريرية مهمة',
  'Select anything a doctor or staff member must see before treatment.': 'حدد أي معلومات يجب أن يراها الطبيب أو الموظف قبل العلاج.',
  'Critical alert note': 'ملاحظة تنبيه مهمة',
  'Medical record': 'السجل الطبي',
  'Allergies': 'الحساسيات',
  'Current conditions': 'الحالات الحالية',
  'Medications': 'الأدوية',
  'Clinical notes': 'ملاحظات سريرية',
  'Administrative notes': 'ملاحظات إدارية',
  'Treatment / procedure': 'العلاج / الإجراء',
  'What was done during this visit?': 'ما الذي تم خلال هذه الزيارة؟',
  'Session note': 'ملاحظة الجلسة',
  'Follow-up date': 'تاريخ المتابعة',
  'Select closed session': 'اختر جلسة مغلقة',
  'Insurance provider': 'مزود التأمين',
  'Select provider': 'اختر المزود',
  'Pending / claim submitted': 'معلّق / تم إرسال المطالبة',
  'Only clinic administrators can manage payments.': 'يمكن لمديري العيادة فقط إدارة المدفوعات.',
  'There are no closed sessions with an amount left to allocate.': 'لا توجد جلسات مغلقة بمبلغ متبقٍ للتوزيع.',
  'Payment must belong to a closed session and cannot exceed the amount still to allocate.': 'يجب أن ترتبط الدفعة بجلسة مغلقة وألا تتجاوز المبلغ المتبقي للتوزيع.',
  'Select an insurance provider for insurance payments.': 'اختر مزود تأمين لدفعات التأمين.',
  'Cash and debit payments must be recorded as paid. Use an insurance payment for a submitted claim.': 'يجب تسجيل الدفعات النقدية ودفعات البطاقة كمدفوعة. استخدم دفعة تأمين للمطالبة المرسلة.',
  'No critical alerts recorded': 'لم يتم تسجيل تنبيهات مهمة',
  'Review before treatment': 'راجع قبل العلاج',
  'Treatment and follow-up': 'العلاج والمتابعة',
  'Final session amount': 'المبلغ النهائي للجلسة',
  'Closing note': 'ملاحظة الإغلاق',
  'Close session': 'إغلاق الجلسة'
  ,
  'Mon': 'الإثنين',
  'Tue': 'الثلاثاء',
  'Wed': 'الأربعاء',
  'Thu': 'الخميس',
  'Fri': 'الجمعة',
  'Sat': 'السبت',
  'Sun': 'الأحد'
};
const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([english, arabic]) => [arabic, english]));
const tr = (value) => language === 'ar' ? (translations[value] || value) : (reverseTranslations[value] || value);
function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('*').forEach((element) => {
    element.childNodes.forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const leading = node.textContent.match(/^\s*/)?.[0] || '';
      const trailing = node.textContent.match(/\s*$/)?.[0] || '';
      const value = node.textContent.trim();
      if (value) node.textContent = `${leading}${tr(value)}${trailing}`;
    });
  });
  document.querySelectorAll('[placeholder],[aria-label]').forEach((element) => {
    if (element.placeholder) element.placeholder = tr(element.placeholder);
    if (element.getAttribute('aria-label')) element.setAttribute('aria-label', tr(element.getAttribute('aria-label')));
  });
  document.querySelectorAll('.language-toggle').forEach((button) => {
    button.textContent = language === 'ar' ? 'English' : 'العربية';
    button.setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  });
  document.title = language === 'ar' ? 'عيادة RTS' : 'RTS Clinic';
}
function toggleLanguage() {
  language = language === 'ar' ? 'en' : 'ar';
  localStorage.setItem(languageKey, language);
  renderAll();
}
const state = JSON.parse(localStorage.getItem(storeKey) || 'null') || {
  patients: [], sessions: [], payments: [], insurance: [], bills: []
};

let dialogMode = '';
let pendingPaymentSessionId = '';
let editingPatientId = '';
let calendarDate = new Date();
let currentUser = null;

const $ = (id) => document.getElementById(id);
const money = (value) => `₪${Number(value || 0).toFixed(2)}`;
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const id = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const patientById = (patientId) => state.patients.find((patient) => patient.id === patientId);
const patientName = (patientId) => patientId === 'guest' ? 'Guest / unidentified' : patientById(patientId)?.fullName || patientById(patientId)?.name || 'Unknown patient';
const sessionById = (sessionId) => state.sessions.find((session) => session.id === sessionId);
const ageFromDob = (dateOfBirth) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth || '')) return '';
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 && age <= 130 ? String(age) : '';
};
const patientPhoto = (patient) => /^data:image\/(?:jpeg|png|webp);base64,/.test(patient?.photo || '') ? patient.photo : '';
const patientAvatar = (patient) => {
  const name = patientName(patient.id);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
  return patientPhoto(patient) ? `<img class="patient-avatar" src="${patientPhoto(patient)}" alt="">` : `<span class="patient-avatar patient-avatar-fallback" aria-hidden="true">${esc(initials)}</span>`;
};
const sessionLabel = (sessionId) => {
  const session = sessionById(sessionId);
  return session ? `${session.date} ${session.time || ''} · ${patientName(session.patientId)}` : 'Unknown session';
};

function setupUpdater() {
  const updater = window.rtsUpdater;
  if (!updater) return;
  const overlay = $('updateOverlay');
  const nowButton = $('updateNow');
  const laterButton = $('updateLater');

  const fallback = (message) => {
    $('updateStatus').textContent = message;
    nowButton.disabled = false;
    nowButton.textContent = 'Open download page';
    nowButton.onclick = () => updater.openReleases();
  };

  updater.on('updater-available', (info) => {
    $('updateVersion').textContent = info.version || '';
    $('updateNotes').textContent = info.notes || 'This release includes improvements and fixes.';
    $('updateMandatory').classList.toggle('hidden', !info.mandatory);
    laterButton.classList.toggle('hidden', Boolean(info.mandatory));
    $('updateProgressTrack').classList.add('hidden');
    $('updateStatus').textContent = '';
    nowButton.disabled = false;
    nowButton.textContent = 'Download update';
    nowButton.onclick = async () => {
      nowButton.disabled = true;
      nowButton.textContent = 'Starting download…';
      const result = await updater.download().catch(() => null);
      if (!result?.ok) fallback('Automatic update failed. Use the secure release download page.');
    };
    overlay.classList.remove('hidden');
  });
  updater.on('updater-progress', (progress) => {
    const percent = Math.round(progress.percent || 0);
    $('updateProgressTrack').classList.remove('hidden');
    $('updateProgressBar').style.width = `${Math.max(0, Math.min(100, percent))}%`;
    $('updateStatus').textContent = `Downloading ${percent}%`;
  });
  updater.on('updater-downloaded', () => {
    $('updateProgressBar').style.width = '100%';
    $('updateStatus').textContent = 'The verified update is ready to install.';
    nowButton.disabled = false;
    nowButton.textContent = 'Restart and install';
    nowButton.onclick = () => updater.install();
  });
  updater.on('updater-error', () => {
    if (!overlay.classList.contains('hidden')) fallback('Automatic update failed. Use the secure release download page.');
  });
  laterButton.addEventListener('click', () => overlay.classList.add('hidden'));
  updater.check().catch(() => {});
}

function migrateState() {
  state.patients.forEach((patient) => {
    if (!patient.fullName) patient.fullName = patient.name || '';
    if (!patient.name) patient.name = patient.fullName;
    if (!Array.isArray(patient.criticalAlerts)) {
      patient.criticalAlerts = patient.criticalAlerts ? String(patient.criticalAlerts).split(',').map((item) => item.trim()).filter(Boolean) : [];
    }
    if (!patient.criticalNote) patient.criticalNote = '';
  });
  state.sessions.forEach((session) => {
    if (!session.status) session.status = session.amount == null ? 'open' : 'closed';
    if (session.amount === undefined) session.amount = null;
    if (!session.treatment) session.treatment = '';
    if (!session.followUp) session.followUp = '';
  });
  state.payments.forEach((payment) => {
    if (!payment.patientId) payment.patientId = sessionById(payment.sessionId)?.patientId || 'guest';
    if (!payment.status) payment.status = 'paid';
  });
}

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
  $('syncState').textContent = 'Saved locally';
  renderAll();
}

function collectedPayments() {
  return state.payments.filter((payment) => payment.status === 'paid');
}

function sessionPayments(sessionId) {
  return state.payments.filter((payment) => payment.sessionId === sessionId && payment.status !== 'void');
}

function sessionCollected(sessionId) {
  return sessionPayments(sessionId).filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function sessionPendingClaims(sessionId) {
  return sessionPayments(sessionId).filter((payment) => payment.status === 'pending').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function sessionCommitted(sessionId) {
  return sessionCollected(sessionId) + sessionPendingClaims(sessionId);
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
  $('insuranceReceivable').textContent = money(state.payments.filter((payment) => payment.method === 'insurance' && payment.status === 'pending').reduce((sum, payment) => sum + Number(payment.amount || 0), 0));
  $('recentSessions').innerHTML = state.sessions.slice().reverse().slice(0, 6).map(sessionRow).join('') || '<p class="muted">No sessions yet.</p>';
  const max = Math.max(day.total, 1);
  $('paymentMix').innerHTML = Object.entries(day.byMethod).map(([method, amount]) => `<div><div class="row-card"><span>${tr(method === 'debit' ? 'Debit card' : method[0].toUpperCase() + method.slice(1))}</span><strong>${money(amount)}</strong></div><div class="mix-bar"><span style="width:${Math.round(amount / max * 100)}%"></span></div></div>`).join('');
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
  $('calendarMonth').textContent = new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', { month: 'long', year: 'numeric' }).format(calendarDate);
  const cells = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => `<div class="calendar-weekday">${tr(label)}</div>`);
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
  const patients = state.patients.filter((patient) => `${patient.fullName || patient.name} ${patient.phone} ${patient.fileNumber} ${patient.nationalId}`.toLowerCase().includes(search));
  const rows = patients.map((patient) => {
    const sessions = state.sessions.filter((session) => session.patientId === patient.id);
    const collected = collectedPayments().filter((payment) => payment.patientId === patient.id).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const age = ageFromDob(patient.dateOfBirth);
    return `<tr><td><span class="pill">${esc(patient.fileNumber || 'Not assigned')}</span></td><td><div class="patient-summary">${patientAvatar(patient)}<div><strong>${esc(patientName(patient.id))}</strong><small>${esc(patient.sex || 'Sex not recorded')}${age ? ` · ${age} years` : ''}</small></div></div></td><td>${esc(patient.phone || 'Not recorded')}</td><td>${sessions.length}</td><td>${money(collected)}</td><td><button type="button" class="link-button" data-patient-id="${esc(patient.id)}">View record</button></td></tr>`;
  }).join('');
  $('patientsTable').innerHTML = rows ? `<table><thead><tr><th>File number</th><th>Patient</th><th>Phone</th><th>Sessions</th><th>Collected</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No patients found.</p>';
}

function renderSessions() {
  const rows = state.sessions.slice().reverse().map((session) => {
    const collected = sessionCollected(session.id);
    const pendingClaim = sessionPendingClaims(session.id);
    return `<tr class="clickable-row" data-session-id="${esc(session.id)}"><td>${esc(session.date)}<br><small>${esc(session.time || '')}</small></td><td>${esc(patientName(session.patientId))}</td><td>${esc(session.service)}</td><td>${session.status === 'closed' ? money(session.amount) : `<span class="pill">${tr('Open')}</span>`}</td><td>${money(collected)}${pendingClaim ? `<br><small>${tr('Claim pending')}: ${money(pendingClaim)}</small>` : ''}</td><td>${session.status === 'closed' ? money(Number(session.amount) - collected - pendingClaim) : '—'}</td></tr>`;
  }).join('');
  $('sessionsTable').innerHTML = rows ? `<table><thead><tr><th>Date / time</th><th>Patient</th><th>Service</th><th>Session value</th><th>Received</th><th>To allocate</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No sessions yet.</p>';
}

function renderPayments() {
  const rows = state.payments.slice().reverse().map((payment) => `<tr><td>${esc(payment.date)}</td><td>${esc(patientName(payment.patientId))}</td><td>${esc(sessionLabel(payment.sessionId))}</td><td>${esc(payment.method)}</td><td>${esc(state.insurance.find((provider) => provider.id === payment.insuranceId)?.name || '')}</td><td>${money(payment.amount)}</td><td><span class="pill">${esc(payment.status || 'paid')}</span></td></tr>`).join('');
  $('paymentsTable').innerHTML = rows ? `<table><thead><tr><th>Date</th><th>Patient</th><th>Session</th><th>Method</th><th>Insurance</th><th>Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No payment records yet.</p>';
}

function renderInsurance() {
  $('insuranceList').innerHTML = state.insurance.map((provider) => `<div class="row-card"><div><strong>${esc(provider.name)}</strong><small>${esc(provider.contact || '')}</small></div><span class="pill">${state.payments.filter((payment) => payment.insuranceId === provider.id).length} claims</span></div>`).join('') || '<p class="muted">No providers configured.</p>';
  $('claimsList').innerHTML = state.payments.filter((payment) => payment.method === 'insurance' && payment.status === 'pending').map((payment) => `<div class="claim"><strong>${esc(patientName(payment.patientId))} · ${money(payment.amount)}</strong><small>${esc(state.insurance.find((provider) => provider.id === payment.insuranceId)?.name || 'Provider not selected')} · Claim submitted</small></div>`).join('') || '<p class="muted">No outstanding insurance claims.</p>';
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
  applyLanguage();
}

function patientOptions() {
  return `<option value="guest">Guest / unidentified</option>${state.patients.map((patient) => `<option value="${esc(patient.id)}">${esc(patientName(patient.id))}</option>`).join('')}`;
}

function sessionOptions() {
  return state.sessions.filter((session) => session.status === 'closed' && Number(session.amount) - sessionCommitted(session.id) > 0.005).map((session) => `<option value="${esc(session.id)}">${esc(sessionLabel(session.id))} · ${money(session.amount)}</option>`).join('');
}

function patientForm(patient) {
  const selected = (value) => patient?.sex === value ? ' selected' : '';
  const alertOptions = [
    ['diabetes', 'Diabetes'],
    ['hypertension', 'High blood pressure'],
    ['heartDisease', 'Heart disease'],
    ['anticoagulants', 'Blood thinners'],
    ['immunosuppressed', 'Immunosuppressed'],
    ['pregnancy', 'Pregnancy'],
    ['fallRisk', 'Fall risk'],
    ['infectionRisk', 'Infection-control alert'],
    ['pacemaker', 'Pacemaker / implanted device'],
    ['seizureHistory', 'Seizure history'],
    ['mobilityNeeds', 'Mobility assistance'],
  ];
  const alerts = Array.isArray(patient?.criticalAlerts) ? patient.criticalAlerts : [];
  const alertChecks = alertOptions.map(([value, label]) => `<label class="check-option"><input type="checkbox" name="criticalAlerts" value="${value}"${alerts.includes(value) ? ' checked' : ''}><span>${label}</span></label>`).join('');
  return `<fieldset class="form-section"><legend>Identity and contact</legend><div class="form-grid"><label>Full legal name<input name="fullName" value="${esc(patient?.fullName || patient?.name || '')}" autocomplete="name" required></label><label>File number<input name="fileNumber" value="${esc(patient?.fileNumber || '')}" required placeholder="e.g. CL-000123"></label><label>Date of birth<input name="dateOfBirth" type="date" max="${today()}" value="${esc(patient?.dateOfBirth || '')}" required></label><label>Sex<select name="sex"><option value="">Not recorded</option><option value="Female"${selected('Female')}>Female</option><option value="Male"${selected('Male')}>Male</option><option value="Intersex"${selected('Intersex')}>Intersex</option><option value="Prefer not to say"${selected('Prefer not to say')}>Prefer not to say</option></select></label><label>Phone<input name="phone" type="tel" autocomplete="tel" value="${esc(patient?.phone || '')}"></label><label>National ID<input name="nationalId" value="${esc(patient?.nationalId || '')}" autocomplete="off"></label><label class="full-width">Address<textarea name="address" autocomplete="street-address">${esc(patient?.address || '')}</textarea></label><label>Emergency contact<input name="emergencyContact" value="${esc(patient?.emergencyContact || '')}"></label><label>Emergency phone<input name="emergencyPhone" type="tel" value="${esc(patient?.emergencyPhone || '')}"></label><label class="full-width">Profile photo<input name="photo" type="file" accept="image/jpeg,image/png,image/webp"><small class="muted">Optional. Stored locally as a small profile image.</small></label></div></fieldset><fieldset class="form-section critical-form-section"><legend>Critical clinical alerts</legend><p class="critical-help">Select anything a doctor or staff member must see before treatment.</p><div class="critical-checks">${alertChecks}</div><label>Critical alert note<textarea name="criticalNote" placeholder="Examples: penicillin reaction, pacemaker, seizure history, special precautions">${esc(patient?.criticalNote || '')}</textarea></label></fieldset><fieldset class="form-section"><legend>Medical record</legend><div class="form-grid"><label>Allergies<textarea name="allergies" placeholder="Record allergies or “None known”">${esc(patient?.allergies || '')}</textarea></label><label>Current conditions<textarea name="conditions">${esc(patient?.conditions || '')}</textarea></label><label>Medications<textarea name="medications">${esc(patient?.medications || '')}</textarea></label><label>Clinical notes<textarea name="medicalNotes">${esc(patient?.medicalNotes || '')}</textarea></label></div></fieldset><fieldset class="form-section"><legend>Administrative notes</legend><label><textarea name="notes">${esc(patient?.notes || '')}</textarea></label></fieldset>`;
}

function openRecord(type, sessionId = '') {
  if (type === 'payment' && currentUser?.role !== 'admin') {
    alert('Only clinic administrators can manage payments.');
    return;
  }
  if (type === 'payment' && !sessionId && !sessionOptions()) {
    alert('There are no closed sessions with an amount left to allocate.');
    return;
  }
  dialogMode = type;
  pendingPaymentSessionId = sessionId;
  editingPatientId = type === 'patient' ? sessionId : '';
  const patient = type === 'patient' && sessionId ? patientById(sessionId) : null;
  const fields = {
    patient: patientForm(patient),
    session: `<label>Patient<select name="patientId" required>${patientOptions()}</select></label><label>Date<input name="date" type="date" value="${today()}" required></label><label>Time<input name="time" type="time" required></label><label>Service<input name="service" required></label><label class="full-width">Treatment / procedure<textarea name="treatment" placeholder="What was done during this visit?"></textarea></label><label class="full-width">Session note<textarea name="note"></textarea></label><label>Follow-up date<input name="followUp" type="date"></label>`,
    payment: `<label>Session<select name="sessionId" required><option value="">Select closed session</option>${sessionOptions()}</select></label><label>Date<input name="date" type="date" value="${today()}" required></label><label>Amount<input name="amount" type="number" min="0.01" step="0.01" required></label><label>Method<select name="method"><option value="cash">Cash</option><option value="debit">Debit card</option><option value="insurance">Insurance</option></select></label><label>Insurance provider<select name="insuranceId"><option value="">Select provider</option>${state.insurance.map((provider) => `<option value="${esc(provider.id)}">${esc(provider.name)}</option>`).join('')}</select></label><label>Status<select name="status"><option value="paid">Paid</option><option value="pending">Pending / claim submitted</option><option value="rejected">Rejected</option></select></label>`
  };
  $('dialogTitle').textContent = type === 'patient' ? (patient ? 'Edit patient record' : 'Add patient') : type === 'session' ? 'Add session' : 'Record payment';
  $('dialogFields').innerHTML = fields[type];
  if (type === 'payment' && sessionId) $('dialogFields').querySelector('[name="sessionId"]').value = sessionId;
  applyLanguage();
  $('recordDialog').showModal();
}

function openSessionDetails(sessionId) {
  const session = sessionById(sessionId);
  if (!session) return;
  const payments = sessionPayments(session.id);
  const collected = sessionCollected(session.id);
  const pendingClaim = sessionPendingClaims(session.id);
  const remaining = session.status === 'closed' ? Number(session.amount) - sessionCommitted(session.id) : 0;
  $('sessionDetails').innerHTML = `<div class="detail-grid"><div><span class="muted">Patient</span><strong>${esc(patientName(session.patientId))}</strong><button type="button" class="link-button" data-patient-id="${esc(session.patientId)}">Open patient file</button></div><div><span class="muted">Date & time</span><strong>${esc(session.date)} ${esc(session.time || '')}</strong></div><div><span class="muted">Service</span><strong>${esc(session.service)}</strong></div><div><span class="muted">Status</span><strong>${session.status === 'closed' ? 'Closed' : 'Open'}</strong></div></div><section class="session-clinical-summary"><h4>Treatment and follow-up</h4><p><strong>${esc(session.treatment || 'No treatment recorded.')}</strong></p><p class="muted">${session.followUp ? `Follow-up: ${esc(session.followUp)}` : 'No follow-up date recorded.'}</p><p>${esc(session.note || 'No session note.')}</p></section><h4>Payments</h4>${payments.map((payment) => `<div class="row-card"><span>${esc(payment.method)} · ${esc(payment.status || 'paid')}</span><strong>${money(payment.amount)}</strong></div>`).join('') || '<p class="muted">No payments recorded.</p>'}${session.status === 'closed' ? `<div class="detail-total"><span>Received / pending claim / to allocate</span><strong>${money(collected)} / ${money(pendingClaim)} / ${money(remaining)}</strong></div>${remaining > 0.005 ? `<div class="dialog-actions"><button type="button" class="primary" data-record-payment="${esc(session.id)}">Record payment</button></div>` : ''}` : `<form id="closeSessionForm" class="form-grid"><label>Final session amount<input name="amount" type="number" min="0.01" step="0.01" required></label><label>Closing note<textarea name="closingNote"></textarea></label><div class="dialog-actions"><button class="primary" type="submit">Close session</button></div></form>`}`;
  applyLanguage();
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

function openPatientDetails(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
  const sessions = state.sessions.filter((session) => session.patientId === patient.id).sort((a, b) => `${b.date} ${b.time || ''}`.localeCompare(`${a.date} ${a.time || ''}`));
  const age = ageFromDob(patient.dateOfBirth);
  const recordValue = (value) => esc(value || 'Not recorded');
  const criticalLabels = {
    diabetes: 'Diabetes',
    hypertension: 'High blood pressure',
    heartDisease: 'Heart disease',
    anticoagulants: 'Blood thinners',
    immunosuppressed: 'Immunosuppressed',
    pregnancy: 'Pregnancy',
    fallRisk: 'Fall risk',
    infectionRisk: 'Infection-control alert',
    pacemaker: 'Pacemaker / implanted device',
    seizureHistory: 'Seizure history',
    mobilityNeeds: 'Mobility assistance',
  };
  const criticalAlerts = Array.isArray(patient.criticalAlerts) ? patient.criticalAlerts : [];
  const criticalBox = criticalAlerts.length || patient.criticalNote
    ? `<section class="critical-alert-box"><div class="critical-alert-heading"><span class="critical-icon" aria-hidden="true">!</span><div><strong>Critical clinical alerts</strong><small>Review before treatment</small></div></div><div class="critical-tags">${criticalAlerts.map((alert) => `<span>${esc(criticalLabels[alert] || alert)}</span>`).join('')}</div>${patient.criticalNote ? `<p>${esc(patient.criticalNote)}</p>` : ''}</section>`
    : `<section class="critical-alert-box critical-alert-box-empty"><strong>No critical alerts recorded</strong><span>Confirm this before treatment if the patient is new.</span></section>`;
  $('patientDetails').innerHTML = `<div class="patient-record-heading">${patientAvatar(patient)}<div><h3>${esc(patientName(patient.id))}</h3><p class="muted">File ${esc(patient.fileNumber || 'not assigned')}${age ? ` · ${age} years old` : ''}</p></div></div>${criticalBox}<div class="detail-grid"><div><span class="muted">Date of birth</span><strong>${recordValue(patient.dateOfBirth)}</strong></div><div><span class="muted">Sex</span><strong>${recordValue(patient.sex)}</strong></div><div><span class="muted">Phone</span><strong>${recordValue(patient.phone)}</strong></div><div><span class="muted">National ID</span><strong>${recordValue(patient.nationalId)}</strong></div><div><span class="muted">Emergency contact</span><strong>${recordValue(patient.emergencyContact)}${patient.emergencyPhone ? ` · ${esc(patient.emergencyPhone)}` : ''}</strong></div><div><span class="muted">Address</span><strong>${recordValue(patient.address)}</strong></div></div><section class="medical-record"><h4>Medical record</h4><div class="detail-grid"><div><span class="muted">Allergies</span><strong>${recordValue(patient.allergies)}</strong></div><div><span class="muted">Conditions</span><strong>${recordValue(patient.conditions)}</strong></div><div><span class="muted">Medications</span><strong>${recordValue(patient.medications)}</strong></div><div><span class="muted">Clinical notes</span><strong>${recordValue(patient.medicalNotes)}</strong></div></div></section><section class="care-history"><div class="history-heading"><h4>Previous sessions and treatments</h4><span class="pill">${sessions.length} visit${sessions.length === 1 ? '' : 's'}</span></div>${sessions.map((session) => `<button type="button" class="history-entry" data-session-id="${esc(session.id)}"><div><strong>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</strong><small>${esc(session.treatment || session.note || session.closingNote || 'No treatment note.')}${session.followUp ? ` · Follow-up ${esc(session.followUp)}` : ''}</small></div><span class="pill">${esc(session.status)}</span></button>`).join('') || '<p class="muted">No sessions recorded for this patient.</p>'}</section><div class="dialog-actions"><button type="button" class="secondary" data-edit-patient="${esc(patient.id)}">Edit patient</button></div>`;
  applyLanguage();
  $('patientDialog').showModal();
}

function imageDataForStorage(file) {
  if (!file.type.match(/^image\/(jpeg|png|webp)$/) || file.size > 5 * 1024 * 1024) throw new Error('Use a JPG, PNG, or WebP image smaller than 5 MB.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The profile image could not be read.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('The profile image could not be processed.'));
      image.onload = () => {
        const size = 160;
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - sourceSize) / 2;
        const sourceY = (image.naturalHeight - sourceSize) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas.getContext('2d').drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

migrateState();
setupUpdater();
$('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = $('loginSubmit');
  const error = $('loginError');
  const data = new FormData(event.target);
  submit.disabled = true;
  submit.textContent = language === 'ar' ? 'جارٍ تسجيل الدخول…' : 'Signing in…';
  error.textContent = '';
  try {
    const result = await window.rtsClinicAuth.login({
      storeId: data.get('storeId'),
      username: data.get('username'),
      password: data.get('password')
    });
    if (!result?.ok) {
      error.textContent = result?.message || tr('Unable to sign in.');
      return;
    }
    currentUser = result.user;
    $('signedInUser').textContent = `${result.store?.name || data.get('storeId')} · ${result.user.name} · ${result.user.role === 'admin' ? 'Admin' : 'Staff'}`;
    document.querySelectorAll('.admin-only').forEach((element) => {
      element.classList.toggle('hidden', result.user.role !== 'admin');
    });
    $('login').classList.add('hidden');
    $('app').classList.remove('hidden');
    renderAll();
  } catch {
    error.textContent = tr('Unable to sign in to RTS Clinic.');
  } finally {
    submit.disabled = false;
    submit.textContent = tr('Sign in');
  }
});
$('nav').addEventListener('click', (event) => { const button = event.target.closest('[data-page]'); if (!button) return; document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item === button)); document.querySelectorAll('.page').forEach((page) => page.classList.toggle('active', page.id === `page-${button.dataset.page}`)); $('pageTitle').textContent = button.textContent; });
document.querySelectorAll('[data-page-link]').forEach((button) => button.addEventListener('click', () => document.querySelector('[data-page="sessions"]').click()));
$('newPatient').addEventListener('click', () => openRecord('patient'));
$('newSession').addEventListener('click', () => openRecord('session'));
$('newPayment').addEventListener('click', () => openRecord('payment'));
$('signOut').addEventListener('click', () => {
  if (!window.confirm(language === 'ar' ? 'هل تريد تسجيل الخروج من مساحة العيادة؟' : 'Sign out of this clinic workspace?')) return;
  currentUser = null;
  document.querySelectorAll('.admin-only').forEach((element) => element.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.page === 'dashboard'));
  document.querySelectorAll('.page').forEach((page) => page.classList.toggle('active', page.id === 'page-dashboard'));
  $('pageTitle').textContent = tr('Dashboard');
  $('loginForm').reset();
  $('loginError').textContent = '';
  $('login').classList.remove('hidden');
  $('app').classList.add('hidden');
  $('loginStoreId').focus();
});
$('closeRecord').addEventListener('click', () => { $('recordDialog').close('cancel'); dialogMode = ''; editingPatientId = ''; });
$('cancelRecord').addEventListener('click', () => { $('recordDialog').close('cancel'); dialogMode = ''; editingPatientId = ''; });
$('closeSession').addEventListener('click', () => $('sessionDialog').close('cancel'));
$('closePatient').addEventListener('click', () => $('patientDialog').close('cancel'));
$('languageToggle').addEventListener('click', toggleLanguage);
$('languageToggleLogin').addEventListener('click', toggleLanguage);
$('calendarPrev').addEventListener('click', () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1); renderCalendar(); });
$('calendarNext').addEventListener('click', () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1); renderCalendar(); });
$('patientSearch').addEventListener('input', renderPatients);
$('insuranceForm').addEventListener('submit', (event) => { event.preventDefault(); const name = $('insuranceName').value.trim(); if (!name) return; state.insurance.push({ id: id('ins'), name, contact: $('insuranceContact').value.trim() }); event.target.reset(); persist(); });
$('generateReport').addEventListener('click', () => { if (currentUser?.role !== 'admin') return; const bill = { id: id('bill'), from: $('reportFrom').value, to: $('reportTo').value, generatedAt: new Date().toISOString(), totals: totals($('reportFrom').value, $('reportTo').value) }; state.bills.push(bill); persist(); alert(`Bill generated: ${bill.id}`); });
$('exportData').addEventListener('click', () => { if (currentUser?.role !== 'admin') return; const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `rts-clinic-${today()}.json`; link.click(); URL.revokeObjectURL(link.href); });
$('recordForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  if (dialogMode === 'patient') {
    const existing = editingPatientId ? patientById(editingPatientId) : null;
    const image = data.photo;
    delete data.photo;
    data.criticalAlerts = event.target.querySelectorAll('[name="criticalAlerts"]:checked').length
      ? Array.from(event.target.querySelectorAll('[name="criticalAlerts"]:checked')).map((input) => input.value)
      : [];
    try {
      data.photo = image instanceof File && image.size ? await imageDataForStorage(image) : existing?.photo || '';
    } catch (error) {
      alert(error.message);
      return;
    }
    data.fullName = data.fullName.trim().replace(/\s+/g, ' ');
    data.name = data.fullName;
    if (existing) Object.assign(existing, data);
    else state.patients.push({ id: id('patient'), ...data });
  }
  if (dialogMode === 'session') state.sessions.push({ id: id('session'), ...data, status: 'open', amount: null });
  if (dialogMode === 'payment') {
    const session = sessionById(data.sessionId);
    const amount = Number(data.amount);
    if (!session || session.status !== 'closed' || amount <= 0 || amount > Number(session.amount) - sessionCommitted(session.id) + 0.005) {
      alert('Payment must belong to a closed session and cannot exceed the amount still to allocate.');
      return;
    }
    if (data.method === 'insurance' && !data.insuranceId) {
      alert('Select an insurance provider for insurance payments.');
      return;
    }
    if (data.method !== 'insurance' && data.status !== 'paid') {
      alert('Cash and debit payments must be recorded as paid. Use an insurance payment for a submitted claim.');
      return;
    }
    state.payments.push({ id: id('payment'), ...data, patientId: session.patientId, amount });
  }
  $('recordDialog').close('saved');
  dialogMode = '';
  editingPatientId = '';
  persist();
});
document.addEventListener('click', (event) => {
  const sessionTarget = event.target.closest('[data-session-id]');
  if (sessionTarget) openSessionDetails(sessionTarget.dataset.sessionId);
  const patientTarget = event.target.closest('[data-patient-id]');
  if (patientTarget) openPatientDetails(patientTarget.dataset.patientId);
  const paymentTarget = event.target.closest('[data-record-payment]');
  if (paymentTarget) { $('sessionDialog').close('cancel'); openRecord('payment', paymentTarget.dataset.recordPayment); }
  const editPatientTarget = event.target.closest('[data-edit-patient]');
  if (editPatientTarget) { $('patientDialog').close('cancel'); openRecord('patient', editPatientTarget.dataset.editPatient); }
});
applyLanguage();
renderAll();
