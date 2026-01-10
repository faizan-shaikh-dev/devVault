"use client";

import { MoreVertical, Trash2, Folder } from "lucide-react";
import { useRoom } from "@/context/RoomContext";
import { useState } from "react";

export default function RoomList() {
  const { rooms, openRoom, setDeleteModalRoom } = useRoom();
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
        <Folder className="w-4 h-4 text-zinc-400" />
        <span className="text-xs uppercase text-zinc-400">Rooms</span>
      </div>

      {rooms.map((room) => (
        <div
          key={room._id}
          className="relative flex items-center justify-between px-4 py-2 text-sm hover:bg-zinc-800"
        >
          <button
            onClick={() => openRoom(room)}
            className="truncate text-left hover:text-indigo-400"
          >
            {room.roomName}
          </button>

          <button
            onClick={() =>
              setOpenMenuId(openMenuId === room._id ? null : room._id)
            }
            className="text-zinc-400 hover:text-zinc-200"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {openMenuId === room._id && (
            <div className="absolute right-4 top-8 bg-zinc-800 rounded shadow-lg z-50">
              <button
                onClick={() => {
                  setDeleteModalRoom(room);
                  setOpenMenuId(null);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete room
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
