import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: NodePgDatabase<Record<string, never>>;
};

export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL;
}

export function isDbConfigured(): boolean {
  const url = getDatabaseUrl();
  return Boolean(url && url.trim().length > 0);
}

export function getPool(): Pool | null {
  const url = getDatabaseUrl();
  if (!url) return null;
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    globalForDb.__arenaNextJsPostgresqlPool = new Pool({
      connectionString: url,
    });
  }
  return globalForDb.__arenaNextJsPostgresqlPool;
}

export function getDb(): NodePgDatabase<Record<string, never>> | null {
  const currentPool = getPool();
  if (!currentPool) return null;
  if (!globalForDb.__arenaNextJsPostgresqlDb) {
    globalForDb.__arenaNextJsPostgresqlDb = drizzle(currentPool);
  }
  return globalForDb.__arenaNextJsPostgresqlDb;
}

export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const realPool = getPool();
    if (!realPool) {
      throw new Error("DATABASE_URL is not configured in environment variables.");
    }
    const val = (realPool as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === "function" ? val.bind(realPool) : val;
  },
});

export const db: NodePgDatabase<Record<string, never>> = new Proxy(
  {} as NodePgDatabase<Record<string, never>>,
  {
    get(_target, prop) {
      const realDb = getDb();
      if (!realDb) {
        throw new Error("DATABASE_URL is not configured in environment variables.");
      }
      const val = (realDb as unknown as Record<string | symbol, unknown>)[prop];
      return typeof val === "function" ? val.bind(realDb) : val;
    },
  },
);
