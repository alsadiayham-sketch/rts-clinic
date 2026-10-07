const { contextBridge, ipcRenderer } = require('electron');

const updaterChannels = [
  'updater-available',
  'updater-none',
  'updater-progress',
  'updater-downloaded',
  'updater-error'
];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_LEGACY_BYTES = 5 * 1024 * 1024;

contextBridge.exposeInMainWorld('rtsUpdater', {
  check: () => ipcRenderer.invoke('updater-check'),
  download: () => ipcRenderer.invoke('updater-download'),
  install: () => ipcRenderer.invoke('updater-install'),
  openReleases: () => ipcRenderer.invoke('updater-open-releases'),
  on: (channel, callback) => {
    if (!updaterChannels.includes(channel)) throw new Error('Unsupported updater channel');
    ipcRenderer.on(channel, (_event, data) => callback(data || {}));
  }
});

contextBridge.exposeInMainWorld('rtsClinic', {
  login: (credentials) => ipcRenderer.invoke('clinic-login', credentials),
  logout: () => ipcRenderer.invoke('clinic-logout'),
  load: () => ipcRenderer.invoke('clinic-data-load'),
  mutate: (action, payload) => ipcRenderer.invoke('clinic-data-mutate', action, payload),
  importLegacy: (state) => {
    const serialized = JSON.stringify(state);
    if (new TextEncoder().encode(serialized || '').byteLength > MAX_LEGACY_BYTES) {
      return Promise.reject(new Error('The legacy workspace is too large to migrate safely.'));
    }
    return ipcRenderer.invoke('clinic-data-import-legacy', state);
  },
  exportData: () => ipcRenderer.invoke('clinic-data-export'),
  onWindowActivated: (callback) => {
    if (typeof callback !== 'function') throw new Error('Window activation callback is required.');
    const listener = () => callback();
    ipcRenderer.on('clinic-window-activated', listener);
    return () => ipcRenderer.removeListener('clinic-window-activated', listener);
  },
  files: {
    list: (recordType, recordId) => ipcRenderer.invoke('clinic-file-list', recordType, recordId),
    upload: (input) => {
      if (!input?.bytes || input.bytes.byteLength > MAX_UPLOAD_BYTES) {
        return Promise.reject(new Error('Medical files must be smaller than 10 MB.'));
      }
      return ipcRenderer.invoke('clinic-file-upload', input);
    },
    download: (fileId) => ipcRenderer.invoke('clinic-file-download', fileId),
    delete: (fileId) => ipcRenderer.invoke('clinic-file-delete', fileId)
  }
});
