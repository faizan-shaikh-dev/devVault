import Image from "next/image";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import CreateRoomForm from "./CreateRoomForm";
import RoomList from "./RoomList";

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-72 bg-bg-secondary border-r border-border-custom flex flex-col transition-colors duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-custom">
        <div className="flex items-center gap-2">
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

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="
            p-2 rounded-lg 
            text-text-secondary hover:text-text-primary 
            hover:bg-bg-primary/50
            transition-all 
            cursor-pointer
          "
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Create Room */}
      <CreateRoomForm />

      {/* Room List */}
      <RoomList />
    </aside>
  );
}
