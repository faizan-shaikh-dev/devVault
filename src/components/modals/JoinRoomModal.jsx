"use client";

import { useEffect, useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Lock } from "lucide-react";

export default function JoinRoomModal() {
  const { joinModalRoom, joinRoom, setJoinModalRoom } = useRoom();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 IMPORTANT: modal open / close par password clear
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
      await joinRoom(joinModalRoom._id, password);

      // ✅ clear after join attempt
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword(""); // ✅ clear input
    setJoinModalRoom(null); // close modal
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 w-80 p-5 rounded space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-zinc-200">
          <Lock className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold">Enter room password</h2>
        </div>

        {/* Input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="
            w-full p-2 rounded
            bg-zinc-800 text-zinc-200
            outline-none
            focus:ring-2 focus:ring-indigo-500/60
          "
        />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleJoin}
            disabled={loading || !password.trim()}
            className="
              flex-1 py-2 rounded
              bg-indigo-600 text-white
              hover:bg-indigo-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
            "
          >
            {loading ? "Joining..." : "Join"}
          </button>

          <button
            onClick={handleCancel}
            className="
              flex-1 py-2 rounded
              bg-zinc-700
              hover:bg-zinc-600
              transition
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
