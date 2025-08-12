import React, { useState, useEffect } from "react";
import { RequestResult } from "./types";
import "./styles.css";

const App: React.FC = () => {
  const [chatUrl, setChatUrl] = useState<string>("");
  const [authorization, setAuthorization] = useState<string>("");
  const [fileStatus, setFileStatus] = useState<string>("");
  const [statusOutput, setStatusOutput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 页面加载时初始化认证信息
  useEffect(() => {
    loadAuthorizationFromFile();
  }, []);

  // 从文件读取认证信息
  const loadAuthorizationFromFile = async (): Promise<void> => {
    try {
      setFileStatus("📝 正在检查认证文件...");
      
      const result = await window.electronAPI.readAuthFile();
      
      if (result.success && result.content) {
        setAuthorization(result.content);
        setFileStatus("✅ 已从 authorization.txt 文件读取认证信息");
      } else {
        setFileStatus("📝 authorization.txt 文件不存在，请在界面中输入认证信息");
      }
    } catch (error) {
      setFileStatus(`❌ 读取认证文件失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // 保存认证信息到文件
  const saveAuthorizationToFile = async (): Promise<void> => {
    try {
      const content = authorization.trim();
      if (!content) {
        setFileStatus("⚠️ 认证信息不能为空");
        return;
      }
      
      const result = await window.electronAPI.writeAuthFile(content);
      
      if (result.success) {
        setFileStatus("✅ 认证信息已保存到 authorization.txt 文件");
      } else {
        setFileStatus(`❌ 保存认证信息失败: ${result.error}`);
      }
    } catch (error) {
      setFileStatus(`❌ 保存认证信息失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // 发送请求
  const handleRequest = async (): Promise<void> => {
    if (!chatUrl.trim()) {
      setStatusOutput("❌ 错误：请输入有效的聊天 URL");
      return;
    }

    setIsLoading(true);
    
    try {
      // 清空之前的结果
      clearResults();
      
      // 发送请求
      const result: RequestResult = await window.electronAPI.requestChatInfo(chatUrl, authorization);
      
      if (result.success) {
        // 请求成功
        const statusText = `✅ 请求成功！\n状态码: ${result.statusCode} - ${result.statusText}`;
        setStatusOutput(statusText);
        
        // 格式化 JSON 数据
        try {
          const formattedJson = JSON.stringify(result.data, null, 2);
          setJsonOutput(formattedJson);
        } catch (error) {
          setJsonOutput(`数据格式化失败: ${error instanceof Error ? error.message : String(error)}\n\n原始数据: ${JSON.stringify(result.data)}`);
        }
      } else {
        // 请求失败
        if (result.statusCode) {
          setStatusOutput(`❌ 请求失败: ${result.error}\n状态码: ${result.statusCode}`);
        } else {
          setStatusOutput(`❌ 请求失败: ${result.error}`);
        }
      }
    } catch (error) {
      setStatusOutput(`❌ 程序执行出错: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 清空结果
  const clearResults = (): void => {
    setStatusOutput("");
    setJsonOutput("");
  };

  // 更新按钮状态
  const updateButtonStates = (): { canRequest: boolean; canSave: boolean } => {
    const hasChatUrl = chatUrl.trim().length > 0;
    const hasAuth = authorization.trim().length > 0;
    
    return {
      canRequest: hasChatUrl,
      canSave: hasAuth
    };
  };

  const { canRequest, canSave } = updateButtonStates();

  return (
    <div className="app">
      <div className="header">
        <h1>🤖 ChatGPT 对话信息获取器</h1>
        <p>输入 ChatGPT 对话 URL 和认证信息，获取对话的 JSON 数据</p>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <div className="section">
            <h2>📝 输入参数</h2>
            
            <div className="input-group">
              <label htmlFor="chat-url">ChatGPT 对话 URL</label>
              <textarea
                id="chat-url"
                value={chatUrl}
                onChange={(e) => setChatUrl(e.target.value)}
                placeholder="例如: https://chatgpt.com/c/689a176f-6e58-8326-9aa2-139893112a85"
                rows={2}
              />
            </div>

            <div className="input-group">
              <label htmlFor="authorization">认证信息 (可选)</label>
              <textarea
                id="authorization"
                value={authorization}
                onChange={(e) => setAuthorization(e.target.value)}
                placeholder="Bearer token 或留空"
                rows={3}
              />
            </div>

            <div className="file-status">
              <span>{fileStatus}</span>
              <button 
                onClick={saveAuthorizationToFile}
                className="save-btn"
                disabled={!canSave}
              >
                保存认证信息
              </button>
            </div>

            <button 
              onClick={handleRequest}
              className="request-btn"
              disabled={!canRequest || isLoading}
            >
              {isLoading ? "⏳ 请求中..." : "🚀 发送请求"}
            </button>

            <div className="example">
              <h3>💡 示例</h3>
              <p><strong>URL:</strong> <code>https://chatgpt.com/c/689a176f-6e58-8326-9aa2-139893112a85</code></p>
              <p><strong>认证:</strong> <code>Bearer eyJhbGciOiJSUzI1NiIs...</code></p>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="section">
            <h2>📊 请求结果</h2>
            
            <div className="output-group">
              <label htmlFor="status-output">状态信息</label>
              <textarea
                id="status-output"
                value={statusOutput}
                readOnly
                rows={5}
                placeholder="状态信息将显示在这里..."
              />
            </div>

            <div className="output-group">
              <label htmlFor="json-output">JSON 数据</label>
              <textarea
                id="json-output"
                value={jsonOutput}
                readOnly
                rows={15}
                placeholder="JSON 数据将显示在这里..."
              />
            </div>

            <button onClick={clearResults} className="clear-btn">
              🗑️ 清空结果
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
