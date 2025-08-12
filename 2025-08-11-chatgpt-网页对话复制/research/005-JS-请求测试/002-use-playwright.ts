import { chromium, type Browser, type Page } from "playwright"
import { API_URL, AUTH, USER_AGENT } from "./lib/consts"

const fetchWithPlaywright = async (api_url: string, auth: string): Promise<string> => {
  let browser: Browser | undefined
  let page: Page | undefined

  try {
    // 启动浏览器
    browser = await chromium.launch({
      headless: true, // 设置为 true 可以隐藏浏览器窗口
      // proxy: {
      //   server: "http://127.0.0.1:7890" // 配置代理
      // }
    })
    
    // 创建新页面
    page = await browser.newPage()
    
    // 设置认证头
    await page.setExtraHTTPHeaders({
      "Authorization": AUTH,
      // headless: true 时，必须加上 User-Agent，否则触发 Enable JavaScript and cookies to continue 的警告
      "User-Agent": USER_AGENT 
    })
    
    // 使用 page.goto() 访问页面
    const response = await page.goto(api_url, {
      waitUntil: "networkidle",
      timeout: 300000 // 增加超时时间
    })
    
    if (response) {
      // 获取页面内容
      const content = await page.content()
      
      // 等待页面加载完成 - 使用更可靠的等待策略
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
      
      return content
      
    } else {
      return "页面访问失败"
    }
    
  } catch (error) {
    console.error("❌ 请求失败:", error)
    return error instanceof Error ? error.message : String(error)
  } finally {
    // 关闭浏览器
    if (browser) {
      await browser.close()
    }
  }
}

const run = async () => {
  const result = await fetchWithPlaywright(API_URL, AUTH)
  console.log("最终结果:", result)
}

// 运行主函数
run()
