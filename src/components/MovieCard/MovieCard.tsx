import { Movie } from "../../types/movie";
import css from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : undefined;

  return (
    <div className={css.card} onClick={() => onSelect(movie)}>
      {posterUrl ? (
        <img src={posterUrl} alt={movie.title} />
      ) : (
        <div className={css.noImage}>No Image</div>
      )}
      <h3>{movie.title}</h3>
      <p>{movie.release_date}</p>
    </div>
  );
}
