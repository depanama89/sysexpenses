import pg from "pg";
import env from "../utils/validateEnv";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.POSTGRES_URL,
});
