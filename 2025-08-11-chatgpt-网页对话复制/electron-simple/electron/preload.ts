import { contextBridge } from "electron";

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 这里可以添加需要暴露给渲染进程的 API
  platform: process.platform,
  version: process.versions.electron
});
