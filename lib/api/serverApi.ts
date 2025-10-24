import axios from 'axios';
import { User } from '../../types/user';
import { Note } from '../../types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

interface ServerApiOptions {
  cookie?: string;
}

export const fetchNotes = async (options?: ServerApiOptions): Promise<Note[]> => {
  const res = await axios.get<Note[]>(`${baseURL}/notes`, {
    headers: { Cookie: options?.cookie || '' },
    withCredentials: true,
  });
  return res.data;
};

export const fetchNoteById = async (id: string, options?: ServerApiOptions): Promise<Note> => {
  const res = await axios.get<Note>(`${baseURL}/notes/${id}`, {
    headers: { Cookie: options?.cookie || '' },
    withCredentials: true,
  });
  return res.data;
};

export const getMe = async (options?: ServerApiOptions): Promise<User> => {
  const res = await axios.get<User>(`${baseURL}/users/me`, {
    headers: { Cookie: options?.cookie || '' },
    withCredentials: true,
  });
  return res.data;
};

export const checkSession = async (options?: ServerApiOptions): Promise<User | null> => {
  try {
    const res = await axios.get<User>(`${baseURL}/auth/session`, {
      headers: { Cookie: options?.cookie || '' },
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};
