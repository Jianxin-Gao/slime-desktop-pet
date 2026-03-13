const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  dragWindow: (movementX, movementY) => ipcRenderer.send('drag-window', movementX, movementY),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback)
});
