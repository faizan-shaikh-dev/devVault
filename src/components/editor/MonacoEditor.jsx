import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useRoom } from "@/context/RoomContext";

export default function MonacoEditor() {
  const { code, saveCode } = useRoom();
  const editorRef = useRef(null);

  // Store editor instance on mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Sync state changes from socket/context into Monaco Editor imperatively
  useEffect(() => {
    if (editorRef.current) {
      const editorValue = editorRef.current.getValue();
      if (code !== editorValue) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      defaultLanguage="javascript"
      defaultValue={code}
      onMount={handleEditorDidMount}
      onChange={saveCode}
    />
  );
}
