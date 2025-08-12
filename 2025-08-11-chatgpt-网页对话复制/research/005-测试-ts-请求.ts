// 类型声明
declare const require: (module: string) => any

// 代理配置
const PROXY_CONFIG = {
  // 常见的代理端口，根据你的VPN软件调整
  host: "127.0.0.1",
  port: 7890, // 常见端口：7890, 1080, 8080, 8888
  protocol: "http"
}

// 检测系统代理环境变量
const getSystemProxy = () => {
  // 使用类型断言避免 TypeScript 错误
  const env = (globalThis as any).process?.env || {}
  const httpProxy = env.HTTP_PROXY || env.http_proxy
  const httpsProxy = env.HTTP_PROXY || env.https_proxy
  
  if (httpProxy || httpsProxy) {
    console.log("检测到系统代理:", { httpProxy, httpsProxy })
    return true
  }
  return false
}

const url = "https://chatgpt.com/backend-api/conversation/687b4060-ce98-8011-afb1-70e3af4a6146"

const auth = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MzQ0ZTY1LWJiYzktNDRkMS1hOWQwLWY5NTdiMDc5YmQwZSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSJdLCJjbGllbnRfaWQiOiJhcHBfWDh6WTZ2VzJwUTl0UjNkRTduSzFqTDVnSCIsImV4cCI6MTc1NTc4MTM4OSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLUZMV294MlZVT0dtNG43aURGQ3FLUU1VOCJ9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL21mYSI6eyJyZXF1aXJlZCI6InllcyJ9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJiZW43dGhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJpYXQiOjE3NTQ5MTczODksImlzcyI6Imh0dHA6Ly9hdXRoLm9wZW5haS5jb20iLCJqdGkiOiIyMjVhY2JhMS00ZTg1LTRiZjYtOWNjNS05MTc5ZDFlYTExZDgiLCJuYmYiOjE3NTQ5MTczODksInB3ZF9hdXRoX3RpbWUiOjE3NTA1ODg0NTc1NzAsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiLCJvZmZsaW5lX2FjY2VzcyIsIm1vZGVsLnJlcXVlc3QiLCJtb2RlbC5yZWFkIiwib3JnYW5pemF0aW9uLnJlYWQiLCJvcmdhbml6YXRpb24ud3JpdGUiXSwic2Vzc2lvbl9pZCI6ImF1dGhzZXNzXzBDYmZ2RjkxY3JqTDB5Q3EwU2xzOGRSRiIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA0MDYwMjYxMDMwNzU0ODA1NDUxIn0.S5GxEhX-WYUygtLZFd_GshP0vUsFWcj8zs-iMdNjgUmQfB21aFY9_VyuEFkyUskTx3pR8ZfKCZm03wdDD6FGfh_QYRmVdVEXUduga4A3wn5rwfjVQyqbl3lsBOA3D9CDc-deoEwPvfWegPSeGIxkrhuZL6PbBByvbrV7Ge4LSgH4b9STmsPxM1yGNfJnN7VxJk8rWRpJXxkgQJi-Ph5J4nUCrvN5zlFNx2ami5AJTY4Og3-s9XxCkdZXo427i05Z9vKEZeFkQ310C4d2ubiOfk9yI5eWph8_EccEWekMbMM1n7CrPxh904Qfd_ACQmE9ZvXylr2p4elVw8XGdbtmjaZkGBRis-pbtgxInoJXE5_eyslpC9Y0hd3Z1BFV5s7iqz0SFlWCrTjarMxADdF90abOlPw-qjXA52BuDggJatcjRincYI6GXvRNnUpJGmHWdUq9Dzl4_A-J85ReoMbHQsWuJI66hb11W1NkqeAmv6qrDit4ZUvbkjQ1IhLCsIy9ePPi8OpwA_ivhOg3yBM0p6HVLUaSHPDBntN-t6ponONTb1AiDgNL1ygm0xJ9R8iGxfnaQ_Uhoyjxb7BtPjdpgXGqg-YTGMfxqMXzP1iD1ufJEyzPIUs4z-K7xL7GS3nhTYRnOZxB8F_fNxsMS2QoP5RnEYARmJbNKa_vUz273SA"

const doRequest = async () => {
  // 检查系统代理
  const hasSystemProxy = getSystemProxy()
  
  if (!hasSystemProxy) {
    console.log("⚠️  未检测到系统代理，将使用代码中配置的代理")
    console.log(`💡 当前配置代理: ${PROXY_CONFIG.protocol}://${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`)
  }

  try {
    // 使用 axios 发送请求
    const axios = require("axios")
    
    const response = await axios.get(url, {
      headers: {
        "Host": "chatgpt.com",
        "Authorization": auth,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      // 配置代理
      proxy: {
        host: PROXY_CONFIG.host,
        port: PROXY_CONFIG.port,
        protocol: PROXY_CONFIG.protocol
      },
      timeout: 30000, // 30秒超时
      // 如果需要忽略SSL证书验证（不推荐）
      // httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false })
    })

    console.log("✅ 请求成功!")
    console.log("状态码:", response.status)
    console.log("状态文本:", response.statusText)
    console.log("响应头:", response.headers)
    
    // 显示响应内容
    console.log("响应内容长度:", response.data?.length || "未知")
    console.log("响应内容预览:", JSON.stringify(response.data).substring(0, 200) + "...")
    
  } catch (error) {
    console.error("❌ 请求失败:", error.message)
    
    if (error.code === "ECONNREFUSED") {
      console.log("💡 连接被拒绝，请检查代理是否启动")
      console.log(`💡 当前代理配置: ${PROXY_CONFIG.protocol}://${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`)
    } else if (error.code === "ENOTFOUND") {
      console.log("💡 域名解析失败，可能需要配置代理")
    } else if (error.code === "ETIMEDOUT") {
      console.log("💡 请求超时，可能是网络或代理问题")
    } else if (error.response) {
      console.log("💡 服务器返回错误:", error.response.status, error.response.statusText)
    }
    
    // 显示详细错误信息
    if (error.response?.data) {
      console.log("错误详情:", error.response.data)
    }
  }
}

// 显示当前代理配置
console.log("🔍 当前代理配置:")
console.log("系统代理:", getSystemProxy() ? "已检测到" : "未检测到")
console.log("代码代理:", `${PROXY_CONFIG.protocol}://${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`)
console.log("目标URL:", url)
console.log("---")

doRequest()

