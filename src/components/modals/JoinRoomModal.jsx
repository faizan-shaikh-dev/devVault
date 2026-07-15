"use client";

import { useState, useEffect } from "react";
import { useRoom } from "@/context/RoomContext";
import { Lock } from "lucide-react";

export default function JoinRoomModal() {
  const { joinModalRoom, setJoinModalRoom, joinRoom } = useRoom();
  const [password, setPassword] = useState("");

  // reset password when modal opens/closes
  useEffect(() => {
    if (!joinModalRoom) setPassword("");
  }, [joinModalRoom]);

  if (!joinModalRoom) return null;

  const handleJoin = async () => {
    await joinRoom(joinModalRoom.roomId, password);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center transition-colors duration-200"
      onClick={() => setJoinModalRoom(null)} // 👈 window click
    >
      <div
        className="bg-bg-secondary border border-border-custom text-text-primary w-80 p-5 rounded space-y-4"
        onClick={(e) => e.stopPropagation()} // 🚨 KEY FIX
      >
        <div className="flex items-center gap-2 text-indigo-400">
          <Lock size={18} />
          <h2 className="font-semibold">Join Room</h2>
        </div>

        <p className="text-sm text-text-secondary">
          Enter password for
          <span className="font-semibold text-text-primary">
            {" "}
            {joinModalRoom.roomName}
          </span>
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Room password"
          className="w-full p-2 bg-bg-input text-text-primary border border-border-custom rounded outline-none focus:ring-2 focus:ring-indigo-500/60"
        />

        <div className="flex gap-2">
          <button
            onClick={handleJoin}
            disabled={!password.trim()}
            className="flex-1 bg-indigo-600 py-2 rounded disabled:opacity-50 text-white cursor-pointer hover:bg-indigo-700"
          >
            Join
          </button>

          <button
            onClick={() => setJoinModalRoom(null)}
            className="flex-1 bg-bg-button-cancel text-text-primary py-2 rounded cursor-pointer hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
