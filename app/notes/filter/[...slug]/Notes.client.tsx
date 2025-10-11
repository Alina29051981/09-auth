'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes, createNote, FetchNotesResponse } from '../../../../lib/api';
import SearchBox from '../../../../components/SearchBox/SearchBox';
import Pagination from '../../../../components/Pagination/Pagination';
import NoteList from '../../../../components/NoteList/NoteList';
import NoteForm from '../../../../components/NoteForm/NoteForm';
import Modal from '../../../../components/Modal/Modal';
import { NoteTag } from '../../../../types/note';
import toast from 'react-hot-toast';
import css from './Notes.module.css';

const PER_PAGE = 5;

interface NotesClientProps {
  filterTag?: NoteTag | 'All';
}

export default function NotesClient({ filterTag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Запит нотаток
  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearch, filterTag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
        tag: filterTag === 'All' ? undefined : filterTag,
      }),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  // Мутація для створення нової нотатки
  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; tag: NoteTag }) => createNote(data),
    onSuccess: (newNote) => {
      queryClient.setQueryData(['notes', page, debouncedSearch, filterTag], (oldData: FetchNotesResponse | undefined) => {
        if (!oldData) return { notes: [newNote], totalNumberOfPages: 1 };
        return {
          ...oldData,
          notes: [newNote, ...oldData.notes],
        };
      });
      toast.success('Note added successfully!');
      setIsNewNoteModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });

  // Хендлери
  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchQuery(value);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleOpenNewNoteModal = () => setIsNewNoteModalOpen(true);
  const handleCloseNewNoteModal = () => setIsNewNoteModalOpen(false);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <button className={css.button} onClick={handleOpenNewNoteModal}>
          + New Note
        </button>
      </div>

      {isLoading && <p className={css.loading}>Loading notes...</p>}
      {error && <p className={css.error}>Could not fetch notes: {error.message}</p>}

      {data && (
        <>
          <NoteList notes={data.notes} />
          {data.totalNumberOfPages > 1 && (
            <Pagination
              currentPage={page}
              totalNumberOfPages={data.totalNumberOfPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isNewNoteModalOpen && (
        <Modal onClose={handleCloseNewNoteModal}>
          <NoteForm
            onClose={handleCloseNewNoteModal}
            onSubmit={(data: { title: string; content: string; tag: NoteTag }) => createMutation.mutate(data)}
          />
        </Modal>
      )}
    </div>
  );
}
