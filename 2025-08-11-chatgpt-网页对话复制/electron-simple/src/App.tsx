import React, { useState } from "react";

type AppProps = {};

const App: React.FC<AppProps> = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      textAlign: "center" 
    }}>
      <h1>🚀 Electron + React + TypeScript</h1>
      <p>这是一个简洁的 Electron 应用示例</p>
      
      <div style={{ margin: "20px 0" }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          点击次数: {count}
        </button>
      </div>
      
      <div style={{ 
        marginTop: "40px", 
        padding: "20px", 
        backgroundColor: "#f8f9fa",
        borderRadius: "10px"
      }}>
        <h3>技术栈</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>✅ Electron - 跨平台桌面应用框架</li>
          <li>✅ React 19 - 用户界面库</li>
          <li>✅ TypeScript - 类型安全的 JavaScript</li>
          <li>✅ Vite - 快速构建工具</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
