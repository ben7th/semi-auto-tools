import { useEffect, useState } from "react";
import styled from "styled-components";

type IAuthorizationDataViewProps = {
  onAuthContentChange: (content: string) => void;
}

/** 显示 authorization.txt 文件内容 */
export const AuthorizationDataView: React.FC<IAuthorizationDataViewProps> = ({ onAuthContentChange }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authContent, setAuthContent] = useState<string>("");
  const [authExists, setAuthExists] = useState<boolean>(false);

  useEffect(() => {
    // 组件加载时读取 authorization.txt 文件
    const readAuthFile = async () => {
      try {
        setLoading(true);
        const result = await window.electronAPI.readAuthorizationFileContent();
        setAuthExists(result.exists);
        setAuthContent(result.content);
        onAuthContentChange(result.content);
      } catch (error) {
        console.error("读取文件失败:", error);
        setAuthExists(false);
        setAuthContent("");
      } finally {
        setLoading(false);
      }
    };

    readAuthFile();
  }, []);

  return <_AuthSection>
    <h3>授权文件状态</h3>
    {loading ? (
      <p>正在检查文件...</p>
    ) : authExists ? (
      <div>
        <p style={{ color: "green" }}>✅ authorization.txt 文件存在</p>
        <_AuthContent>
          <strong>文件内容:</strong>
          <pre>{authContent}</pre>
        </_AuthContent>
      </div>
    ) : (
      <p style={{ color: "red" }}>❌ authorization.txt 文件不存在</p>
    )}
  </_AuthSection>
}

const _AuthContent = styled.div`
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 12px;
    color: #333;
    background-color: #fff;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
  }
`;

const _AuthSection = styled.div`
`;