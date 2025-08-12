// DOM 元素引用
const chatUrlInput = document.getElementById('chat-url');
const authorizationInput = document.getElementById('authorization');
const fileStatusSpan = document.getElementById('file-status');
const saveAuthBtn = document.getElementById('save-auth-btn');
const requestBtn = document.getElementById('request-btn');
const statusOutput = document.getElementById('status-output');
const jsonOutput = document.getElementById('json-output');
const clearBtn = document.getElementById('clear-btn');

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadAuthorizationFromFile();
  setupEventListeners();
  updateButtonStates();
});

// 设置事件监听器
function setupEventListeners() {
  // 输入框变化时更新按钮状态
  chatUrlInput.addEventListener('input', updateButtonStates);
  authorizationInput.addEventListener('input', updateButtonStates);
  
  // 保存认证信息按钮
  saveAuthBtn.addEventListener('click', saveAuthorizationToFile);
  
  // 发送请求按钮
  requestBtn.addEventListener('click', handleRequest);
  
  // 清空结果按钮
  clearBtn.addEventListener('click', clearResults);
}

// 从文件读取认证信息
async function loadAuthorizationFromFile() {
  try {
    fileStatusSpan.textContent = '📝 正在检查认证文件...';
    
    const result = await window.electronAPI.readAuthFile();
    
    if (result.success) {
      authorizationInput.value = result.content;
      fileStatusSpan.textContent = '✅ 已从 authorization.txt 文件读取认证信息';
    } else {
      fileStatusSpan.textContent = '📝 authorization.txt 文件不存在，请在界面中输入认证信息';
    }
  } catch (error) {
    fileStatusSpan.textContent = `❌ 读取认证文件失败: ${error.message}`;
  }
}

// 保存认证信息到文件
async function saveAuthorizationToFile() {
  try {
    const content = authorizationInput.value.trim();
    if (!content) {
      fileStatusSpan.textContent = '⚠️ 认证信息不能为空';
      return;
    }
    
    saveAuthBtn.disabled = true;
    saveAuthBtn.textContent = '保存中...';
    
    const result = await window.electronAPI.writeAuthFile(content);
    
    if (result.success) {
      fileStatusSpan.textContent = '✅ 认证信息已保存到 authorization.txt 文件';
    } else {
      fileStatusSpan.textContent = `❌ 保存认证信息失败: ${result.error}`;
    }
  } catch (error) {
    fileStatusSpan.textContent = `❌ 保存认证信息失败: ${error.message}`;
  } finally {
    saveAuthBtn.disabled = false;
    saveAuthBtn.textContent = '保存认证信息';
  }
}

// 处理请求
async function handleRequest() {
  const chatUrl = chatUrlInput.value.trim();
  const authorization = authorizationInput.value.trim();
  
  if (!chatUrl) {
    setStatusOutput('❌ 错误：请输入有效的聊天 URL');
    return;
  }
  
  try {
    // 禁用按钮，显示加载状态
    requestBtn.disabled = true;
    requestBtn.textContent = '⏳ 请求中...';
    
    // 清空之前的结果
    clearResults();
    
    // 发送请求
    const result = await window.electronAPI.requestChatInfo(chatUrl, authorization);
    
    if (result.success) {
      // 请求成功
      const statusText = `✅ 请求成功！\n状态码: ${result.statusCode} - ${result.statusText}`;
      setStatusOutput(statusText);
      
      // 格式化 JSON 数据
      try {
        const formattedJson = JSON.stringify(result.data, null, 2);
        setJsonOutput(formattedJson);
      } catch (error) {
        setJsonOutput(`数据格式化失败: ${error.message}\n\n原始数据: ${JSON.stringify(result.data)}`);
      }
    } else {
      // 请求失败
      setStatusOutput(`❌ 请求失败: ${result.error}`);
      if (result.statusCode) {
        setStatusOutput(`❌ 请求失败: ${result.error}\n状态码: ${result.statusCode}`);
      }
    }
  } catch (error) {
    setStatusOutput(`❌ 程序执行出错: ${error.message}`);
  } finally {
    // 恢复按钮状态
    requestBtn.disabled = false;
    requestBtn.textContent = '🚀 发送请求';
  }
}

// 清空结果
function clearResults() {
  statusOutput.value = '';
  jsonOutput.value = '';
}

// 设置状态输出
function setStatusOutput(text) {
  statusOutput.value = text;
}

// 设置 JSON 输出
function setJsonOutput(text) {
  jsonOutput.value = text;
}

// 更新按钮状态
function updateButtonStates() {
  const hasChatUrl = chatUrlInput.value.trim().length > 0;
  const hasAuth = authorizationInput.value.trim().length > 0;
  
  // 请求按钮：需要聊天 URL
  requestBtn.disabled = !hasChatUrl;
  
  // 保存按钮：需要认证信息
  saveAuthBtn.disabled = !hasAuth;
}
