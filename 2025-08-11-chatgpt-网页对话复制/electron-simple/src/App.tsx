import React, { useState } from "react";
import { AuthorizationDataView } from "./components/AuthorizationDataView";
import { UIFlex } from "./ui/ui-exports";
import { requestChatGPT } from "./api/requestChatGPT";

const App: React.FC = () => {
  const [gptChatUrl, setGptChatUrl] = useState<string>("https://chatgpt.com/c/689a176f-6e58-8326-9aa2-139893112a85");
  const [authContent, setAuthContent] = useState<string>("");

  return (
    <UIFlex>
      <UIFlex>
        <div>GPT 聊天 URL</div>
        <input type="text" value={gptChatUrl} onChange={(e) => setGptChatUrl(e.target.value)} />
      </UIFlex>
      <AuthorizationDataView onAuthContentChange={setAuthContent} />
      <div>授权文件内容: {authContent}</div>
      <button onClick={() => requestChatGPT(gptChatUrl, authContent)}>获取对话信息</button>
    </UIFlex>
  );
};

export default App;