#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ChatGPT 对话信息获取器
通过 Gradio 界面获取 ChatGPT 对话的详细信息
"""

import re
import requests
import gradio as gr
from typing import Tuple, Optional
from urllib.parse import urlparse


def extract_conversation_id(url: str) -> Optional[str]:
    """
    从 ChatGPT 对话 URL 中提取对话 ID
    
    Args:
        url: ChatGPT 对话页面 URL
        
    Returns:
        对话 ID 或 None
    """
    if not url:
        return None
    
    # 匹配 ChatGPT 对话 URL 模式
    # 例如: https://chatgpt.com/c/687b4060-ce98-8011-afb1-70e3af4a6146
    pattern = r'https?://chatgpt\.com/c/([a-f0-9\-]+)'
    match = re.search(pattern, url)
    
    if match:
        return match.group(1)
    return None


def get_conversation_info(url: str, authorization: str) -> Tuple[str, str]:
    """
    获取 ChatGPT 对话信息
    
    Args:
        url: ChatGPT 对话页面 URL
        authorization: Authorization header 值
        
    Returns:
        (状态信息, 响应内容) 的元组
    """
    try:
        # 提取对话 ID
        conversation_id = extract_conversation_id(url)
        if not conversation_id:
            return "❌ 错误", "无法从 URL 中提取对话 ID。请确保 URL 格式正确，例如：https://chatgpt.com/c/687b4060-ce98-8011-afb1-70e3af4a6146"
        
        # 构建 API 请求 URL
        api_url = f"https://chatgpt.com/backend-api/conversation/{conversation_id}"
        
        # 设置请求头
        headers = {
            'Authorization': authorization,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Host': 'chatgpt.com'
        }
        
        # 发起 GET 请求
        response = requests.get(api_url, headers=headers, timeout=30)
        
        # 检查响应状态
        if response.status_code == 200:
            try:
                # 尝试解析 JSON 响应
                data = response.json()
                formatted_response = f"""✅ 请求成功！

📊 响应信息：
- 状态码: {response.status_code}
- 响应头: {dict(response.headers)}
- 响应大小: {len(response.content)} 字节

📝 响应内容 (JSON):
{data}"""
            except ValueError:
                # 如果不是 JSON，显示原始文本
                formatted_response = f"""✅ 请求成功！

📊 响应信息：
- 状态码: {response.status_code}
- 响应头: {dict(response.headers)}
- 响应大小: {len(response.content)} 字节

📝 响应内容 (原始文本):
{response.text}"""
            
            return "✅ 成功", formatted_response
            
        elif response.status_code == 401:
            return "❌ 认证失败", f"Authorization header 无效或已过期。\n\n状态码: {response.status_code}\n响应: {response.text}"
        elif response.status_code == 403:
            return "❌ 访问被拒绝", f"没有权限访问此对话。\n\n状态码: {response.status_code}\n响应: {response.text}"
        elif response.status_code == 404:
            return "❌ 对话不存在", f"对话 ID '{conversation_id}' 不存在或已被删除。\n\n状态码: {response.status_code}\n响应: {response.text}"
        else:
            return f"❌ 请求失败 (状态码: {response.status_code})", f"请求失败，状态码: {response.status_code}\n\n响应: {response.text}"
            
    except requests.exceptions.Timeout:
        return "❌ 请求超时", "请求超时，请检查网络连接或稍后重试。"
    except requests.exceptions.ConnectionError:
        return "❌ 连接错误", "无法连接到 ChatGPT 服务器，请检查网络连接。"
    except requests.exceptions.RequestException as e:
        return "❌ 请求异常", f"请求过程中发生异常：{str(e)}"
    except Exception as e:
        return "❌ 未知错误", f"发生未知错误：{str(e)}"


def validate_inputs(url: str, authorization: str) -> Tuple[bool, str]:
    """
    验证输入参数
    
    Args:
        url: 输入的 URL
        authorization: 输入的 authorization
        
    Returns:
        (是否有效, 错误信息) 的元组
    """
    if not url.strip():
        return False, "请输入 ChatGPT 对话页面 URL"
    
    if not authorization.strip():
        return False, "请输入 Authorization header 信息"
    
    # 检查 URL 格式
    conversation_id = extract_conversation_id(url)
    if not conversation_id:
        return False, "URL 格式不正确，应该是 https://chatgpt.com/c/[对话ID] 的格式"
    
    # 检查 authorization 格式（通常以 Bearer 开头）
    if not (authorization.startswith('Bearer ') or authorization.startswith('Basic ')):
        return False, "Authorization header 格式不正确，通常以 'Bearer ' 或 'Basic ' 开头"
    
    return True, ""


def process_request(url: str, authorization: str) -> Tuple[str, str]:
    """
    处理请求的主函数
    
    Args:
        url: ChatGPT 对话页面 URL
        authorization: Authorization header 值
        
    Returns:
        (状态信息, 响应内容) 的元组
    """
    # 验证输入
    is_valid, error_msg = validate_inputs(url, authorization)
    if not is_valid:
        return "❌ 输入验证失败", error_msg
    
    # 获取对话信息
    return get_conversation_info(url, authorization)


def create_interface():
    """创建 Gradio 界面"""
    
    with gr.Blocks(title="ChatGPT 对话信息获取器") as interface:
        gr.Markdown("""
        # ChatGPT 对话信息获取器
        
        这个工具可以帮助你获取 ChatGPT 对话的详细信息。
        
        ## 使用说明
        
        1. **输入 ChatGPT 对话页面 URL**：例如 `https://chatgpt.com/c/687b4060-ce98-8011-afb1-70e3af4a6146`
        2. **输入 Authorization header**：从浏览器开发者工具中获取
        3. **点击获取信息**：自动发起请求并显示结果
        
        ## 如何获取 Authorization header
        
        1. 打开 ChatGPT 对话页面
        2. 按 F12 打开开发者工具
        3. 切换到 Network 面板
        4. 刷新页面或进行对话操作
        5. 找到包含 `/backend-api/conversation/` 的请求
        6. 在请求头中找到 `Authorization` 字段并复制其值
        
        ## 注意事项
        
        - 请确保你有权限访问该对话
        - Authorization header 可能会过期，需要定期更新
        - 请勿分享你的 Authorization header 信息
        """)
        
        with gr.Row():
            with gr.Column(scale=2):
                # 输入区域
                gr.Markdown("### 输入信息")
                
                url_input = gr.Textbox(
                    label="ChatGPT 对话页面 URL",
                    placeholder="https://chatgpt.com/c/687b4060-ce98-8011-afb1-70e3af4a6146",
                    lines=1
                )
                
                auth_input = gr.Textbox(
                    label="Authorization Header",
                    placeholder="Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
                    lines=5
                )
                
                submit_btn = gr.Button("获取对话信息", variant="primary")
            
            with gr.Column(scale=1):
                # 信息显示区域
                gr.Markdown("### 请求状态")
                status_output = gr.Textbox(
                    label="状态",
                    value="等待输入...",
                    interactive=False,
                    lines=2
                )
                
                gr.Markdown("### 响应内容")
                response_output = gr.Textbox(
                    label="响应",
                    value="",
                    interactive=False,
                    lines=20
                )
        
        # 示例区域
        with gr.Accordion("使用示例", open=False):
            gr.Markdown("""
            ### 示例 1：基本使用
            
            **URL**: `https://chatgpt.com/c/687b4060-ce98-8011-afb1-70e3af4a6146`
            
            **Authorization**: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
            
            ### 示例 2：错误处理
            
            如果输入无效的 URL 或 Authorization，系统会显示相应的错误信息。
            
            ### 示例 3：网络问题
            
            如果网络连接有问题，系统会提示相应的错误信息。
            """)
        
        # 绑定事件
        submit_btn.click(
            fn=process_request,
            inputs=[url_input, auth_input],
            outputs=[status_output, response_output]
        )
        
        # 回车键提交
        url_input.submit(
            fn=process_request,
            inputs=[url_input, auth_input],
            outputs=[status_output, response_output]
        )
        
        auth_input.submit(
            fn=process_request,
            inputs=[url_input, auth_input],
            outputs=[status_output, response_output]
        )
    
    return interface


if __name__ == "__main__":
    # 创建界面
    interface = create_interface()
    
    # 启动服务
    print("🚀 启动 ChatGPT 对话信息获取器...")
    print("📱 界面将在浏览器中打开")
    print("🔗 本地访问地址: http://localhost:7860")
    
    interface.launch(
        server_name="0.0.0.0",  # 允许外部访问
        server_port=7860,        # 端口号
        share=False,             # 不创建公共链接
        debug=True,              # 调试模式
        show_error=True,         # 显示错误信息
        quiet=False              # 显示启动信息
    )
