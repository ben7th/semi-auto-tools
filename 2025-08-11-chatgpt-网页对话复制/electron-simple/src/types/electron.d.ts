declare global {
  interface Window {
    electronAPI: {
      platform: string;
      version: string;
    };
  }
}

export {};
