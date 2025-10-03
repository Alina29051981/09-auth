'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../lib/api';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  id: string;
  onClose: () => void; 
}

export default function NoteDetailsClient({ id, onClose }: NoteDetailsClientProps) {
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container} style={{ position: 'relative' }}>
            <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'transparent',
          border: 'none',
          fontSize: 28,
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 10,
          color: '#333',
        }}
      >
        ×
      </button>

      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
