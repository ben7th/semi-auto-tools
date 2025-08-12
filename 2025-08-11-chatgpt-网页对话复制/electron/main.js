const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    title: 'ChatGPT 对话信息获取器',
    show: false
  });

  // 加载应用的 index.html
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // 当窗口准备好显示时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 开发模式下打开开发者工具
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow);

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC 通信处理
ipcMain.handle('read-auth-file', async () => {
  try {
    const authPath = path.join(os.homedir(), 'authorization.txt');
    if (fs.existsSync(authPath)) {
      const content = fs.readFileSync(authPath, 'utf8');
      return { success: true, content: content.trim() };
    } else {
      return { success: false, error: '文件不存在' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-auth-file', async (event, content) => {
  try {
    const authPath = path.join(os.homedir(), 'authorization.txt');
    fs.writeFileSync(authPath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('request-chat-info', async (event, { chatUrl, authorization }) => {
  try {
    const axios = require('axios');
    
    // 解析 chat_id
    const chatId = chatUrl.split('/').pop();
    const apiUrl = `https://chatgpt.com/backend-api/conversation/${chatId}`;
    
    // 设置请求头
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    if (authorization && authorization.trim()) {
      headers['Authorization'] = authorization.trim();
    }
    
    // 发送请求
    const response = await axios.get(apiUrl, { headers, timeout: 30000 });
    
    return {
      success: true,
      statusCode: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    };
    
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: `请求失败: ${error.response.status} - ${error.response.statusText}`,
        statusCode: error.response.status
      };
    } else if (error.request) {
      return {
        success: false,
        error: '网络请求失败，请检查网络连接'
      };
    } else {
      return {
        success: false,
        error: `请求错误: ${error.message}`
      };
    }
  }
});
