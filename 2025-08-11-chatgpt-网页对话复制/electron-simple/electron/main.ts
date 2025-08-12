import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";

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
