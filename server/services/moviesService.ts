import { type Movie } from "../models/movie";

import { movieQueries } from "../data/movies";

export async function movies(): Promise<Movie[]> {
  const data: Movie[] = await movieQueries.queryAll();
  return data ?? null;
}

export async function movieById(slug: string): Promise<Movie> {
  const data: Movie[] = await movieQueries.queryById(slug);
  return data[0] ?? null;
}

export async function movieCreate(movie: Movie): Promise<Movie> {
  const data = await movieQueries.create(movie);
  return data[0] ?? null;
}
