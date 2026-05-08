import { dialog, BrowserWindow, Notification, shell, ipcMain } from 'electron';
import { DesktopAdapter, IFileDialog, IWindowManager, INotification, IShell, FileDialogOptions } from './contracts';

class ElectronFileDialog implements IFileDialog {
  async openFile(options?: FileDialogOptions): Promise<string | null> {
    const result = await dialog.showOpenDialog({
      title: options?.title,
      defaultPath: options?.defaultPath,
      filters: options?.filters,
      properties: ['openFile'],
    });
    return result.canceled ? null : result.filePaths[0] ?? null;
  }

  async saveFile(options?: FileDialogOptions): Promise<string | null> {
    const result = await dialog.showSaveDialog({
      title: options?.title,
      defaultPath: options?.defaultPath,
      filters: options?.filters,
    });
    return result.canceled ? null : result.filePath ?? null;
  }

  async openDirectory(): Promise<string | null> {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return result.canceled ? null : result.filePaths[0] ?? null;
  }
}

class ElectronWindowManager implements IWindowManager {
  private getWin(): BrowserWindow | null {
    return BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? null;
  }

  minimize(): void { this.getWin()?.minimize(); }
  maximize(): void {
    const win = this.getWin();
    win?.isMaximized() ? win.unmaximize() : win?.maximize();
  }
  close(): void { this.getWin()?.close(); }
  isMaximized(): boolean { return this.getWin()?.isMaximized() ?? false; }
  setTitle(title: string): void { this.getWin()?.setTitle(title); }
}

class ElectronNotification implements INotification {
  show(title: string, body: string): void {
    new Notification({ title, body }).show();
  }
}

class ElectronShell implements IShell {
  async openExternal(url: string): Promise<void> { await shell.openExternal(url); }
  async openPath(path: string): Promise<void> { await shell.openPath(path); }
}

export class ElectronAdapter implements DesktopAdapter {
  fileDialog: IFileDialog = new ElectronFileDialog();
  windowManager: IWindowManager = new ElectronWindowManager();
  notification: INotification = new ElectronNotification();
  shell: IShell = new ElectronShell();

  constructor() {
    this.registerIpcHandlers();
  }

  private registerIpcHandlers(): void {
    ipcMain.handle('dialog:openFile', (_, opts) => this.fileDialog.openFile(opts));
    ipcMain.handle('dialog:saveFile', (_, opts) => this.fileDialog.saveFile(opts));
    ipcMain.handle('dialog:openDirectory', () => this.fileDialog.openDirectory());
    ipcMain.handle('window:minimize', () => this.windowManager.minimize());
    ipcMain.handle('window:maximize', () => this.windowManager.maximize());
    ipcMain.handle('window:close', () => this.windowManager.close());
    ipcMain.handle('window:isMaximized', () => this.windowManager.isMaximized());
    ipcMain.handle('notification:show', (_, title, body) => this.notification.show(title, body));
    ipcMain.handle('shell:openExternal', (_, url) => this.shell.openExternal(url));
  }
}
