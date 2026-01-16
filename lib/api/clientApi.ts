import type { AxiosResponse } from "axios";
import { api } from "./api";
import type { CreateNoteRequest, Note } from "@/types/note";
import type { User } from "@/types/user";

type AuthCredentials = {
  email: string;
  password: string;
};

export type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

const normalizeNotesResponse = (data: unknown): FetchNotesResponse => {
  if (Array.isArray(data)) {
    return { notes: data as Note[], totalPages: 1 };
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const notes = Array.isArray(obj.notes) ? (obj.notes as Note[]) : [];
    const totalPages =
      typeof obj.totalPages === "number"
        ? obj.totalPages
        : typeof obj.total === "number" && typeof obj.perPage === "number" && obj.perPage > 0
        ? Math.ceil(obj.total / obj.perPage)
        : 1;

    return { notes, totalPages };
  }

  return { notes: [], totalPages: 1 };
};

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const res: AxiosResponse<unknown> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search || undefined,
      tag: params.tag || undefined,
    },
  });

  return normalizeNotesResponse(res.data);
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: CreateNoteRequest): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.post("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
};

export const register = async (payload: AuthCredentials): Promise<User> => {
  const res: AxiosResponse<User> = await api.post("/auth/register", payload);
  return res.data;
};

export const login = async (payload: AuthCredentials): Promise<User> => {
  const res: AxiosResponse<User> = await api.post("/auth/login", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const res: AxiosResponse<{ success: boolean }> = await api.get("/auth/session");
  return Boolean(res.data?.success);
};

export const getMe = async (): Promise<User> => {
  const res: AxiosResponse<User> = await api.get("/users/me");
  return res.data;
};

export const updateMe = async (payload: Partial<Pick<User, "username">>): Promise<User> => {
  const res: AxiosResponse<User> = await api.patch("/users/me", payload);
  return res.data;
};
