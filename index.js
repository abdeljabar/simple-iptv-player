const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    win.loadFile('index.html');
    win.webContents.openDevTools();
};

app.whenReady().then(() => {
    createWindow();
});

ipcMain.handle('validate-file-path', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { error: 'File does not exist.' };
    }
    if (!filePath.endsWith('.m3u') && !filePath.endsWith('.m3u8')) {
      return { error: 'Invalid file type. Please provide a .m3u or .m3u8 file.' };
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return { content };
  } catch (err) {
    return { error: `Failed to read file: ${err.message}` };
  }
});

ipcMain.on('open-remote-video', (event, url) => {
  const playerPath = '/usr/bin/vlc';

  const command = `"${playerPath}" "${url}"`;

  exec(command, (error) => {
    if (error) {
      console.error('Failed to open external player:', error.message);
    }
  });
});
