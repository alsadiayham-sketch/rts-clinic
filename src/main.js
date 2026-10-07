const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { ClinicStorage } = require('./clinic-storage');

let mainWindow = null;
let clinicStorage = null;
const authenticatedSessions = new Map();
const UPDATE_RELEASES_URL = 'https://github.com/alsadiayham-sketch/rts-clinic/releases/latest';
const CLINIC_AUTH_URL = 'https://rts-royal.pages.dev/api/pos-login';
const hasSingleInstanceLock = app.requestSingleInstanceLock();

app.setPath('userData', path.join(app.getPath('appData'), 'RTS Clinic'));

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.disableDifferentialDownload = false;
autoUpdater.allowDowngrade = false;
autoUpdater.allowPrerelease = false;

function sendUpdater(channel, data = {}) {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send(channel, data);
}

function getUpdatePolicy(info) {
  const notes = Array.isArray(info?.releaseNotes)
    ? info.releaseNotes.map((entry) => entry?.note || '').join('\n')
    : typeof info?.releaseNotes === 'string' ? info.releaseNotes : '';
  const marker = /<!--\s*rts-update-policy\s+(\{[^\r\n]*\})\s*-->/i;
  const match = notes.match(marker);
  let policy = { mode: 'optional' };
  if (match) {
    try {
      policy = JSON.parse(match[1]);
    } catch (error) {
      console.error('Invalid update policy metadata:', error.message);
    }
  }
  return { mandatory: policy.mode === 'mandatory', notes: notes.replace(marker, '').trim() };
}

autoUpdater.on('update-available', (info) => {
  const policy = getUpdatePolicy(info);
  sendUpdater('updater-available', { version: info?.version, ...policy });
});
autoUpdater.on('update-not-available', () => sendUpdater('updater-none'));
autoUpdater.on('download-progress', (progress) => sendUpdater('updater-progress', {
  percent: progress.percent || 0,
  transferred: progress.transferred || 0,
  total: progress.total || 0,
  bytesPerSecond: progress.bytesPerSecond || 0
}));
autoUpdater.on('update-downloaded', (info) => sendUpdater('updater-downloaded', { version: info?.version }));
autoUpdater.on('error', (error) => sendUpdater('updater-error', { message: String(error?.message || error) }));

function assertTrustedSender(event) {
  if (!mainWindow || mainWindow.isDestroyed() || event.sender.id !== mainWindow.webContents.id) {
    throw new Error('Untrusted renderer request.');
  }
}

function requireSession(event, requiredRole = null) {
  assertTrustedSender(event);
  const session = authenticatedSessions.get(event.sender.id);
  if (!session) throw new Error('Your clinic session has expired. Sign in again.');
  if (requiredRole && session.role !== requiredRole) throw new Error('This operation requires a clinic administrator.');
  return session;
}

function publicSession(session) {
  return {
    clinic: { id: session.clinicId, name: session.clinicName },
    user: { id: session.userId, name: session.userName, role: session.role }
  };
}

function focusMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    if (app.isReady()) createWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.moveTop();
  mainWindow.focus();
  mainWindow.webContents.focus();
  mainWindow.webContents.send('clinic-window-activated');
}

function createWindow() {
  clinicStorage = new ClinicStorage(app.getPath('userData'));
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1100,
    minHeight: 720,
    title: 'RTS Clinic',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    backgroundColor: '#f8f6f9',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
  const rendererId = mainWindow.webContents.id;
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  mainWindow.webContents.on('did-start-navigation', (_event, _url, isInPlace, isMainFrame) => {
    if (isMainFrame && !isInPlace) authenticatedSessions.delete(rendererId);
  });
  mainWindow.webContents.on('destroyed', () => authenticatedSessions.delete(rendererId));
  mainWindow.webContents.on('did-finish-load', () => focusMainWindow());
  mainWindow.on('focus', () => {
    if (!mainWindow.isDestroyed()) mainWindow.webContents.send('clinic-window-activated');
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', focusMainWindow);
  app.whenReady().then(createWindow);
}
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
  else focusMainWindow();
});

ipcMain.handle('updater-check', async (event) => {
  assertTrustedSender(event);
  if (!app.isPackaged) return { ok: false, reason: 'dev' };
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: String(error?.message || error) };
  }
});

ipcMain.handle('updater-download', async (event) => {
  assertTrustedSender(event);
  if (!app.isPackaged) return { ok: false, reason: 'dev' };
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: String(error?.message || error) };
  }
});

ipcMain.handle('updater-install', (event) => {
  assertTrustedSender(event);
  setImmediate(() => autoUpdater.quitAndInstall(true, true));
  return { ok: true };
});

ipcMain.handle('updater-open-releases', async (event) => {
  assertTrustedSender(event);
  await shell.openExternal(UPDATE_RELEASES_URL);
  return { ok: true };
});

ipcMain.handle('clinic-login', async (event, credentials = {}) => {
  assertTrustedSender(event);
  authenticatedSessions.delete(event.sender.id);
  const clinicId = typeof credentials.storeId === 'string' ? credentials.storeId.trim().toLowerCase() : '';
  const username = typeof credentials.username === 'string' ? credentials.username.trim() : '';
  const password = typeof credentials.password === 'string' ? credentials.password : '';
  if (!clinicId || !username || !password || clinicId.length > 200 || username.length > 200 || password.length > 1000) {
    return { ok: false, message: 'Enter your clinic ID, username, and password.' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(CLINIC_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId: clinicId, username, password }),
      signal: controller.signal
    });
    const responseText = await response.text();
    let payload = {};
    if (responseText) {
      try {
        payload = JSON.parse(responseText);
      } catch (error) {
        console.error('Clinic authentication returned invalid JSON:', error.message);
      }
    }
    if (!response.ok || !payload.ok || !payload.user) {
      return {
        ok: false,
        message: payload?.error?.message || 'Unable to sign in to RTS Clinic.'
      };
    }
    const session = {
      clinicId,
      clinicName: String(payload.store?.name || clinicId).slice(0, 200),
      userId: String(payload.user.id || payload.user.username || username).slice(0, 200),
      userName: String(payload.user.name || payload.user.username || username).slice(0, 200),
      role: payload.user.role === 'admin' ? 'admin' : 'staff'
    };
    authenticatedSessions.set(event.sender.id, session);
    return { ok: true, ...publicSession(session) };
  } catch (error) {
    return {
      ok: false,
      message: error?.name === 'AbortError'
        ? 'The clinic sign-in service timed out.'
        : 'The clinic sign-in service is unavailable.'
    };
  } finally {
    clearTimeout(timeout);
  }
});

ipcMain.handle('clinic-logout', (event) => {
  assertTrustedSender(event);
  authenticatedSessions.delete(event.sender.id);
  return { ok: true };
});

ipcMain.handle('clinic-data-load', async (event) => {
  const session = requireSession(event);
  return clinicStorage.load(session.clinicId);
});

ipcMain.handle('clinic-data-mutate', async (event, action, payload) => {
  const session = requireSession(event);
  return clinicStorage.mutate(session.clinicId, session, action, payload);
});

ipcMain.handle('clinic-data-import-legacy', async (event, legacyState) => {
  const session = requireSession(event);
  return clinicStorage.importLegacy(session.clinicId, legacyState);
});

ipcMain.handle('clinic-data-export', async (event) => {
  const session = requireSession(event, 'admin');
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export clinic data',
    defaultPath: `rts-clinic-${session.clinicId}-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePath) return { ok: false, canceled: true };
  const state = await clinicStorage.load(session.clinicId);
  await fs.writeFile(result.filePath, JSON.stringify(state, null, 2), { encoding: 'utf8', flag: 'w' });
  return { ok: true };
});

ipcMain.handle('clinic-file-list', async (event, recordType, recordId) => {
  const session = requireSession(event);
  return clinicStorage.listFiles(session.clinicId, recordType, recordId);
});

ipcMain.handle('clinic-file-upload', async (event, input) => {
  const session = requireSession(event);
  return clinicStorage.uploadFile(session.clinicId, session, input);
});

ipcMain.handle('clinic-file-download', async (event, fileId) => {
  const session = requireSession(event);
  const { metadata, source } = await clinicStorage.getFile(session.clinicId, fileId);
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save medical file',
    defaultPath: metadata.originalName,
    filters: [{ name: 'Medical file', extensions: [path.extname(metadata.originalName).slice(1)] }]
  });
  if (result.canceled || !result.filePath) return { ok: false, canceled: true };
  await fs.copyFile(source, result.filePath);
  return { ok: true };
});

ipcMain.handle('clinic-file-delete', async (event, fileId) => {
  const session = requireSession(event, 'admin');
  return clinicStorage.deleteFile(session.clinicId, session, fileId);
});
