#!/usr/bin/env node
/**
 * Sitemap generator — runs before `vite build`.
 *
 * Canonical, app-independent implementation distributed from the
 * orchestrator (`.claude/sync/scripts/`). Do NOT edit per-repo: changes
 * belong in the orchestrator and are re-synced to every project.
 *
 * Reads PUBLIC_ROUTES from src/lib/seo/sitemap-routes.ts (the per-repo
 * single source of truth for indexable routes) and writes
 * public/sitemap.xml deterministically. Output is stable when routes are
 * unchanged, so the CI drift check (git diff, ignoring <lastmod>) only
 * triggers on real route changes.
 *
 * Self-guarding: if src/lib/seo/sitemap-routes.ts does not exist, this
 * script exits 0 with a skip notice. This keeps the universally
 * distributed file harmless in repos that have no public web routes
 * (mobile, backend). To wire sitemap generation into a project, run the
 * `/setup-sitemap` skill.
 *
 * Contract: orchestrator `.claude/ref/growth/seo.md` §7
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ROUTES_FILE = resolve(ROOT, "src/lib/seo/sitemap-routes.ts");
const OUTPUT_FILE = resolve(ROOT, "public/sitemap.xml");

if (!existsSync(ROUTES_FILE)) {
  console.log(
    `[sitemap] No ${ROUTES_FILE} — skipping (run /setup-sitemap to enable).`,
  );
  process.exit(0);
}

// Resolve the production domain: APP_URL env wins, else package.json
// `homepage`. Hard-fail rather than guess a wrong domain across repos.
const PKG_FILE = resolve(ROOT, "package.json");
let pkgHomepage = "";
if (existsSync(PKG_FILE)) {
  try {
    pkgHomepage = JSON.parse(readFileSync(PKG_FILE, "utf8")).homepage ?? "";
  } catch {
    pkgHomepage = "";
  }
}

const APP_URL = process.env.APP_URL ?? pkgHomepage;

if (!APP_URL) {
  console.error(
    "[sitemap] No production domain — set APP_URL or package.json `homepage`.",
  );
  process.exit(1);
}

if (!APP_URL.startsWith("https://")) {
  console.error(`[sitemap] APP_URL must be an https URL, got: ${APP_URL}`);
  process.exit(1);
}

const ORIGIN = APP_URL.replace(/\/$/, "");

const today = new Date().toISOString().slice(0, 10);

const source = readFileSync(ROUTES_FILE, "utf8");

const arrayMatch = source.match(
  /PUBLIC_ROUTES[^=]*=\s*\[([\s\S]*?)\]\s*as\s+const/,
);

if (!arrayMatch) {
  console.error(
    `[sitemap] Could not locate PUBLIC_ROUTES array in ${ROUTES_FILE}`,
  );
  process.exit(1);
}

const entryRegex =
  /\{\s*path:\s*"([^"]+)"\s*,\s*priority:\s*([0-9.]+)\s*,\s*changefreq:\s*"(daily|weekly|monthly|yearly)"\s*\}/g;

const routes = [];
let match;
while ((match = entryRegex.exec(arrayMatch[1])) !== null) {
  routes.push({
    path: match[1],
    priority: Number(match[2]),
    changefreq: match[3],
  });
}

if (routes.length === 0) {
  console.error(`[sitemap] No routes parsed from ${ROUTES_FILE}`);
  process.exit(1);
}

const urls = routes
  .map(({ path, priority, changefreq }) => {
    const loc = path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(OUTPUT_FILE, xml, "utf8");

console.log(
  `[sitemap] wrote ${routes.length} routes to ${OUTPUT_FILE} (lastmod=${today})`,
);
