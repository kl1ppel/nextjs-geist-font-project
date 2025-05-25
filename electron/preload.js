const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (phone, message) => ipcRenderer.invoke('send-message', phone, message),
  onQrCode: (callback) => ipcRenderer.on('qr-code', (event, qr) => callback(qr)),
  onClientReady: (callback) => ipcRenderer.on('client-ready', () => callback()),
});
