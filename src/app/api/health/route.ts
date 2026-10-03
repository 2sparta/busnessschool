import { db, hasDatabase } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabase()) {
    return Response.json({ ok: true, mode: "demo" });
  }
  try {
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, mode: "db" });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
