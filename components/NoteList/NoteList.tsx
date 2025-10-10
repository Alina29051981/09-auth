'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { Note } from '../../types/note';
import { deleteNote } from '../../lib/api';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onNoteClick?: (noteId: string) => void;
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // ✅ Мутація для видалення нотатки
  const mutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      toast.success('Note deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });

  const handleDelete = (noteId: string) => {
    if (!noteId) {
      toast.error('Note ID is missing.');
      return;
    }
    mutation.mutate(noteId);
  };

  if (!notes?.length) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes
        .filter((note) => Boolean(note.id)) // ✅ не рендеримо нотатки без id
        .map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>

              <button
                className={css.button}
                onClick={() => handleDelete(note.id)}
                disabled={mutation.isPending}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
    </ul>
  );
}
