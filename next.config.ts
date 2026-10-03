import type { NextConfig } from "next";

function getBasePath(): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  if (!raw || raw === "/") return "";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
}

// On Vercel the site is served from the domain root, so basePath stays empty
// and "/images/..." resolves to "public/images/...".
// For a GitHub Pages project site (username.github.io/repo-name/) set
// NEXT_PUBLIC_BASE_PATH=/repo-name and Next.js will prefix routing,
// next/image assets and (via withBasePath()) plain links/fetch calls.
const basePath = getBasePath();

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
};

export default nextConfig;
