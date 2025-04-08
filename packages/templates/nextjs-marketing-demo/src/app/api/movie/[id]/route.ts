import { NextRequest, NextResponse } from 'next/server';

const API_OMDB = process.env.NEXT_PUBLIC_API_OMDB;
if (!API_OMDB) throw new Error('Missing .env variable NEXT_PUBLIC_API_OMDB');

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const url = `https://www.omdbapi.com/?i=${encodeURIComponent(params.id)}&apikey=${API_OMDB}`;

  let data;
  try {
    const res = await fetch(url);
    data = await res.json();
  } catch (err) {
    console.error('Network error while fetching from OMDB:', err);
    return NextResponse.json({ error: 'Failed to reach OMDB.' }, { status: 502 });
  }

  if (data.Response === 'False') {
    const status = mapOmdbErrorToStatus(data.Error);
    return NextResponse.json({ error: data.Error }, { status });
  }
  return NextResponse.json(data);
}

function mapOmdbErrorToStatus(error: string): number {
  if (error === 'Movie not found!') return 404;
  if (error === 'Invalid API key!') {
    // No need to communicate to client.
    console.log('Incorrect OMDb API key!');
  }
  if (error === 'Request limit reached!') return 429;
  if (error === 'Too many results.') return 400;

  console.log('Unexpected OMDb API error:', error);
  return 502; // Fallback for unknown errors.
}
