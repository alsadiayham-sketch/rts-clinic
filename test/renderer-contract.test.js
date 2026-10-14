const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('reports include every patient identity represented by closed sessions', () => {
  const app = fs.readFileSync(path.join(__dirname, '..', 'src', 'renderer', 'app.js'), 'utf8');

  assert.match(
    app,
    /const reportPatientIds = \[\.\.\.new Set\(selectedSessions\.map\(\(session\) => session\.patientId\)\)\];/
  );
  assert.match(app, /reportPatientIds\.map\(\(patientId\) =>/);
  assert.match(app, /patientName\(patientId\)/);
});

test('exposes protected backup export and restore controls', () => {
  const app = fs.readFileSync(path.join(__dirname, '..', 'src', 'renderer', 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'renderer', 'index.html'), 'utf8');
  const preload = fs.readFileSync(path.join(__dirname, '..', 'src', 'preload.js'), 'utf8');

  assert.match(html, /id="restoreData"[^>]*class="secondary admin-only"/);
  assert.match(html, /id="exportData"[^>]*class="secondary admin-only"/);
  assert.match(preload, /restoreData: \(\) => ipcRenderer\.invoke\('clinic-data-restore'\)/);
  assert.match(app, /\$\('restoreData'\)\.addEventListener\('click'/);
});
