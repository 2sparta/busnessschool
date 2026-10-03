#!/usr/bin/env node
/**
 * Static export script for GitHub Pages deployment.
 * 
 * It:
 * 1. Temporarily disables server API routes during static export
 * 2. Runs `next build` with NEXT_EXPORT=true
 * 3. Generates `out/.nojekyll` and `out/404.html` for GitHub Pages compatibility
 * 4. Safely restores API routes for local development and server runs
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("\n🏛️  Empire Business School — GitHub Pages Static Export");
console.log("=======================================================\n");

const rootDir = process.cwd();
const apiDir = path.join(rootDir, "src", "app", "api");
const tempApiDir = path.join(rootDir, "src", "app", "_api_disabled_gh_pages");
let apiMoved = false;

try {
  if (fs.existsSync(apiDir)) {
    console.log("📦 1. Temporarily disabling server API routes for static export...");
    fs.renameSync(apiDir, tempApiDir);
    apiMoved = true;
  }

  // Determine base path:
  // If explicitly given via NEXT_PUBLIC_BASE_PATH, use it.
  // Otherwise if running inside GitHub Actions with GITHUB_REPOSITORY (e.g. "octocat/business-school"),
  // use "/business-school" unless it's a user/org page like "octocat.github.io".
  let basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!basePath && process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split("/");
    const repoName = parts[1];
    if (repoName && !repoName.toLowerCase().endsWith(".github.io")) {
      basePath = `/${repoName}`;
    }
  }

  console.log(`🌐 2. Target Base Path: ${basePath || "/ (root)"}`);
  console.log("⚡ 3. Compiling Next.js static pages with Turbopack...");

  const env = {
    ...process.env,
    NEXT_EXPORT: "true",
    NEXT_PUBLIC_BASE_PATH: basePath,
    NODE_ENV: "production",
  };

  execSync("npx next build", {
    stdio: "inherit",
    env,
  });

  const outDir = path.join(rootDir, "out");
  if (fs.existsSync(outDir)) {
    // Critical: GitHub Pages uses Jekyll by default, which ignores folders starting with "_" like "_next"
    const nojekyllPath = path.join(outDir, ".nojekyll");
    fs.writeFileSync(nojekyllPath, "");
    console.log("✅ 4. Created out/.nojekyll (disables Jekyll so _next static files load)");

    // Ensure 404.html exists for GitHub Pages routing
    const notFoundSource = path.join(outDir, "_not-found.html");
    const fourOhFourTarget = path.join(outDir, "404.html");
    if (fs.existsSync(notFoundSource)) {
      fs.copyFileSync(notFoundSource, fourOhFourTarget);
      console.log("✅ 5. Created out/404.html for GitHub Pages navigation");
    } else {
      const indexSource = path.join(outDir, "index.html");
      if (fs.existsSync(indexSource)) {
        fs.copyFileSync(indexSource, fourOhFourTarget);
        console.log("✅ 5. Created out/404.html fallback from index.html");
      }
    }
  }

  console.log("\n🎉 Static export ready in ./out directory!");
  console.log("🚀 You can now publish the contents of './out' directly to GitHub Pages.\n");
} catch (error) {
  console.error("\n❌ Export failed:", error);
  process.exitCode = 1;
} finally {
  if (apiMoved && fs.existsSync(tempApiDir)) {
    console.log("🔄 Restoring server API routes...");
    fs.renameSync(tempApiDir, apiDir);
    console.log("✅ API routes restored successfully.\n");
  }
}
