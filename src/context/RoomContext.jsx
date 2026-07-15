"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
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

const checkHasPassword = (room) => {
  if (!room) return false;
  if (room.hasPassword !== undefined) return room.hasPassword;
  return room.password !== undefined && room.password !== null && room.password !== "";
};

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [code, setCode] = useState("");

  const [joinModalRoom, setJoinModalRoom] = useState(null);
  const [deleteModalRoom, setDeleteModalRoom] = useState(null);

  const activeRoomRef = useRef(null);
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  const leaveRoomRef = useRef(null);

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
      const normalizedRooms = data.map((room) => ({
        ...room,
        hasPassword: checkHasPassword(room),
      }));
      setRooms(normalizedRooms);
    } catch {
      toast.error("Failed to load rooms");
    }
  };

  /* ================= RESTORE ROOM ON REFRESH ================= */
  useEffect(() => {
    const restoreRoom = async () => {
      const savedRoomId = localStorage.getItem("activeRoomId");
      if (!savedRoomId) return;
      const savedPassword = localStorage.getItem("activeRoomPassword") || "";

      try {
        const room = await getRoomByIdApi(savedRoomId, savedPassword);
        setActiveRoom(room);
        setCode(room.code || "");
        socket.emit("join-room", room.roomId);
      } catch {
        localStorage.removeItem("activeRoomId");
        localStorage.removeItem("activeRoomPassword");
      }
    };

    restoreRoom();
  }, []);

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    socket.on("room-created", (room) => {
      const normalizedRoom = {
        ...room,
        hasPassword: checkHasPassword(room),
      };
      setRooms((prev) => [normalizedRoom, ...prev]);
    });

    socket.on("room-deleted", (roomId) => {
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
      if (activeRoomRef.current && activeRoomRef.current.roomId === roomId) {
        if (leaveRoomRef.current) {
          leaveRoomRef.current();
        }
        toast.error("The active room has been deleted by an administrator");
      }
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
        hasPassword: checkHasPassword(room),
        createdAt: room.createdAt,
      };

      setRooms((prev) => [formattedRoom, ...prev]);
      socket.emit("room-created", formattedRoom);

      toast.success("Room created");

      // Auto-join the newly created room
      await joinRoom(room.roomId, password);
    } catch {
      toast.error("Create room failed");
    }
  };

  /* ================= OPEN ROOM ================= */
  const openRoom = (room) => {
    if (checkHasPassword(room)) {
      setJoinModalRoom(room);
    } else {
      joinRoom(room.roomId, "");
    }
  };

  /* ================= JOIN ROOM ================= */
  const joinRoom = async (roomId, password = "") => {
    try {
      // If we are currently in a room, leave it first on the socket server
      if (activeRoomRef.current) {
        socket.emit("leave-room", activeRoomRef.current.roomId);
      }

      const room = await joinRoomApi({ roomId, password });

      setActiveRoom(room);
      setCode(room.code || "");
      localStorage.setItem("activeRoomId", room.roomId);
      if (password) {
        localStorage.setItem("activeRoomPassword", password);
      } else {
        localStorage.removeItem("activeRoomPassword");
      }

      socket.emit("join-room", room.roomId);
      setJoinModalRoom(null);

      toast.success("Joined room");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Join failed");
    }
  };

  /* ================= LEAVE ROOM ================= */
  const leaveRoom = () => {
    if (activeRoomRef.current) {
      socket.emit("leave-room", activeRoomRef.current.roomId);
    }
    localStorage.removeItem("activeRoomId");
    localStorage.removeItem("activeRoomPassword");
    setActiveRoom(null);
    setCode("");
  };

  leaveRoomRef.current = leaveRoom;

  /* ================= SAVE CODE (REAL-TIME) ================= */
  const saveCodeTimeoutRef = useRef(null);

  // Clean up debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (saveCodeTimeoutRef.current) {
        clearTimeout(saveCodeTimeoutRef.current);
      }
    };
  }, []);

  const debouncedSaveDb = useCallback((roomId, value) => {
    if (saveCodeTimeoutRef.current) {
      clearTimeout(saveCodeTimeoutRef.current);
    }
    saveCodeTimeoutRef.current = setTimeout(async () => {
      try {
        await updateCodeApi(roomId, value);
      } catch {
        toast.error("Failed to save code");
      }
    }, 500);
  }, []);

  const saveCode = (value) => {
    setCode(value);

    if (!activeRoom) return;

    socket.emit("code-change", {
      roomId: activeRoom.roomId,
      code: value,
    });

    debouncedSaveDb(activeRoom.roomId, value);
  };

  /* ================= DELETE ROOM ================= */
  const deleteRoom = async (roomId, password) => {
    try {
      await deleteRoomApi(roomId, password);

      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
      socket.emit("room-deleted", roomId);

      if (activeRoomRef.current?.roomId === roomId) {
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
