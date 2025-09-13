import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchMovies } from "../../api/movies";
import { Movie, MoviesResponse } from "../../types/movie";
import MovieCard from "../MovieCard/MovieCard";
import css from "./App.module.css";

export default function App() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [previousData, setPreviousData] = useState<MoviesResponse | null>(null);

  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    staleTime: 5000,
  });

  useEffect(() => {
  if (data && data.results.length === 0) {
    iziToast.error({
      title: '', // без заголовка
      message: 'No movies found for your request', // текст повідомлення
      position: 'topRight',
      timeout: 2500,
      close: true,
    });
  }
}, [data]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input);
    setPage(1);
    setPreviousData(null);
  };

  const moviesToShow = (data?.results.length ? data.results : previousData?.results || []).slice(0, 20);
  const totalPages = data?.total_pages ?? previousData?.total_pages ?? 0;

  return (
    <div className={css.container}>
      {/* Header */}
      <header className={css.header}>
        <div className={css.logo}>Powered by TMDB</div>
        <form onSubmit={handleSubmit} className={css.searchForm}>
          <input
            type="text"
            value={input}
            placeholder="Search movies..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong 😢</p>}

      {moviesToShow.length > 0 && (
        <main>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <div className={css.grid}>
            {moviesToShow.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
