import React, { useState, useRef, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { Movie } from '../../types/movie';
import { fetchMoviesByQuery } from '../../services/movieService';
import toast from 'react-hot-toast';
import css from './App.module.css';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const lastMovieRef = useRef<HTMLLIElement | null>(null);

  const handleSearchSubmit = async (query: string) => {
    setSearchQuery(query);
    setMovies([]);
    setPage(1);
    setError(null);

    setLoading(true);
    try {
      const data = await fetchMoviesByQuery(query, 1);
      setTotalPages(data.total_pages);

      if (data.results.length === 0) {
        toast('No movies found for your request.');
      } else {
        setMovies(data.results);
      }
    } catch {
      setError('There was an error fetching movies.');
      toast.error('There was an error fetching movies.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (page >= totalPages) return;

    setLoading(true);
    try {
      const data = await fetchMoviesByQuery(searchQuery, page + 1);
      setMovies(prev => [...prev, ...data.results]);
      setPage(prev => prev + 1);
    } catch {
      setError('There was an error fetching more movies.');
      toast.error('There was an error fetching more movies.');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (lastMovieRef.current) {
      lastMovieRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [movies]);

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div className={css.container}>
      <h1 className={css.title}>Movie Search</h1>
      <SearchBar onSubmit={handleSearchSubmit} />

      {loading && <Loader />}
      {error && <ErrorMessage />}
      {!loading && !error && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelect} lastMovieRef={lastMovieRef} />
          {page < totalPages && (
            <button className={css.loadMore} onClick={loadMore}>
              Load More
            </button>
          )}
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
