import React, { useState } from "react";
import { AuthorizationDataView } from "./components/AuthorizationDataView";
import { UIFlex } from "./ui/ui-exports";
import { requestChatGPT } from "./api/requestChatGPT";

const App: React.FC = () => {
  const [gptChatUrl, setGptChatUrl] = useState<string>("https://chatgpt.com/backend-api/conversation/687b4060-ce98-8011-afb1-70e3af4a6146");
  const [authContent, setAuthContent] = useState<string>("");

  // 测试 HTTP 请求功能
  const testHttpRequest = async () => {
    try {
      console.log("开始测试 HTTP 请求...");
      const response = await window.electronAPI.sendHttpRequest({
        url: "https://httpbin.org/get",
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });
      
      if (!response.success) {
        console.error("请求失败:", response.error);
      } else {
        console.log("请求成功:", response);
      }
    } catch (error) {
      console.error("请求异常:", error);
    }
  };

  return (
    <UIFlex>
      <UIFlex>
        <div>GPT 聊天 URL</div>
        <input type="text" value={gptChatUrl} onChange={(e) => setGptChatUrl(e.target.value)} />
      </UIFlex>
      <AuthorizationDataView onAuthContentChange={setAuthContent} />
      <div>授权文件内容: {authContent}</div>
      <button onClick={() => requestChatGPT(gptChatUrl, authContent)}>获取对话信息</button>
      <button onClick={testHttpRequest}>测试 HTTP 请求</button>
    </UIFlex>
  );
};

export default App;