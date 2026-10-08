import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinEd — онлайн-школа фінансової грамотності",
  description:
    "Онлайн-школа фінансової грамотності для дітей до 16 років, молоді 16–30 і дорослих 30–60+. Навчайся у власному темпі або з кураторами.",
  applicationName: "FinEd",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="antialiased">{children}</body>
    </html>
  );
}
