import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { Note, NoteTag } from '../types/note';

export interface Draft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: Draft;
  notes: Note[];
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
  addNote: (note: Note) => void;
}

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

// кастомний storage для persist
const localStorageStorage: PersistStorage<NoteStore> = {
  getItem: (name) => {
    const stored = localStorage.getItem(name);
    return stored ? JSON.parse(stored) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      notes: [],
      setDraft: (note) => set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
    }),
    {
      name: 'note-draft',
      storage: localStorageStorage,
    }
  )
);
