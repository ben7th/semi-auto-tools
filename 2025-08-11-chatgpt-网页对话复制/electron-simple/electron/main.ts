import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as https from "https";
import * as http from "http";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // 开发环境下加载 Vite 开发服务器
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境下加载构建后的文件
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 添加 IPC 处理器来读取 authorization.txt 文件
ipcMain.handle("read-authorization-file", async () => {
  try {
    const filePath = path.join(process.cwd(), "authorization.txt");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return { exists: true, content };
    } else {
      return { exists: false, content: "" };
    }
  } catch (error: unknown) {
    console.error("读取 authorization.txt 文件失败:", error);
    return { exists: false, content: "", error: error instanceof Error ? error.message : String(error) };
  }
});

// 添加 IPC 处理器来发送 HTTP 请求
ipcMain.handle("send-http-request", async (event, options) => {
  try {
    console.log("收到 HTTP 请求:", options);
    const { url, method = "GET", headers = {}, body } = options;
    
    return new Promise((resolve) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === "https:";
      const client = isHttps ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method.toUpperCase(),
        headers: {
          "User-Agent": "Electron-App/1.0",
          "Accept": "*/*",
          ...headers
        }
      };

      console.log("请求选项:", requestOptions);

      const req = client.request(requestOptions, (res) => {
        console.log("收到响应:", res.statusCode, res.statusMessage);
        let data = "";
        
        res.on("data", (chunk) => {
          data += chunk;
        });
        
        res.on("end", () => {
          console.log("响应完成，数据长度:", data.length);
          resolve({
            success: true,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on("error", (error) => {
        console.error("HTTP 请求错误:", error);
        resolve({
          success: false,
          error: error.message,
          code: (error as NodeJS.ErrnoException).code || "UNKNOWN"
        });
      });

      req.on("timeout", () => {
        req.destroy();
        console.error("HTTP 请求超时");
        resolve({
          success: false,
          error: "Request timeout",
          code: "TIMEOUT"
        });
      });

      // 设置超时时间
      req.setTimeout(30000); // 30秒超时

      // 如果有请求体，发送数据
      if (body) {
        req.write(body);
      }
      
      req.end();
    });
  } catch (error: unknown) {
    console.error("HTTP 请求失败:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      code: "UNKNOWN_ERROR"
    };
  }
});
