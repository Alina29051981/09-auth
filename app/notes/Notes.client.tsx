'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes, FetchNotesResponse } from '../../lib/api';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import css from './Notes.module.css';

const PER_PAGE = 5;

export default function NotesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch || undefined }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchQuery(value);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes. {error.message}</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <button type="button" className={css.button} onClick={handleOpenModal}>
          + New Note
        </button>
      </div>

      <NoteList notes={data?.notes || []} />

      <Pagination
        currentPage={page}
        totalNumberOfPages={data?.totalNumberOfPages || 1}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
