// Electron API 类型定义
export interface ElectronAPI {
  readAuthFile: () => Promise<{
    success: boolean;
    content?: string;
    error?: string;
  }>;
  
  writeAuthFile: (content: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  
  requestChatInfo: (chatUrl: string, authorization: string) => Promise<{
    success: boolean;
    statusCode?: number;
    statusText?: string;
    data?: any;
    headers?: any;
    error?: string;
  }>;
}

// 请求结果类型
export interface RequestResult {
  success: boolean;
  statusCode?: number;
  statusText?: string;
  data?: any;
  headers?: any;
  error?: string;
}

// 认证文件状态类型
export interface AuthFileStatus {
  success: boolean;
  content?: string;
  error?: string;
}

// 保存认证文件结果类型
export interface SaveAuthResult {
  success: boolean;
  error?: string;
}

// 全局类型声明
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
