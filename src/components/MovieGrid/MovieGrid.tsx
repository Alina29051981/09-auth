import React from 'react';
import { Movie } from '../../types/movie';
import css from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  lastMovieRef?: React.Ref<HTMLLIElement>;
}

// Функція для формування URL зображення
const getImageUrl = (path?: string | null): string | undefined =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : undefined;

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect, lastMovieRef }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <ul className={css.grid}>
      {movies.map((movie, index) => (
        <li
          key={movie.id}
          ref={index === movies.length - 1 ? lastMovieRef : null}
        >
          <div
            className={css.card}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(movie)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSelect(movie);
            }}
          >
            <img
              className={css.image}
              src={getImageUrl(movie.poster_path)}
              alt={movie.title ?? 'Movie poster'}
              loading="lazy"
            />
            <h2 className={css.title}>{movie.title ?? 'No title'}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
