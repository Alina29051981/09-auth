import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
       const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const backdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const imageSrc = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined;

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={backdropClick}>
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        {imageSrc && <img src={imageSrc} alt={movie.title} className={css.image} />}
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
