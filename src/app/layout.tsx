import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Empire Business School — практична освіта для бізнесу",
  description:
    "Практичні програми з підприємництва, лідерства, маркетингу та фінансів. Навчайся з менторами й розвивай бізнес у своєму темпі.",
  applicationName: "Empire Business School",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="antialiased">{children}</body>
    </html>
  );
}
