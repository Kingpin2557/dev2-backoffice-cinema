import { movieQueries } from "./queries";
import { type Movie } from "../models/movie";

export async function movies(): Promise<Movie[] | null> {
  const data: Movie[] = await movieQueries.queryAll();
  return data ?? null;
}

export async function movieById(slug: string): Promise<Movie | null> {
  const data: Movie[] = await movieQueries.queryById(slug);
  return data[0] ?? null;
}

export async function movieCreate(movie: Movie): Promise<Movie | null> {
  const data = await movieQueries.create(movie);
  return data[0] ?? null;
}
