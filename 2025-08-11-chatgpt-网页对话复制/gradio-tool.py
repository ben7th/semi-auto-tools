#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
基于 Gradio 的 ChatGPT 对话信息获取服务
"""

import gradio as gr
import asyncio
import json
from pathlib import Path
from lib.client import PlaywrightAPIClient


def load_authorization_from_file():
    """从 authorization.txt 文件读取认证信息"""
    file_path = Path("authorization.txt")
    
    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
            if content:
                return content, "✅ 已从 authorization.txt 文件读取认证信息"
            else:
                return "", "⚠️ authorization.txt 文件存在但内容为空"
        except Exception as e:
            return "", f"❌ 读取 authorization.txt 文件失败: {str(e)}"
    else:
        return "", "📝 authorization.txt 文件不存在，请在界面中输入认证信息"


async def request_chat_info(chat_url, authorization):
    """异步请求聊天信息"""
    if not chat_url.strip():
        return "错误：请输入有效的聊天 URL", ""
    
    try:
        client = PlaywrightAPIClient(
            chat_url=chat_url.strip(),
            authorization=authorization.strip() if authorization.strip() else ""
        )
        
        result = await client.request()
        
        if result.get("success"):
            status_info = f"✅ 请求成功！\n状态码: {result.get('status_code')} - {result.get('status_text')}"
            
            json_data = result.get("json_data")
            if json_data:
                json_str = json.dumps(json_data, indent=2, ensure_ascii=False)
                return status_info, json_str
            else:
                raw_response = result.get("raw_response", "")
                return status_info, raw_response
        else:
            error_msg = result.get("error", "未知错误")
            return f"❌ 请求失败: {error_msg}", ""
            
    except Exception as e:
        return f"❌ 程序执行出错: {str(e)}", ""


def sync_request_chat_info(chat_url, authorization):
    """同步包装函数"""
    return asyncio.run(request_chat_info(chat_url, authorization))


def create_interface():
    """创建 Gradio 界面"""
    
    with gr.Blocks(title="ChatGPT 对话信息获取器") as demo:
        gr.Markdown("# 🤖 ChatGPT 对话信息获取器")
        gr.Markdown("输入 ChatGPT 对话 URL 和认证信息，获取对话的 JSON 数据")
        
        with gr.Row():
            with gr.Column(scale=1):
                gr.Markdown("## 📝 输入参数")
                
                chat_url_input = gr.Textbox(
                    label="ChatGPT 对话 URL",
                    placeholder="例如: https://chatgpt.com/c/689a176f-6e58-8326-9aa2-139893112a85",
                    lines=2
                )
                
                authorization_input = gr.TextArea(
                    label="认证信息 (可选)",
                    placeholder="Bearer token 或留空",
                    lines=3
                )
                
                # 文件状态显示
                file_status_output = gr.Textbox(
                    label="文件状态",
                    lines=2,
                    interactive=False
                )
                
                request_btn = gr.Button("🚀 发送请求", variant="primary")
                
                gr.Markdown("### 💡 示例")
                gr.Markdown("""
                **URL:** `https://chatgpt.com/c/689a176f-6e58-8326-9aa2-139893112a85`  
                **认证:** `Bearer eyJhbGciOiJSUzI1NiIs...`
                """)
            
            with gr.Column(scale=1):
                gr.Markdown("## 📊 请求结果")
                
                status_output = gr.Textbox(
                    label="状态信息",
                    lines=5,
                    interactive=False
                )
                
                json_output = gr.Textbox(
                    label="JSON 数据",
                    lines=15,
                    interactive=False
                )
                
                clear_btn = gr.Button("🗑️ 清空结果", variant="secondary")
        
        # 绑定事件
        request_btn.click(
            fn=sync_request_chat_info,
            inputs=[chat_url_input, authorization_input],
            outputs=[status_output, json_output]
        )
        
        clear_btn.click(
            fn=lambda: ("", ""),
            outputs=[status_output, json_output]
        )
        
        # 页面加载时初始化
        def init_interface():
            auth_from_file, file_status = load_authorization_from_file()
            return auth_from_file, file_status
        
        demo.load(
            fn=init_interface,
            outputs=[authorization_input, file_status_output]
        )
    
    return demo


if __name__ == "__main__":
    app = create_interface()
    app.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True
    )
