import { fetchMovie } from '@/lib/fetchers';

export const getMovieQueryOptions = (movieId: string) => ({
  queryKey: ['movie', movieId],
  queryFn: () => fetchMovie(movieId),
});
