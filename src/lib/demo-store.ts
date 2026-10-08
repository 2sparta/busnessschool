import { isCourseId, isPlanId, type CourseId, type PlanId } from "@/lib/school";

export type StoredPurchase = {
  id: string;
  courseId: CourseId;
  planId: PlanId;
  buyerName: string;
  buyerEmail: string;
  /** ISO date string, so it can be stored in localStorage safely. */
  createdAt: string;
};

const STORAGE_KEY = "empire-purchases-v1";
const LAST_KEY = "empire-last-purchase-v1";

export const DEMO_PURCHASE_IDS = ["demo-start", "demo-mentorship", "demo-vip"] as const;

export type DemoPurchaseId = (typeof DEMO_PURCHASE_IDS)[number];

const DEMO_SEED: Record<DemoPurchaseId, StoredPurchase> = {
  "demo-start": {
    id: "demo-start",
    courseId: "age-16-30",
    planId: "start",
    buyerName: "Олександр Демченко",
    buyerEmail: "demo@empire.school",
    createdAt: new Date("2026-09-01T09:00:00+03:00").toISOString(),
  },
  "demo-mentorship": {
    id: "demo-mentorship",
    courseId: "under-16",
    planId: "mentorship",
    buyerName: "Ольга Демченко",
    buyerEmail: "demo@empire.school",
    createdAt: new Date("2026-09-05T09:00:00+03:00").toISOString(),
  },
  "demo-vip": {
    id: "demo-vip",
    courseId: "age-30-60",
    planId: "vip",
    buyerName: "Богдан Демченко",
    buyerEmail: "demo@empire.school",
    createdAt: new Date("2026-09-10T09:00:00+03:00").toISOString(),
  },
};

export function isDemoPurchaseId(value: unknown): value is DemoPurchaseId {
  return typeof value === "string" && (DEMO_PURCHASE_IDS as readonly string[]).includes(value);
}

export function getDemoPurchase(id: string): StoredPurchase | null {
  if (!isDemoPurchaseId(id)) return null;
  return DEMO_SEED[id];
}

export function isLocalPurchaseId(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("local-");
}

function readAllLocal(): StoredPurchase[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is StoredPurchase => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return (
        typeof candidate.id === "string" &&
        isCourseId(candidate.courseId) &&
        isPlanId(candidate.planId) &&
        typeof candidate.buyerName === "string" &&
        typeof candidate.buyerEmail === "string" &&
        typeof candidate.createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

function writeAllLocal(purchases: StoredPurchase[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases.slice(-20)));
  } catch {
    // Storage may be unavailable (private mode) — the cabinet still works for the session.
  }
}

export function createLocalPurchase(input: {
  courseId: CourseId;
  planId: PlanId;
  buyerName: string;
  buyerEmail: string;
}): StoredPurchase {
  const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const purchase: StoredPurchase = {
    id,
    courseId: input.courseId,
    planId: input.planId,
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    createdAt: new Date().toISOString(),
  };
  const all = readAllLocal().filter((item) => item.id !== id);
  writeAllLocal([...all, purchase]);
  try {
    window.localStorage.setItem(LAST_KEY, id);
  } catch {
    // ignore
  }
  return purchase;
}

export function getLocalPurchase(id: string): StoredPurchase | null {
  return readAllLocal().find((item) => item.id === id) ?? null;
}

/** Demo seed first, then browser storage. Works without any server. */
export function getAnyOfflinePurchase(id: string): StoredPurchase | null {
  return getDemoPurchase(id) ?? getLocalPurchase(id);
}

export function getLastOfflinePurchaseId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
}
