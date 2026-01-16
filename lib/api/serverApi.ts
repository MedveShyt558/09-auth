import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
};

type FetchNotesResponse = {
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

const withCookieHeader = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const res: AxiosResponse<unknown> = await api.get("/notes", {
    ...(await withCookieHeader()),
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
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`, await withCookieHeader());
  return res.data;
};

export const checkSession = async (): Promise<AxiosResponse<{ success: boolean }>> => {
  const res: AxiosResponse<{ success: boolean }> = await api.get(
    "/auth/session",
    await withCookieHeader()
  );
  return res;
};

export const getMe = async (): Promise<User> => {
  const res: AxiosResponse<User> = await api.get("/users/me", await withCookieHeader());
  return res.data;
};
