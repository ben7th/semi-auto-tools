# ChatGPT 对话信息获取器 - Tauri 版本

这是一个基于 Tauri + React + TypeScript 的桌面应用，用于获取 ChatGPT 对话的 JSON 数据。

## 功能特性

- 🖥️ 原生桌面应用体验
- 🎨 现代化的 UI 界面设计
- 📝 支持输入 ChatGPT 对话 URL
- 🔐 支持 Bearer Token 认证
- 💾 自动保存和加载认证信息
- 📊 实时显示请求状态和结果
- 📱 响应式设计，支持不同屏幕尺寸

## 技术栈

- **后端**: Rust + Tauri
- **前端**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3 + 现代设计

## 开发环境要求

- Node.js 18+
- Rust 1.70+
- Tauri CLI

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run tauri dev
```

### 3. 构建生产版本

```bash
npm run tauri build
```

## 项目结构

```
tauri/
├── src/                    # 前端源码
│   ├── App.tsx           # 主应用组件
│   ├── App.css           # 主应用样式
│   ├── main.tsx          # 应用入口
│   └── style.css         # 全局样式
├── src-tauri/             # Rust 后端源码
│   ├── src/
│   │   └── main.rs       # 主程序
│   ├── Cargo.toml        # Rust 依赖配置
│   ├── build.rs          # 构建脚本
│   └── tauri.conf.json   # Tauri 配置
├── icons/                 # 应用图标
├── package.json           # 前端依赖配置
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 项目说明
```

## 使用说明

1. 启动应用后，在左侧面板输入 ChatGPT 对话 URL
2. 可选择输入 Bearer Token 认证信息
3. 点击"发送请求"按钮获取对话数据
4. 右侧面板会显示请求状态和 JSON 结果
5. 认证信息会自动保存到用户主目录的 `authorization.txt` 文件

## 注意事项

- 目前请求功能是模拟的，需要后续实现真实的 HTTP 请求逻辑
- 认证信息会保存在用户主目录，请确保信息安全
- 应用需要网络权限来访问 ChatGPT API

## 开发计划

- [ ] 实现真实的 HTTP 请求逻辑
- [ ] 添加请求历史记录
- [ ] 支持批量处理多个 URL
- [ ] 添加数据导出功能
- [ ] 优化错误处理和用户反馈

## 许可证

本项目仅供学习和研究使用。
