export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export const NOTE_TAGS: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string; 
}
export interface CreateNoteDTO {
  title: string;
  content: string;
  tag: NoteTag;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalNumberOfPages: number; 
}
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

