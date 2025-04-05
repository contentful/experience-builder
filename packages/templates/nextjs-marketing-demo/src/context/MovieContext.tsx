'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { fetchMovieData, MovieState, MovieProviderProps } from './movieApi';

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export interface MovieContextType {
  movies: Record<string, MovieState>;
  fetchMovie: (movieId: string) => Promise<void>;
}

export const useMovie = (movieId: string): MovieState => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovie must be used within a MovieProvider');

  const { fetchMovie, movies } = context;
  const movie = movies[movieId];

  useEffect(() => {
    console.log('Movie context:', movie);
    if (!movie) {
      // CSR support if movie wasn't pre-fetched, with all its pros/cons.
      fetchMovie(movieId);
    }
  }, [movieId, movie, fetchMovie]);

  return movie ?? { loading: true };
};

export const MovieProvider: React.FC<MovieProviderProps> = ({ initialMovies = {}, children }) => {
  const [movies, setMovies] = useState<Record<string, MovieState>>(initialMovies);
  const fetchingMovies = useRef(new Set<string>()); // Track in-flight fetch requests

  const fetchMovie = useCallback(
    async (movieId: string) => {
      if (movies[movieId] || fetchingMovies.current.has(movieId)) {
        return;
      }

      fetchingMovies.current.add(movieId); // Mark this movie as being fetched

      setMovies((prev) => ({ ...prev, [movieId]: { loading: true } }));

      try {
        const movieData = await fetchMovieData(movieId);
        setMovies((prevMovies) => ({
          ...prevMovies,
          [movieId]: { data: movieData, loading: false },
        }));
      } catch (error) {
        setMovies((prevMovies) => ({
          ...prevMovies,
          [movieId]: { error: error as Error, loading: false },
        }));
      } finally {
        fetchingMovies.current.delete(movieId);
      }
    },
    [movies],
  );

  return <MovieContext.Provider value={{ movies, fetchMovie }}>{children}</MovieContext.Provider>;
};
