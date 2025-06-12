const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
let BRELYNT_PATH = process.env.BRELYNT_PATH;

function createWindow () {
  Menu.setApplicationMenu(null);

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile('public/index.html');
}

app.whenReady().then(() => {
  if (!BRELYNT_PATH) {
    BRELYNT_PATH = path.join(app.getPath('userData'), 'Brelynt');
  }
  createWindow();
});

ipcMain.handle('get-brelynt-structure', async () => {
  try {
      return [];
    }
    function readDirRecursive(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      return items.map(item => {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          return {
            type: 'dir',
            name: item.name,
            children: readDirRecursive(fullPath)
          }
        } else {
          return {
            type: 'file',
            name: item.name,
            path: fullPath
          }
        }
      });
    }
    const structure = readDirRecursive(brelyntPath);
    console.log('[DEBUG] Структура папки:', JSON.stringify(structure, null, 2));
    return structure;
  } catch (error) {
    console.log('[DEBUG] Ошибка:', error.message);
    dialog.showErrorBox('Ошибка чтения', error.message);
    return [];
  }
});
