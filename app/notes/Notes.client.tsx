'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../lib/api';
import SearchBox from '../../components/SearchBox/SearchBox';
import Pagination from '../../components/Pagination/Pagination';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';

const PER_PAGE = 5;

export default function NotesClient() {
  const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

   const { data, isLoading, error } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch || undefined }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

    const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchQuery(value);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Could not fetch the list of notes. {(error as Error).message}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <button type="button" onClick={handleOpenModal}>
          + New Note
        </button>
      </div>

      <NoteList
        notes={data?.notes || []}
        onDelete={handleDelete}
      />

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
