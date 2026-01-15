"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Trash2, Folder } from "lucide-react";
import { useRoom } from "@/context/RoomContext";

export default function RoomList() {
  const { rooms, openRoom, setDeleteModalRoom } = useRoom();
  const [menuRoom, setMenuRoom] = useState(null);

  // 🔥 CLOSE MENU ON WINDOW CLICK
  useEffect(() => {
    const closeMenu = () => setMenuRoom(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2 z-10">
        <Folder className="w-4 h-4 text-zinc-400" />
        <span className="text-xs uppercase text-zinc-400">Rooms</span>
      </div>

      {rooms.map((room) => (
        <div
          key={room.roomId}
          className="flex items-center justify-between px-4 py-2 text-sm hover:bg-zinc-800"
        >
          {/* Room name */}
          <button
            onClick={() => openRoom(room)}
            className="truncate text-left hover:text-indigo-400"
          >
            {room.roomName}
          </button>

          {/* Three dots + dropdown */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // 🚨 IMPORTANT
          >
            <button
              onClick={() =>
                setMenuRoom(
                  menuRoom?.roomId === room.roomId ? null : room
                )
              }
              className="text-zinc-400 hover:text-zinc-200"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuRoom?.roomId === room.roomId && (
              <div
                className="
                  absolute top-full right-0 mt-2
                  bg-zinc-800 rounded shadow-lg
                  z-50 min-w-[140px]
                "
              >
                <button
                  onClick={() => {
                    setDeleteModalRoom(room);
                    setMenuRoom(null);
                  }}
                  className="
                    flex items-center gap-2
                    px-3 py-2 text-sm
                    text-red-400 hover:bg-zinc-700
                    w-full
                  "
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
