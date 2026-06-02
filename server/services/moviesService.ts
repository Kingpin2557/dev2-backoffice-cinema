import sql from "../config/db";
import type { MovieModel, Movie, MovieProto } from "../models/movies";

export const movieQueries: MovieModel = {
  async getAll(): Promise<Movie[]> {
    const data = await sql<Movie[]>`
      SELECT * FROM "Movie"
    `;
    return data ?? [];
  },

  async get(id: number): Promise<Movie | null> {
    const data = await sql<Movie[]>`
      SELECT * FROM "Movie" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  async create(data: MovieProto): Promise<Movie> {
    const [newMovie] = await sql<Movie[]>`
      INSERT INTO "Movie" (title, "posterUrl", "trailerUrl", description, "durationMinutes")
      VALUES (${data.title}, ${data.posterUrl}, ${data.trailerUrl}, ${data.description}, ${data.durationMinutes})
      RETURNING *
    `;
    return newMovie;
  },

  async update(
    data: Partial<MovieProto> & { id: number },
  ): Promise<Movie | null> {
    const { id, ...payload } = data;

    const result = await sql<Movie[]>`
        UPDATE "Movie"
        SET
          title = COALESCE(${payload.title ?? null}, title),
          "posterUrl" = COALESCE(${payload.posterUrl ?? null}, "posterUrl"),
          "trailerUrl" = COALESCE(${payload.trailerUrl ?? null}, "trailerUrl"),
          description = COALESCE(${payload.description ?? null}, description),
          "durationMinutes" = COALESCE(${payload.durationMinutes ?? null}, "durationMinutes")
        WHERE id = ${id}
        RETURNING *
      `;

    return result[0] ?? null;
  },
  async delete(id: number): Promise<boolean> {
    const result = await sql`
      DELETE FROM "Movie" WHERE id = ${id}
    `;
    return result.count > 0;
  },

  async getByDuration(duration: number): Promise<Movie[]> {
    const data = await sql<Movie[]>`
      SELECT * FROM "Movie" WHERE "durationMinutes" <= ${duration}
    `;
    return data ?? [];
  },
};
