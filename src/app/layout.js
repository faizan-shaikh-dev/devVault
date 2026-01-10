import { RoomProvider } from "@/context/RoomContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RoomProvider>{children}</RoomProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
