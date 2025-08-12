# Electron Simple App

这是一个最简洁的 Electron + React + TypeScript 项目模板。

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速构建工具
- **pnpm** - 快速的包管理器

## 项目结构

```
electron-simple/
├── electron/           # Electron 主进程代码
│   ├── main.ts        # 主进程入口
│   ├── preload.ts     # 预加载脚本
│   └── tsconfig.json  # Electron TS 配置
├── src/               # React 应用源码
│   ├── main.tsx       # React 应用入口
│   ├── App.tsx        # 主应用组件
│   └── types/         # 类型声明
├── dist/              # 构建输出目录
├── package.json       # 项目配置
├── tsconfig.json      # TypeScript 配置
├── vite.config.ts     # Vite 配置
└── index.html         # HTML 入口文件
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

这将同时启动：
- Vite 开发服务器 (http://localhost:5173)
- Electron 应用

### 构建应用

```bash
pnpm run build
```

### 运行构建后的应用

```bash
pnpm start
```

## 开发说明

- 开发时，Electron 会加载 Vite 开发服务器的内容
- 生产构建时，Electron 会加载构建后的静态文件
- 使用 `contextBridge` 安全地暴露 API 给渲染进程
- 支持热重载和开发者工具

## 故障排除

### 窗口显示空白
如果 Electron 窗口显示空白，请检查：
1. Vite 开发服务器是否正在运行（http://localhost:5173）
2. 控制台是否有错误信息
3. 确保先运行 `pnpm run dev:renderer` 再运行 `pnpm run dev:electron`

### 路径错误
如果遇到文件路径错误，请检查：
1. 项目结构是否正确
2. 构建输出目录是否存在
3. Electron 主进程的路径配置是否正确

## 自定义

- 修改 `electron/main.ts` 来调整 Electron 主进程
- 修改 `src/App.tsx` 来调整 React 应用界面
- 在 `electron/preload.ts` 中添加更多安全的 API