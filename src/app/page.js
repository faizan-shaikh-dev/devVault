"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import Sidebar from "@/components/sidebar/Sidebar";
import EditorHeader from "@/components/editor/EditorHeader";
import MonacoEditor from "@/components/editor/MonacoEditor";
import { useRoom } from "@/context/RoomContext";

export default function Page() {
  const { activeRoom } = useRoom();

  useEffect(() => {
    const handleGlobalKey = (e) => {
      console.log("Global KeyDown Captured:", e.key, "Code:", e.code, "Target:", e.target.tagName);
      if (e.key.toLowerCase() === "c") {
        toast(`Key '${e.key}' detected on ${e.target.tagName}`, { icon: "⌨️" });
      }
    };
    window.addEventListener("keydown", handleGlobalKey, true);
    return () => window.removeEventListener("keydown", handleGlobalKey, true);
  }, []);

  return (
    <div className="h-screen flex bg-zinc-950 text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        {!activeRoom ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Select or create a room to start coding
          </div>
        ) : (
          <>
            <EditorHeader />
            <div className="flex-1">
              <MonacoEditor />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
