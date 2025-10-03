import axios from 'axios';
import type { Note, CreateNoteDTO } from '../lib/types/note';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalNumberOfPages: number;
}

interface ApiNotesResponse {
  notes: Note[];
  totalPages: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

api.interceptors.request.use((config) => {
  const t = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (t && config.headers) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<ApiNotesResponse>('/notes', { params });
  return {
    notes: data.notes,
    totalNumberOfPages: data.totalPages,
  };
};

export const createNote = async (dto: CreateNoteDTO): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', dto);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  console.log("fetchNoteById response:", data);
  return data as Note; 
};

