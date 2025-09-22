import React from 'react';
import css from './NoteList.module.css';
import { Note } from '../../types/note';
import { useDeleteNote } from '../../hooks/useNotes';

type Props = { notes: Note[] };

const NoteList: React.FC<Props> = ({ notes }) => {
  const deleteMut = useDeleteNote();

  const handleDelete = (_id: string) => {
    if (!confirm('Delete this note?')) return;
    deleteMut.mutate(_id);
  };

  return (
    <ul className={css.list}>
      {notes.map(n => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button className={css.button} onClick={() => handleDelete(n.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
