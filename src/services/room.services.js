import { api } from "./api";

// CREATE
export const createRoomApi = (payload) =>
  api.post("/create", payload).then(res => res.data);

// JOIN  ✅ MUST SEND roomId
export const joinRoomApi = ({ roomId, password }) =>
  api.post("/join", { roomId, password }).then(res => res.data);

// GET ALL
export const getAllRoomsApi = () =>
  api.get("/").then(res => res.data);

// UPDATE CODE
export const updateCodeApi = (roomId, code) =>
  api.put(`/${roomId}/code`, { code }).then(res => res.data);

// DELETE
export const deleteRoomApi = (roomId, password) =>
  api.delete(`/${roomId}`, { data: { password } }).then(res => res.data);
