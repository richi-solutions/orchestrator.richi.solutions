---
name: setup-sitemap
description: Wires the sitemap + robots.txt enforcement chain into a web project — seeds sitemap-routes.ts, wires the build step, adds the CI drift check, and writes robots.txt. The generator script itself is distributed via .claude/sync and must not be hand-written. Use /setup-sitemap to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

# Setup Sitemap & Robots

Wire the sitemap generation + drift-prevention chain into this project.

**Contract reference:** Always load `.claude/ref/growth/seo.md` §7–8 first.
That document is the **single source of truth** for the sitemap mechanism,
required fields, excluded route categories, and robots.txt rules. Do NOT
deviate from it.

**Division of labour (important):**

| Artifact | Owned by | Editable per-repo? |
|----------|----------|--------------------|
| `scripts/generate-sitemap.mjs` | Orchestrator (`.claude/sync/scripts/`) | **No** — distributed, do not edit |
| `src/lib/seo/sitemap-routes.ts` | This repo | Yes — the per-repo route list |
| `package.json` build wiring | This repo | Yes |
| `.github/workflows/ci.yml` drift step | This repo | Yes |
| `public/robots.txt` | This repo | Yes |

The generator is generic and self-guarding; never recreate it here. If
`scripts/generate-sitemap.mjs` is missing, it has simply not been synced
yet — run `/update-dotclaude` (or `bash scripts/sync-local.sh` from the
orchestrator) and re-run this skill.

Context probes:

Project structure: !`ls src/ 2>/dev/null || echo "no src/ directory"`
Generator present: !`[ -f scripts/generate-sitemap.mjs ] && echo "yes" || echo "NO — sync .claude first"`
Routes file present: !`[ -f src/lib/seo/sitemap-routes.ts ] && echo "yes" || echo "no"`
Router file: !`ls src/App.tsx src/main.tsx src/router.tsx 2>/dev/null || echo "none found"`
CI workflow: !`ls .github/workflows/ci.yml 2>/dev/null || echo "no ci.yml"`
robots.txt: !`[ -f public/robots.txt ] && echo "exists" || echo "missing"`
Production domain: !`grep -h "homepage" package.json 2>/dev/null | head -1 || echo "unknown — check package.json homepage / APP_URL"`

---

## Step 0: Eligibility Check

Skip and report if this is NOT a web project that needs a sitemap:

- Mobile repos (`*.app.richi.solutions`, React Native / Flutter) — no sitemap.
- Backend / automation repos (e.g. `n8n.*`) with no `vite build` and no
  public routes — no sitemap.

Only proceed for web repos (`xyz.richi.solutions` with a Vite SPA).

---

## Step 1: Confirm the Generator Is Present

1. Verify `scripts/generate-sitemap.mjs` exists. If not, STOP and tell the
   user to sync `.claude` first (see note above). Do not write the generator
   by hand — it is distributed from the orchestrator.

---

## Step 2: Seed `src/lib/seo/sitemap-routes.ts`

This file is the per-repo single source of truth for indexable routes.

1. Read the router (`src/App.tsx` or the route config) and extract every
   static public route.
2. **Exclude** the categories from `seo.md` §7.4:
   - Auth flows: `/auth`, `/reset-password`, `/onboarding`
   - Account areas: `/account/*`, `/my`, `/profile`
   - Admin areas: `/admin/*`
   - Partner/creator dashboards: `/partner/*` (the *dashboard*; a public
     `/partner` landing page MAY be included)
   - Checkout flows: `/checkout/*`
   - Dynamic ID routes without a public listing (`/tournament/:id`, etc.)
3. Assign sensible `priority` (homepage `1.0`, primary features `0.8–0.9`,
   informational `0.6–0.7`, legal `0.3`) and `changefreq`
   (`daily`/`weekly`/`monthly`/`yearly`).
4. If the file already exists, reconcile against the current router instead
   of overwriting — add new public routes, remove deleted ones, keep
   existing priorities.

Write it in this exact shape (the generator parses `PUBLIC_ROUTES` by regex,
so keep the `{ path, priority, changefreq }` literal form and `as const`):

```ts
/**
 * Single source of truth for indexable public routes.
 *
 * Keep this list in sync with the router. The CI sitemap drift check will
 * fail any PR that adds/removes a public route without updating here.
 *
 * Excluded by policy — see orchestrator `ref/growth/seo.md` §7.4.
 */

export type ChangeFreq = "daily" | "weekly" | "monthly" | "yearly";

export interface SitemapRoute {
  path: string;
  priority: number;
  changefreq: ChangeFreq;
}

export const PUBLIC_ROUTES: readonly SitemapRoute[] = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  // ...one entry per indexable static route...
] as const;
```

---

## Step 3: Wire `package.json`

Ensure these scripts exist (merge, do not clobber existing build steps):

```json
{
  "scripts": {
    "sitemap:generate": "node scripts/generate-sitemap.mjs",
    "build": "npm run sitemap:generate && vite build"
  }
}
```

If `build` already runs other pre-steps, prepend `npm run sitemap:generate &&`.

---

## Step 4: Add the CI Drift Check

In `.github/workflows/ci.yml`, add this step to the quality job **before**
`npm run build` (and after typecheck). Use the `lastmod`-ignoring diff —
a plain `git diff --exit-code` would fail every day because `lastmod` is the
current date:

```yaml
      - name: Sitemap drift check
        run: |
          npm run sitemap:generate
          # Ignore lastmod date so the check only fails on real route changes
          if ! git diff --ignore-matching-lines='<lastmod>' --exit-code public/sitemap.xml; then
            echo "::error::public/sitemap.xml is out of sync with src/lib/seo/sitemap-routes.ts. Run 'npm run sitemap:generate' and commit the result."
            exit 1
          fi
```

If there is no `ci.yml`, create one following the RDF CI template
(`rdf.md` §09) and include this step.

---

## Step 5: Write `public/robots.txt`

Per `seo.md` §7.6 / §8 — must include a `Sitemap:` directive (absolute URL
on the production domain) and `Disallow:` every excluded category from §7.4:

```
User-agent: *
Allow: /
Disallow: /auth
Disallow: /reset-password
Disallow: /onboarding
Disallow: /account/
Disallow: /admin/
Disallow: /partner/
Disallow: /checkout/
Disallow: /my
Disallow: /profile

Sitemap: https://<production-domain>/sitemap.xml
```

Use the real production domain (from `package.json` `homepage` / `APP_URL`).
Add any repo-specific private routes (e.g. `/feed`, `/chats`) to the
disallow list.

---

## Step 6: Generate & Verify

1. Run `APP_URL=https://<domain> npm run sitemap:generate` and confirm
   `public/sitemap.xml` is written with all routes.
2. Run the drift check command locally to confirm it passes.
3. Run `npm run build` to confirm the chain is wired correctly.

---

## Step 7: Commit

Commit on a feature branch with a body (Conventional Commits):

```
feat(seo): wire sitemap generation and drift check

Seed sitemap-routes.ts as the route source of truth, wire
sitemap:generate into the build, add the CI drift guard, and add
robots.txt with the Sitemap directive. Implements seo.md §7. The
generator script is distributed from the orchestrator.
```

Verify against the deployment gate (`runtime-contract.md`): the three
sitemap checks must now pass.
