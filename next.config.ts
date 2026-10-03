import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(isExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
