'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes, FetchNotesResponse } from '../../../../lib/api';
import SearchBox from '../../../../components/SearchBox/SearchBox';
import Pagination from '../../../../components/Pagination/Pagination';
import NoteList from '../../../../components/NoteList/NoteList';
import { NoteTag } from '../../../../types/note';
import Link from 'next/link';
import css from './NotesPage.module.css';

const PER_PAGE = 5;

interface NotesClientProps {
  filterTag?: NoteTag | 'All';
}

export default function NotesClient({ filterTag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);

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

    const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchQuery(value);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        <Link href="/notes/action/create">
          <button className={css.button}>+ Create note</button>
        </Link>
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
    </div>
  );
}
