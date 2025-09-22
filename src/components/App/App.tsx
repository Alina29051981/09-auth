import React, { useState } from 'react';
import css from './App.module.css';
import { useDebounce } from 'use-debounce';
import { useNotes } from '../../hooks/useNotes';
import SearchBox from '../SearchBox/SearchBox';
import PaginationComp from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

const PER_PAGE = 12;

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError } = useNotes({ page, perPage: PER_PAGE, search: debouncedSearch });

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={(v) => { setPage(1); setSearch(v); }} />
        {totalPages > 1 && <PaginationComp pageCount={totalPages} currentPage={page} onPageChange={(p) => setPage(p)} />}
        <button className={css.button} onClick={() => setModalOpen(true)}>Create note +</button>
      </header>
  
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error while loading notes</p>}

      {data?.notes?.length ? <NoteList notes={data.notes} /> : <p>No notes found</p>}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onSuccess={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;
