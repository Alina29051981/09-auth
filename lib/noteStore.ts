import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteTag } from '../types/note';

export interface Draft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: Draft;
  notes: Note[];                     // додаємо масив нотаток
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
  addNote: (note: Note) => void;     // додаємо метод addNote
}

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      notes: [],

      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),

      clearDraft: () => set({ draft: initialDraft }),

      addNote: (note) =>
        set((state) => ({ notes: [...state.notes, note] })),
    }),
    { name: 'note-draft' }
  )
);
