"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Trash2, Folder } from "lucide-react";
import { useRoom } from "@/context/RoomContext";

export default function RoomList() {
  const { rooms, openRoom, setDeleteModalRoom } = useRoom();
  const [menuRoom, setMenuRoom] = useState(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setMenuRoom(null);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2 z-10">
        <Folder className="w-4 h-4 text-zinc-400" />
        <span className="text-xs uppercase text-zinc-400">Rooms</span>
      </div>

      {/* Room List */}
      {rooms && rooms.length > 0 ? (
        rooms.map((room) => (
          <div
            key={room.roomId}
            className="flex items-center justify-between px-4 py-2 text-sm hover:bg-zinc-800"
          >
            <button
              onClick={() => openRoom(room)}
              className="truncate text-left hover:text-indigo-400 w-full"
            >
              {room.roomName}
            </button>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuRoom(menuRoom?.roomId === room.roomId ? null : room);
                }}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuRoom?.roomId === room.roomId && (
                <div className="absolute top-full right-0 mt-2 bg-zinc-800 rounded shadow-lg z-50 min-w-36">
                  <button
                    onClick={() => {
                      setDeleteModalRoom(room);
                      setMenuRoom(null);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 w-full"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center text-sm mt-20">
          No rooms found
        </p>
      )}
    </div>
  );
}
