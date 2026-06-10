import sql from "./db";
import type { PlayingMovie, Showtime, ShowtimeSlot, ShowtimeProto } from "../models/showtimes";

export const showtimeQueries = {
  async getAll() {
    const data = await sql<Showtime[]>`
      SELECT * FROM "Showtime" ORDER BY "startTime"
    `;
    return data ?? [];
  },

  async get(id: number) {
    const data = await sql<Showtime[]>`
      SELECT * FROM "Showtime" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  async create(data: ShowtimeProto) {
    const [newShowtime] = await sql<Showtime[]>`
      INSERT INTO "Showtime" ("roomId", "movieId", "startTime", "endTime")
      VALUES (${data.roomId}, ${data.movieId}, ${data.startTime}, ${data.endTime})
      RETURNING *
    `;
    return newShowtime;
  },

  async update(data: Partial<ShowtimeProto> & { id: number }) {
    const { id, ...payload } = data;
    const result = await sql<Showtime[]>`
      UPDATE "Showtime"
      SET
        "roomId"    = COALESCE(${payload.roomId    ?? null}, "roomId"),
        "movieId"   = COALESCE(${payload.movieId   ?? null}, "movieId"),
        "startTime" = COALESCE(${payload.startTime ?? null}, "startTime"),
        "endTime"   = COALESCE(${payload.endTime   ?? null}, "endTime")
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0] ?? null;
  },

  async delete(id: number) {
    const result = await sql<Showtime[]>`
      DELETE FROM "Showtime" WHERE id = ${id} RETURNING *
    `;
    return result[0] ?? null;
  },

  // --- Kiosk endpoints ---

  /**
   * Returns every movie that has at least one showtime, enriched with
   * genres, language and subtitles — ready for the MovieSelection view.
   */
  async getPlayingMovies() {
    const data = await sql<PlayingMovie[]>`
      SELECT
        m.id,
        m.title,
        m."posterUrl",
        m."trailerUrl",
        m.description,
        m."durationMinutes",
        COALESCE(
          json_agg(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL),
          '[]'
        ) AS genres,
        COALESCE(
          json_agg(DISTINCT DATE(s."startTime")::text) FILTER (WHERE s."startTime" IS NOT NULL),
          '[]'
        ) AS dates,
        lang.name              AS language,
        lang.display           AS "languageDisplay",
        string_agg(DISTINCT sub.name, '/' ORDER BY sub.name) AS subtitles
      FROM "Movie" m
      JOIN "Showtime" s       ON s."movieId"  = m.id
      LEFT JOIN movie_genre mg   ON mg."movieId" = m.id
      LEFT JOIN genres g         ON g.id         = mg."genreId"
      LEFT JOIN movie_languages ml ON ml."movieId" = m.id
      LEFT JOIN languages lang   ON lang.id       = ml."languageId"
      LEFT JOIN movie_subtitles ms ON ms."movieId" = m.id
      LEFT JOIN subtitles sub    ON sub.id         = ms."subtitleId"
      GROUP BY m.id, lang.name, lang.display
      ORDER BY m.id
    `;
    return data ?? [];
  },

  /**
   * Returns the unique calendar dates on which any showtime occurs.
   */
  async getUniqueDates() {
    const data = await sql<{ date: string }[]>`
      SELECT DISTINCT DATE("startTime")::text AS date
      FROM "Showtime"
      ORDER BY date
    `;
    return data ?? [];
  },

  /**
   * Returns every showtime for a given movie, enriched with room name
   * and format — ready for the RoomSelection view.
   */
  async getShowtimesForMovie(movieId: number) {
    const data = await sql<ShowtimeSlot[]>`
      SELECT
        s.id,
        s."startTime",
        s."endTime",
        r.id            AS "roomId",
        r.name          AS "roomName",
        f.name          AS "formatName",
        lang.name       AS language,
        lang.display    AS "languageDisplay"
      FROM "Showtime" s
      JOIN "Room" r          ON r.id   = s."roomId"
      LEFT JOIN formats f    ON f.id   = r."projectionFormatId"
      LEFT JOIN movie_languages ml ON ml."movieId" = s."movieId"
      LEFT JOIN languages lang     ON lang.id       = ml."languageId"
      WHERE s."movieId" = ${movieId}
      ORDER BY r.id, s."startTime"
    `;
    return data ?? [];
  },
};
