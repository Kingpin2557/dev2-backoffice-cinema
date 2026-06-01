import sql from "./db";
import { type Movie } from "./moviesService";

export const movieQueries = {
  queryAll: () => sql<Movie[]>`SELECT * FROM "Movie"`,
  queryMovie: (id: string) => sql<Movie[]>`
    SELECT * FROM "Movie" WHERE id = ${id} LIMIT 1
  `,
};
