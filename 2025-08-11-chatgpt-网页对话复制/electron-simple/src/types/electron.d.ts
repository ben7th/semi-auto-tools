// 声明全局类型
declare global {
  interface Window {
    electronAPI: {
      platform: string;
      version: string;
      readAuthorizationFileContent: () => Promise<{
        exists: boolean;
        content: string;
        error?: string;
      }>;
      // 添加通过主进程发送 HTTP 请求的功能
      sendHttpRequest: (options: {
        url: string;
        method?: string;
        headers?: Record<string, string>;
        body?: string;
      }) => Promise<{
        success: boolean;
        status?: number;
        statusText?: string;
        headers?: Record<string, string>;
        data?: string;
        error?: string;
        code?: string;
      }>;
    };
  }
}

export {};