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
    };
  }
}

export {};