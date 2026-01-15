"use client";

import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Trash2 } from "lucide-react";

export default function DeleteRoomModal() {
  const { deleteModalRoom, setDeleteModalRoom, deleteRoom } = useRoom();
  const [password, setPassword] = useState("");

  if (!deleteModalRoom) return null;

  const handleDelete = async () => {
    await deleteRoom(deleteModalRoom.roomId, password);
    setPassword("");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={() => {
        setDeleteModalRoom(null);
        setPassword("");
      }} // 👈 window click
    >
      <div
        className="bg-zinc-900 w-80 p-5 rounded space-y-4"
        onClick={(e) => e.stopPropagation()} // 🚨 KEY FIX
      >
        <div className="flex items-center gap-2 text-red-400">
          <Trash2 size={18} />
          <h2 className="font-semibold">Delete Room</h2>
        </div>

        <p className="text-sm text-zinc-400">
          Are you sure you want to delete
          <span className="font-semibold text-white">
            {" "}
            {deleteModalRoom.roomName}
          </span>
          ?
        </p>

        {deleteModalRoom.hasPassword && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Room password"
            className="w-full p-2 bg-zinc-800 rounded"
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 py-2 rounded"
          >
            Delete
          </button>

          <button
            onClick={() => {
              setDeleteModalRoom(null);
              setPassword("");
            }}
            className="flex-1 bg-zinc-700 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
