const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayApi', {
  onTogglePlay: (callback) => ipcRenderer.on('toggle-play', (_event, value) => callback(value)),
  onToggleSound: (callback) => ipcRenderer.on('toggle-sound', (_event, value) => callback(value)),
  onChangeSpeed: (callback) => ipcRenderer.on('change-speed', (_event, value) => callback(value)),
  onBurstSalvo: (callback) => ipcRenderer.on('burst-salvo', (_event, value) => callback(value)),
  onCursorMove: (callback) => ipcRenderer.on('cursor-move', (_event, pt) => callback(pt)),
  onGlobalClick: (callback) => ipcRenderer.on('global-click', (_event, pt) => callback(pt)),
  onChangeIntensity: (callback) => ipcRenderer.on('change-intensity', (_event, mode) => callback(mode)),
});
