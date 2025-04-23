// preload.js
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  printBarcode: (htmlContent) => ipcRenderer.send("print-barcode", htmlContent),
});
