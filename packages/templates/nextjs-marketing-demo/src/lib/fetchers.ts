const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const isServer = typeof window === 'undefined';
const baseUrl = isServer ? appUrl : '';

export const fetchMovie = async (movieId: string): Promise<Movie> => {
  const url = `${baseUrl}/api/movie/${encodeURIComponent(movieId)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch movie data for ID: ${movieId}`);
  return res.json();
};
