import { api } from "./api";

// create room
export const createRoomApi = async (payload) => {
  const { data } = await api.post("/create", payload);
  return data;
};

// join room (password)
export const joinRoomApi = async (payload) => {
  const { data } = await api.post("/join", payload);
  return data;
};

// get all rooms
export const getAllRoomsApi = async () => {
  const { data } = await api.get("/");
  return data;
};

// save code
export const updateCodeApi = async (roomId, code) => {
  const { data } = await api.put(`/${roomId}/code`, { code });
  return data;
};

// delete room
export const deleteRoomApi = async (roomId, password) => {
  const { data } = await api.delete(`/${roomId}`, {
    data: { password },
  });
  return data;
};
