import "./globals.css";
import { RoomProvider } from "@/context/RoomContext";
import Sidebar from "@/components/sidebar/Sidebar";
import JoinRoomModal from "@/components/modals/JoinRoomModal";
import DeleteRoomModal from "@/components/modals/DeleteRoomModal";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "DevVault",
  description: "Paste, share and collaborate on code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">
        <RoomProvider>
          <div className="flex h-screen overflow-hidden">
            {/* <Sidebar /> */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>

          {/* GLOBAL MODALS (ONCE) */}
          <JoinRoomModal />
          <DeleteRoomModal />
        </RoomProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
