export interface IFileDialog {
  openFile(options?: FileDialogOptions): Promise<string | null>;
  saveFile(options?: FileDialogOptions): Promise<string | null>;
  openDirectory(): Promise<string | null>;
}

export interface IWindowManager {
  minimize(): void;
  maximize(): void;
  close(): void;
  isMaximized(): boolean;
  setTitle(title: string): void;
}

export interface INotification {
  show(title: string, body: string): void;
}

export interface IShell {
  openExternal(url: string): Promise<void>;
  openPath(path: string): Promise<void>;
}

export interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: { name: string; extensions: string[] }[];
}

export interface DesktopAdapter {
  fileDialog: IFileDialog;
  windowManager: IWindowManager;
  notification: INotification;
  shell: IShell;
}

export class AdapterFactory {
  private static instance: DesktopAdapter | null = null;

  static init(): void {
    // Electron implementation loaded at runtime
    // Swap for Tauri adapter in future
    const { ElectronAdapter } = require('./electron-adapter');
    AdapterFactory.instance = new ElectronAdapter();
  }

  static get(): DesktopAdapter {
    if (!AdapterFactory.instance) throw new Error('Desktop adapter not initialized');
    return AdapterFactory.instance;
  }
}
