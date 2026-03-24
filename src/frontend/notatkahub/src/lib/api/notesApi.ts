import { api } from "./api";

// All notes

type GetNotesRequest = {
  page: number;
  limit: number;
};

export const getNotes = async ({ page, limit }: GetNotesRequest) => {
  const responce = await api.get(`/note/getAll`, {
    params: {
      page,
      limit,
    },
  });
  return responce.data;
};

export const searchNote = async (text: string) => {
  const responce = await api.get("/note/search", { params: { text } });
  return responce.data;
};

export const getNoteById = async (id: string) => {
  const responce = await api.get(`/note/getOne/${id}`, { params: { id } });
  return responce.data;
};

type CreateNoteRequest = {
  title: string;
  content: string;
};

export const createNote = async ({ title, content }: CreateNoteRequest) => {
  const responce = await api.post(`/note/create`, {
    title,
    content,
  });
  return responce.data;
};

export type PinNoteRequest = {
  id: string;
  pin: boolean;
};

export const pinNote = async ({ id, pin }: PinNoteRequest) => {
  const responce = await api.patch(`/note/pin/${id}/${pin}`, {
    params: {
      id,
      pin,
    },
  });
  return responce.data;
};

type UpdateNoteRequest = {
  id: string;
  title: string;
  content: string;
};

export const updateNote = async ({ id, title, content }: UpdateNoteRequest) => {
  const responce = await api.patch("/note/update", {
    id,
    title,
    content,
  });
  return responce.data;
};

// Notes from Trash

export const addNoteToTrash = async (id: string) => {
  const responce = await api.post(`/trash/add/${id}`, { params: { id } });
  return responce.data;
};

type TrashNotesRequests = {
  page: number;
  limit: number;
};

export const getNotesFromTrash = async ({
  page,
  limit,
}: TrashNotesRequests) => {
  const responce = await api.get("/trash/getAll", {
    params: {
      page,
      limit,
    },
  });
  return responce.data;
};

// export const searchNoteFromTrash = async () => {}; Те саме що і в минулому випадкові

export const getNoteByIdFromTrash = async (id: string) => {
  const responce = await api.get(`/trash/getOne/${id}`, { params: { id } });
  return responce.data;
};

export const reviveNote = async (id: string) => {
  const responce = await api.post(`/trash/backtonotes/${id}`, {
    params: { id },
  });
  return responce.data;
};

export const deleteNoteFromTrash = async (id: string) => {
  const responce = await api.delete(`trash/deleteNote/${id}`, {
    params: { id },
  });
  return responce.data;
};
