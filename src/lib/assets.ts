/**
 * Helper to resolve asset and link paths properly both on root domains (Vercel, local)
 * and subpath repositories on GitHub Pages (e.g. https://username.github.io/repo-name/).
 */
export function getAssetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!path) return path;
  if (!path.startsWith("/")) return path;
  // If base path is already prefixed or empty, return path
  if (!base || path.startsWith(base)) return path;
  return `${base}${path}`;
}
