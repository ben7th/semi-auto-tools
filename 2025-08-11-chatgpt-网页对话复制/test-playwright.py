#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用 Playwright 请求 API 并获取响应文本的类
"""

import asyncio
from lib.client import PlaywrightAPIClient
from pathlib import Path

CHAT_URL = "https://chatgpt.com/c/689a176f-6e58-8326-9aa2-139893112a85"

CURRENT_DIR: Path = Path(__file__).parent
AUTHORIZATION = (CURRENT_DIR / "authorization.txt").read_text()

async def main():
    """主函数示例"""
    
    client = PlaywrightAPIClient(
        chat_url=CHAT_URL,
        authorization=AUTHORIZATION
    )
    
    print("开始使用 Playwright 访问 API...")
    
    result = await client.request()
    json_data = result.get("json_data", {})
    
    print("程序结束")

    print(json_data)


if __name__ == "__main__":
    # 运行异步函数
    asyncio.run(main())
