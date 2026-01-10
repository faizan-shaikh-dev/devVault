import { useState } from "react";
import { Plus } from "lucide-react";
import { useRoom } from "@/context/RoomContext";

export default function CreateRoomForm() {
  const { createRoom } = useRoom();
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = async () => {
    if (!roomName.trim()) return;

    await createRoom({ roomName, password });
    setRoomName("");
    setPassword("");
  };

  return (
    <div className="p-4 space-y-3">
      <input
        value={roomName}
        placeholder="Room name"
        className="w-full p-2 rounded bg-zinc-800 text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/60 transition"
        onChange={(e) => setRoomName(e.target.value)}
      />

      <input
        value={password}
        type="password"
        placeholder="Password"
        className="w-full p-2 rounded bg-zinc-800 text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/60 transition"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleCreate}
        disabled={!roomName.trim()}
        className="
          w-full flex items-center justify-center gap-2
          py-2 rounded font-medium
          bg-indigo-600 text-white
          hover:bg-indigo-700
          active:scale-[0.98]
          disabled:opacity-50
          disabled:cursor-not-allowed
          cursor-pointer
          transition-all
        "
      >
        <Plus className="w-4 h-4" />
        Create Room
      </button>
    </div>
  );
}
