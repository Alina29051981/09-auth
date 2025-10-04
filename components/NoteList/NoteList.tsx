'use client';

import React from 'react';
import Link from 'next/link';
import css from './NoteList.module.css';
import { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api';

interface NoteListProps {
  notes: Note[];
}

const NoteListItem: React.FC<{ note: Note }> = React.memo(({ note }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteNote(note.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <li className={css.listItem}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>
        <Link href={`/notes/${note.id}`} className={css.link}>
          View details
        </Link>
        <button className={css.button} onClick={handleDelete} disabled={mutation.isPending}>
          Delete
        </button>
      </div>
    </li>
  );
});
NoteListItem.displayName = 'NoteListItem';

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  if (notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} />
      ))}
    </ul>
  );
};

export default NoteList;
