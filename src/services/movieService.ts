import axios from 'axios';
import type { Movie } from '../types/movie';

const myKey = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  moviename: string,
  page: number
): Promise<MoviesHttpResponse> => {
  const config = {
    params: {
      query: moviename,
      include_adult: false,
      language: 'en-US',
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  };

  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    config
  );

  return response.data;
};
