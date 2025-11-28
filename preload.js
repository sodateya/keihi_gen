const { contextBridge, ipcRenderer } = require("electron");

// レンダラープロセスに安全にAPIを公開
contextBridge.exposeInMainWorld("electronAPI", {
  saveFile: (buffer, fileName) => ipcRenderer.invoke("save-file", { buffer, fileName }),
});

