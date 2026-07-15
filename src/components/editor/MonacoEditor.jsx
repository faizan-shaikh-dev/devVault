import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useRoom } from "@/context/RoomContext";

export default function MonacoEditor() {
  const { code, saveCode } = useRoom();
  const editorRef = useRef(null);
  const isRemoteChangeRef = useRef(false);

  // Store editor instance on mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Sync state changes from socket/context into Monaco Editor imperatively
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const editorValue = editor.getValue();
      if (code !== editorValue) {
        isRemoteChangeRef.current = true;
        const model = editor.getModel();
        if (model) {
          editor.executeEdits("remote-sync", [
            {
              range: model.getFullModelRange(),
              text: code,
              forceMoveMarkers: true,
            },
          ]);
        }
      }
    }
  }, [code]);

  const handleChange = (value) => {
    if (isRemoteChangeRef.current) {
      isRemoteChangeRef.current = false;
      return;
    }
    saveCode(value || "");
  };

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      defaultLanguage="javascript"
      defaultValue={code}
      onMount={handleEditorDidMount}
      onChange={handleChange}
    />
  );
}
