import React, { useState, useCallback, useTransition } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes, FetchNotesResponse } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

const PER_PAGE = 12;

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [isModalOpen, setModalOpen] = useState(false);

   const [isPending, startTransition] = useTransition();

  const searchQuery = page === 1 && !search ? '' : debouncedSearch;

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', searchQuery, page],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search: searchQuery }),
    staleTime: 5000,
  });

  const notes = data?.notes ?? [];
  const totalNumberOfPages = data?.totalPages ?? 1;

   const handlePageChange = useCallback((p: number) => {
    startTransition(() => setPage(p)); 
  }, []);

  const handleSearchChange = useCallback((v: string) => {
    startTransition(() => {
      setPage(1);
      setSearch(v); 
    });
  }, []);

  const openModal = useCallback(() => {
    startTransition(() => setModalOpen(true)); 
  }, []);

  const closeModal = useCallback(() => {
    startTransition(() => setModalOpen(false)); 
  }, []);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalNumberOfPages > 1 && (
          <Pagination
            totalNumberOfPages={totalNumberOfPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
        {isPending && <span style={{ marginLeft: 8 }}>Loading...</span>}
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error while loading notes</p>}

      {notes.length ? <NoteList notes={notes} /> : <p>No notes found</p>}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default App;
