import React, { useState } from "react";
import styled from "styled-components";

type AppProps = {};

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
      
      <_Description>
        <h3>技术栈</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>✅ Electron - 跨平台桌面应用框架</li>
          <li>✅ React 19 - 用户界面库</li>
          <li>✅ TypeScript - 类型安全的 JavaScript</li>
          <li>✅ Vite - 快速构建工具</li>
        </ul>
      </_Description>
    </_App>
  );
};

export default App;

const _App = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
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

const _Description = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
`