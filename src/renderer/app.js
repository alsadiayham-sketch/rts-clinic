const legacyStoreKey = 'rts_clinic_workspace_v1';
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
  'View details': 'عرض التفاصيل',
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
  'Close session': 'إغلاق الجلسة',
  'Saved to clinic workspace': 'تم الحفظ في مساحة العيادة',
  'Unable to save changes.': 'تعذر حفظ التغييرات.',
  'Unable to load this clinic workspace.': 'تعذر تحميل مساحة هذه العيادة.',
  'Legacy clinic data was moved into this clinic workspace.': 'تم نقل بيانات العيادة القديمة إلى مساحة هذه العيادة.',
  'Legacy clinic data was removed without importing it.': 'تمت إزالة بيانات العيادة القديمة دون استيرادها.',
  'Legacy data was not imported because this clinic already has data. The unscoped copy was removed.': 'لم يتم استيراد البيانات القديمة لأن هذه العيادة تحتوي على بيانات. تمت إزالة النسخة غير المرتبطة بعيادة.',
  'Medical files': 'الملفات الطبية',
  'Add file': 'إضافة ملف',
  'Download': 'تنزيل',
  'Delete': 'حذف',
  'No medical files uploaded.': 'لم يتم رفع ملفات طبية.',
  'PDF, JPG, PNG, or WebP. Maximum 10 MB.': 'PDF أو JPG أو PNG أو WebP. الحد الأقصى 10 ميغابايت.',
  'Uploading file…': 'جارٍ رفع الملف…',
  'Loading…': 'جارٍ التحميل…',
  'Unable to load medical files.': 'تعذر تحميل الملفات الطبية.',
  'Unable to upload this medical file.': 'تعذر رفع هذا الملف الطبي.',
  'Unable to download this medical file.': 'تعذر تنزيل هذا الملف الطبي.',
  'Unable to delete this medical file.': 'تعذر حذف هذا الملف الطبي.',
  'Delete this medical file permanently?': 'هل تريد حذف هذا الملف الطبي نهائياً؟',
  'Only clinic administrators can delete medical files.': 'يمكن لمديري العيادة فقط حذف الملفات الطبية.',
  'Only clinic administrators can manage insurance providers.': 'يمكن لمديري العيادة فقط إدارة مزودي التأمين.',
  'Only clinic administrators can generate bills.': 'يمكن لمديري العيادة فقط إنشاء الفواتير.',
  'This operation requires a clinic administrator.': 'تتطلب هذه العملية مدير عيادة.',
  'Your clinic session has expired. Sign in again.': 'انتهت جلسة العيادة. سجّل الدخول مرة أخرى.',
  'Select a patient that belongs to this clinic.': 'اختر مريضاً تابعاً لهذه العيادة.',
  'The requested medical record does not belong to this clinic.': 'السجل الطبي المطلوب لا يتبع هذه العيادة.',
  'The medical file no longer exists.': 'الملف الطبي لم يعد موجوداً.',
  'Only PDF, JPG, PNG, and WebP files are allowed.': 'يُسمح فقط بملفات PDF وJPG وPNG وWebP.',
  'Medical files must be smaller than 10 MB.': 'يجب أن يكون حجم الملف الطبي أقل من 10 ميغابايت.',
  'The selected file content does not match its file type.': 'محتوى الملف المحدد لا يطابق نوعه.',
  'Cash and debit payments must be recorded as paid.': 'يجب تسجيل الدفعات النقدية ودفعات البطاقة كمدفوعة.',
  'Enter an insurance provider name.': 'أدخل اسم مزود التأمين.',
  'Select a valid report date range.': 'اختر نطاق تاريخ صالحاً للتقرير.',
  'Bill generated successfully.': 'تم إنشاء الفاتورة بنجاح.',
  'Data exported successfully.': 'تم تصدير البيانات بنجاح.',
  'This session cannot be closed.': 'لا يمكن إغلاق هذه الجلسة.',
  'Enter a valid final session amount.': 'أدخل مبلغاً نهائياً صالحاً للجلسة.',
  'Patient name and file number are required.': 'اسم المريض ورقم الملف مطلوبان.',
  'Session date, time, patient, and service are required.': 'تاريخ الجلسة ووقتها والمريض والخدمة مطلوبة.',
  'Diabetes': 'السكري',
  'High blood pressure': 'ارتفاع ضغط الدم',
  'Heart disease': 'أمراض القلب',
  'Blood thinners': 'مميعات الدم',
  'Immunosuppressed': 'ضعف المناعة',
  'Pregnancy': 'الحمل',
  'Fall risk': 'خطر السقوط',
  'Infection-control alert': 'تنبيه مكافحة العدوى',
  'Pacemaker / implanted device': 'منظم ضربات القلب / جهاز مزروع',
  'Seizure history': 'تاريخ نوبات الصرع',
  'Mobility assistance': 'مساعدة على الحركة',
  'Confirm this before treatment if the patient is new.': 'أكد ذلك قبل العلاج إذا كان المريض جديداً.',
  'Previous sessions and treatments': 'الجلسات والعلاجات السابقة',
  'No sessions recorded for this patient.': 'لا توجد جلسات مسجلة لهذا المريض.',
  'No treatment note.': 'لا توجد ملاحظة علاج.',
  'Edit patient': 'تعديل المريض',
  'Follow-up': 'متابعة',
  'Date & time': 'التاريخ والوقت',
  'Unable to sign in.': 'تعذر تسجيل الدخول.',
  'Unable to sign in to RTS Clinic.': 'تعذر تسجيل الدخول إلى عيادة RTS.',
  'Admin': 'مدير',
  'Staff': 'موظف',
  'Search sessions': 'البحث في الجلسات',
  'Patient, service, date, or treatment': 'المريض أو الخدمة أو التاريخ أو العلاج',
  'All statuses': 'كل الحالات',
  'Outstanding': 'مبلغ مستحق',
  'Clinic services': 'خدمات العيادة',
  'Service name': 'اسم الخدمة',
  'Add service': 'إضافة خدمة',
  'Search payments': 'البحث في المدفوعات',
  'Patient, session, provider, or amount': 'المريض أو الجلسة أو المزود أو المبلغ',
  'All methods': 'كل الطرق',
  'Search providers': 'البحث في المزودين',
  'All providers': 'كل المزودين',
  'Pending claims': 'مطالبات معلّقة',
  'Mapped patients': 'مرضى مرتبطون',
  'Insurance financial report': 'التقرير المالي للتأمين',
  'Provider': 'المزود',
  'Print / save PDF': 'طباعة / حفظ PDF',
  'Generated bills': 'الفواتير المنشأة',
  'Search bills': 'البحث في الفواتير',
  'Gender': 'الجنس',
  'Age': 'العمر',
  'Select patient': 'اختر المريض',
  'Search patients while typing': 'ابحث عن المرضى أثناء الكتابة',
  'Use guest': 'استخدام زائر',
  'Selected': 'تم الاختيار',
  'Search or enter a service': 'ابحث أو أدخل خدمة',
  'Custom service': 'خدمة مخصصة',
  'Follow-up time': 'وقت المتابعة',
  'Participation fee': 'رسوم مشاركة المريض',
  'Insurance amount': 'مبلغ التأمين',
  'Amount received from insurer': 'المبلغ المستلم من شركة التأمين',
  'Settlement date': 'تاريخ التسوية',
  'Requested': 'المطلوب',
  'Received from insurer': 'المستلم من التأمين',
  'Patient participation': 'مشاركة المريض',
  'Insurance outstanding': 'مستحق التأمين',
  'Adjust payment': 'تعديل الدفعة',
  'Print receipt': 'طباعة الإيصال',
  'Print all receipts': 'طباعة كل الإيصالات',
  'Patient financial report': 'التقرير المالي للمريض',
  'Full session report': 'تقرير الجلسات الكامل',
  'NIS': 'شيكل',
  'Generated': 'تم الإنشاء',
  'Date range': 'نطاق التاريخ',
  'Session total': 'إجمالي الجلسة',
  'There are no closed sessions with an outstanding balance.': 'لا توجد جلسات مغلقة برصيد مستحق.',
  'Only clinic administrators can manage clinic services.': 'يمكن لمديري العيادة فقط إدارة خدمات العيادة.',
  'Patient name is required.': 'اسم المريض مطلوب.',
  'years': 'سنة',
  'paid': 'مدفوع',
  'pending': 'معلّق',
  'rejected': 'مرفوض',
  'open': 'مفتوحة',
  'closed': 'مغلقة',
  'No matching sessions.': 'لا توجد جلسات مطابقة.',
  'No matching payment records.': 'لا توجد مدفوعات مطابقة.',
  'No providers found.': 'لم يتم العثور على مزودين.',
  'No insurance claims in this range.': 'لا توجد مطالبات تأمين في هذا النطاق.',
  'No generated bills found.': 'لم يتم العثور على فواتير منشأة.',
  'No services configured. Staff can enter a custom service while creating a session.': 'لم تتم إضافة خدمات. يمكن للموظفين إدخال خدمة مخصصة عند إنشاء الجلسة.',
  'Generated automatically when the patient is saved.': 'يتم إنشاؤه تلقائياً عند حفظ المريض.',
  'Choose a saved service or keep typing to use free text.': 'اختر خدمة محفوظة أو تابع الكتابة لإدخال خدمة مخصصة.',
  'Search closed sessions while typing': 'ابحث عن الجلسات المغلقة أثناء الكتابة',
  'Delete this clinic service?': 'هل تريد حذف خدمة العيادة هذه؟',
  'exclude patient participation': 'لا تشمل مشاركة المريض',
  'Close & record payment': 'إغلاق وتسجيل دفعة',
  'Mon': 'الإثنين',
  'Tue': 'الثلاثاء',
  'Wed': 'الأربعاء',
  'Thu': 'الخميس',
  'Fri': 'الجمعة',
  'Sat': 'السبت',
  'Sun': 'الأحد',
  'Version history': 'سجل الإصدارات',
  'History': 'السجل',
  'Edit session': 'تعديل الجلسة',
  'Edit payment': 'تعديل الدفعة',
  'Change reason': 'سبب التعديل',
  'Explain why this record is being changed': 'اشرح سبب تعديل هذا السجل',
  'A reason is required and will be saved in the permanent history.': 'السبب مطلوب وسيُحفظ في السجل الدائم.',
  'Last updated': 'آخر تحديث',
  'Created': 'تم الإنشاء',
  'Updated': 'تم التعديل',
  'Closed session': 'تم إغلاق الجلسة',
  'No version history found.': 'لم يتم العثور على سجل إصدارات.',
  'No field values changed.': 'لم تتغير قيم الحقول.',
  'Before and after snapshots': 'لقطات ما قبل وبعد',
  'Before': 'قبل',
  'After': 'بعد',
  'Version': 'الإصدار',
  'This record changed after you opened it. Reopen it and review the latest version before saving again.': 'تم تعديل هذا السجل بعد فتحه. أعد فتحه وراجع أحدث إصدار قبل الحفظ مرة أخرى.',
  'Enter a reason for this change.': 'أدخل سبب هذا التعديل.',
  'Only clinic administrators can change a closed session amount.': 'يمكن لمديري العيادة فقط تغيير مبلغ الجلسة المغلقة.',
  'Only clinic administrators can change the date, time, or service of a closed session.': 'يمكن لمديري العيادة فقط تغيير تاريخ أو وقت أو خدمة الجلسة المغلقة.',
  'The session amount cannot be lower than payments and active insurance claims.': 'لا يمكن أن يكون مبلغ الجلسة أقل من الدفعات ومطالبات التأمين النشطة.',
  'Final amount': 'المبلغ النهائي',
  'Record details': 'تفاصيل السجل',
  'Next session date': 'تاريخ الجلسة القادمة',
  'Next session time': 'وقت الجلسة القادمة',
  'Follow-up appointment': 'موعد متابعة',
  'Scheduled follow-up': 'متابعة مجدولة'
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
    const label = button.querySelector('.language-toggle-label');
    if (label) label.textContent = language === 'ar' ? 'English' : 'العربية';
    button.setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    button.setAttribute('title', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  });
  document.title = language === 'ar' ? 'عيادة RTS' : 'RTS Clinic';
}
function toggleLanguage() {
  language = language === 'ar' ? 'en' : 'ar';
  localStorage.setItem(languageKey, language);
  renderAll();
  if (currentUser && currentClinic) {
    $('signedInUser').textContent = `${currentClinic.name || currentClinic.id} · ${currentUser.name} · ${tr(currentUser.role === 'admin' ? 'Admin' : 'Staff')}`;
  }
}
const emptyState = () => ({
  patients: [],
  sessions: [],
  payments: [],
  insurance: [],
  services: [],
  bills: [],
  medicalFiles: [],
  auditLog: [],
  settings: { nextPatientSequence: 1 }
});
let state = emptyState();

let dialogMode = '';
let pendingPaymentSessionId = '';
let editingPaymentId = '';
let editingPatientId = '';
let editingSessionId = '';
let calendarDate = new Date();
let currentUser = null;
let currentClinic = null;

const $ = (id) => document.getElementById(id);
const money = (value) => `₪${Number(value || 0).toFixed(2)}`;
const nis = (value) => `${money(value)} ${tr('NIS')}`;
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const currentTime = () => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const patientById = (patientId) => state.patients.find((patient) => patient.id === patientId);
const patientName = (patientId) => patientId === 'guest' ? 'Guest / unidentified' : patientById(patientId)?.fullName || patientById(patientId)?.name || 'Unknown patient';
const sessionById = (sessionId) => state.sessions.find((session) => session.id === sessionId);
const localizedDateTime = (value) => value ? new Date(value).toLocaleString(language === 'ar' ? 'ar' : 'en') : '';
const revisionMetadata = (record) => {
  if (!record) return '';
  const actor = record.updatedByName || record.updatedBy || record.createdByName || record.createdBy || tr('Clinic user');
  return `${tr('Version')} ${Number(record.revision || 1)} · ${tr('Last updated')} ${esc(localizedDateTime(record.updatedAt || record.createdAt))} · ${esc(actor)}`;
};
const ageFromDob = (dateOfBirth) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth || '')) return '';
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 && age <= 130 ? age : null;
};
const patientAvatar = (patient) => {
  const name = patientName(patient.id);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
  return `<span class="patient-avatar patient-avatar-fallback" aria-hidden="true">${esc(initials)}</span>`;
};
const sessionLabel = (sessionId) => {
  const session = sessionById(sessionId);
  return session ? `${session.date} ${session.time || ''} · ${patientName(session.patientId)}` : 'Unknown session';
};
const errorMessage = (error, fallback) => {
  const message = String(error?.message || '').replace(/^Error invoking remote method '[^']+': Error:\s*/, '');
  return tr(message || fallback);
};
function setInlineError(id, message, focus = false) {
  const element = $(id);
  if (!element) return;
  element.textContent = message ? tr(message) : '';
  if (message && focus) element.focus();
}
function showAppMessage(message, isError = false) {
  const element = $('appMessage');
  element.textContent = tr(message);
  element.classList.toggle('is-error', isError);
  element.classList.toggle('hidden', !message);
  if (message && isError) element.focus();
}
function replaceState(nextState) {
  state = { ...emptyState(), ...(nextState || {}) };
  migrateState();
  renderAll();
}
async function applyMutation(action, payload) {
  const nextState = await window.rtsClinic.mutate(action, payload);
  replaceState(nextState);
  $('syncState').textContent = tr('Saved to clinic workspace');
  return nextState;
}

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
      try {
        const result = await updater.download();
        if (!result?.ok) fallback('Automatic update failed. Use the secure release download page.');
      } catch (error) {
        console.error('Update download failed:', error);
        fallback('Automatic update failed. Use the secure release download page.');
      }
    };
    overlay.classList.remove('hidden');
  });
  updater.on('updater-progress', (progress) => {
    const percent = Math.round(progress.percent || 0);
    $('updateProgressTrack').classList.remove('hidden');
    $('updateProgressBar').value = Math.max(0, Math.min(100, percent));
    $('updateStatus').textContent = `Downloading ${percent}%`;
  });
  updater.on('updater-downloaded', () => {
    $('updateProgressBar').value = 100;
    $('updateStatus').textContent = 'The verified update is ready to install.';
    nowButton.disabled = false;
    nowButton.textContent = 'Restart and install';
    nowButton.onclick = () => updater.install();
  });
  updater.on('updater-error', () => {
    if (!overlay.classList.contains('hidden')) fallback('Automatic update failed. Use the secure release download page.');
  });
  laterButton.addEventListener('click', () => overlay.classList.add('hidden'));
  updater.check().catch((error) => console.error('Update check failed:', error));
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
    if (payment.method === 'insurance') {
      payment.insuranceAmount = Number(payment.insuranceAmount ?? payment.amount ?? 0);
      payment.participationFee = Number(payment.participationFee || 0);
      payment.settledAmount = Number(payment.settledAmount ?? (payment.status === 'paid' ? payment.insuranceAmount : 0));
      payment.amount = payment.insuranceAmount;
    }
  });
  if (!Array.isArray(state.medicalFiles)) state.medicalFiles = [];
  if (!Array.isArray(state.services)) state.services = [];
}

function sessionPayments(sessionId) {
  return state.payments.filter((payment) => payment.sessionId === sessionId && payment.status !== 'void');
}

function paymentCollected(payment) {
  if (payment.status === 'void') return 0;
  if (payment.method === 'insurance') {
    return Number(payment.participationFee || 0) + Number(payment.settledAmount || 0);
  }
  return payment.status === 'paid' ? Number(payment.amount || 0) : 0;
}

function paymentPendingInsurance(payment) {
  if (payment.method !== 'insurance' || payment.status !== 'pending') return 0;
  return Math.max(Number(payment.insuranceAmount || payment.amount || 0) - Number(payment.settledAmount || 0), 0);
}

function sessionFinance(sessionId) {
  const session = sessionById(sessionId);
  const payments = sessionPayments(sessionId);
  const total = session?.status === 'closed' ? Number(session.amount || 0) : 0;
  const received = payments.reduce((sum, payment) => sum + paymentCollected(payment), 0);
  const pendingInsurance = payments.reduce((sum, payment) => sum + paymentPendingInsurance(payment), 0);
  return {
    total,
    received,
    pendingInsurance,
    outstanding: Math.max(total - received, 0),
    unclaimed: Math.max(total - received - pendingInsurance, 0)
  };
}

function totals(from, to) {
  const payments = state.payments.filter((payment) => payment.status !== 'void' && (!from || payment.date >= from) && (!to || payment.date <= to));
  const byMethod = { cash: 0, debit: 0, insurance: 0 };
  let participation = 0;
  payments.forEach((payment) => {
    if (payment.method === 'insurance') {
      byMethod.insurance += Number(payment.settledAmount || 0);
      participation += Number(payment.participationFee || 0);
    } else if (payment.status === 'paid') {
      byMethod[payment.method] = (byMethod[payment.method] || 0) + Number(payment.amount || 0);
    }
  });
  return {
    total: Object.values(byMethod).reduce((sum, value) => sum + value, 0) + participation,
    participation,
    byMethod
  };
}

function renderDashboard() {
  const day = totals(today(), today());
  $('todayCollected').textContent = money(day.total);
  $('todaySessions').textContent = state.sessions.filter((session) => session.date === today()).length;
  $('totalPatients').textContent = state.patients.length;
  $('insuranceReceivable').textContent = money(state.payments.reduce((sum, payment) => sum + paymentPendingInsurance(payment), 0));
  $('recentSessions').innerHTML = state.sessions.slice().reverse().slice(0, 6).map(sessionRow).join('') || '<p class="muted">No sessions yet.</p>';
  const max = Math.max(day.total, 1);
  $('paymentMix').innerHTML = Object.entries(day.byMethod).map(([method, amount]) => `<div><div class="row-card"><span>${tr(method === 'debit' ? 'Debit card' : method[0].toUpperCase() + method.slice(1))}</span><strong>${money(amount)}</strong></div><progress class="mix-progress" max="${max}" value="${amount}"></progress></div>`).join('');
  renderCalendar();
  const upcoming = calendarAppointments().filter((appointment) => appointment.date >= today())
    .sort((a, b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`))
    .slice(0, 5);
  $('upcomingSessions').innerHTML = upcoming.map(appointmentRow).join('') || '<p class="muted">No upcoming sessions.</p>';
}

function sessionRow(session) {
  const label = session.status === 'closed' ? money(session.amount) : 'Open';
  return `<button type="button" class="row-card row-button" data-session-id="${esc(session.id)}"><div><strong>${esc(patientName(session.patientId))}</strong><small>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</small></div><span class="pill">${label}</span></button>`;
}

function followUpIsMaterialized(session) {
  const followUpDate = session.followUpDate || session.followUp;
  if (!followUpDate) return false;
  return state.sessions.some((candidate) => candidate.id !== session.id
    && candidate.patientId === session.patientId
    && candidate.date === followUpDate
    && (!session.followUpTime || candidate.time === session.followUpTime));
}

function calendarAppointments(date = '') {
  const appointments = state.sessions
    .filter((session) => !date || session.date === date)
    .map((session) => ({ session, date: session.date, time: session.time || '', followUp: false }));
  state.sessions.forEach((session) => {
    const followUpDate = session.followUpDate || session.followUp;
    if (!followUpDate || (date && followUpDate !== date) || followUpIsMaterialized(session)) return;
    appointments.push({
      session,
      date: followUpDate,
      time: session.followUpTime || '',
      followUp: true
    });
  });
  return appointments;
}

function appointmentRow(appointment) {
  if (!appointment.followUp) return sessionRow(appointment.session);
  return `<button type="button" class="row-card row-button follow-up-row" data-session-id="${esc(appointment.session.id)}"><div><strong>${esc(patientName(appointment.session.patientId))}</strong><small>${esc(appointment.date)} ${esc(appointment.time)} · ${tr('Follow-up appointment')}</small></div><span class="pill follow-up-pill">${tr('Scheduled follow-up')}</span></button>`;
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
    const appointments = calendarAppointments(date)
      .sort((a, b) => `${a.time} ${a.followUp ? '1' : '0'}`.localeCompare(`${b.time} ${b.followUp ? '1' : '0'}`));
    const classes = ['calendar-day'];
    if (date === today()) classes.push('is-today');
    cells.push(`<div class="${classes.join(' ')}"><span class="calendar-date">${day}</span>${appointments.slice(0, 3).map((appointment) => `<button type="button" class="calendar-event${appointment.followUp ? ' is-follow-up' : ''}" data-session-id="${esc(appointment.session.id)}" aria-label="${esc(`${appointment.followUp ? tr('Follow-up appointment') : tr('Session details')}: ${patientName(appointment.session.patientId)}`)}">${esc(appointment.time)} ${appointment.followUp ? `${tr('Follow-up')} · ` : ''}${esc(patientName(appointment.session.patientId))}</button>`).join('')}${appointments.length > 3 ? `<small class="calendar-more">+${appointments.length - 3} more</small>` : ''}</div>`);
  }
  $('calendar').innerHTML = cells.join('');
}

function renderPatients() {
  const search = ($('patientSearch').value || '').toLowerCase();
  const patients = state.patients.filter((patient) => `${patient.fullName || patient.name} ${patient.phone} ${patient.fileNumber} ${patient.nationalId}`.toLowerCase().includes(search));
  const rows = patients.map((patient) => {
    const sessions = state.sessions.filter((session) => session.patientId === patient.id);
    const collected = state.payments.filter((payment) => payment.patientId === patient.id).reduce((sum, payment) => sum + paymentCollected(payment), 0);
    const age = ageFromDob(patient.dateOfBirth);
    const demographics = [patient.sex ? tr(patient.sex) : '', age !== null ? `${age} ${tr('years')}` : ''].filter(Boolean).join(' · ');
    return `<tr><td><span class="pill">${esc(patient.fileNumber || 'Not assigned')}</span></td><td><div class="patient-summary">${patientAvatar(patient)}<div><strong>${esc(patientName(patient.id))}</strong>${demographics ? `<small>${esc(demographics)}</small>` : ''}</div></div></td><td>${esc(patient.phone || 'Not recorded')}</td><td>${sessions.length}</td><td>${money(collected)}</td><td><button type="button" class="link-button" data-patient-id="${esc(patient.id)}">View record</button></td></tr>`;
  }).join('');
  $('patientsTable').innerHTML = rows ? `<table><thead><tr><th>File number</th><th>Patient</th><th>Phone</th><th>Sessions</th><th>Collected</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No patients found.</p>';
}

function renderSessions() {
  const search = ($('sessionSearch')?.value || '').trim().toLowerCase();
  const status = $('sessionStatusFilter')?.value || '';
  const sessions = state.sessions.filter((session) => {
    const finance = sessionFinance(session.id);
    const searchable = `${patientName(session.patientId)} ${session.service} ${session.date} ${session.time || ''} ${session.treatment || ''} ${session.note || ''}`.toLowerCase();
    const statusMatch = !status
      || session.status === status
      || (status === 'unpaid' && session.status === 'closed' && finance.outstanding > 0.005);
    return searchable.includes(search) && statusMatch;
  });
  const rows = sessions.slice().reverse().map((session) => {
    const finance = sessionFinance(session.id);
    const accessibleLabel = `${tr('View details')}: ${patientName(session.patientId)}, ${session.date} ${session.time || ''}`;
    return `<tr class="clickable-row" data-session-id="${esc(session.id)}"><td><button type="button" class="table-row-button" data-session-id="${esc(session.id)}" aria-label="${esc(accessibleLabel)}"><strong>${esc(session.date)}</strong><small>${esc(session.time || '')}</small></button></td><td>${esc(patientName(session.patientId))}</td><td>${esc(session.service)}</td><td>${session.status === 'closed' ? money(session.amount) : `<span class="pill">${tr('Open')}</span>`}</td><td>${money(finance.received)}${finance.pendingInsurance ? `<br><small>${tr('Claim pending')}: ${money(finance.pendingInsurance)}</small>` : ''}</td><td>${session.status === 'closed' ? money(finance.outstanding) : '—'}</td></tr>`;
  }).join('');
  $('sessionsTable').innerHTML = rows ? `<table><thead><tr><th>Date / time</th><th>Patient</th><th>Service</th><th>Session value</th><th>Received</th><th>To allocate</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No matching sessions.</p>';
}

function renderPayments() {
  const search = ($('paymentSearch')?.value || '').trim().toLowerCase();
  const method = $('paymentMethodFilter')?.value || '';
  const status = $('paymentStatusFilter')?.value || '';
  const payments = state.payments.filter((payment) => {
    const provider = state.insurance.find((item) => item.id === payment.insuranceId)?.name || '';
    const searchable = `${patientName(payment.patientId)} ${sessionLabel(payment.sessionId)} ${provider} ${payment.amount}`.toLowerCase();
    return searchable.includes(search) && (!method || payment.method === method) && (!status || payment.status === status);
  });
  const rows = payments.slice().reverse().map((payment) => {
    const provider = state.insurance.find((item) => item.id === payment.insuranceId)?.name || '';
    const amounts = payment.method === 'insurance'
      ? `${money(payment.insuranceAmount)} / ${money(payment.settledAmount)}`
      : money(payment.amount);
    return `<tr class="clickable-row" data-payment-id="${esc(payment.id)}"><td><button class="table-row-button" type="button" data-payment-id="${esc(payment.id)}"><strong>${esc(payment.date)}</strong><small>${tr('Adjust payment')}</small></button></td><td>${esc(patientName(payment.patientId))}</td><td>${esc(sessionLabel(payment.sessionId))}</td><td>${tr(payment.method === 'debit' ? 'Debit card' : payment.method[0].toUpperCase() + payment.method.slice(1))}</td><td>${esc(provider)}</td><td>${amounts}</td><td><span class="pill status-${esc(payment.status || 'paid')}">${tr(payment.status || 'paid')}</span></td></tr>`;
  }).join('');
  $('paymentsTable').innerHTML = rows ? `<table><thead><tr><th>Date</th><th>Patient</th><th>Session</th><th>Method</th><th>Insurance</th><th>Amount / settled</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No matching payment records.</p>';
}

function renderInsurance() {
  const selectedProvider = $('insuranceReportProvider')?.value || '';
  $('insuranceReportProvider').innerHTML = `<option value="">${tr('All providers')}</option>${state.insurance.map((provider) => `<option value="${esc(provider.id)}">${esc(provider.name)}</option>`).join('')}`;
  $('insuranceReportProvider').value = state.insurance.some((provider) => provider.id === selectedProvider) ? selectedProvider : '';
  const search = ($('insuranceSearch')?.value || '').trim().toLowerCase();
  const providerFilter = $('insuranceClaimFilter')?.value || '';
  const providers = state.insurance.filter((provider) => {
    const claims = state.payments.filter((payment) => payment.insuranceId === provider.id);
    const mapped = state.patients.filter((patient) => patient.insuranceId === provider.id);
    return `${provider.name} ${provider.contact || ''}`.toLowerCase().includes(search)
      && (!providerFilter || (providerFilter === 'pending' && claims.some((claim) => claim.status === 'pending')) || (providerFilter === 'mapped' && mapped.length));
  });
  $('insuranceList').innerHTML = providers.map((provider) => {
    const claims = state.payments.filter((payment) => payment.insuranceId === provider.id);
    const mapped = state.patients.filter((patient) => patient.insuranceId === provider.id).length;
    const requested = claims.reduce((sum, payment) => sum + Number(payment.insuranceAmount || 0), 0);
    const received = claims.reduce((sum, payment) => sum + Number(payment.settledAmount || 0), 0);
    return `<div class="row-card"><div><strong>${esc(provider.name)}</strong><small>${esc(provider.contact || '')}</small><small>${mapped} ${tr('Mapped patients')}</small></div><div><strong>${money(requested)} / ${money(received)}</strong><small>${tr('Requested')} / ${tr('Received')}</small></div></div>`;
  }).join('') || '<p class="muted">No providers found.</p>';

  const from = $('insuranceFrom')?.value || '';
  const to = $('insuranceTo')?.value || '';
  const reportProvider = $('insuranceReportProvider')?.value || '';
  const claims = state.payments.filter((payment) => payment.method === 'insurance'
    && (!from || payment.date >= from)
    && (!to || payment.date <= to)
    && (!reportProvider || payment.insuranceId === reportProvider));
  const requested = claims.reduce((sum, payment) => sum + Number(payment.insuranceAmount || 0), 0);
  const received = claims.reduce((sum, payment) => sum + Number(payment.settledAmount || 0), 0);
  const participation = claims.reduce((sum, payment) => sum + Number(payment.participationFee || 0), 0);
  const pending = claims.reduce((sum, payment) => sum + paymentPendingInsurance(payment), 0);
  $('insuranceSummary').innerHTML = `<div class="financial-strip"><div><span>${tr('Requested')}</span><strong>${money(requested)}</strong></div><div><span>${tr('Received from insurer')}</span><strong>${money(received)}</strong></div><div><span>${tr('Insurance outstanding')}</span><strong>${money(pending)}</strong></div></div><p class="muted">${tr('Patient participation')}: ${money(participation)} · ${tr('Requested')} / ${tr('Received from insurer')} ${tr('exclude patient participation')}</p>`;
  const rows = claims.slice().reverse().map((payment) => {
    const session = sessionById(payment.sessionId);
    const provider = state.insurance.find((item) => item.id === payment.insuranceId);
    return `<tr class="clickable-row" data-payment-id="${esc(payment.id)}"><td>${esc(provider?.name || '')}</td><td>${esc(payment.date)}</td><td>${esc(patientName(payment.patientId))}</td><td>${esc(session?.service || '')}</td><td>${money(payment.insuranceAmount)}</td><td>${money(payment.participationFee)}</td><td>${money(payment.settledAmount)}</td><td>${money(paymentPendingInsurance(payment))}</td><td><span class="pill status-${esc(payment.status)}">${tr(payment.status)}</span></td></tr>`;
  }).join('');
  $('claimsList').innerHTML = rows ? `<table><thead><tr><th>Provider</th><th>Date</th><th>Patient</th><th>Treatment</th><th>Requested</th><th>Participation</th><th>Received</th><th>Outstanding</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="muted">No insurance claims in this range.</p>';
}

function renderReports() {
  const from = $('reportFrom').value;
  const to = $('reportTo').value;
  const selectedSessions = state.sessions.filter((session) => session.status === 'closed' && (!from || session.date >= from) && (!to || session.date <= to));
  const result = totals(from, to);
  $('reportSummary').innerHTML = `<div class="metric-grid"><div class="metric"><span>Sessions</span><strong>${selectedSessions.length}</strong></div><div class="metric"><span>Collected</span><strong>${money(result.total)}</strong></div><div class="metric"><span>Cash</span><strong>${money(result.byMethod.cash)}</strong></div><div class="metric"><span>Insurance</span><strong>${money(result.byMethod.insurance)}</strong></div></div>`;
  $('reportsTable').innerHTML = `<table><thead><tr><th>Patient</th><th>Sessions</th><th>Session value</th><th>Collected</th><th>Balance</th></tr></thead><tbody>${state.patients.map((patient) => {
    const sessions = selectedSessions.filter((session) => session.patientId === patient.id);
    const value = sessions.reduce((sum, session) => sum + Number(session.amount || 0), 0);
    const sessionIds = new Set(sessions.map((session) => session.id));
    const collected = state.payments.filter((payment) => sessionIds.has(payment.sessionId)).reduce((sum, payment) => sum + paymentCollected(payment), 0);
    return sessions.length ? `<tr><td>${esc(patientName(patient.id))}</td><td>${sessions.length}</td><td>${money(value)}</td><td>${money(collected)}</td><td>${money(Math.max(value - collected, 0))}</td></tr>` : '';
  }).join('')}</tbody></table>`;
  const billSearch = ($('billSearch')?.value || '').trim().toLowerCase();
  const bills = state.bills.filter((bill) => {
    const inRange = (!from || !bill.to || bill.to >= from) && (!to || !bill.from || bill.from <= to);
    return inRange && `${bill.from || ''} ${bill.to || ''} ${bill.generatedAt || ''} ${bill.totals?.total || ''}`.toLowerCase().includes(billSearch);
  });
  $('billsTable').innerHTML = bills.length ? `<table><thead><tr><th>Generated</th><th>Date range</th><th>Sessions</th><th>Session value</th><th>Collected</th><th>Outstanding</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${bills.slice().reverse().map((bill) => `<tr><td>${esc(new Date(bill.generatedAt).toLocaleString(language === 'ar' ? 'ar' : 'en'))}</td><td>${esc(bill.from || 'Start')} – ${esc(bill.to || 'Today')}</td><td>${Number(bill.summary?.sessionCount || 0)}</td><td>${money(bill.summary?.sessionValue || 0)}</td><td>${money(bill.totals?.total || bill.summary?.received || 0)}</td><td>${money(bill.summary?.outstanding || 0)}</td><td><button type="button" class="link-button" data-print-bill="${esc(bill.id)}">${tr('Print / save PDF')}</button></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No generated bills found.</p>';
}

function renderServices() {
  $('serviceList').innerHTML = state.services.map((service) => `<span class="service-tag">${esc(service.name)}<button type="button" data-delete-service="${esc(service.id)}" aria-label="${esc(`${tr('Delete')} ${service.name}`)}">×</button></span>`).join('') || `<p class="muted">${tr('No services configured. Staff can enter a custom service while creating a session.')}</p>`;
}

function renderAll() {
  renderDashboard();
  renderPatients();
  renderSessions();
  renderPayments();
  renderInsurance();
  renderReports();
  renderServices();
  applyLanguage();
}

function patientForm(patient) {
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
  const age = ageFromDob(patient?.dateOfBirth);
  const providerOptions = state.insurance.map((provider) => `<option value="${esc(provider.id)}"${patient?.insuranceId === provider.id ? ' selected' : ''}>${esc(provider.name)}</option>`).join('');
  return `<fieldset class="form-section"><legend>Identity and contact</legend><div class="form-grid"><label>Full legal name<input name="fullName" value="${esc(patient?.fullName || patient?.name || '')}" autocomplete="name" required></label>${patient?.fileNumber ? `<label>File number<input value="${esc(patient.fileNumber)}" readonly></label>` : `<div><span class="muted">${tr('File number')}</span><p class="field-help">${tr('Generated automatically when the patient is saved.')}</p></div>`}<label>Date of birth<div class="date-with-age"><input id="patientDob" name="dateOfBirth" type="date" min="1896-01-01" max="${today()}" value="${esc(patient?.dateOfBirth || '')}" required><output id="patientAge" class="age-output" for="patientDob">${age !== null ? `${age} ${tr('years')}` : tr('Age')}</output></div></label><div class="choice-field"><span>${tr('Gender')}</span><div class="radio-group" role="radiogroup" aria-label="${tr('Gender')}"><label class="radio-option"><input type="radio" name="sex" value="Male"${patient?.sex === 'Male' ? ' checked' : ''} required><span>${tr('Male')}</span></label><label class="radio-option"><input type="radio" name="sex" value="Female"${patient?.sex === 'Female' ? ' checked' : ''} required><span>${tr('Female')}</span></label></div></div><label>Phone<input name="phone" type="tel" autocomplete="tel" value="${esc(patient?.phone || '')}"></label><label>National ID<input name="nationalId" value="${esc(patient?.nationalId || '')}" autocomplete="off"></label><label>Insurance provider<select name="insuranceId"><option value="">${tr('Not recorded')}</option>${providerOptions}</select></label><label class="full-width">Address<textarea name="address" autocomplete="street-address">${esc(patient?.address || '')}</textarea></label><label>Emergency contact<input name="emergencyContact" value="${esc(patient?.emergencyContact || '')}"></label><label>Emergency phone<input name="emergencyPhone" type="tel" value="${esc(patient?.emergencyPhone || '')}"></label></div></fieldset><fieldset class="form-section critical-form-section"><legend>Critical clinical alerts</legend><p class="critical-help">Select anything a doctor or staff member must see before treatment.</p><div class="critical-checks">${alertChecks}</div><label>Critical alert note<textarea name="criticalNote" placeholder="Examples: penicillin reaction, pacemaker, seizure history, special precautions">${esc(patient?.criticalNote || '')}</textarea></label></fieldset><fieldset class="form-section"><legend>Medical record</legend><div class="form-grid"><label>Allergies<textarea name="allergies" placeholder="Record allergies or “None known”">${esc(patient?.allergies || '')}</textarea></label><label>Current conditions<textarea name="conditions">${esc(patient?.conditions || '')}</textarea></label><label>Medications<textarea name="medications">${esc(patient?.medications || '')}</textarea></label><label>Clinical notes<textarea name="medicalNotes">${esc(patient?.medicalNotes || '')}</textarea></label></div></fieldset><fieldset class="form-section"><legend>Administrative notes</legend><label><textarea name="notes">${esc(patient?.notes || '')}</textarea></label></fieldset>`;
}

function medicalFilesSection(recordType, recordId, prefix) {
  return `<section class="medical-files"><div class="history-heading"><h4>${tr('Medical files')}</h4><div><button type="button" class="secondary file-upload-button" data-file-picker="${prefix}FileInput">${tr('Add file')}</button><input id="${prefix}FileInput" class="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" data-file-upload data-record-type="${recordType}" data-record-id="${esc(recordId)}" data-file-list="${prefix}FileList" data-file-error="${prefix}FileError"></div></div><p class="muted">${tr('PDF, JPG, PNG, or WebP. Maximum 10 MB.')}</p><p id="${prefix}FileError" class="form-error" role="alert"></p><div id="${prefix}FileList" aria-live="polite"><p class="muted">${tr('Loading…')}</p></div></section>`;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function renderMedicalFiles(recordType, recordId, listId, errorId) {
  setInlineError(errorId, '');
  try {
    const files = await window.rtsClinic.files.list(recordType, recordId);
    const list = $(listId);
    if (!list) return;
    list.innerHTML = files.length
      ? files.map((file) => `<div class="medical-file-row"><div><strong>${esc(file.originalName)}</strong><small>${esc(formatFileSize(file.size))} · ${esc(new Date(file.uploadedAt).toLocaleString(language === 'ar' ? 'ar' : 'en'))}</small></div><div class="file-actions"><button type="button" class="link-button" data-file-download="${esc(file.id)}" data-file-error="${errorId}">${tr('Download')}</button>${currentUser?.role === 'admin' ? `<button type="button" class="link-button danger-link" data-file-delete="${esc(file.id)}" data-record-type="${recordType}" data-record-id="${esc(recordId)}" data-file-list="${listId}" data-file-error="${errorId}">${tr('Delete')}</button>` : ''}</div></div>`).join('')
      : `<p class="muted">${tr('No medical files uploaded.')}</p>`;
  } catch (error) {
    setInlineError(errorId, errorMessage(error, 'Unable to load medical files.'));
  }
}

function outstandingSessions(includeSessionId = '') {
  return state.sessions.filter((session) => (
    session.status === 'closed'
    && (sessionFinance(session.id).outstanding > 0.005 || session.id === includeSessionId)
  ));
}

function setupPatientPicker(existingSession = null) {
  const input = $('patientPickerInput');
  const hidden = $('patientPickerValue');
  const results = $('patientPickerResults');
  const note = $('patientPickerSelection');
  if (!input || !hidden || !results || !note) return;
  const render = () => {
    const query = input.value.trim().toLowerCase();
    const patients = state.patients
      .filter((patient) => `${patientName(patient.id)} ${patient.fileNumber || ''} ${patient.phone || ''}`.toLowerCase().includes(query))
      .slice(0, 12);
    results.innerHTML = patients.map((patient) => `<button type="button" class="typeahead-option" data-patient-choice="${esc(patient.id)}"><span><strong>${esc(patientName(patient.id))}</strong><small>${esc(patient.fileNumber || '')} · ${esc(patient.phone || '')}</small></span></button>`).join('');
  };
  const selectPatient = (patientId) => {
    if (patientId === 'guest') {
      hidden.value = 'guest';
      input.value = tr('Guest / unidentified');
      note.textContent = tr('Selected');
      results.innerHTML = '';
      return;
    }
    const patient = patientById(patientId);
    if (!patient) return;
    hidden.value = patient.id;
    input.value = patientName(patient.id);
    note.textContent = `${tr('Selected')}: ${patient.fileNumber || patientName(patient.id)}`;
    results.innerHTML = '';
  };
  input.addEventListener('input', () => {
    hidden.value = '';
    note.textContent = '';
    render();
  });
  input.addEventListener('focus', render);
  results.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-patient-choice]');
    if (!choice) return;
    selectPatient(choice.dataset.patientChoice);
  });
  $('useGuest')?.addEventListener('click', () => selectPatient('guest'));
  if (existingSession?.patientId) selectPatient(existingSession.patientId);
}

function setupServicePicker() {
  const input = $('servicePickerInput');
  const results = $('servicePickerResults');
  if (!input || !results) return;
  if (input.readOnly) {
    results.remove();
    return;
  }
  const render = () => {
    const query = input.value.trim().toLowerCase();
    results.innerHTML = state.services
      .filter((service) => service.name.toLowerCase().includes(query))
      .slice(0, 10)
      .map((service) => `<button type="button" class="typeahead-option" data-service-choice="${esc(service.name)}"><strong>${esc(service.name)}</strong></button>`)
      .join('');
  };
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  results.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-service-choice]');
    if (!choice) return;
    input.value = choice.dataset.serviceChoice;
    results.innerHTML = '';
    input.focus();
  });
}

function updatePaymentFields() {
  const method = $('paymentMethod')?.value;
  const direct = $('directPaymentFields');
  const insurance = $('insurancePaymentFields');
  if (!direct || !insurance) return;
  const isInsurance = method === 'insurance';
  direct.classList.toggle('hidden', isInsurance);
  insurance.classList.toggle('hidden', !isInsurance);
  direct.querySelectorAll('input,select').forEach((field) => { field.disabled = isInsurance; });
  insurance.querySelectorAll('input,select').forEach((field) => { field.disabled = !isInsurance; });
}

function setupSessionPicker(existingPayment) {
  const input = $('sessionPickerInput');
  const hidden = $('sessionPickerValue');
  const results = $('sessionPickerResults');
  const note = $('sessionPickerSelection');
  if (!input || !hidden || !results || !note) return;
  const available = () => outstandingSessions(existingPayment?.sessionId);
  const selectSession = (sessionId) => {
    const session = sessionById(sessionId);
    if (!session) return;
    hidden.value = session.id;
    input.value = sessionLabel(session.id);
    const finance = sessionFinance(session.id);
    note.textContent = `${tr('Outstanding')}: ${money(finance.outstanding)}`;
    const amountInput = $('paymentAmount');
    const insuranceAmount = $('insuranceAmount');
    if (amountInput && !existingPayment) amountInput.value = finance.outstanding.toFixed(2);
    if (insuranceAmount && !existingPayment) insuranceAmount.value = Math.max(finance.unclaimed, 0).toFixed(2);
    const patient = patientById(session.patientId);
    if ($('paymentInsuranceId') && patient?.insuranceId && !existingPayment) $('paymentInsuranceId').value = patient.insuranceId;
  };
  const render = () => {
    const query = input.value.trim().toLowerCase();
    results.innerHTML = available()
      .filter((session) => `${sessionLabel(session.id)} ${session.service} ${session.date}`.toLowerCase().includes(query))
      .slice(0, 20)
      .map((session) => {
        const finance = sessionFinance(session.id);
        return `<button type="button" class="typeahead-option" data-session-choice="${esc(session.id)}"><span><strong>${esc(patientName(session.patientId))}</strong><small>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</small></span><strong>${money(finance.outstanding)}</strong></button>`;
      }).join('');
  };
  input.addEventListener('input', () => {
    hidden.value = '';
    note.textContent = '';
    render();
  });
  input.addEventListener('focus', render);
  results.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-session-choice]');
    if (!choice) return;
    selectSession(choice.dataset.sessionChoice);
    results.innerHTML = '';
  });
  if (existingPayment?.sessionId) selectSession(existingPayment.sessionId);
  else if (pendingPaymentSessionId) selectSession(pendingPaymentSessionId);
}

function recordVersionPanel(entityType, record) {
  if (!record?.id) return '';
  return `<div class="record-version"><p><strong>${tr('Version')} ${Number(record.revision || 1)}</strong><small>${revisionMetadata(record)}</small></p><button type="button" class="secondary" data-history-type="${esc(entityType)}" data-history-id="${esc(record.id)}">${tr('History')}</button></div>`;
}

function changeReasonField() {
  return `<label class="change-reason"><span>${tr('Change reason')}</span><textarea name="changeReason" required maxlength="500" placeholder="${tr('Explain why this record is being changed')}"></textarea><small>${tr('A reason is required and will be saved in the permanent history.')}</small></label>`;
}

function sessionForm(session) {
  const lockedPatient = session?.status === 'closed';
  const lockedStructure = session?.status === 'closed' && currentUser?.role !== 'admin';
  const patientField = lockedPatient
    ? `<label class="full-width">${tr('Patient')}<input value="${esc(patientName(session.patientId))}" readonly><input name="patientId" type="hidden" value="${esc(session.patientId)}"></label>`
    : `<div class="typeahead full-width"><span>${tr('Patient')}</span><div class="typeahead-input-row"><input id="patientPickerInput" type="search" autocomplete="off" placeholder="${tr('Search patients while typing')}" role="combobox" aria-controls="patientPickerResults"><button id="useGuest" class="secondary" type="button">${tr('Use guest')}</button></div><input id="patientPickerValue" name="patientId" type="hidden" required><p id="patientPickerSelection" class="selection-note"></p><div id="patientPickerResults" class="typeahead-results" role="listbox"></div></div>`;
  const closedAmount = session?.status === 'closed'
    ? `<label>${tr('Final amount')}<div class="date-with-age"><span class="currency-mark" aria-hidden="true">₪</span><input name="amount" type="number" min="0.01" step="0.01" value="${esc(session.amount || '')}"${currentUser?.role === 'admin' ? '' : ' readonly'}></div></label><label>${tr('Closing note')}<textarea name="closingNote">${esc(session.closingNote || '')}</textarea></label>`
    : '';
  return `${recordVersionPanel('session', session)}${patientField}<label>Date<input name="date" type="date" value="${esc(session?.date || today())}" required${lockedStructure ? ' readonly' : ''}></label><label>Time<input name="time" type="time" value="${esc(session?.time || currentTime())}" required${lockedStructure ? ' readonly' : ''}></label><div class="typeahead full-width"><span>${tr('Service')}</span><input id="servicePickerInput" name="service" autocomplete="off" value="${esc(session?.service || '')}" placeholder="${tr('Search or enter a service')}" required role="combobox" aria-controls="servicePickerResults"${lockedStructure ? ' readonly' : ''}><p class="field-help">${tr(lockedStructure ? 'Only clinic administrators can change the date, time, or service of a closed session.' : 'Choose a saved service or keep typing to use free text.')}</p><div id="servicePickerResults" class="typeahead-results" role="listbox"></div></div><label class="full-width">Treatment / procedure<textarea name="treatment" placeholder="What was done during this visit?">${esc(session?.treatment || '')}</textarea></label><label class="full-width">Session note<textarea name="note">${esc(session?.note || '')}</textarea></label><label>Follow-up date<input name="followUpDate" type="date" value="${esc(session?.followUpDate || session?.followUp || '')}"></label><label>Follow-up time<input name="followUpTime" type="time" value="${esc(session?.followUpTime || '')}"></label>${closedAmount}${session ? changeReasonField() : ''}`;
}

function historyLabel(key) {
  return tr(key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (character) => character.toUpperCase()));
}

function historyValue(value) {
  if (value === null || value === undefined || value === '') return tr('Not recorded');
  if (Array.isArray(value)) return value.length ? value.map((item) => tr(String(item))).join(', ') : tr('Not recorded');
  if (typeof value === 'object') return JSON.stringify(value);
  return tr(String(value));
}

function openHistory(entityType, entityId) {
  const entries = state.auditLog
    .filter((entry) => entry.entityType === entityType && entry.entityId === entityId)
    .slice()
    .reverse();
  const record = entityType === 'patient' ? patientById(entityId) : entityType === 'session' ? sessionById(entityId) : state.payments.find((payment) => payment.id === entityId);
  const title = entityType === 'patient' ? patientName(entityId) : entityType === 'session' ? sessionLabel(entityId) : sessionLabel(record?.sessionId);
  $('historySubtitle').textContent = `${tr(entityType[0].toUpperCase() + entityType.slice(1))} · ${title}`;
  const ignored = new Set(['id', 'revision', 'createdAt', 'createdBy', 'createdByName', 'updatedAt', 'updatedBy', 'updatedByName']);
  $('historyDetails').innerHTML = entries.map((entry, index) => {
    const before = entry.before || {};
    const after = entry.after || {};
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .filter((key) => !ignored.has(key) && JSON.stringify(before[key]) !== JSON.stringify(after[key]));
    const changes = keys.map((key) => `<div class="version-change"><strong>${esc(historyLabel(key))}</strong><span class="version-value version-old">${esc(historyValue(before[key]))}</span><span class="version-arrow" aria-hidden="true">→</span><span class="version-value version-new">${esc(historyValue(after[key]))}</span></div>`).join('');
    const action = entry.action === 'created' ? tr('Created') : entry.action === 'closed' ? tr('Closed session') : tr('Updated');
    return `<details class="version-entry"${index === 0 ? ' open' : ''}><summary><div><h3>${esc(action)}</h3><p>${esc(localizedDateTime(entry.changedAt))} · ${esc(entry.changedByName || entry.changedBy || tr('Clinic user'))}${entry.reason ? ` · ${esc(entry.reason)}` : ''}</p></div><span class="version-badge">${tr('Version')} ${Number(entry.version || 1)}</span></summary><div class="version-body"><div class="version-diff">${changes || `<p class="muted">${tr('No field values changed.')}</p>`}</div><details class="version-snapshots"><summary>${tr('Before and after snapshots')}</summary><h4>${tr('Before')}</h4><pre>${esc(JSON.stringify(before, null, 2))}</pre><h4>${tr('After')}</h4><pre>${esc(JSON.stringify(after, null, 2))}</pre></details></div></details>`;
  }).join('') || `<p class="muted">${tr('No version history found.')}</p>`;
  applyLanguage();
  if (!$('historyDialog').open) $('historyDialog').showModal();
}

function openRecord(type, recordId = '', paymentId = '') {
  if (type === 'payment' && currentUser?.role !== 'admin') {
    showAppMessage('Only clinic administrators can manage payments.', true);
    return;
  }
  const existingPayment = type === 'payment' && paymentId ? state.payments.find((payment) => payment.id === paymentId) : null;
  if (type === 'payment' && !existingPayment && !recordId && !outstandingSessions().length) {
    showAppMessage('There are no closed sessions with an outstanding balance.', true);
    return;
  }
  showAppMessage('');
  setInlineError('recordError', '');
  dialogMode = type;
  pendingPaymentSessionId = type === 'payment' ? recordId : '';
  editingPaymentId = existingPayment?.id || '';
  editingPatientId = type === 'patient' ? recordId : '';
  editingSessionId = type === 'session' ? recordId : '';
  const patient = type === 'patient' && recordId ? patientById(recordId) : null;
  const existingSession = type === 'session' && recordId ? sessionById(recordId) : null;
  const providerOptions = state.insurance.map((provider) => `<option value="${esc(provider.id)}"${existingPayment?.insuranceId === provider.id ? ' selected' : ''}>${esc(provider.name)}</option>`).join('');
  const fields = {
    patient: `${recordVersionPanel('patient', patient)}${patientForm(patient)}${patient ? changeReasonField() : ''}`,
    session: sessionForm(existingSession),
    payment: `${recordVersionPanel('payment', existingPayment)}<div class="typeahead full-width"><span>${tr('Session')}</span><input id="sessionPickerInput" type="search" autocomplete="off" placeholder="${tr('Search closed sessions while typing')}" role="combobox" aria-controls="sessionPickerResults"><input id="sessionPickerValue" name="sessionId" type="hidden" required><p id="sessionPickerSelection" class="selection-note"></p><div id="sessionPickerResults" class="typeahead-results" role="listbox"></div></div><label>Date<input name="date" type="date" value="${esc(existingPayment?.date || today())}" required></label><label>Method<select id="paymentMethod" name="method"><option value="cash"${existingPayment?.method === 'cash' ? ' selected' : ''}>Cash</option><option value="debit"${existingPayment?.method === 'debit' ? ' selected' : ''}>Debit card</option><option value="insurance"${existingPayment?.method === 'insurance' ? ' selected' : ''}>Insurance</option></select></label><div id="directPaymentFields" class="conditional-fields"><label>Amount<input id="paymentAmount" name="amount" type="number" min="0.01" step="0.01" value="${esc(existingPayment?.method !== 'insurance' ? existingPayment?.amount || '' : '')}" required></label><input name="status" type="hidden" value="paid"></div><div id="insurancePaymentFields" class="conditional-fields hidden"><label>Insurance provider<select id="paymentInsuranceId" name="insuranceId" required><option value="">Select provider</option>${providerOptions}</select></label><label>Participation fee<input name="participationFee" type="number" min="0" step="0.01" value="${esc(existingPayment?.participationFee || 0)}" required></label><label>Insurance amount<input id="insuranceAmount" name="insuranceAmount" type="number" min="0.01" step="0.01" value="${esc(existingPayment?.insuranceAmount || '')}" required></label><label>Amount received from insurer<input name="settledAmount" type="number" min="0" step="0.01" value="${esc(existingPayment?.settledAmount || 0)}" required></label><label>Settlement date<input name="settlementDate" type="date" value="${esc(existingPayment?.settlementDate || '')}"></label><label>Status<select name="status"><option value="pending"${existingPayment?.status === 'pending' ? ' selected' : ''}>Pending / claim submitted</option><option value="paid"${existingPayment?.status === 'paid' ? ' selected' : ''}>Paid</option><option value="rejected"${existingPayment?.status === 'rejected' ? ' selected' : ''}>Rejected</option></select></label></div>${existingPayment ? changeReasonField() : ''}`
  };
  $('dialogTitle').textContent = type === 'patient'
    ? (patient ? 'Edit patient record' : 'Add patient')
    : type === 'session' ? (existingSession ? 'Edit session' : 'Add session') : existingPayment ? 'Edit payment' : 'Record payment';
  $('dialogFields').innerHTML = fields[type];
  applyLanguage();
  $('recordDialog').showModal();
  if (type === 'patient') {
    $('patientDob')?.addEventListener('input', (event) => {
      const age = ageFromDob(event.target.value);
      $('patientAge').textContent = age === null ? tr('Age') : `${age} ${tr('years')}`;
    });
  }
  if (type === 'session') {
    setupPatientPicker(existingSession);
    setupServicePicker();
  }
  if (type === 'payment') {
    setupSessionPicker(existingPayment);
    $('paymentMethod').addEventListener('change', updatePaymentFields);
    updatePaymentFields();
  }
}

function openSessionDetails(sessionId) {
  const session = sessionById(sessionId);
  if (!session) return;
  const payments = sessionPayments(session.id);
  const finance = sessionFinance(session.id);
  const paymentAction = currentUser?.role === 'admin' && finance.outstanding > 0.005
    ? `<button type="button" class="primary" data-record-payment="${esc(session.id)}">${tr('Record payment')}</button>`
    : '';
  const paymentRows = payments.map((payment) => {
    const amountLabel = payment.method === 'insurance'
      ? `${money(payment.participationFee)} + ${money(payment.settledAmount)} / ${money(payment.insuranceAmount)}`
      : money(payment.amount);
    return `<button type="button" class="row-card payment-row-button" data-payment-id="${esc(payment.id)}"><span>${tr(payment.method === 'debit' ? 'Debit card' : payment.method[0].toUpperCase() + payment.method.slice(1))} · ${tr(payment.status || 'paid')}</span><strong>${amountLabel}</strong></button>`;
  }).join('');
  const followUp = session.followUpDate || session.followUp;
  $('sessionDetails').innerHTML = `<section class="detail-section"><div class="detail-grid"><div><span class="muted">Patient</span><strong>${esc(patientName(session.patientId))}</strong>${session.patientId !== 'guest' ? `<button type="button" class="link-button" data-patient-id="${esc(session.patientId)}">Open patient file</button>` : ''}</div><div><span class="muted">Date & time</span><strong>${esc(session.date)} ${esc(session.time || '')}</strong></div><div><span class="muted">Service</span><strong>${esc(session.service)}</strong></div><div><span class="muted">Status</span><strong>${tr(session.status === 'closed' ? 'Closed' : 'Open')}</strong></div></div><p class="metadata-line">${revisionMetadata(session)}</p><div class="detail-actions"><button type="button" class="secondary" data-history-type="session" data-history-id="${esc(session.id)}">${tr('History')}</button><button type="button" class="primary" data-edit-session="${esc(session.id)}">${tr('Edit session')}</button></div></section><section class="detail-section"><h4>Treatment and follow-up</h4><p><strong>${esc(session.treatment || 'No treatment recorded.')}</strong></p><p class="muted">${followUp ? `${tr('Follow-up')}: ${esc(followUp)} ${esc(session.followUpTime || '')}` : tr('No follow-up date recorded.')}</p><p>${esc(session.note || 'No session note.')}</p>${session.closingNote ? `<p><strong>${tr('Closing note')}:</strong> ${esc(session.closingNote)}</p>` : ''}</section>${session.status === 'closed' ? `<section class="detail-section"><div class="history-heading"><h4>${tr('Payments')}</h4><strong class="nis-total"><span class="currency-mark" aria-hidden="true">₪</span>${money(session.amount)} <small>${tr('NIS')}</small></strong></div>${paymentRows || '<p class="muted">No payments recorded.</p>'}<div class="financial-strip"><div><span>${tr('Received')}</span><strong>${money(finance.received)}</strong></div><div><span>${tr('Claim pending')}</span><strong>${money(finance.pendingInsurance)}</strong></div><div><span>${tr('To allocate')}</span><strong>${money(finance.outstanding)}</strong></div></div><div class="detail-actions"><button type="button" class="secondary" data-print-session="${esc(session.id)}">${tr('Print receipt')}</button>${paymentAction}</div></section>  ` : `<section class="detail-section"><form id="closeSessionForm" class="form-grid"><label>Final session amount<input name="amount" type="number" min="0.01" step="0.01" required></label><label>Closing note<textarea name="closingNote"></textarea></label><label>${tr('Next session date')}<input name="followUpDate" type="date" min="${today()}" value="${esc(session.followUpDate || session.followUp || '')}"></label><label>${tr('Next session time')}<input name="followUpTime" type="time" value="${esc(session.followUpTime || '')}"></label><p id="sessionActionError" class="form-error full-width" role="alert" tabindex="-1"></p><div class="dialog-actions"><button class="secondary" type="submit" value="details">Close session</button>${currentUser?.role === 'admin' ? `<button class="primary" type="submit" value="payment">${tr('Close & record payment')}</button>` : ''}</div></form></section>`}${medicalFilesSection('session', session.id, 'session')}`;
  applyLanguage();
  if (!$('sessionDialog').open) $('sessionDialog').showModal();
  renderMedicalFiles('session', session.id, 'sessionFileList', 'sessionFileError');
  $('closeSessionForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const submit = event.submitter;
    const continueToPayment = submit.value === 'payment';
    submit.disabled = true;
    setInlineError('sessionActionError', '');
    try {
      await applyMutation('session-close', {
        sessionId: session.id,
        expectedRevision: session.revision,
        amount: data.amount,
        closingNote: data.closingNote,
        followUpDate: data.followUpDate,
        followUpTime: data.followUpTime
      });
      if (continueToPayment) {
        $('sessionDialog').close('payment');
        openRecord('payment', session.id);
      } else {
        openSessionDetails(session.id);
      }
    } catch (error) {
      setInlineError('sessionActionError', errorMessage(error, 'Unable to save changes.'), true);
    } finally {
      submit.disabled = false;
    }
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
  const provider = state.insurance.find((item) => item.id === patient.insuranceId);
  $('patientDetails').innerHTML = `<div class="patient-record-heading">${patientAvatar(patient)}<div><h3>${esc(patientName(patient.id))}</h3><p class="muted">File ${esc(patient.fileNumber || 'not assigned')}${age !== null ? ` · ${age} ${tr('years')}` : ''}</p><p class="metadata-line">${revisionMetadata(patient)}</p></div></div>${criticalBox}<div class="detail-grid"><div><span class="muted">Date of birth</span><strong>${recordValue(patient.dateOfBirth)}</strong></div><div><span class="muted">Gender</span><strong>${recordValue(patient.sex)}</strong></div><div><span class="muted">Phone</span><strong>${recordValue(patient.phone)}</strong></div><div><span class="muted">National ID</span><strong>${recordValue(patient.nationalId)}</strong></div><div><span class="muted">Insurance provider</span><strong>${recordValue(provider?.name)}</strong></div><div><span class="muted">Emergency contact</span><strong>${recordValue(patient.emergencyContact)}${patient.emergencyPhone ? ` · ${esc(patient.emergencyPhone)}` : ''}</strong></div><div><span class="muted">Address</span><strong>${recordValue(patient.address)}</strong></div></div><section class="medical-record"><h4>Medical record</h4><div class="detail-grid"><div><span class="muted">Allergies</span><strong>${recordValue(patient.allergies)}</strong></div><div><span class="muted">Conditions</span><strong>${recordValue(patient.conditions)}</strong></div><div><span class="muted">Medications</span><strong>${recordValue(patient.medications)}</strong></div><div><span class="muted">Clinical notes</span><strong>${recordValue(patient.medicalNotes)}</strong></div></div></section>${medicalFilesSection('patient', patient.id, 'patient')}<section class="care-history"><div class="history-heading"><h4>Previous sessions and treatments</h4><span class="pill">${sessions.length} visit${sessions.length === 1 ? '' : 's'}</span></div>${sessions.map((session) => `<button type="button" class="history-entry" data-session-id="${esc(session.id)}"><div><strong>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</strong><small>${esc(session.treatment || session.note || session.closingNote || 'No treatment note.')}${session.followUpDate || session.followUp ? ` · ${tr('Follow-up')} ${esc(session.followUpDate || session.followUp)} ${esc(session.followUpTime || '')}` : ''}</small></div><span class="pill">${tr(session.status)}</span></button>`).join('') || '<p class="muted">No sessions recorded for this patient.</p>'}</section><div class="detail-actions"><button type="button" class="secondary" data-history-type="patient" data-history-id="${esc(patient.id)}">${tr('History')}</button><button type="button" class="secondary" data-print-patient-receipts="${esc(patient.id)}">${tr('Print all receipts')}</button><button type="button" class="secondary" data-print-patient-finance="${esc(patient.id)}">${tr('Patient financial report')}</button><button type="button" class="secondary" data-print-patient-sessions="${esc(patient.id)}">${tr('Full session report')}</button><button type="button" class="primary" data-edit-patient="${esc(patient.id)}">Edit patient</button></div>`;
  applyLanguage();
  $('patientDialog').showModal();
  renderMedicalFiles('patient', patient.id, 'patientFileList', 'patientFileError');
}

function printDocument(title, body) {
  const printArea = $('printArea');
  printArea.innerHTML = `<article class="print-document"><h1>${esc(title)}</h1><p class="print-meta">${esc(currentClinic?.name || 'RTS Clinic')} · ${esc(new Date().toLocaleString(language === 'ar' ? 'ar' : 'en'))}</p>${body}</article>`;
  printArea.setAttribute('aria-hidden', 'false');
  const cleanup = () => {
    printArea.innerHTML = '';
    printArea.setAttribute('aria-hidden', 'true');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
  window.setTimeout(() => {
    if (printArea.innerHTML) cleanup();
  }, 30000);
}

function paymentPrintRows(payments) {
  return payments.map((payment) => {
    const provider = state.insurance.find((item) => item.id === payment.insuranceId)?.name || '';
    const paid = payment.method === 'insurance' ? paymentCollected(payment) : Number(payment.amount || 0);
    return `<tr><td>${esc(payment.date)}</td><td>${esc(payment.method)}</td><td>${esc(provider)}</td><td>${money(paid)}</td><td>${esc(payment.status)}</td></tr>`;
  }).join('');
}

function printSessionReceipt(sessionId) {
  const session = sessionById(sessionId);
  if (!session) return;
  const payments = sessionPayments(session.id);
  const finance = sessionFinance(session.id);
  printDocument(`${tr('Print receipt')} · ${patientName(session.patientId)}`, `<p>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</p><table><thead><tr><th>Date</th><th>Method</th><th>Provider</th><th>Received</th><th>Status</th></tr></thead><tbody>${paymentPrintRows(payments) || '<tr><td colspan="5">No payments recorded.</td></tr>'}</tbody></table><p class="print-total">${tr('Session total')}: ${nis(session.amount)} · ${tr('Received')}: ${nis(finance.received)} · ${tr('Balance')}: ${nis(finance.outstanding)}</p>`);
}

function printPatientReceipts(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
  const sessions = state.sessions.filter((session) => session.patientId === patientId && session.status === 'closed');
  const body = sessions.map((session) => {
    const finance = sessionFinance(session.id);
    return `<h2>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</h2><table><thead><tr><th>Date</th><th>Method</th><th>Provider</th><th>Received</th><th>Status</th></tr></thead><tbody>${paymentPrintRows(sessionPayments(session.id)) || '<tr><td colspan="5">No payments recorded.</td></tr>'}</tbody></table><p>${tr('Session total')}: ${nis(session.amount)} · ${tr('Received')}: ${nis(finance.received)} · ${tr('Balance')}: ${nis(finance.outstanding)}</p>`;
  }).join('') || '<p>No closed sessions.</p>';
  printDocument(`${tr('Print all receipts')} · ${patientName(patientId)}`, body);
}

function printPatientFinancialReport(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
  const sessions = state.sessions.filter((session) => session.patientId === patientId && session.status === 'closed');
  const rows = sessions.map((session) => {
    const finance = sessionFinance(session.id);
    return `<tr><td>${esc(session.date)}</td><td>${esc(session.service)}</td><td>${money(session.amount)}</td><td>${money(finance.received)}</td><td>${money(finance.pendingInsurance)}</td><td>${money(finance.outstanding)}</td></tr>`;
  }).join('');
  printDocument(`${tr('Patient financial report')} · ${patientName(patientId)}`, `<p>${tr('File number')}: ${esc(patient.fileNumber)}</p><table><thead><tr><th>Date</th><th>Service</th><th>Session total</th><th>Received</th><th>Claim pending</th><th>Balance</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No closed sessions.</td></tr>'}</tbody></table>`);
}

function printPatientSessionReport(patientId) {
  const patient = patientById(patientId);
  if (!patient) return;
  const sessions = state.sessions.filter((session) => session.patientId === patientId).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const body = sessions.map((session) => `<h2>${esc(session.date)} ${esc(session.time || '')} · ${esc(session.service)}</h2><p><strong>${tr('Treatment / procedure')}:</strong> ${esc(session.treatment || 'Not recorded')}</p><p><strong>${tr('Session note')}:</strong> ${esc(session.note || 'Not recorded')}</p><p><strong>${tr('Follow-up')}:</strong> ${esc(session.followUpDate || session.followUp || 'Not recorded')} ${esc(session.followUpTime || '')}</p><p><strong>${tr('Closing note')}:</strong> ${esc(session.closingNote || 'Not recorded')}</p>`).join('') || '<p>No sessions recorded.</p>';
  printDocument(`${tr('Full session report')} · ${patientName(patientId)}`, body);
}

function printInsuranceReport() {
  const providerId = $('insuranceReportProvider').value;
  const provider = state.insurance.find((item) => item.id === providerId);
  const from = $('insuranceFrom').value;
  const to = $('insuranceTo').value;
  const claims = state.payments.filter((payment) => payment.method === 'insurance'
    && (!providerId || payment.insuranceId === providerId)
    && (!from || payment.date >= from)
    && (!to || payment.date <= to));
  const rows = claims.map((payment) => {
    const session = sessionById(payment.sessionId);
    return `<tr><td>${esc(payment.date)}</td><td>${esc(patientName(payment.patientId))}</td><td>${esc(session?.service || '')}</td><td>${money(payment.insuranceAmount)}</td><td>${money(payment.participationFee)}</td><td>${money(payment.settledAmount)}</td><td>${money(paymentPendingInsurance(payment))}</td></tr>`;
  }).join('');
  const requested = claims.reduce((sum, payment) => sum + Number(payment.insuranceAmount || 0), 0);
  const received = claims.reduce((sum, payment) => sum + Number(payment.settledAmount || 0), 0);
  printDocument(`${tr('Insurance financial report')} · ${provider?.name || tr('All providers')}`, `<p>${tr('Date range')}: ${esc(from || 'Start')} – ${esc(to || 'Today')}</p><table><thead><tr><th>Date</th><th>Patient</th><th>Treatment</th><th>Requested</th><th>Participation</th><th>Received</th><th>Outstanding</th></tr></thead><tbody>${rows || '<tr><td colspan="7">No claims.</td></tr>'}</tbody></table><p class="print-total">${tr('Requested')}: ${nis(requested)} · ${tr('Received from insurer')}: ${nis(received)}</p>`);
}

function printRevenueReport(bill = null) {
  const from = bill?.from ?? $('reportFrom').value;
  const to = bill?.to ?? $('reportTo').value;
  const sessions = state.sessions.filter((session) => session.status === 'closed' && (!from || session.date >= from) && (!to || session.date <= to));
  const rows = sessions.map((session) => {
    const finance = sessionFinance(session.id);
    return `<tr><td>${esc(session.date)}</td><td>${esc(patientName(session.patientId))}</td><td>${esc(session.service)}</td><td>${money(session.amount)}</td><td>${money(finance.received)}</td><td>${money(finance.outstanding)}</td></tr>`;
  }).join('');
  const value = sessions.reduce((sum, session) => sum + Number(session.amount || 0), 0);
  const received = sessions.reduce((sum, session) => sum + sessionFinance(session.id).received, 0);
  printDocument(`${tr('Bill and revenue report')} · ${from || 'Start'} – ${to || 'Today'}`, `<table><thead><tr><th>Date</th><th>Patient</th><th>Service</th><th>Session value</th><th>Received</th><th>Balance</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No sessions.</td></tr>'}</tbody></table><p class="print-total">${tr('Session value')}: ${nis(value)} · ${tr('Collected')}: ${nis(received)} · ${tr('Balance')}: ${nis(Math.max(value - received, 0))}</p>`);
}

setupUpdater();

async function handleLegacyWorkspace() {
  const raw = localStorage.getItem(legacyStoreKey);
  if (!raw) return;
  let legacyState;
  try {
    legacyState = JSON.parse(raw);
  } catch (error) {
    console.error('Discarding invalid legacy clinic data:', error);
    localStorage.removeItem(legacyStoreKey);
    showAppMessage('Legacy clinic data was removed without importing it.', true);
    return;
  }
  const clinicName = currentClinic?.name || currentClinic?.id || '';
  const prompt = language === 'ar'
    ? `تم العثور على بيانات عيادة قديمة غير مرتبطة بمعرّف عيادة. هل تريد نقلها إلى "${clinicName}"؟`
    : `Legacy clinic data is not assigned to a clinic. Move it into "${clinicName}"?`;
  if (!window.confirm(prompt)) {
    localStorage.removeItem(legacyStoreKey);
    showAppMessage('Legacy clinic data was removed without importing it.');
    return;
  }
  try {
    const result = await window.rtsClinic.importLegacy(legacyState);
    replaceState(result.state);
    showAppMessage(result.imported
      ? 'Legacy clinic data was moved into this clinic workspace.'
      : 'Legacy data was not imported because this clinic already has data. The unscoped copy was removed.', !result.imported);
  } catch (error) {
    console.error('Legacy clinic migration failed:', error);
    showAppMessage(errorMessage(error, 'Legacy clinic data was removed without importing it.'), true);
  } finally {
    localStorage.removeItem(legacyStoreKey);
  }
}

$('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = $('loginSubmit');
  const error = $('loginError');
  const data = new FormData(event.target);
  submit.disabled = true;
  submit.textContent = language === 'ar' ? 'جارٍ تسجيل الدخول…' : 'Signing in…';
  error.textContent = '';
  try {
    const result = await window.rtsClinic.login({
      storeId: data.get('storeId'),
      username: data.get('username'),
      password: data.get('password')
    });
    if (!result?.ok) {
      error.textContent = result?.message || tr('Unable to sign in.');
      return;
    }
    currentUser = result.user;
    currentClinic = result.clinic;
    replaceState(await window.rtsClinic.load());
    $('signedInUser').textContent = `${result.clinic?.name || data.get('storeId')} · ${result.user.name} · ${tr(result.user.role === 'admin' ? 'Admin' : 'Staff')}`;
    document.querySelectorAll('.admin-only').forEach((element) => {
      element.classList.toggle('hidden', result.user.role !== 'admin');
    });
    $('login').classList.add('hidden');
    $('app').classList.remove('hidden');
    showAppMessage('');
    await handleLegacyWorkspace();
  } catch (loginError) {
    console.error('Clinic sign-in failed:', loginError);
    await window.rtsClinic.logout().catch((logoutError) => console.error('Failed to clear rejected clinic session:', logoutError));
    currentUser = null;
    currentClinic = null;
    state = emptyState();
    error.textContent = errorMessage(loginError, 'Unable to load this clinic workspace.');
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
$('signOut').addEventListener('click', async () => {
  if (!window.confirm(language === 'ar' ? 'هل تريد تسجيل الخروج من مساحة العيادة؟' : 'Sign out of this clinic workspace?')) return;
  try {
    await window.rtsClinic.logout();
  } catch (error) {
    console.error('Clinic logout IPC failed:', error);
  } finally {
    currentUser = null;
    currentClinic = null;
    state = emptyState();
    localStorage.removeItem(legacyStoreKey);
    ['recordDialog', 'sessionDialog', 'patientDialog', 'historyDialog'].forEach((id) => { if ($(id).open) $(id).close('logout'); });
    document.querySelectorAll('.admin-only').forEach((element) => element.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.page === 'dashboard'));
    document.querySelectorAll('.page').forEach((page) => page.classList.toggle('active', page.id === 'page-dashboard'));
    $('pageTitle').textContent = tr('Dashboard');
    $('loginForm').reset();
    $('loginError').textContent = '';
    $('patientSearch').value = '';
    showAppMessage('');
    renderAll();
    $('login').classList.remove('hidden');
    $('app').classList.add('hidden');
    $('loginStoreId').focus();
  }
});
function resetRecordDialog() {
  dialogMode = '';
  editingPatientId = '';
  editingPaymentId = '';
  editingSessionId = '';
  pendingPaymentSessionId = '';
}

$('closeRecord').addEventListener('click', () => { $('recordDialog').close('cancel'); resetRecordDialog(); });
$('cancelRecord').addEventListener('click', () => { $('recordDialog').close('cancel'); resetRecordDialog(); });
$('closeSession').addEventListener('click', () => $('sessionDialog').close('cancel'));
$('closePatient').addEventListener('click', () => $('patientDialog').close('cancel'));
$('closeHistory').addEventListener('click', () => $('historyDialog').close('cancel'));
$('languageToggle').addEventListener('click', toggleLanguage);
$('languageToggleLogin').addEventListener('click', toggleLanguage);
$('calendarPrev').addEventListener('click', () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1); renderCalendar(); });
$('calendarNext').addEventListener('click', () => { calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1); renderCalendar(); });
const renderLocalized = (render) => {
  render();
  applyLanguage();
};
$('patientSearch').addEventListener('input', () => renderLocalized(renderPatients));
$('sessionSearch').addEventListener('input', () => renderLocalized(renderSessions));
$('sessionStatusFilter').addEventListener('change', () => renderLocalized(renderSessions));
$('paymentSearch').addEventListener('input', () => renderLocalized(renderPayments));
$('paymentMethodFilter').addEventListener('change', () => renderLocalized(renderPayments));
$('paymentStatusFilter').addEventListener('change', () => renderLocalized(renderPayments));
$('insuranceSearch').addEventListener('input', () => renderLocalized(renderInsurance));
$('insuranceClaimFilter').addEventListener('change', () => renderLocalized(renderInsurance));
$('insuranceReportProvider').addEventListener('change', () => renderLocalized(renderInsurance));
$('insuranceFrom').addEventListener('change', () => renderLocalized(renderInsurance));
$('insuranceTo').addEventListener('change', () => renderLocalized(renderInsurance));
$('reportFrom').addEventListener('change', () => renderLocalized(renderReports));
$('reportTo').addEventListener('change', () => renderLocalized(renderReports));
$('billSearch').addEventListener('input', () => renderLocalized(renderReports));
$('printInsuranceReport').addEventListener('click', printInsuranceReport);
$('printRevenueReport').addEventListener('click', () => printRevenueReport());
$('serviceForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = event.submitter;
  submit.disabled = true;
  setInlineError('serviceError', '');
  try {
    await applyMutation('service-create', { service: { name: $('serviceName').value } });
    event.target.reset();
  } catch (error) {
    setInlineError('serviceError', errorMessage(error, 'Unable to save changes.'), true);
  } finally {
    submit.disabled = false;
  }
});
$('insuranceForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = event.submitter;
  setInlineError('insuranceError', '');
  submit.disabled = true;
  try {
    await applyMutation('insurance-create', {
      provider: { name: $('insuranceName').value, contact: $('insuranceContact').value }
    });
    event.target.reset();
  } catch (error) {
    setInlineError('insuranceError', errorMessage(error, 'Unable to save changes.'), true);
  } finally {
    submit.disabled = false;
  }
});
$('generateReport').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  $('reportMessage').textContent = '';
  $('reportMessage').classList.remove('is-error');
  button.disabled = true;
  try {
    await applyMutation('bill-create', { from: $('reportFrom').value, to: $('reportTo').value });
    $('reportMessage').textContent = tr('Bill generated successfully.');
  } catch (error) {
    $('reportMessage').textContent = errorMessage(error, 'Unable to save changes.');
    $('reportMessage').classList.add('is-error');
  } finally {
    button.disabled = false;
  }
});
$('exportData').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    const result = await window.rtsClinic.exportData();
    if (result?.ok) showAppMessage('Data exported successfully.');
  } catch (error) {
    showAppMessage(errorMessage(error, 'Unable to save changes.'), true);
  } finally {
    button.disabled = false;
  }
});
$('recordForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = event.submitter;
  submit.disabled = true;
  setInlineError('recordError', '');
  const data = Object.fromEntries(new FormData(event.target).entries());
  const changeReason = data.changeReason || '';
  delete data.changeReason;
  try {
    if (dialogMode === 'patient') {
      const existing = editingPatientId ? patientById(editingPatientId) : null;
      data.criticalAlerts = Array.from(event.target.querySelectorAll('[name="criticalAlerts"]:checked')).map((input) => input.value);
      data.id = existing?.id || '';
      await applyMutation('patient-upsert', {
        patient: data,
        expectedRevision: existing?.revision,
        changeReason
      });
    }
    let savedSessionId = '';
    if (dialogMode === 'session') {
      const existing = editingSessionId ? sessionById(editingSessionId) : null;
      if (existing) {
        data.id = existing.id;
        await applyMutation('session-update', {
          session: data,
          expectedRevision: existing.revision,
          changeReason
        });
        savedSessionId = existing.id;
      } else {
        const nextState = await applyMutation('session-create', { session: data });
        savedSessionId = nextState.sessions.at(-1)?.id || '';
      }
    }
    if (dialogMode === 'payment') {
      const existing = editingPaymentId ? state.payments.find((payment) => payment.id === editingPaymentId) : null;
      data.id = editingPaymentId;
      await applyMutation(editingPaymentId ? 'payment-update' : 'payment-create', {
        payment: data,
        expectedRevision: existing?.revision,
        changeReason
      });
    }
    $('recordDialog').close('saved');
    resetRecordDialog();
    if (savedSessionId) openSessionDetails(savedSessionId);
  } catch (error) {
    setInlineError('recordError', errorMessage(error, 'Unable to save changes.'), true);
  } finally {
    submit.disabled = false;
  }
});
document.addEventListener('click', (event) => {
  const sessionTarget = event.target.closest('[data-session-id]');
  if (sessionTarget) openSessionDetails(sessionTarget.dataset.sessionId);
  const patientTarget = event.target.closest('[data-patient-id]');
  if (patientTarget) openPatientDetails(patientTarget.dataset.patientId);
  const paymentTarget = event.target.closest('[data-record-payment]');
  if (paymentTarget) { $('sessionDialog').close('cancel'); openRecord('payment', paymentTarget.dataset.recordPayment); }
  const paymentRow = event.target.closest('[data-payment-id]');
  if (paymentRow && !paymentTarget) {
    const payment = state.payments.find((item) => item.id === paymentRow.dataset.paymentId);
    if (payment) {
      if ($('sessionDialog').open) $('sessionDialog').close('cancel');
      openRecord('payment', payment.sessionId, payment.id);
    }
  }
  const editPatientTarget = event.target.closest('[data-edit-patient]');
  if (editPatientTarget) { $('patientDialog').close('cancel'); openRecord('patient', editPatientTarget.dataset.editPatient); }
  const editSessionTarget = event.target.closest('[data-edit-session]');
  if (editSessionTarget) { $('sessionDialog').close('cancel'); openRecord('session', editSessionTarget.dataset.editSession); }
  const historyTarget = event.target.closest('[data-history-type][data-history-id]');
  if (historyTarget) openHistory(historyTarget.dataset.historyType, historyTarget.dataset.historyId);
  const printSessionTarget = event.target.closest('[data-print-session]');
  if (printSessionTarget) printSessionReceipt(printSessionTarget.dataset.printSession);
  const printReceiptsTarget = event.target.closest('[data-print-patient-receipts]');
  if (printReceiptsTarget) printPatientReceipts(printReceiptsTarget.dataset.printPatientReceipts);
  const printFinanceTarget = event.target.closest('[data-print-patient-finance]');
  if (printFinanceTarget) printPatientFinancialReport(printFinanceTarget.dataset.printPatientFinance);
  const printSessionsTarget = event.target.closest('[data-print-patient-sessions]');
  if (printSessionsTarget) printPatientSessionReport(printSessionsTarget.dataset.printPatientSessions);
  const printBillTarget = event.target.closest('[data-print-bill]');
  if (printBillTarget) {
    const bill = state.bills.find((item) => item.id === printBillTarget.dataset.printBill);
    if (bill) printRevenueReport(bill);
  }
  const deleteServiceTarget = event.target.closest('[data-delete-service]');
  if (deleteServiceTarget && window.confirm(tr('Delete this clinic service?'))) {
    deleteServiceTarget.disabled = true;
    applyMutation('service-delete', { serviceId: deleteServiceTarget.dataset.deleteService })
      .catch((error) => showAppMessage(errorMessage(error, 'Unable to save changes.'), true))
      .finally(() => { deleteServiceTarget.disabled = false; });
  }
  const filePicker = event.target.closest('[data-file-picker]');
  if (filePicker) $(filePicker.dataset.filePicker)?.click();
  const downloadTarget = event.target.closest('[data-file-download]');
  if (downloadTarget) {
    setInlineError(downloadTarget.dataset.fileError, '');
    downloadTarget.disabled = true;
    window.rtsClinic.files.download(downloadTarget.dataset.fileDownload)
      .catch((error) => setInlineError(downloadTarget.dataset.fileError, errorMessage(error, 'Unable to download this medical file.')))
      .finally(() => { downloadTarget.disabled = false; });
  }
  const deleteTarget = event.target.closest('[data-file-delete]');
  if (deleteTarget && window.confirm(tr('Delete this medical file permanently?'))) {
    setInlineError(deleteTarget.dataset.fileError, '');
    deleteTarget.disabled = true;
    window.rtsClinic.files.delete(deleteTarget.dataset.fileDelete)
      .then(() => renderMedicalFiles(deleteTarget.dataset.recordType, deleteTarget.dataset.recordId, deleteTarget.dataset.fileList, deleteTarget.dataset.fileError))
      .catch((error) => setInlineError(deleteTarget.dataset.fileError, errorMessage(error, 'Unable to delete this medical file.')))
      .finally(() => { deleteTarget.disabled = false; });
  }
});

['recordDialog', 'sessionDialog', 'patientDialog', 'historyDialog'].forEach((id) => {
  const dialog = $(id);
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close('outside');
  });
  dialog.addEventListener('cancel', () => {
    if (id === 'recordDialog') resetRecordDialog();
  });
  dialog.addEventListener('close', () => {
    if (id === 'recordDialog') resetRecordDialog();
  });
});

let lastKeyboardTarget = null;
document.addEventListener('focusin', (event) => {
  if (event.target.matches('input,select,textarea,button,[tabindex]')) lastKeyboardTarget = event.target;
});
function recoverKeyboardFocus() {
  window.requestAnimationFrame(() => {
    const openDialog = document.querySelector('dialog[open]');
    const candidate = lastKeyboardTarget?.isConnected && !lastKeyboardTarget.disabled && lastKeyboardTarget.getClientRects().length
      ? lastKeyboardTarget
      : openDialog?.querySelector('input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])')
        || (!$('login').classList.contains('hidden') ? $('loginStoreId') : document.querySelector('.page.active input, .page.active button'));
    candidate?.focus({ preventScroll: true });
  });
}
window.addEventListener('focus', recoverKeyboardFocus);
window.rtsClinic.onWindowActivated(recoverKeyboardFocus);
document.addEventListener('change', async (event) => {
  const input = event.target.closest('[data-file-upload]');
  if (!input || !input.files?.length) return;
  const file = input.files[0];
  setInlineError(input.dataset.fileError, '');
  input.disabled = true;
  const picker = document.querySelector(`[data-file-picker="${input.id}"]`);
  if (picker) {
    picker.disabled = true;
    picker.classList.add('is-loading');
  }
  try {
    await window.rtsClinic.files.upload({
      recordType: input.dataset.recordType,
      recordId: input.dataset.recordId,
      originalName: file.name,
      mimeType: file.type,
      bytes: new Uint8Array(await file.arrayBuffer())
    });
    await renderMedicalFiles(input.dataset.recordType, input.dataset.recordId, input.dataset.fileList, input.dataset.fileError);
  } catch (error) {
    setInlineError(input.dataset.fileError, errorMessage(error, 'Unable to upload this medical file.'));
  } finally {
    input.value = '';
    input.disabled = false;
    if (picker) {
      picker.disabled = false;
      picker.classList.remove('is-loading');
    }
  }
});
applyLanguage();
renderAll();
