import { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useRoom } from "@/context/RoomContext";
import { useTheme } from "@/context/ThemeContext";

export default function MonacoEditor() {
  const { code, saveCode } = useRoom();
  const { theme } = useTheme();
  const editorRef = useRef(null);
  const containerRef = useRef(null);
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

  // Prevent keydown events for 'c' / 'C' key from bubbling up to document/window,
  // which stops the Vercel Toolbar from intercepting it and opening comment mode.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event) => {
      if (
        (event.key === "c" || event.key === "C") &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.stopPropagation();
      }
    };

    container.addEventListener("keydown", handleKeyDown, { capture: false });
    return () => {
      container.removeEventListener("keydown", handleKeyDown, { capture: false });
    };
  }, []);

  const handleChange = (value) => {
    if (isRemoteChangeRef.current) {
      isRemoteChangeRef.current = false;
      return;
    }
    saveCode(value || "");
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      <Editor
        height="100%"
        theme={theme === "dark" ? "vs-dark" : "light"}
        defaultLanguage="javascript"
        defaultValue={code}
        onMount={handleEditorDidMount}
        onChange={handleChange}
      />
    </div>
  );
}
