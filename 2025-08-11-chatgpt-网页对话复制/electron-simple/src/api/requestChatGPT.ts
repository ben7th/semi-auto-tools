// 使用 Electron 主进程发送 HTTP 请求，避免跨域问题
export const requestChatGPT = async (url: string, authToken: string) => {
  try {
    console.log("开始请求 ChatGPT API...");
    console.log("URL:", url);
    console.log("Auth Token:", authToken ? "已提供" : "未提供");

    // 通过 Electron 主进程发送请求
    const response = await window.electronAPI.sendHttpRequest({
      url: url,
      method: "GET",
      headers: {
        "Authorization": authToken,
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (response.error) {
      console.error("请求失败:", response.error);
      return {
        success: false,
        error: response.error,
        code: response.code
      };
    }

    console.log("请求成功:", {
      status: response.status,
      statusText: response.statusText,
      dataLength: response.data?.length || 0
    });

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    };

  } catch (error) {
    console.error("请求异常:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// 通用的 HTTP 请求函数
export const sendHttpRequest = async (options: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}) => {
  try {
    const response = await window.electronAPI.sendHttpRequest(options);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response;
  } catch (error) {
    console.error("HTTP 请求失败:", error);
    throw error;
  }
};