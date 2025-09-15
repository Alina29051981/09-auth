import axios from "axios";
import { MoviesResponse } from "../services/movieService";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string;
const BASE_URL = "https://api.themoviedb.org/3";

if (!TOKEN) {
  throw new Error;
}

export const fetchMovies = async (query: string, page: number): Promise<MoviesResponse> => {
  const { data } = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie`, {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return data;
};
