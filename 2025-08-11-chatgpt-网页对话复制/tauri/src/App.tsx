import React, { useState, useEffect } from "react";
import { readTextFile, writeTextFile, exists } from "@tauri-apps/api/fs";
import { homeDir, join } from "@tauri-apps/api/path";
import "./App.css";

type RequestResult = {
  success: boolean;
  statusCode?: number;
  statusText?: string;
  jsonData?: string;
  error?: string;
};

function App() {
  const [chatUrl, setChatUrl] = useState("");
  const [authorization, setAuthorization] = useState("");
  const [fileStatus, setFileStatus] = useState("");
  const [statusOutput, setStatusOutput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 页面加载时初始化认证信息
  useEffect(() => {
    loadAuthorizationFromFile();
  }, []);

  // 从文件读取认证信息
  const loadAuthorizationFromFile = async () => {
    try {
      const home = await homeDir();
      const authFilePath = await join(home, "authorization.txt");
      
      if (await exists(authFilePath)) {
        const content = await readTextFile(authFilePath);
        if (content.trim()) {
          setAuthorization(content.trim());
          setFileStatus("✅ 已从 authorization.txt 文件读取认证信息");
        } else {
          setFileStatus("⚠️ authorization.txt 文件存在但内容为空");
        }
      } else {
        setFileStatus("📝 authorization.txt 文件不存在，请在界面中输入认证信息");
      }
    } catch (error) {
      setFileStatus(`❌ 读取 authorization.txt 文件失败: ${error}`);
    }
  };

  // 保存认证信息到文件
  const saveAuthorizationToFile = async () => {
    try {
      const home = await homeDir();
      const authFilePath = await join(home, "authorization.txt");
      await writeTextFile(authFilePath, authorization);
      setFileStatus("✅ 认证信息已保存到 authorization.txt 文件");
    } catch (error) {
      setFileStatus(`❌ 保存认证信息失败: ${error}`);
    }
  };

  // 发送请求（暂时是模拟的）
  const handleRequest = async () => {
    if (!chatUrl.trim()) {
      setStatusOutput("错误：请输入有效的聊天 URL");
      return;
    }

    setIsLoading(true);
    
    // 模拟请求延迟
    setTimeout(() => {
      // 这里暂时返回模拟数据，后续会实现真实的请求逻辑
      const mockResult: RequestResult = {
        success: true,
        statusCode: 200,
        statusText: "OK",
        jsonData: JSON.stringify({
          message: "这是模拟的响应数据",
          chatId: chatUrl.split("/").pop(),
          timestamp: new Date().toISOString()
        }, null, 2)
      };

      if (mockResult.success) {
        setStatusOutput(`✅ 请求成功！\n状态码: ${mockResult.statusCode} - ${mockResult.statusText}`);
        setJsonOutput(mockResult.jsonData || "");
      } else {
        setStatusOutput(`❌ 请求失败: ${mockResult.error}`);
        setJsonOutput("");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // 清空结果
  const clearResults = () => {
    setStatusOutput("");
    setJsonOutput("");
  };

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
                disabled={!authorization.trim()}
              >
                保存认证信息
              </button>
            </div>

            <button 
              onClick={handleRequest}
              className="request-btn"
              disabled={isLoading || !chatUrl.trim()}
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
}

export default App;
