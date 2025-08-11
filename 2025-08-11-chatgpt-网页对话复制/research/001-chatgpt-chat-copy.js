// ==UserScript==
// @name         ChatGPT 消息解析工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 ChatGPT 网页右下方显示解析按钮，复制解析后的消息JSON到剪贴板
// @author       You
// @match        https://chatgpt.com/*
// @match        https://*.chatgpt.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';



    // 创建解析按钮
    function createParseButton() {
        // 检查是否已经存在按钮
        if (document.getElementById('chatgpt-parse-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'chatgpt-parse-btn';
        button.innerHTML = '复制解析消息';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.background = '#4f46e5';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#6366f1';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        // 点击事件
        button.addEventListener('click', handleParseClick);

        document.body.appendChild(button);
    }



    // 处理解析点击事件
    async function handleParseClick() {
        const button = document.getElementById('chatgpt-parse-btn');
        const originalText = button.innerHTML;

        try {
            // 查找所有带有 data-message-id 的元素
            const messageElements = document.querySelectorAll('[data-message-id]');
            
            if (messageElements.length === 0) {
                throw new Error('未找到消息元素');
            }

            // 解析消息内容
            const parsedMessages = parseMessages(messageElements);
            
            // 复制到剪贴板
            await copyToClipboard(parsedMessages);

            // 显示成功状态
            button.innerHTML = '解析成功!';
            button.style.background = '#28a745';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '#6366f1';
            }, 2000);

        } catch (error) {
            console.error('解析失败:', error);
            
            // 显示错误状态
            button.innerHTML = '解析失败';
            button.style.background = '#dc3545';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '#6366f1';
            }, 2000);
        }
    }

    // 解析消息内容
    function parseMessages(messageElements) {
        const messages = [];
        
        messageElements.forEach((element, index) => {
            const messageId = element.getAttribute('data-message-id');
            const authorRole = element.getAttribute('data-message-author-role');
            
            // 查找消息内容区域
            const contentElement = element.querySelector('.markdown, .whitespace-pre-wrap, [class*="text-message"]');
            let htmlContent = '';
            let textContent = '';
            
            if (contentElement) {
                // 保持HTML结构
                htmlContent = contentElement.innerHTML;
                // 同时获取纯文本作为备用
                textContent = contentElement.textContent || contentElement.innerText || '';
            } else {
                // 如果没有找到特定内容区域，获取整个元素
                htmlContent = element.innerHTML;
                textContent = element.textContent || element.innerText || '';
            }
            
            // 清理文本内容（保留换行，只去除多余空格）
            textContent = textContent.trim().replace(/[ \t]+/g, ' ');
            
            if (textContent) {
                messages.push({
                    index: index + 1,
                    messageId: messageId,
                    authorRole: authorRole || 'unknown',
                    htmlContent: htmlContent,
                    textContent: textContent,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // 返回JSON格式的数据
        return {
            metadata: {
                totalMessages: messages.length,
                exportTime: new Date().toISOString(),
                source: 'ChatGPT Web Interface',
                version: '1.0'
            },
            messages: messages
        };
    }



    // 复制到剪贴板
    async function copyToClipboard(content) {
        let textToCopy = '';
        
        if (typeof content === 'string') {
            textToCopy = content;
        } else if (content.innerHTML) {
            textToCopy = content.innerHTML;
        } else if (content.textContent || content.innerText) {
            textToCopy = content.textContent || content.innerText || '';
        } else if (typeof content === 'object') {
            // 如果是对象（如JSON数据），转换为格式化的JSON字符串
            textToCopy = JSON.stringify(content, null, 2);
        } else {
            textToCopy = String(content);
        }
        
        if (navigator.clipboard && window.isSecureContext) {
            // 使用现代 Clipboard API
            await navigator.clipboard.writeText(textToCopy);
        } else {
            // 降级到传统方法
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
            } catch (err) {
                throw new Error('复制失败: ' + err.message);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    // 初始化
    function init() {
        // 等待页面加载完成后创建按钮
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createParseButton);
        } else {
            createParseButton();
        }

        // 监听页面变化，确保按钮始终存在
        const observer = new MutationObserver(() => {
            if (!document.getElementById('chatgpt-parse-btn')) {
                createParseButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动脚本
    init();
})();
