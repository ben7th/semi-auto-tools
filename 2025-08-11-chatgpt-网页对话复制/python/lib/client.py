from typing import Dict, Any, Optional
from playwright.async_api import async_playwright
import json

class PlaywrightAPIClient:
    """使用 Playwright 进行 API 请求的客户端类"""
    
    def __init__(self, chat_url: str, authorization: str = ""):
        """
        初始化 API 客户端
        
        Args:
            chat_url: chatgpt 的对话 url, 例如 https://chatgpt.com/c/689a176f-6e58-8326-9aa2-139893112a85
            authorization: 认证信息（如 Bearer Token）
        """
        self.chat_url = chat_url
        self.chat_id = chat_url.split('/')[-1]
        self.api_url = f"https://chatgpt.com/backend-api/conversation/{self.chat_id}"

        self.authorization = authorization
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    
    async def request(self) -> Dict[str, Any]:
        """
        发送 API 请求并返回完整的响应信息
        
        Returns:
            包含响应信息的字典，格式如下：
            {
                "success": bool,
                "status_code": int,
                "status_text": str,
                "headers": dict,
                "raw_response": str,
                "json_data": Optional[dict],
                "error": Optional[str]
            }
        """
        # 验证配置
        if not self.api_url:
            return {
                "success": False,
                "error": "API_URL 不能为空"
            }
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                # 设置请求头
                headers = {"User-Agent": self.user_agent}
                if self.authorization:
                    headers["Authorization"] = self.authorization
                
                await page.set_extra_http_headers(headers)
                
                # 发送请求
                response = await page.goto(self.api_url, wait_until="networkidle")
                
                if response:
                    # 获取响应信息
                    status_code = response.status
                    status_text = response.status_text
                    headers = dict(response.headers)
                    raw_response = await response.text()
                    
                    # 尝试解析 JSON
                    json_data = None
                    try:
                        json_data = json.loads(raw_response)
                    except json.JSONDecodeError:
                        pass
                    
                    return {
                        "success": True,
                        "status_code": status_code,
                        "status_text": status_text,
                        "headers": headers,
                        "raw_response": raw_response,
                        "json_data": json_data,
                        "error": None
                    }
                else:
                    return {
                        "success": False,
                        "error": "未获取到响应"
                    }
                    
            except Exception as e:
                return {
                    "success": False,
                    "error": f"请求过程中出错: {str(e)}"
                }
            
            finally:
                await browser.close()