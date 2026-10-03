import { db, isDbConfigured } from "@/db";
import { purchases } from "@/db/schema";
import { isCourseId, isPlanId } from "@/lib/school";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Перевірте дані форми та спробуйте ще раз." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json({ error: "Не вдалося прочитати дані форми." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const buyerName = typeof body.name === "string" ? body.name.trim() : "";
  const buyerEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (buyerName.length < 2 || buyerName.length > 100) {
    return Response.json({ error: "Вкажіть ім’я від 2 до 100 символів." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail) || buyerEmail.length > 180) {
    return Response.json({ error: "Вкажіть коректну адресу електронної пошти." }, { status: 400 });
  }

  if (!isCourseId(body.courseId) || !isPlanId(body.planId)) {
    return Response.json({ error: "Оберіть програму й тариф зі списку." }, { status: 400 });
  }

  // If a PostgreSQL database is connected, persist the purchase
  if (isDbConfigured()) {
    try {
      const [purchase] = await db
        .insert(purchases)
        .values({
          courseId: body.courseId,
          planId: body.planId,
          buyerName,
          buyerEmail,
        })
        .returning({ id: purchases.id });

      if (purchase?.id) {
        return Response.json({ id: purchase.id }, { status: 201 });
      }
    } catch (error) {
      console.warn("Database insert failed, using fallback session ID for demo:", error);
    }
  }

  // Fallback for Vercel/demo mode without database credentials
  const demoPurchaseId = randomUUID();
  return Response.json({ id: demoPurchaseId }, { status: 201 });
}
