"use client";

import { useEffect, useState } from "react";
import { CabinetView } from "@/components/cabinet-view";
import { Icon } from "@/components/icon";
import { withBasePath } from "@/lib/base-path";
import { getAnyOfflinePurchase, type StoredPurchase } from "@/lib/demo-store";
import { getCourse, getPlan } from "@/lib/school";

function formatEnrolledOn(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Kyiv",
    }).format(new Date(isoDate));
  } catch {
    return new Date(isoDate).toLocaleDateString("uk-UA");
  }
}

export function CabinetLocalFallback({ purchaseId }: { purchaseId: string }) {
  const [purchase, setPurchase] = useState<StoredPurchase | null | undefined>(undefined);
  const home = withBasePath("/");

  useEffect(() => {
    setPurchase(getAnyOfflinePurchase(purchaseId));
  }, [purchaseId]);

  if (purchase === undefined) {
    return (
      <main className="page-frame cabinet-page">
        <div className="container" style={{ padding: "80px 0" }}>
          <p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Мій кабінет</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}>Завантажуємо твій кабінет…</h1>
        </div>
      </main>
    );
  }

  if (!purchase) {
    return (
      <main className="page-frame cabinet-page">
        <div className="container" style={{ padding: "80px 0", maxWidth: 640 }}>
          <p className="eyebrow eyebrow-dark"><span className="eyebrow-line" /> Мій кабінет</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, lineHeight: 1.1 }}>
            Не вдалося знайти цей запис.
          </h1>
          <p style={{ color: "#77776f", fontSize: 12, lineHeight: 1.7 }}>
            Можливо, ти відкрив кабінет в іншому браузері, очистив дані сайту або посилання застаріло.
            На статичному хостингу (GitHub Pages) записи зберігаються лише в цьому браузері.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
            <a className="button button-gold" href={home}>На головну <Icon name="arrow" size={15} /></a>
            <a className="button button-outline" href={`${home}#pricing`}>Обрати програму <Icon name="arrow" size={15} /></a>
          </div>
        </div>
      </main>
    );
  }

  const course = getCourse(purchase.courseId);
  const plan = getPlan(purchase.planId);
  if (!course || !plan) {
    return (
      <main className="page-frame cabinet-page">
        <div className="container" style={{ padding: "80px 0" }}>
          <p>Запис пошкоджено. <a href={home} style={{ textDecoration: "underline" }}>Повернутися на головну</a></p>
        </div>
      </main>
    );
  }

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
}
