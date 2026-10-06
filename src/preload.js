const { contextBridge, ipcRenderer } = require('electron');

const updaterChannels = [
  'updater-available',
  'updater-none',
  'updater-progress',
  'updater-downloaded',
  'updater-error'
];

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
