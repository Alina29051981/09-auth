import React, { useCallback } from 'react';
import Link from 'next/link';
import css from './NoteList.module.css';
import { Note } from '../../lib/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api';

export interface NoteListProps {
  notes: Note[];
}

const NoteListItem: React.FC<{
  note: Note;
  onDelete: (id: string) => void;
}> = React.memo(({ note, onDelete }) => (
  <li className={css.listItem}>
    <h2 className={css.title}>{note.title}</h2>
    <p className={css.content}>{note.content}</p>
    <div className={css.footer}>
      <span className={css.tag}>{note.tag}</span>
      <Link href={`/notes/${note.id}`} className={css.link}>
        View details
      </Link>
      <button className={css.button} onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </div>
  </li>
));

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm('Delete this note?')) return;
      deleteMut.mutate(id);
    },
    [deleteMut]
  );

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} onDelete={handleDelete} />
      ))}
    </ul>
  );
};

export default NoteList;
