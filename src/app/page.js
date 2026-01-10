"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import EditorHeader from "@/components/editor/EditorHeader";
import MonacoEditor from "@/components/editor/MonacoEditor";
import JoinRoomModal from "@/components/modals/JoinRoomModal";
import DeleteRoomModal from "@/components/modals/DeleteRoomModal";
import { useRoom } from "@/context/RoomContext";

export default function Page() {
  const { activeRoom } = useRoom();

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

      <JoinRoomModal />
      <DeleteRoomModal />
    </div>
  );
}
