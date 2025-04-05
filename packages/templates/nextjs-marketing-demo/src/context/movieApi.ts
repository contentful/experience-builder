import React from 'react';

const API_OMDB = process.env.NEXT_PUBLIC_API_OMDB;
if (!API_OMDB) throw new Error('Missing .env variable NEXT_PUBLIC_API_OMDB');

export type Movie = unknown; // TODO: Get OMDB Movie type.

export interface MovieState {
  data?: Movie;
  loading: boolean;
  error?: {
    // TODO: We can't use an Error here due to client hydration. Better solution through serialization?
    message: string;
  };
}

export interface MovieProviderProps {
  initialMovies?: Record<string, MovieState>;
  children: React.ReactNode;
}

export const fetchMovieData = async (movieId: string): Promise<Movie> => {
  const url = `https://www.omdbapi.com/?i=${encodeURIComponent(movieId)}&apikey=${API_OMDB}`;
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Failed to fetch movie data for ID: ${movieId}`);
  return res.json();
};

export const prefetchMovies = async (movieIds: string[]): Promise<Record<string, MovieState>> => {
  const fetchPromises = movieIds.map((id) => fetchMovieData(id));
  const results = await Promise.allSettled(fetchPromises);

  return movieIds.reduce<Record<string, MovieState>>((acc, id, idx) => {
    const result = results[idx];
    if (result.status === 'fulfilled') {
      acc[id] = { data: result.value, loading: false };
    } else {
      const error = { message: result.reason.message };
      acc[id] = { error, loading: false };
    }
    return acc;
  }, {});
};
