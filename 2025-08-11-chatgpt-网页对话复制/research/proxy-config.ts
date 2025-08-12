// 代理配置文件
export const PROXY_CONFIGS = {
  // 常见VPN代理端口配置
  vpn: {
    host: "127.0.0.1",
    port: 7890,
    protocol: "http"
  },
  
  // Clash 默认配置
  clash: {
    host: "127.0.0.1", 
    port: 7890,
    protocol: "http"
  },
  
  // V2Ray 默认配置
  v2ray: {
    host: "127.0.0.1",
    port: 1080,
    protocol: "http"
  },
  
  // Shadowsocks 默认配置
  shadowsocks: {
    host: "127.0.0.1",
    port: 1080,
    protocol: "http"
  },
  
  // 自定义配置
  custom: {
    host: "127.0.0.1",
    port: 8080,
    protocol: "http"
  }
}

// 获取系统代理环境变量
export const getSystemProxy = () => {
  const env = (globalThis as any).process?.env || {}
  return {
    http: env.HTTP_PROXY || env.http_proxy,
    https: env.HTTPS_PROXY || env.https_proxy
  }
}

// 设置代理环境变量
export const setProxyEnv = (host: string, port: number, protocol: string = "http") => {
  const proxyUrl = `${protocol}://${host}:${port}`
  
  if ((globalThis as any).process?.env) {
    (globalThis as any).process.env.HTTP_PROXY = proxyUrl
    ;(globalThis as any).process.env.HTTPS_PROXY = proxyUrl
    console.log(`✅ 已设置代理环境变量: ${proxyUrl}`)
  } else {
    console.log("⚠️  无法设置环境变量，请在运行前手动设置")
    console.log(`💡 设置命令: set HTTP_PROXY=${proxyUrl} && set HTTPS_PROXY=${proxyUrl}`)
  }
}

// 测试代理连接
export const testProxy = async (host: string, port: number, protocol: string = "http") => {
  const testUrl = "https://httpbin.org/ip"
  
  try {
    const response = await fetch(testUrl, {
      method: "GET",
      // 注意：fetch 本身不支持代理，这里只是测试环境变量是否生效
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log("✅ 代理测试成功!")
      console.log("当前IP:", data.origin)
      return true
    }
  } catch (error) {
    console.error("❌ 代理测试失败:", error.message)
  }
  
  return false
}

// 显示当前代理状态
export const showProxyStatus = () => {
  const systemProxy = getSystemProxy()
  console.log("🔍 当前代理状态:")
  console.log("HTTP_PROXY:", systemProxy.http || "未设置")
  console.log("HTTPS_PROXY:", systemProxy.https || "未设置")
  
  if (!systemProxy.http && !systemProxy.https) {
    console.log("⚠️  建议设置代理环境变量以访问需要VPN的网站")
    console.log("💡 常见VPN代理端口:")
    Object.entries(PROXY_CONFIGS).forEach(([name, config]) => {
      console.log(`   ${name}: ${config.protocol}://${config.host}:${config.port}`)
    })
  }
}
