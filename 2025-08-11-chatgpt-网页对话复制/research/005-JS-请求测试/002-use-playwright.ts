import { chromium, type Browser, type Page } from "playwright"
import { API_URL, AUTH } from "./lib/consts"

let browser: Browser
let page: Page

const run = async () => {
  try {
    console.log("🚀 启动 Playwright...")
    
    // 启动浏览器
    browser = await chromium.launch({
      headless: false, // 设置为 true 可以隐藏浏览器窗口
      proxy: {
        server: "http://127.0.0.1:7890" // 配置代理
      }
    })
    
    // 创建新页面
    page = await browser.newPage()
    
    // 设置认证头
    await page.setExtraHTTPHeaders({
      "Authorization": AUTH
    })
    
    console.log("📡 发送请求...")
    
    // 使用 page.goto() 访问页面
    const response = await page.goto(API_URL, {
      waitUntil: "networkidle",
      timeout: 30000
    })
    
    if (response) {
      console.log("✅ 页面访问成功!")
      console.log("状态码:", response.status())
      console.log("状态文本:", response.statusText())
      
      // 获取页面内容
      const content = await page.content()
      console.log("页面内容长度:", content.length)
      console.log("页面标题:", await page.title())
      
      // 获取所有 cookies
      const cookies = await page.context().cookies()
      console.log("Cookies 数量:", cookies.length)
      cookies.forEach(cookie => {
        console.log(`Cookie: ${cookie.name}=${cookie.value}`)
      })
      
      // 等待页面加载完成
      await page.waitForLoadState("networkidle")
      
      // 执行页面 JavaScript
      const jsResult = await page.evaluate(() => {
        // 这里可以执行任何页面上的 JavaScript
        return {
          url: window.location.href,
          title: document.title,
          userAgent: navigator.userAgent,
          cookies: document.cookie
        }
      })
      
      console.log("JavaScript 执行结果:", jsResult)
      
      // 输出完整的页面内容
      console.log("\n" + "=".repeat(80))
      console.log("📄 完整页面内容:")
      console.log("=".repeat(80))
      console.log(content)
      console.log("=".repeat(80))
      
    } else {
      console.log("❌ 页面访问失败")
    }
    
  } catch (error) {
    console.error("❌ 请求失败:", error)
  } finally {
    // 关闭浏览器
    if (browser) {
      await browser.close()
      console.log("🔒 浏览器已关闭")
    }
  }
}

// 运行主函数
run()
