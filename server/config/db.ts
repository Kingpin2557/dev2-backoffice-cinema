import postgres, { type Sql } from "postgres";

const postgressUrl: string = String(process.env.POSTGRES_URL);

const sql: Sql = postgres(postgressUrl);

export default sql;
