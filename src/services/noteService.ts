import axios from 'axios';
import { Note, CreateNoteDTO } from '../types/note';
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = '' } = params;

  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search },
  });

  return data; 
};

export const createNote = async (dto: CreateNoteDTO): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', dto);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
