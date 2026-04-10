import { useEffect, useState } from 'react';
import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { MovieModal } from '../MovieModal/MovieModal';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';
type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [movieName, setMovieName] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', movieName, page],
    queryFn: () => fetchMovies(movieName, page),
    enabled: movieName !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && !data.results.length) {
      toast.error('No movies found for your request.');
    }
  }, [data, isSuccess]);

  const handleSearch = (newMovieName: string) => {
    setMovieName(newMovieName);
    setPage(1);
  };

  const totalPages = data?.total_pages ?? 0;

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.App}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && totalPages > 1 && (
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

      {data && <MovieGrid movies={data.results} onSelect={handleSelectMovie} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      <Toaster />
    </div>
  );
}
