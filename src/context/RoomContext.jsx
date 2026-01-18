"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createRoomApi,
  joinRoomApi,
  getAllRoomsApi,
  updateCodeApi,
  deleteRoomApi,
  getRoomByIdApi,
} from "@/services/room.services";
import { socket } from "@/socket/socket";

const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [code, setCode] = useState("");

  const [joinModalRoom, setJoinModalRoom] = useState(null);
  const [deleteModalRoom, setDeleteModalRoom] = useState(null);

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

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

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    socket.on("room-created", (room) => {
      setRooms((prev) => [room, ...prev]);
    });

    socket.on("room-deleted", (roomId) => {
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    });

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-deleted");
      socket.off("code-update");
    };
  }, []);

  /* ================= CREATE ROOM ================= */
  const createRoom = async ({ roomName, password }) => {
    try {
      const room = await createRoomApi({ roomName, password });

      const formattedRoom = {
        roomId: room.roomId,
        roomName: room.roomName,
        hasPassword: room.password !== null,
        createdAt: room.createdAt,
      };

      setRooms((prev) => [formattedRoom, ...prev]);
      socket.emit("room-created", formattedRoom);

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

      socket.emit("join-room", room.roomId);
      setJoinModalRoom(null);

      toast.success("Joined room");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Join failed");
    }
  };

  /* ================= LEAVE ROOM ================= */
  const leaveRoom = () => {
    localStorage.removeItem("activeRoomId");
    setActiveRoom(null);
    setCode("");
  };

  /* ================= SAVE CODE (REAL-TIME) ================= */
  const saveCode = async (value) => {
    setCode(value);

    if (!activeRoom) return;

    socket.emit("code-change", {
      roomId: activeRoom.roomId,
      code: value,
    });

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

      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
      socket.emit("room-deleted", roomId);

      if (activeRoom?.roomId === roomId) {
        leaveRoom();
      }

      setDeleteModalRoom(null);
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
