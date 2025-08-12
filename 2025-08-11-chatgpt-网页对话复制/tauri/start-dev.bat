@echo off
echo 正在启动 ChatGPT 对话信息获取器开发环境...
echo.

echo 1. 安装依赖...
call npm install

echo.
echo 2. 启动开发服务器...
call npm run tauri dev

pause
