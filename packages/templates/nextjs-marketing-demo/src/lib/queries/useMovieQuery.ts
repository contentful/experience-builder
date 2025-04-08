'use client';

import { useQuery } from '@tanstack/react-query';
import { getMovieQueryOptions } from '@/lib/queries/queryOptions';

export const useMovieQuery = (movieId: string) => useQuery(getMovieQueryOptions(movieId));
