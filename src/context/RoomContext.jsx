"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createRoomApi,
  joinRoomApi,
  getAllRoomsApi,
  updateCodeApi,
  deleteRoomApi,
} from "@/services/room.services";
import { socket } from "@/socket/socket";

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [code, setCode] = useState("");

  const [joinModalRoom, setJoinModalRoom] = useState(null);
  const [deleteModalRoom, setDeleteModalRoom] = useState(null);

  /* ---------- LOAD ROOMS ---------- */
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getAllRoomsApi();
      setRooms(data);
    } catch {
      toast.error("Failed to load rooms");
    }
  };

  /* ---------- CREATE ROOM ---------- */
  const createRoom = async ({ roomName, password }) => {
    try {
      const room = await createRoomApi({ roomName, password });
      setRooms((prev) => [room, ...prev]);
      toast.success("Room created");
    } catch {
      toast.error("Create room failed");
    }
  };

  /* ---------- ROOM CLICK ---------- */
  // ✅ ROOM CLICK = ONLY OPEN MODAL
const openRoom = (room) => {
  setJoinModalRoom(room);
};

  

  /* ---------- JOIN ROOM ---------- */
  const handleJoinRoom = async (roomId, password) => {
  if (!password.trim()) return; // 🛑 empty password block

  try {
    const room = await joinRoomApi({ roomId, password });

    setActiveRoom(room);
    setJoinModalRoom(null);

    toast.success("Joined room");
  } catch {
    toast.error("Wrong password");
  }
};


  /* ---------- LEAVE ROOM ---------- */
  const leaveRoom = () => {
    if (socket.connected && activeRoom) {
      socket.emit("leave-room", activeRoom._id);
      socket.disconnect();
    }
    setActiveRoom(null);
    setCode("");
  };

  /* ---------- SAVE CODE ---------- */
  const saveCode = async (value) => {
    setCode(value);
    if (!activeRoom) return;

    try {
      await updateCodeApi(activeRoom._id, value);
    } catch {
      toast.error("Failed to save code");
    }
  };

  /* ---------- DELETE ROOM ---------- */
  const deleteRoom = async (roomId, password) => {
    try {
      await deleteRoomApi(roomId, password);
      toast.success("Room deleted");

      setRooms((prev) => prev.filter((r) => r._id !== roomId));
      setDeleteModalRoom(null);

      if (activeRoom?._id === roomId) leaveRoom();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        activeRoom,
        code,

        joinModalRoom,
        deleteModalRoom,
        setJoinModalRoom,
        setDeleteModalRoom,

        createRoom,
        openRoom,
        joinRoom: handleJoinRoom,
        leaveRoom,
        saveCode,
        deleteRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
