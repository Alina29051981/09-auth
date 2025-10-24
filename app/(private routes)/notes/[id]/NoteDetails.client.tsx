'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '../../../../lib/api';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  noteId: string;
  onClose?: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags?: string[];
}

const NoteDetailsClient: React.FC<NoteDetailsClientProps> = ({ noteId, onClose }) => {
  const router = useRouter();
  const { data: note, isLoading, error } = useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/notes/filter/All');
    }
  };

  return (
    <div className={css.container} style={{ position: 'relative' }}>
      <button
        onClick={handleClose}
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

        {note.tags && note.tags.length > 0 && (
          <div>
            {note.tags.map((tag) => (
              <span key={tag} className={css.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
