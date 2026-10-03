import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CabinetLocalFallback } from "@/components/cabinet-local-fallback";
import { CabinetView } from "@/components/cabinet-view";
import { db, hasDatabase } from "@/db";
import { purchases } from "@/db/schema";
import { DEMO_PURCHASE_IDS, getDemoPurchase } from "@/lib/demo-store";
import { getCourse, getPlan, isCourseId, isPlanId } from "@/lib/school";

/**
 * Pre-render demo cabinets so they work on static hosting (GitHub Pages)
 * without any database. Real purchases are rendered on demand by the server.
 */
export async function generateStaticParams() {
  return DEMO_PURCHASE_IDS.map((purchaseId) => ({ purchaseId }));
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatEnrolledOn(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Kyiv",
  }).format(date);
}

export default async function StudentCabinet({
  params,
}: {
  params: Promise<{ purchaseId: string }>;
}) {
  const { purchaseId } = await params;

  // Offline demo cabinets — no database needed (used by GitHub Pages).
  const demo = getDemoPurchase(purchaseId);
  if (demo) {
    const course = getCourse(demo.courseId);
    const plan = getPlan(demo.planId);
    if (!course || !plan) notFound();
    return (
      <CabinetView
        purchaseId={demo.id}
        buyerName={demo.buyerName}
        buyerEmail={demo.buyerEmail}
        enrolledOn={formatEnrolledOn(demo.createdAt)}
        course={course}
        plan={plan}
      />
    );
  }

  // Browser-only purchases created on static hosting (local-...) are resolved
  // on the client from localStorage.
  if (purchaseId.startsWith("local-")) {
    return <CabinetLocalFallback purchaseId={purchaseId} />;
  }

  if (!UUID_PATTERN.test(purchaseId)) {
    notFound();
  }

  if (!hasDatabase()) {
    return <CabinetLocalFallback purchaseId={purchaseId} />;
  }

  try {
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.id, purchaseId))
      .limit(1);

    if (!purchase || !isCourseId(purchase.courseId) || !isPlanId(purchase.planId)) {
      // Might be a browser-only purchase with a server-like id — let the client check.
      return <CabinetLocalFallback purchaseId={purchaseId} />;
    }

    const course = getCourse(purchase.courseId);
    const plan = getPlan(purchase.planId);
    if (!course || !plan) notFound();

    return (
      <CabinetView
        purchaseId={purchase.id}
        buyerName={purchase.buyerName}
        buyerEmail={purchase.buyerEmail}
        enrolledOn={formatEnrolledOn(purchase.createdAt)}
        course={course}
        plan={plan}
      />
    );
  } catch (error) {
    console.error("Unable to load course purchase", error);
    return <CabinetLocalFallback purchaseId={purchaseId} />;
  }
}
