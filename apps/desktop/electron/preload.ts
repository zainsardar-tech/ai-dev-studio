import { contextBridge, ipcRenderer } from 'electron';

const api = {
  send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  on: (channel: string, callback: (...args: unknown[]) => void) => ipcRenderer.on(channel, (_, ...args) => callback(...args)),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
};

contextBridge.exposeInMainWorld('zarixsol', api);
