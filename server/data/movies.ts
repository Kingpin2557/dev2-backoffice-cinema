import sql from "../config/db";

import type { Movie } from "../models/movie";

export const movieQueries = {
  queryAll: () => sql<Movie[]>`SELECT * FROM "Movie"`,
  queryById: (id: string) => sql<Movie[]>`
    SELECT * FROM "Movie" WHERE id = ${id} LIMIT 1
  `,
  create: ({
    title,
    posterUrl,
    trailerUrl,
    description,
    durationMinutes,
  }: Movie) => sql<
    Movie[]
  >`INSERT INTO "Movie" ("title", "posterUrl", "trailerUrl", "description", "durationMinutes")
  VALUES (${title}, ${posterUrl}, ${trailerUrl}, ${description}, ${durationMinutes})
  RETURNING *`,
};
