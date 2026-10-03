/**
 * Base path helper for GitHub Pages project sites.
 *
 * When the site is hosted as `username.github.io/repo-name/`, the build sets
 * NEXT_PUBLIC_BASE_PATH=/repo-name and Next.js prefixes router navigation
 * automatically. Plain `<img src>` / `<a href>` / `fetch()` calls do NOT get
 * that prefix automatically, so they must go through `withBasePath()`.
 */
export function getBasePath(): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!basePath || basePath === "/") return "";
  return basePath.startsWith("/") ? basePath : `/${basePath}`;
}

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  const basePath = getBasePath();
  if (!basePath) return path;
  if (path === "/") return `${basePath}/`;
  if (path.startsWith(`${basePath}/`) || path === basePath) return path;
  return `${basePath}${path}`;
}

export function isStaticDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
}
