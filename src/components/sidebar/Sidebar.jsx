import Image from "next/image";
import CreateRoomForm from "./CreateRoomForm";
import RoomList from "./RoomList";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800">
        <Image
          src="/logo.png"
          alt="CodeVault logo"
          width={50}
          height={50}
          priority
        />
        <h1 className="text-2xl font-semibold text-blue-500 mt-2">
          DevVault
        </h1>
      </div>

      {/* Create Room */}
      <CreateRoomForm />

      {/* Room List */}
      <RoomList />
    </aside>
  );
}
