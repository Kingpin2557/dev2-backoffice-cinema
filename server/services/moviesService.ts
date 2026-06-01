import sql from "../config/db";

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  durationMinutes: number;
}

export async function movies(): Promise<Movie[]> {
  const data: Movie[] = await sql<Movie[]>`SELECT * FROM "Movie"`;
  return data ?? null;
}

export async function movieById(id: string): Promise<Movie> {
  const data: Movie[] = await sql<Movie[]>`
    SELECT * FROM "Movie" WHERE id = ${id} LIMIT 1
  `;
  return data[0] ?? null;
}

export async function movieCreate(movie: Movie): Promise<Movie> {
  const { title, posterUrl, trailerUrl, description, durationMinutes } = movie;

  const data = await sql<
    Movie[]
  >`INSERT INTO "Movie" ("title", "posterUrl", "trailerUrl", "description", "durationMinutes")
  VALUES (${title}, ${posterUrl}, ${trailerUrl}, ${description}, ${durationMinutes})
  RETURNING *`;
  return data[0] ?? null;
}
