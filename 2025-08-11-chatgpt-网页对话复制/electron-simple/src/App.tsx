import React, { useState } from "react";
import styled from "styled-components";
import { AuthorizationDataView } from "./components/AuthorizationDataView";

type AppProps = {};

// 声明全局类型
declare global {
  interface Window {
    electronAPI: {
      platform: string;
      version: string;
      readAuthorizationFileContent: () => Promise<{
        exists: boolean;
        content: string;
        error?: string;
      }>;
    };
  }
}

const App: React.FC<AppProps> = () => {
  const [count, setCount] = useState(0);

  return (
    <_App>
      <h1>🚀 Electron + React + TypeScript</h1>
      <p>这是一个简洁的 Electron 应用示例</p>
      
      <_ButtonBox>
        <_Button onClick={() => setCount(count + 1)}>
          点击次数: {count}
        </_Button>
      </_ButtonBox>

      <AuthorizationDataView />
    </_App>
  );
};

export default App;

const _App = styled.div`
`;

const _ButtonBox = styled.div`
  margin: 20px 0;
`;

const _Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;