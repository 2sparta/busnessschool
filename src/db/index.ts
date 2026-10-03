import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

/**
 * The database is optional at import time so that a fully static build
 * (GitHub Pages) can succeed without DATABASE_URL. Server routes check
 * `hasDatabase()` and return a proper error instead of crashing the build.
 */
export function hasDatabase(): boolean {
  return Boolean(databaseUrl);
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function getPool(): Pool {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    globalForDb.__arenaNextJsPostgresqlPool = new Pool({
      connectionString: databaseUrl,
    });
  }
  return globalForDb.__arenaNextJsPostgresqlPool;
}

const lazyPool = typeof window === "undefined" && databaseUrl ? getPool() : null;

type DbClient = ReturnType<typeof drizzle>;

function createMissingDatabaseProxy(): DbClient {
  const throwMissing = () => {
    throw new Error("DATABASE_URL is required");
  };
  return new Proxy(
    {},
    {
      get: throwMissing,
      apply: throwMissing,
    },
  ) as unknown as DbClient;
}

export const pool = lazyPool;
export const db: DbClient = lazyPool ? drizzle(lazyPool) : createMissingDatabaseProxy();
