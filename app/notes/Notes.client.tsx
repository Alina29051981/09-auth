'use client';
import { useState } from 'react';
import Link from 'next/link';
import css from './notes.module.css';
import { useNotes, useDeleteNote } from './useNotes';
import { FetchNotesParams } from '../../lib/api';
import NoteForm from '../../components/NoteForm/NoteForm';

interface NotesClientProps {
  page: number;
  perPage: number;
  search: string;
}

export default function NotesClient({ page, perPage, search }: NotesClientProps) {
  const [inputValue, setInputValue] = useState(search);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const params: FetchNotesParams = { page, perPage, search: searchTerm };
  const { data, isLoading, error } = useNotes(params);
  const deleteMutation = useDeleteNote(params);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length < 3) {
      alert('Enter at least 3 characters to search');
      return;
    }
    setSearchTerm(inputValue.trim());
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const notes = data?.notes ?? [];

  return (
    <div className={css.container}>
      <div className={css.controls} style={{ marginBottom: '20px' }}>
        {/* Пошук */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search notes..."
            style={{ width: '200px', padding: '5px' }}
          />
          <button type="submit">Search</button>
        </form>

                <button onClick={() => setIsFormOpen(true)} style={{ marginTop: '10px' }}>
          Create New Note
        </button>
      </div>

            {isFormOpen && <NoteForm onClose={() => setIsFormOpen(false)} />}

      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.item}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`}>View</Link>
              <button onClick={() => deleteMutation.mutate(note.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
