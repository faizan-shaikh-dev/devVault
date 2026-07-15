import "./globals.css";
import { RoomProvider } from "@/context/RoomContext";
import { ThemeProvider } from "@/context/ThemeContext";
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
      <body className="bg-bg-primary text-text-primary transition-colors duration-200">
        <ThemeProvider>
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
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
