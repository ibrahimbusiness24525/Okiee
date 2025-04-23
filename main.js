// main.js
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
};

app.whenReady().then(createWindow);

ipcMain.on("print-barcode", (event, htmlContent) => {
  const printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print({ silent: true, printBackground: true }, (success, error) => {
      if (!success) console.error("Print failed: ", error);
      printWindow.close();
    });
  });
});
