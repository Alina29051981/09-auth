import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { NoteTag } from '../../types/note';

export interface Draft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface DraftStore {
  draft: Draft;
  setDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

const localStorageStorage: PersistStorage<Pick<DraftStore, 'draft'>> = {
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

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',
      storage: localStorageStorage,
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
