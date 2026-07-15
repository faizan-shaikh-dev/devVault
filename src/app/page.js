"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import EditorHeader from "@/components/editor/EditorHeader";
import MonacoEditor from "@/components/editor/MonacoEditor";
import { useRoom } from "@/context/RoomContext";

export default function Page() {
  const { activeRoom } = useRoom();

  return (
    <div className="h-screen flex bg-bg-primary text-text-primary overflow-hidden transition-colors duration-200">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        {!activeRoom ? (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
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
