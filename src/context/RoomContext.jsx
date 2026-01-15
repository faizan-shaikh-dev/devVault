"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createRoomApi,
  joinRoomApi,
  getAllRoomsApi,
  updateCodeApi,
  deleteRoomApi,
  getRoomByIdApi, // ✅ NEW
} from "@/services/room.services";
import { socket } from "@/socket/socket";

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [code, setCode] = useState("");

  const [joinModalRoom, setJoinModalRoom] = useState(null);
  const [deleteModalRoom, setDeleteModalRoom] = useState(null);

  /* ================= LOAD ROOM LIST ================= */
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

  /* ================= RESTORE ROOM ON REFRESH ================= */
  useEffect(() => {
    const restoreRoom = async () => {
      const savedRoomId = localStorage.getItem("activeRoomId");
      if (!savedRoomId) return;

      try {
        const room = await getRoomByIdApi(savedRoomId);

        setActiveRoom(room);
        setCode(room.code || "");

        socket.emit("join-room", room.roomId);
      } catch {
        localStorage.removeItem("activeRoomId");
      }
    };

    restoreRoom();
  }, []);

  /* ================= CREATE ROOM ================= */
  const createRoom = async ({ roomName, password }) => {
    try {
      const room = await createRoomApi({ roomName, password });

      setRooms(prev => [
        {
          roomId: room.roomId,
          roomName: room.roomName,
          hasPassword: room.password !== null,
          createdAt: room.createdAt,
        },
        ...prev,
      ]);

      toast.success("Room created");
    } catch {
      toast.error("Create room failed");
    }
  };

  /* ================= OPEN ROOM ================= */
  const openRoom = (room) => {
    if (room.hasPassword) {
      setJoinModalRoom(room);
    } else {
      joinRoom(room.roomId, "");
    }
  };

  /* ================= JOIN ROOM ================= */
  const joinRoom = async (roomId, password = "") => {
    try {
      const room = await joinRoomApi({ roomId, password });

      setActiveRoom(room);
      setCode(room.code || "");
      localStorage.setItem("activeRoomId", room.roomId);

      setJoinModalRoom(null);
      socket.emit("join-room", room.roomId);

      toast.success("Joined room");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Join failed");
    }
  };

  /* ================= LEAVE ROOM ================= */
  const leaveRoom = () => {
    if (activeRoom) socket.emit("leave-room", activeRoom.roomId);

    localStorage.removeItem("activeRoomId");
    setActiveRoom(null);
    setCode("");
  };

  /* ================= SAVE CODE ================= */
  const saveCode = async (value) => {
    setCode(value);

    if (!activeRoom) return;

    try {
      await updateCodeApi(activeRoom.roomId, value);
    } catch {
      toast.error("Failed to save code");
    }
  };

  /* ================= DELETE ROOM ================= */
  const deleteRoom = async (roomId, password) => {
    try {
      await deleteRoomApi(roomId, password);

      setRooms(prev => prev.filter(r => r.roomId !== roomId));
      setDeleteModalRoom(null);
      localStorage.removeItem("activeRoomId");

      if (activeRoom?.roomId === roomId) leaveRoom();

      toast.success("Room deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
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
        joinRoom,
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
