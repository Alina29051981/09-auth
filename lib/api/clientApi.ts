import { api } from './api';
import { User } from '../../types/user';
import { Note, CreateNoteDTO } from '../../types/note';


export interface NoteHttpResponse {
  notes: Note[];
  totalPages: number;
}

export default async function fetchNotes(
  query: string,
  page: number,
  tag?: string,
  perPage: number = 12 
): Promise<NoteHttpResponse> {
  const response = await api.get<NoteHttpResponse>("/notes", {
    params: {
      search: query,
      page,
      tag: tag || undefined,
      perPage,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const responseById = await api.get<Note>(`/notes/${id}`);
  return responseById.data;
}

export async function createNote({
  title,
  content,
  tag,
}: CreateNoteDTO): Promise<Note> {
  const postResponse = await api.post<Note>("/notes", {
    title,
    content,
    tag,
  });
  return postResponse.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const deleteResponse = await api.delete<Note>(`/notes/${id}`);

  return deleteResponse.data;
}

export interface RegisterRequest {
   email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
}

export async function register(data: RegisterRequest) {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
}

export async function login(data: LoginRequest) {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
}

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export async function checkSession(): Promise<User | null> {
  try {
    const res = await api.get<User>("/auth/session");
    return res.data; 
  } catch {
    return null;
  }
}

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export interface UpdateUserRequest {
  username?: string;
}

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await api.patch<User>("/users/me", payload);
  return res.data;
};

