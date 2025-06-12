const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');

// Determine Brelynt directory dynamically. An explicit BRELYNT_DIR
// environment variable has priority; otherwise use the Electron
// userData path.
const getBrelyntPath = () => {
  const envPath = process.env.BRELYNT_DIR;
  if (envPath && envPath.trim()) {
    return envPath;
  }
  return path.join(app.getPath('userData'), 'Brelynt');
};

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

app.whenReady().then(createWindow);

ipcMain.handle('get-brelynt-structure', async () => {
  try {
    const brelyntPath = getBrelyntPath();
    if (!fs.existsSync(brelyntPath)) {
      console.log('[DEBUG] Папка Brelynt не найдена:', brelyntPath);
      dialog.showErrorBox('Ошибка', `Папка Brelynt не найдена по пути: ${brelyntPath}`);
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
