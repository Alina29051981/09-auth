import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useQuery } from "@tanstack/react-query";

import { fetchMovies } from "../../api/movies";
import { Movie } from "../../types/movie";
import { MoviesResponse } from "../../services/movieService";
import MovieCard from "../MovieCard/MovieCard";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

export default function App() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    staleTime: 5000,
    placeholderData: (prev) => prev, // заміна keepPreviousData у v5
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      iziToast.error({
        title: "",
        message: "No movies found for your request",
        position: "topRight",
        timeout: 2500,
        close: true,
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input.trim());
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const moviesToShow = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

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
              <MovieCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />
            ))}
          </div>
        </main>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
