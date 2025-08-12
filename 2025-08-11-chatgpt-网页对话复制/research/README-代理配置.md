# 代理配置说明

## 问题描述
当访问需要 VPN 的网站时，Node.js 的 `fetch` API 默认不会走系统代理，需要手动配置。

## 解决方案

### 方法1：设置环境变量（推荐）

#### Windows PowerShell
```powershell
# 设置代理环境变量
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"

# 运行脚本
node 005-测试-ts-请求.js
```

#### Windows CMD
```cmd
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
node 005-测试-ts-请求.js
```

#### Linux/macOS
```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
node 005-测试-ts-请求.js
```

### 方法2：使用 axios（支持内置代理）

```bash
# 安装 axios
npm install axios
```

然后修改代码使用 axios：

```typescript
import axios from "axios"

const response = await axios.get(url, {
  headers: { /* ... */ },
  proxy: {
    host: "127.0.0.1",
    port: 7890,
    protocol: "http"
  }
})
```

### 方法3：使用代理配置文件

```typescript
import { setProxyEnv, showProxyStatus } from "./proxy-config"

// 设置代理
setProxyEnv("127.0.0.1", 7890, "http")

// 显示状态
showProxyStatus()
```

## 常见VPN代理端口

| VPN软件 | 默认端口 | 协议 |
|---------|----------|------|
| Clash | 7890 | HTTP/SOCKS5 |
| V2Ray | 1080 | HTTP/SOCKS5 |
| Shadowsocks | 1080 | SOCKS5 |
| 其他 | 8080, 8888 | HTTP |

## 验证代理是否生效

### 1. 检查环境变量
```bash
# Windows
echo %HTTP_PROXY%
echo %HTTPS_PROXY%

# Linux/macOS
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

### 2. 测试连接
```bash
# 测试是否能访问 Google
curl -I https://www.google.com

# 或者使用我们的测试脚本
node proxy-config.js
```

## 故障排除

### 问题1：仍然无法访问
- 确认 VPN 软件已启动
- 检查代理端口是否正确
- 尝试不同的代理协议（HTTP/SOCKS5）

### 问题2：环境变量不生效
- 确保在同一个终端窗口设置和运行
- 检查代理软件是否支持 HTTP 代理
- 尝试重启终端

### 问题3：TypeScript 类型错误
- 安装 @types/node: `npm install --save-dev @types/node`
- 或者使用类型断言避免错误

## 最佳实践

1. **优先使用环境变量**：最兼容的方式
2. **备份配置**：将代理设置保存到脚本中
3. **测试连接**：运行前先测试代理是否工作
4. **错误处理**：添加代理检测和错误提示

## 示例脚本

查看 `005-测试-ts-请求.ts` 和 `proxy-config.ts` 文件获取完整示例。
