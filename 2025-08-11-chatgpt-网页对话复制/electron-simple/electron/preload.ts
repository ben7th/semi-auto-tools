import { contextBridge, ipcRenderer } from "electron";

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 这里可以添加需要暴露给渲染进程的 API
  platform: process.platform,
  version: process.versions.electron,
  // 添加读取 authorization.txt 文件的功能
  readAuthorizationFileContent: () => ipcRenderer.invoke("read-authorization-file"),
  // 添加通过主进程发送 HTTP 请求的功能
  sendHttpRequest: (options: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }) => ipcRenderer.invoke("send-http-request", options)
});
