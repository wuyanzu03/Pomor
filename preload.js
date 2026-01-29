const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomorApi', {
  getStats: async () => {
    return await ipcRenderer.invoke('stats:get');
  },
  addSession: async (payload) => {
    return await ipcRenderer.invoke('stats:addSession', payload);
  },
  deleteSession: async (payload) => {
    return await ipcRenderer.invoke('stats:deleteSession', payload);
  }
});

