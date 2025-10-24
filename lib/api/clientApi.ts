import { api } from './api';
import { User } from '../../types/user';
import { Note } from '../../types/note';

// Логін
export async function login(email: string, password: string): Promise<User> {
  const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
  return res.data.user;
}

// Реєстрація
export async function register(email: string, password: string): Promise<User> {
  const res = await api.post<{ user: User; token: string }>('/auth/register', { email, password});
  return res.data.user;
}

// Перевірка сесії
export async function checkSession(): Promise<User | null> {
  try {
    const res = await api.get<User>('/auth/session');
    return res.data;
  } catch {
    return null;
  }
}

// Вихід
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

// Отримати поточного користувача
export async function getMe(): Promise<User> {
  const res = await api.get<User>('/users/me');
  return res.data;
}

// Оновити дані користувача
export async function updateMe(username: string): Promise<User> {
  const res = await api.patch<User>('/users/me', { username });
  return res.data;
}


// Ноти
export async function fetchNotes(): Promise<Note[]> {
  const res = await api.get<Note[]>('/notes');
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(note: Partial<Note>): Promise<Note> {
  const res = await api.post<Note>('/notes', note);
  return res.data;
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}
