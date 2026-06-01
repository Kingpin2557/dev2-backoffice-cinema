import postgres, { Sql } from "postgres";

import dotenv from "dotenv";
dotenv.config();
const postgressUrl: string = String(process.env.POSTGRES_URL);

const sql: Sql = postgres(postgressUrl);

export default sql;
