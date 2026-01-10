"use client";

import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Trash2 } from "lucide-react";

export default function DeleteRoomModal() {
  const {
    deleteModalRoom,
    deleteRoom,
    setDeleteModalRoom,
  } = useRoom();

  const [password, setPassword] = useState("");

  if (!deleteModalRoom) return null;

  const handleDelete = async () => {
    await deleteRoom(deleteModalRoom._id, password);
    setPassword("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 w-80 p-5 rounded space-y-4">
        
        <div className="flex items-center gap-2 text-red-400">
          <Trash2 className="w-4 h-4" />
          <h2 className="text-sm font-semibold">
            Delete room
          </h2>
        </div>

        <p className="text-xs text-zinc-400">
          Enter room password to confirm delete.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded outline-none focus:ring-2 focus:ring-red-500/60"
          placeholder="Password"
        />

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded transition"
          >
            Delete
          </button>

          <button
            onClick={() => setDeleteModalRoom(null)}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-2 rounded transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
