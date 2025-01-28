const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  validateFilePath: (filePath) => ipcRenderer.invoke('validate-file-path', filePath),
  openRemoteVideo: (url) =>  {
    const validUrl = url.startsWith('http://') || url.startsWith('https://');
    if (validUrl) {
      ipcRenderer.send('open-remote-video', url);
    } else {
      console.error('Invalid URL:', url);
    }
  },
});
