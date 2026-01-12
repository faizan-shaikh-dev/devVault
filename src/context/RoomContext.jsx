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

  /* ================= LOAD ROOMS ================= */
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

  /* ========== RESTORE ROOM ON REFRESH ========== */
  useEffect(() => {
    const savedRoomId = localStorage.getItem("activeRoomId");
    if (!savedRoomId || !rooms.length) return;

    const room = rooms.find((r) => r.roomId === savedRoomId);
    if (!room) {
      localStorage.removeItem("activeRoomId");
      return;
    }

    setActiveRoom(room);
    socket.emit("join-room", savedRoomId);
  }, [rooms]);

  /* ================= CREATE ROOM ================= */
  const createRoom = async ({ roomName, password }) => {
    try {
      const room = await createRoomApi({ roomName, password });
      setRooms((prev) => [room, ...prev]);
      toast.success("Room created");
    } catch {
      toast.error("Create room failed");
    }
  };

  /* ========== ROOM CLICK (PUBLIC / PRIVATE) ====== */
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
      toast.error(
        err?.response?.data?.message || "Unauthorized"
      );
    }
  };

  /* ================= LEAVE ROOM ================= */
  const leaveRoom = () => {
    if (activeRoom) {
      socket.emit("leave-room", activeRoom.roomId);
    }

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
      toast.success("Room deleted");

      setRooms((prev) =>
        prev.filter((room) => room.roomId !== roomId)
      );

      setDeleteModalRoom(null);
      localStorage.removeItem("activeRoomId");

      if (activeRoom?.roomId === roomId) {
        leaveRoom();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
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
