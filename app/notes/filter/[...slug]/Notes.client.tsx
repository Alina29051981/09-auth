'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNotes, FetchNotesResponse } from '../../../../lib/api';
import SearchBox from '../../../../components/SearchBox/SearchBox';
import Pagination from '../../../../components/Pagination/Pagination';
import NoteList from '../../../../components/NoteList/NoteList';
import NoteForm from '../../../../components/NoteForm/NoteForm';
import { NoteTag } from '../../../../types/note';
import Modal from '../../../../components/Modal/Modal';
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

  const router = useRouter();

  const { data, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearch, filterTag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
        tag: filterTag === 'All' ? undefined : filterTag,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchQuery(value);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleOpenNewNoteModal = () => setIsNewNoteModalOpen(true);
  const handleCloseNewNoteModal = () => setIsNewNoteModalOpen(false);

   const handleOpenNotePreview = (noteId: string) => {
    router.push(`/@modal/(.)notes/${noteId}`);
  };

  if (isLoading) return <p className={css.loading}>Loading notes...</p>;
  if (error) return <p className={css.error}>Could not fetch notes. {error.message}</p>;

  return (
    <div className={css.app}>
      <div className={css.main}>
        <div className={css.toolbar}>
          <SearchBox value={searchQuery} onChange={handleSearchChange} />
          <button className={css.button} onClick={handleOpenNewNoteModal}>
            + New Note
          </button>
        </div>

        <NoteList notes={data?.notes || []} onNoteClick={handleOpenNotePreview} />

        {data?.totalNumberOfPages > 1 && (
          <Pagination
            currentPage={page}
            totalNumberOfPages={data.totalNumberOfPages}
            onPageChange={handlePageChange}
          />
        )}

        {isNewNoteModalOpen && (
          <Modal onClose={handleCloseNewNoteModal}>
            <NoteForm onClose={handleCloseNewNoteModal} />
          </Modal>
        )}
      </div>
    </div>
  );
}
