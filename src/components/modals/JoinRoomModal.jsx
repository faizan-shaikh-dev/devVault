"use client";

import { useEffect, useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Lock } from "lucide-react";

export default function JoinRoomModal() {
  const { joinModalRoom, joinRoom, setJoinModalRoom } = useRoom();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!joinModalRoom) {
      setPassword("");
    }
  }, [joinModalRoom]);

  if (!joinModalRoom) return null;

  const handleJoin = async () => {
    if (!password.trim()) return;

    try {
      setLoading(true);

      // ✅ FIXED: use roomId, NOT _id
      await joinRoom(joinModalRoom.roomId, password);

      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    setJoinModalRoom(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 w-80 p-5 rounded space-y-4">
        <div className="flex items-center gap-2 text-zinc-200">
          <Lock className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold">Enter room password</h2>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 rounded bg-zinc-800 text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/60"
        />

        <div className="flex gap-2">
          <button
            onClick={handleJoin}
            disabled={loading || !password.trim()}
            className="flex-1 py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Joining..." : "Join"}
          </button>

          <button
            onClick={handleCancel}
            className="flex-1 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
