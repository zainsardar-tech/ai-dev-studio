import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { AdapterFactory } from './adapter/contracts';

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

function createSplash(): void {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 450,
    frame: false,
    transparent: false,
    backgroundColor: '#020617',
    resizable: false,
    center: true,
    show: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  splashWindow.loadFile(path.join(__dirname, '../resources/splash.html'));
  splashWindow.on('closed', () => { splashWindow = null; });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    transparent: false,
    backgroundColor: '#020617',
    icon: path.join(__dirname, '../resources/icon.svg'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: 'hidden',
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../ui/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    if (splashWindow && !splashWindow.isDestroyed()) splashWindow.close();
    mainWindow?.show();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  AdapterFactory.init();
  createSplash();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
