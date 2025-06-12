const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getBrelyntStructure: () => ipcRenderer.invoke('get-brelynt-structure')
});
