# ChatGPT 对话信息获取器 - Electron 版本

这是一个基于 Electron + HTML + CSS + JavaScript 的桌面应用，用于获取 ChatGPT 对话的 JSON 数据。

## ✨ 功能特性

- 🖥️ 原生桌面应用体验
- 🎨 现代化的 UI 界面设计
- 📝 支持输入 ChatGPT 对话 URL
- 🔐 支持 Bearer Token 认证
- 💾 自动保存和加载认证信息
- 📊 实时显示请求状态和结果
- 📱 响应式设计，支持不同屏幕尺寸
- 🚀 基于 Electron，开发体验优秀

## 🛠️ 技术栈

- **桌面框架**: Electron 28
- **前端**: 原生 HTML + CSS + JavaScript
- **网络请求**: Axios
- **构建工具**: Electron Builder

## 📋 系统要求

- Windows 10/11
- Node.js 16+
- npm 或 yarn

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

### 3. 构建应用

```bash
npm run build
```

### 4. 打包应用

```bash
npm run pack
```

## 📁 项目结构

```
electron/
├── main.js                 # 主进程文件
├── preload.js             # 预加载脚本
├── renderer/              # 渲染进程文件
│   ├── index.html        # 主页面
│   ├── styles.css        # 样式文件
│   └── renderer.js       # 渲染进程逻辑
├── assets/                # 资源文件
│   └── icon.ico          # 应用图标
├── package.json           # 项目配置
├── start-dev.bat          # 快速启动脚本
└── README.md              # 项目说明
```

## 🔧 主要功能

### 1. 认证信息管理
- 自动从用户主目录读取 `authorization.txt` 文件
- 支持手动保存认证信息到文件
- 文件状态实时显示

### 2. 对话信息获取
- 解析 ChatGPT 对话 URL 获取 chat_id
- 构造 API 请求到 ChatGPT 后端
- 支持 Bearer Token 认证
- 实时显示请求状态和结果

### 3. 用户界面
- 左右分栏布局，操作和结果分离
- 响应式设计，支持不同屏幕尺寸
- 现代化 UI 设计，用户体验优秀

## 📖 使用说明

1. **启动应用**：运行 `npm run dev` 启动开发模式
2. **输入 URL**：在左侧面板输入 ChatGPT 对话 URL
3. **设置认证**：可选择输入 Bearer Token 认证信息
4. **发送请求**：点击"发送请求"按钮获取对话数据
5. **查看结果**：右侧面板显示请求状态和 JSON 数据
6. **保存认证**：认证信息会自动保存到用户主目录

## 🔒 安全特性

- 使用 `contextIsolation` 隔离主进程和渲染进程
- 通过 `preload.js` 提供安全的 API 接口
- 禁用 `nodeIntegration` 防止安全风险
- 认证信息存储在用户主目录，相对安全

## 🚀 开发优势

相比 Tauri，Electron 在 Windows 上的优势：

- **开发环境简单**：不需要 Rust 编译环境
- **配置直观**：配置文件结构清晰易懂
- **调试方便**：内置开发者工具，调试体验好
- **社区成熟**：大量资源和示例代码
- **兼容性好**：Windows 平台支持完善

## 📦 构建和分发

### 开发构建
```bash
npm run build
```

### 生产打包
```bash
npm run dist
```

### 打包选项
- Windows: NSIS 安装程序
- 支持自定义安装目录
- 包含应用图标和元数据

## 🐛 故障排除

### 常见问题

1. **应用无法启动**
   - 检查 Node.js 版本是否兼容
   - 确认依赖是否正确安装

2. **网络请求失败**
   - 检查网络连接
   - 确认 URL 格式是否正确
   - 验证认证信息是否有效

3. **图标显示异常**
   - 确认 `assets/icon.ico` 文件存在
   - 检查图标文件格式是否正确

## 📄 许可证

本项目仅供学习和研究使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 📞 支持

如果遇到问题，请：
1. 查看本文档的故障排除部分
2. 检查控制台错误信息
3. 提交 Issue 描述问题详情
