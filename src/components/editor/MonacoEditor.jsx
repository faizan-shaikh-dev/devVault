import Editor from "@monaco-editor/react";
import { useRoom } from "@/context/RoomContext";

export default function MonacoEditor() {
  const { code, saveCode } = useRoom();

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      defaultLanguage="javascript"
      value={code}
      onChange={saveCode}
    />
  );
}
