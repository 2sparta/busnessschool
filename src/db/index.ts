import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Database client is fully lazy so `next build` on Vercel succeeds
 * even when DATABASE_URL is not set.
 *
 * - Import time: never throws, never opens a connection.
 * - Request time: server routes check `hasDatabase()` first.
 * - If the database is used without DATABASE_URL, a clear error is thrown.
 */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

const globalForDb = globalThis as typeof globalThis & {
  __empirePool?: Pool;
  __empireDb?: ReturnType<typeof drizzle>;
};

function getDatabase(): ReturnType<typeof drizzle> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }
  if (!globalForDb.__empireDb) {
    if (!globalForDb.__empirePool) {
      globalForDb.__empirePool = new Pool({ connectionString: databaseUrl });
    }
    globalForDb.__empireDb = drizzle(globalForDb.__empirePool);
  }
  return globalForDb.__empireDb;
}

type DbClient = ReturnType<typeof drizzle>;

/**
 * A proxy that looks like the drizzle client but only connects
 * on the first actual query. Accessing any property triggers lazy init.
 */
export const db: DbClient = new Proxy({} as DbClient, {
  get(_target, prop, receiver) {
    const real = getDatabase();
    const value = Reflect.get(real as unknown as Record<PropertyKey, unknown>, prop, receiver);
    return typeof value === "function" ? (value as (...a: never[]) => unknown).bind(real) : value;
  },
  apply(_target, _thisArg, args) {
    const real = getDatabase() as unknown as (...a: unknown[]) => unknown;
    return real(...args);
  },
});

export const pool: Pool | null = null;
