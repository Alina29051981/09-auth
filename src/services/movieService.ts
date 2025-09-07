import axios from 'axios';
import { Movie } from '../types/movie';

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const token = import.meta.env.VITE_TMDB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export async function fetchMoviesByQuery(
  query: string,
  page = 1
): Promise<MoviesResponse> {
  const params = {
    query,
    page,
    include_adult: false,
    language: 'en-US',
  };

  const response = await axiosInstance.get<MoviesResponse>('/search/movie', {
    params,
  });
  return response.data;
}

