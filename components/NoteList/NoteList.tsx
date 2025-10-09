'use client';

import React from 'react';
import css from './NoteList.module.css';
import { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api';

interface NoteListProps {
  notes: Note[];
  onNoteClick?: (noteId: string) => void; 
}

interface NoteListItemProps {
  note: Note;
  onNoteClick?: (noteId: string) => void;
}

const NoteListItem: React.FC<NoteListItemProps> = React.memo(({ note, onNoteClick }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteNote(note.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = () => mutation.mutate();
  const handleViewDetails = () => onNoteClick?.(note.id);

  return (
    <li className={css.listItem}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>

        <button className={css.link} onClick={handleViewDetails}>
          View details
        </button>
        
        <button className={css.button} onClick={handleDelete} disabled={mutation.isPending}>
          Delete
        </button>
      </div>
    </li>
  );
});
NoteListItem.displayName = 'NoteListItem';

const NoteList: React.FC<NoteListProps> = ({ notes, onNoteClick }) => {
  if (notes.length === 0) return <p className={css.empty}>No notes found.</p>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} onNoteClick={onNoteClick} />
      ))}
    </ul>
  );
};

export default NoteList;
