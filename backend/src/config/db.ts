import { Pool, PoolClient, types } from "pg";
import { DB_POOL_MAX, DB_SSL, DB_URI } from "./constants";

types.setTypeParser(types.builtins.NUMERIC, (v) => parseFloat(v));

export const pool = new Pool({
  connectionString: DB_URI,
  max: DB_POOL_MAX,
  ssl: DB_SSL ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("[db] unexpected idle client error", err);
});

export type Db = Pick<PoolClient, "query">;

export const withTransaction = async <T>(fn: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
