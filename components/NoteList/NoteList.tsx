import React from 'react';
import Link from 'next/link';
import css from './NoteList.module.css';
import { Note } from '../../types/note';

export interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void | Promise<void>;
}

const NoteListItem: React.FC<{
  note: Note;
  onDelete: (id: string) => void | Promise<void>;
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
NoteListItem.displayName = 'NoteListItem';

const NoteList: React.FC<NoteListProps> = ({ notes, onDelete }) => {
  if (notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default NoteList;
