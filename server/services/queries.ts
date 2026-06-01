import sql from "../config/db";

import type { Customer } from "../models/customer";
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

export const customerQueries = {
  queryAll: () => sql<Customer[]>`SELECT * FROM "Customer"`,
  queryById: (id: string) => sql<Customer[]>`
    SELECT * FROM "Customer" WHERE id = ${id} LIMIT 1
  `,
  create: ({ firstname, lastname, email, phonenumber }: Customer) =>
    sql<
      Customer[]
    >`INSERT INTO "Customer" ("firstname", "lastname", "email", "phonenumber")
           VALUES (${firstname}, ${lastname}, ${email}, ${phonenumber})
           RETURNING *`,
};
