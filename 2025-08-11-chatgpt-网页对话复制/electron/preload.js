const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 读取认证文件
  readAuthFile: () => ipcRenderer.invoke('read-auth-file'),
  
  // 写入认证文件
  writeAuthFile: (content) => ipcRenderer.invoke('write-auth-file', content),
  
  // 请求聊天信息
  requestChatInfo: (chatUrl, authorization) => 
    ipcRenderer.invoke('request-chat-info', { chatUrl, authorization })
});
