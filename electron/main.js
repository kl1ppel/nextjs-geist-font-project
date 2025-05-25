const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // Load the Next.js development server in development
  // or the built app in production
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    win.loadURL('http://localhost:8000'); // Using port 8000 as specified in package.json
  } else {
    win.loadFile(path.join(__dirname, '../out/index.html'));
  }
  // Open DevTools optionally
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
