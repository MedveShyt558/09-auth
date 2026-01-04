import axios from "axios";
import type { AxiosResponse } from "axios";
import type { CreateNoteRequest, Note } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTEHUB_API,
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function ensureBaseUrl() {
  if (!process.env.NEXT_PUBLIC_NOTEHUB_API) {
    throw new Error("NEXT_PUBLIC_NOTEHUB_API is not defined");
  }
}

export const fetchNotes = async (params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> => {
  ensureBaseUrl();

  const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search || undefined,
      tag: params.tag || undefined,
    },
  });

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  ensureBaseUrl();

  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: CreateNoteRequest): Promise<Note> => {
  ensureBaseUrl();

  const res: AxiosResponse<Note> = await api.post("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  ensureBaseUrl();

  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
};
