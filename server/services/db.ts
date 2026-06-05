import postgres, { Sql } from "postgres";
import dotenv from "dotenv";

dotenv.config();

const postgressUrl: string = String(process.env.POSTGRES_URL);
const sql: Sql = postgres(postgressUrl, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

export default sql;
