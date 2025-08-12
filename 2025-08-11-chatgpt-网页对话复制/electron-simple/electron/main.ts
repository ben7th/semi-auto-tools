import { app, BrowserWindow } from "electron";
import * as path from "path";

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
    // 从 dist 目录加载构建后的 React 应用
    const htmlPath = path.join(__dirname, "index.html");
    console.log('Loading HTML file:', htmlPath);
    
    // 先检查文件是否存在
    const fs = require('fs');
    if (fs.existsSync(htmlPath)) {
      console.log('HTML file exists, loading...');
      mainWindow.loadFile(htmlPath);
    } else {
      console.error('HTML file not found:', htmlPath);
    }
    
    // 监听加载事件
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.log('Failed to load:', errorCode, errorDescription, validatedURL);
    });
    
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Page loaded successfully');
    });
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
