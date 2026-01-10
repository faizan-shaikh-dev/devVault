import { LogOut, Hash } from "lucide-react";
import { useRoom } from "@/context/RoomContext";

export default function EditorHeader() {
  const { activeRoom, leaveRoom } = useRoom();

  if (!activeRoom) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
      
      {/* Room Name */}
      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <Hash className="w-4 h-4 text-indigo-400" />
        <span className="font-medium truncate max-w-60">
          {activeRoom.roomName}
        </span>
      </div>

      {/* Leave Button + Tooltip */}
      <div className="relative group">
        <button
          onClick={leaveRoom}
          className="
            flex items-center
            text-red-400
            hover:text-red-500
            transition
            cursor-pointer
          "
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* Tooltip */}
        <span
          className="
            absolute right-0 top-full mt-2
            scale-0 group-hover:scale-100
            bg-zinc-200 text-red-800
            text-xs px-2 py-1 rounded
            whitespace-nowrap
            transition-transform
            origin-top-right
            z-50
            pointer-events-none
          "
        >
          Leave room
        </span>
      </div>
    </div>
  );
}
