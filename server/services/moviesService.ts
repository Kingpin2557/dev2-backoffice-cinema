import sql from "./db";
import type { Movie, MovieProto } from "../models/movies";

export const movieQueries = {
  async getAll() {
    const data = await sql<Movie[]>`
      SELECT * FROM "Movie" ORDER BY id
    `;
    return data ?? [];
  },

  async get(id: number) {
    const data = await sql<Movie[]>`
      SELECT * FROM "Movie" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  async create(data: MovieProto) {
    const [newMovie] = await sql<Movie[]>`
      INSERT INTO "Movie" (title, "posterUrl", "trailerUrl", description, "durationMinutes")
      VALUES (${data.title}, ${data.posterUrl}, ${data.trailerUrl}, ${data.description}, ${data.durationMinutes})
      RETURNING *
    `;
    return newMovie;
  },

  async update(data: Partial<MovieProto> & { id: number }) {
    const { id, ...payload } = data;
    const result = await sql<Movie[]>`
      UPDATE "Movie"
      SET
        "title" = COALESCE(${payload.title ?? null}, "title"),
        "posterUrl" = COALESCE(${payload.posterUrl ?? null}, "posterUrl"),
        "trailerUrl" = COALESCE(${payload.trailerUrl ?? null}, "trailerUrl"),
        "description" = COALESCE(${payload.description ?? null}, "description"),
        "durationMinutes" = COALESCE(${payload.durationMinutes ?? null}, "durationMinutes")
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0] ?? null;
  },

  async delete(id: number): Promise<Movie | null> {
    return await sql.begin(async (sql) => {
      await sql`DELETE FROM "movie_genre" WHERE "movieId" = ${id}`;
      await sql`DELETE FROM "movie_languages" WHERE "movieId" = ${id}`;
      await sql`DELETE FROM "movie_subtitles" WHERE "movieId" = ${id}`;
      await sql`DELETE FROM "movie_formats" WHERE "movieId" = ${id}`;
      await sql`DELETE FROM "Showtime" WHERE "movieId" = ${id}`;
      const result = await sql<
        Movie[]
      >`DELETE FROM "Movie" WHERE id = ${id} RETURNING *`;
      return result[0] ?? null;
    });
  },

  async getPaginated(limit: number, offset: number) {
    const data = await sql<Movie[]>`
      SELECT * FROM "Movie" ORDER BY id LIMIT ${limit} OFFSET ${offset}
    `;
    return data ?? [];
  },

  async getCount() {
    const result = await sql<[{ count: string }]>`SELECT COUNT(*) FROM "Movie"`;
    return parseInt(result[0].count);
  },

  async getByDuration(duration: number) {
    const data = await sql<Movie[]>`
      SELECT * FROM "Movie" WHERE "durationMinutes" <= ${duration}
    `;
    return data ?? [];
  },

  // --- Kiosk lookup endpoints ---

  async getAllGenres() {
    const data = await sql<{ id: number; name: string }[]>`
      SELECT id, name FROM genres ORDER BY name
    `;
    return data ?? [];
  },

  async getGenresForMovie(movieId: number) {
    const data = await sql<{ id: number; name: string }[]>`
      SELECT g.id, g.name
      FROM genres g
      JOIN movie_genre mg ON mg."genreId" = g.id
      WHERE mg."movieId" = ${movieId}
      ORDER BY g.name
    `;
    return data ?? [];
  },

  async getAllDates() {
    const data = await sql<{ date: string }[]>`
      SELECT DISTINCT DATE("startTime")::text AS date
      FROM "Showtime"
      ORDER BY date
    `;
    return data ?? [];
  },

  async getDatesForMovie(movieId: number) {
    const data = await sql<{ date: string }[]>`
      SELECT DISTINCT DATE("startTime")::text AS date
      FROM "Showtime"
      WHERE "movieId" = ${movieId}
      ORDER BY date
    `;
    return data ?? [];
  },

  async getLanguagesForMovie(movieId: number) {
    const data = await sql<{ id: number; name: string; display: string }[]>`
      SELECT l.id, l.name, l.display
      FROM languages l
      JOIN movie_languages ml ON ml."languageId" = l.id
      WHERE ml."movieId" = ${movieId}
      ORDER BY l.name
    `;
    return data ?? [];
  },

  async getFormatsForMovie(movieId: number) {
    const data = await sql<{ id: number; name: string }[]>`
      SELECT DISTINCT f.id, f.name
      FROM formats f
      JOIN "Room" r ON r."projectionFormatId" = f.id
      JOIN "Showtime" s ON s."roomId" = r.id
      WHERE s."movieId" = ${movieId}
      ORDER BY f.name
    `;
    return data ?? [];
  },
};
