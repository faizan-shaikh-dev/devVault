"use client";

import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Trash2 } from "lucide-react";

export default function DeleteRoomModal() {
  const { deleteModalRoom, setDeleteModalRoom, deleteRoom } = useRoom();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!deleteModalRoom) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteRoom(deleteModalRoom.roomId, password);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const hasPassword = deleteModalRoom.hasPassword !== undefined
    ? deleteModalRoom.hasPassword
    : (deleteModalRoom.password !== undefined && deleteModalRoom.password !== null && deleteModalRoom.password !== "");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center transition-colors duration-200"
      onClick={() => {
        setDeleteModalRoom(null);
        setPassword("");
      }} // 👈 window click
    >
      <div
        className="bg-bg-secondary border border-border-custom text-text-primary w-80 p-5 rounded space-y-4"
        onClick={(e) => e.stopPropagation()} // 🚨 KEY FIX
      >
        <div className="flex items-center gap-2 text-red-400">
          <Trash2 size={18} />
          <h2 className="font-semibold">Delete Room</h2>
        </div>

        <p className="text-sm text-text-secondary">
          Are you sure you want to delete
          <span className="font-semibold text-text-primary">
            {" "}
            {deleteModalRoom.roomName}
          </span>
          ?
        </p>

        {hasPassword && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Room password"
            className="w-full p-2 bg-bg-input text-text-primary border border-border-custom rounded outline-none focus:ring-2 focus:ring-red-500/60"
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`flex-1 bg-red-600 py-2 rounded text-white font-medium transition-all cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={() => {
              setDeleteModalRoom(null);
              setPassword("");
            }}
            className="flex-1 bg-bg-button-cancel text-text-primary py-2 rounded cursor-pointer hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
