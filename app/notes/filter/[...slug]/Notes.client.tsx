'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
  hydrate,
  DehydratedState,
} from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes, deleteNote, FetchNotesResponse } from '../../../../lib/api';
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
  dehydratedState?: DehydratedState;
}

export default function NotesClient({ filterTag, dehydratedState }: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);

  if (dehydratedState) hydrate(queryClient, dehydratedState);

  const queryClientInstance = useQueryClient();

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

   const deleteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchQuery(value);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleOpenNewNoteModal = () => setIsNewNoteModalOpen(true);
  const handleCloseNewNoteModal = () => setIsNewNoteModalOpen(false);

  const handleDeleteNote = (noteId: string) => {
    if (!noteId) {
      toast.error('Note ID is missing.');
      return;
    }
    deleteMutation.mutate(noteId);
  };

  return (
    <QueryClientProvider client={queryClient}>
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
            <NoteList notes={data.notes} onDelete={handleDeleteNote} />
            {data.totalNumberOfPages > 1 && (
              <div>
                <Pagination
                  currentPage={page}
                  totalNumberOfPages={data.totalNumberOfPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {isNewNoteModalOpen && (
          <Modal onClose={handleCloseNewNoteModal}>
            <NoteForm onClose={handleCloseNewNoteModal} />
          </Modal>
        )}
      </div>
    </QueryClientProvider>
  );
}
