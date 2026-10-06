const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow = null;
const UPDATE_RELEASES_URL = 'https://github.com/alsadiayham-sketch/rts-clinic/releases/latest';

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
    try { policy = JSON.parse(match[1]); } catch {}
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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1100,
    minHeight: 720,
    title: 'RTS Clinic',
    backgroundColor: '#f8f6f9',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('updater-check', async () => {
  if (!app.isPackaged) return { ok: false, reason: 'dev' };
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: String(error?.message || error) };
  }
});

ipcMain.handle('updater-download', async () => {
  if (!app.isPackaged) return { ok: false, reason: 'dev' };
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: String(error?.message || error) };
  }
});

ipcMain.handle('updater-install', () => {
  setImmediate(() => autoUpdater.quitAndInstall(true, true));
  return { ok: true };
});

ipcMain.handle('updater-open-releases', async () => {
  await shell.openExternal(UPDATE_RELEASES_URL);
  return { ok: true };
});
