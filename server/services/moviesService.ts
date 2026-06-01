import { movieQueries } from "./queries";

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  durationMinutes: number;
}

export async function getMovies(): Promise<Movie[]> {
  const data: Movie[] = await movieQueries.queryAll();

  return data ?? null;
}

export async function getMovieById(slug: string): Promise<Movie | null> {
  const data: Movie[] = await movieQueries.queryMovie(slug);

  return data[0] ?? null;
}
