import { LogOut, Hash, Code } from "lucide-react";
import { useRoom } from "@/context/RoomContext";

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "typescript", label: "TypeScript" },
];

export default function EditorHeader() {
  const { activeRoom, leaveRoom, language, setLanguage } = useRoom();

  if (!activeRoom) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border-custom bg-bg-secondary transition-colors duration-200">
      
      {/* Room Name */}
      <div className="flex items-center gap-2 text-sm text-text-primary">
        <Hash className="w-4 h-4 text-indigo-400" />
        <span className="font-medium truncate max-w-60">
          {activeRoom.roomName}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-bg-primary px-3 py-1.5 rounded-md border border-border-custom hover:border-indigo-500/50 transition-colors">
          <Code className="w-4 h-4 text-text-secondary" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm text-text-primary outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-bg-primary text-text-primary">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Button + Tooltip */}
        <div className="relative group">
          <button
            onClick={leaveRoom}
            className="
              flex items-center
              text-red-400
              hover:text-red-500
              transition
              cursor-pointer
            "
          >
            <LogOut className="w-5 h-5" />
          </button>

          {/* Tooltip */}
          <span
            className="
              absolute right-0 top-full mt-2
              scale-0 group-hover:scale-100
              bg-bg-dropdown text-red-500
              border border-border-dropdown
              text-xs px-2 py-1 rounded
              whitespace-nowrap
              transition-transform
              origin-top-right
              z-50
              pointer-events-none
            "
          >
            Leave room
          </span>
        </div>
      </div>
    </div>
  );
}
