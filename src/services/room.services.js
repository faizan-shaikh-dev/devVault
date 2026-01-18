import { api } from "./api";

// CREATE
export const createRoomApi = (payload) =>
  api.post("/create", payload).then((res) => res.data);

// JOIN
export const joinRoomApi = ({ roomId, password }) =>
  api.post("/join", { roomId, password }).then((res) => res.data);

// GET ALL ROOMS
export const getAllRoomsApi = () =>
  api.get("/").then((res) => res.data);

// GET FULL ROOM (FOR REFRESH)
export const getRoomByIdApi = (roomId) =>
  api.get(`/${roomId}`).then((res) => res.data);

// UPDATE CODE
export const updateCodeApi = (roomId, code) =>
  api.put(`/${roomId}/code`, { code }).then((res) => res.data);

// DELETE ROOM
export const deleteRoomApi = (roomId, password) =>
  api.delete(`/${roomId}`, { data: { password } }).then((res) => res.data);
