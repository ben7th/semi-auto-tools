// ==UserScript==
// @name         ChatGPT 对话 Authorization 获取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取 ChatGPT 对话页面的 authorization header 信息
// @author       You
// @match        https://chatgpt.com/c/*
// @run-at       document-start
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // 存储获取到的 authorization 信息
    let authorizationHeader = null;
    
    // 创建复制按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = '复制 Authorization';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#0d8a6f';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#10a37f';
        });
        
        button.addEventListener('click', () => {
            if (authorizationHeader) {
                GM_setClipboard(authorizationHeader);
                button.textContent = '已复制！';
                button.style.background = '#28a745';
                setTimeout(() => {
                    button.textContent = '复制 Authorization';
                    button.style.background = '#10a37f';
                }, 2000);
            } else {
                button.textContent = '未获取到 Authorization';
                button.style.background = '#dc3545';
                setTimeout(() => {
                    button.textContent = '复制 Authorization';
                    button.style.background = '#10a37f';
                }, 2000);
            }
        });
        
        return button;
    }
    
    // 拦截 XMLHttpRequest 请求
    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(...args) {
            if (this._url && this._url.includes('/backend-api/conversation/')) {
                console.log('拦截到 XHR 请求:', this._url);
                
                // 监听请求头 - 在发送前检查
                const originalSetRequestHeader = this.setRequestHeader;
                this.setRequestHeader = function(name, value) {
                    console.log('设置请求头:', name, value);
                    if (name.toLowerCase() === 'authorization') {
                        authorizationHeader = value;
                        console.log('从 XHR 请求头获取到 Authorization:', value);
                    }
                    return originalSetRequestHeader.apply(this, [name, value]);
                };
                
                // 监听响应头
                this.addEventListener('readystatechange', () => {
                    if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                        console.log('XHR 响应头已接收');
                        // 尝试获取所有响应头
                        const allHeaders = this.getAllResponseHeaders();
                        console.log('所有响应头:', allHeaders);
                        
                        // 检查常见的 authorization 相关 header
                        const authHeaders = ['authorization', 'Authorization', 'AUTHORIZATION'];
                        for (const headerName of authHeaders) {
                            try {
                                const value = this.getResponseHeader(headerName);
                                if (value) {
                                    authorizationHeader = value;
                                    console.log('从 XHR 响应头获取到 Authorization:', value);
                                    break;
                                }
                            } catch (e) {
                                console.log('无法获取响应头:', headerName, e);
                            }
                        }
                    }
                });
            }
            return originalSend.apply(this, args);
        };
    }
    
    // 拦截 fetch 请求
    function interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = function(input, init) {
            const url = typeof input === 'string' ? input : input.url;
            
            if (url && url.includes('/backend-api/conversation/')) {
                console.log('拦截到 Fetch 请求:', url);
                
                // 检查请求头中的 authorization
                if (init && init.headers) {
                    console.log('Fetch 请求配置:', init);
                    
                    // 处理 Headers 对象
                    if (init.headers instanceof Headers) {
                        const authHeader = init.headers.get('authorization') || init.headers.get('Authorization');
                        if (authHeader) {
                            authorizationHeader = authHeader;
                            console.log('从 Fetch 请求头获取到 Authorization:', authHeader);
                        }
                    }
                    // 处理普通对象
                    else if (typeof init.headers === 'object') {
                        const authHeader = init.headers.authorization || init.headers.Authorization;
                        if (authHeader) {
                            authorizationHeader = authHeader;
                            console.log('从 Fetch 请求头对象获取到 Authorization:', authHeader);
                        }
                    }
                }
                
                // 监听响应
                return originalFetch(input, init).then(response => {
                    console.log('Fetch 响应状态:', response.status);
                    
                    // 尝试获取响应头中的 authorization
                    const authHeader = response.headers.get('authorization') || response.headers.get('Authorization');
                    if (authHeader) {
                        authorizationHeader = authHeader;
                        console.log('从 Fetch 响应头获取到 Authorization:', authHeader);
                    }
                    
                    // 克隆响应以便检查
                    const clonedResponse = response.clone();
                    clonedResponse.text().then(text => {
                        console.log('响应内容长度:', text.length);
                        // 检查响应体中是否包含 authorization 信息
                        if (text.includes('authorization') || text.includes('Authorization')) {
                            console.log('响应体中包含 authorization 相关信息');
                        }
                    }).catch(e => console.log('无法读取响应体:', e));
                    
                    return response;
                }).catch(error => {
                    console.log('Fetch 请求失败:', error);
                    return Promise.reject(error);
                });
            }
            
            return originalFetch(input, init);
        };
    }
    
    // 添加额外的监听方法
    function addExtraListeners() {
        // 监听所有网络请求
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'resource' && entry.name.includes('/backend-api/conversation/')) {
                        console.log('检测到资源请求:', entry.name);
                    }
                });
            });
            observer.observe({ entryTypes: ['resource'] });
        }
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            console.log('页面可见性变化:', document.visibilityState);
        });
        
        // 监听页面焦点变化
        window.addEventListener('focus', () => {
            console.log('页面获得焦点');
        });
        
        // 监听 URL 变化（SPA 路由）
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                console.log('URL 变化:', currentUrl);
                // 重新检查 authorization
                if (authorizationHeader) {
                    console.log('当前保存的 Authorization:', authorizationHeader);
                }
            }
        }, 1000);
    }
    
    // 主函数
    function main() {
        // 设置拦截器
        interceptXHR();
        interceptFetch();
        addExtraListeners(); // 添加额外的监听器
        
        // 等待页面加载完成后添加复制按钮
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(createCopyButton());
            });
        } else {
            document.body.appendChild(createCopyButton());
        }
        
        // 监听动态加载的内容
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 检查是否有新的 script 标签或其他可能触发请求的元素
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'SCRIPT' || node.tagName === 'IMG') {
                                // 这些元素可能会触发新的请求
                                console.log('检测到新元素:', node.tagName);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('ChatGPT Authorization 获取器已启动');
        console.log('当前页面 URL:', window.location.href);
        console.log('页面加载状态:', document.readyState);
    }
    
    // 启动脚本
    main();
})();

/*
 * ========================================
 * 脚本逻辑说明 - 便于调试和维护
 * ========================================
 * 
 * 【工作原理】
 * 1. 脚本在页面加载开始时就运行 (@run-at document-start)
 * 2. 重写 XMLHttpRequest.prototype.open 和 send 方法来拦截 XHR 请求
 * 3. 重写 window.fetch 方法来拦截 fetch 请求
 * 4. 监听包含 '/backend-api/conversation/' 的特定请求
 * 5. 从请求头或响应头中提取 authorization 信息
 * 6. 在页面右上角显示复制按钮
 * 7. 添加额外的监听器：PerformanceObserver、页面状态变化、URL 变化等
 * 
 * 【调试方法】
 * 1. 打开浏览器开发者工具的 Console 面板
 * 2. 查看以下日志信息：
 *    - "ChatGPT Authorization 获取器已启动"
 *    - "当前页面 URL: [URL]"
 *    - "页面加载状态: [状态]"
 *    - "拦截到 XHR 请求: [URL]"
 *    - "拦截到 Fetch 请求: [URL]"
 *    - "设置请求头: [名称] [值]"
 *    - "从 XHR 请求头获取到 Authorization: [值]"
 *    - "从 Fetch 请求头获取到 Authorization: [值]"
 *    - "XHR 响应头已接收"
 *    - "所有响应头: [内容]"
 *    - "Fetch 响应状态: [状态码]"
 *    - "响应内容长度: [长度]"
 *    - "检测到资源请求: [URL]"
 *    - "页面可见性变化: [状态]"
 *    - "URL 变化: [新URL]"
 * 
 * 【关键改进】
 * 1. 修复了 XHR 拦截中的 getRequestHeader 错误
 * 2. 添加了 setRequestHeader 拦截，在请求发送前获取 header
 * 3. 增强了 fetch 拦截，支持 Headers 对象和普通对象
 * 4. 添加了 PerformanceObserver 监听所有网络请求
 * 5. 增加了页面状态和 URL 变化监听
 * 6. 添加了响应体内容检查
 * 7. 提供了更详细的调试日志
 * 
 * 【可能的问题和解决方案】
 * 1. 如果获取不到 authorization：
 *    - 检查请求是否真的包含该 header
 *    - 确认 URL 匹配模式是否正确
 *    - 查看是否有其他请求方式未被拦截
 *    - 检查浏览器控制台的详细日志
 *    - 确认请求是否在脚本运行前就已发送
 * 
 * 2. 如果复制按钮不显示：
 *    - 检查页面是否完全加载
 *    - 确认 DOM 操作是否成功
 *    - 查看是否有 CSS 冲突
 * 
 * 3. 如果脚本不工作：
 *    - 确认 URL 匹配规则
 *    - 检查浏览器控制台是否有错误
 *    - 验证篡改猴是否启用
 *    - 检查 @run-at 设置是否正确
 * 
 * 【技术细节】
 * - 使用原型链重写确保最大兼容性
 * - MutationObserver 监听动态内容变化
 * - PerformanceObserver 监听网络请求
 * - GM_setClipboard 提供跨域剪贴板访问
 * - 事件委托和防抖处理避免性能问题
 * - 支持 Headers 对象和普通对象两种格式
 * 
 * 【测试建议】
 * 1. 在不同浏览器中测试
 * 2. 测试网络延迟情况下的表现
 * 3. 验证 SPA 路由切换后的功能
 * 4. 检查内存泄漏和性能影响
 * 5. 测试不同网络环境下的表现
 * 
 * 【更新日志】
 * v1.1 - 修复拦截逻辑，增强调试功能，添加多种监听方式
 * v1.0 - 初始版本，支持 XHR 和 fetch 拦截
 * 
 * ========================================
 */