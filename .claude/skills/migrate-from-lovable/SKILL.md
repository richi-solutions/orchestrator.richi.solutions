---
name: migrate-from-lovable
description: Migrates a Lovable-generated Vite+React project to Vercel hosting + own Supabase Cloud project. Handles Vercel CLI setup, Supabase CLI linking, Lovable artifact cleanup, and .claude config sync. Use /migrate-from-lovable to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
argument-hint: ""
---

# Migrate from Lovable to Vercel + Supabase Cloud

This skill migrates a Lovable-generated Vite+React project to the production stack:
**Vercel (hosting) + own Supabase Cloud project (self-provisioned)**

The framework stays Vite+React — no framework conversion needed.

---

## Phase 1: Analysis

### Step 1.1: Scan Repository Structure

Analyze the current project:

```bash
# Check if this is a Vite project
cat package.json | grep -E '"vite"|"@vitejs"' || echo "NOT a Vite project"

# Check for Lovable-specific artifacts
ls -la .lovable 2>/dev/null || echo "No .lovable directory"
ls -la lovable.config.* 2>/dev/null || echo "No lovable config"
grep -r "lovable" package.json 2>/dev/null || echo "No lovable deps"
grep -r "GPTEngineer\|lovable-tagger" . --include="*.ts" --include="*.tsx" -l 2>/dev/null || echo "No Lovable-specific refs"
```

### Step 1.2: Map Current Architecture

Identify and document:

1. **Routing:** Scan for React Router setup
   - Find `createBrowserRouter` or `<Routes>` usage
   - List all route definitions and their components

2. **Supabase Usage:** Find current Supabase client setup
   - Check for `import.meta.env.VITE_SUPABASE_URL`
   - List all files using Supabase client
   - Check if Lovable-managed Supabase is used (check `.env` or Lovable config)
   - Check for Edge Functions in `supabase/functions/`

3. **Dependencies:** Categorize deps
   - Keep: React, Vite, Tailwind, shadcn, Supabase, Zod, TanStack Query, React Router, etc.
   - Remove: Lovable-specific packages (lovable-tagger, GPTEngineer utils)

4. **Environment Variables:** List all `VITE_*` env vars

5. **Existing Config:** Check for vercel.json, supabase/config.toml, .claude/

### Step 1.3: Generate Migration Report

Output a report:

```
## Migration Report: [project-name]

### Current Stack
- Framework: Vite + React + TypeScript
- Router: React Router (X routes found)
- Supabase: [Lovable-managed / already own project / not set up]
- Env vars: [list of VITE_* vars]
- Lovable artifacts: [list of Lovable-specific files/deps]

### Migration Steps Required
- [ ] Vercel setup (vercel.json, CLI link)
- [ ] Supabase Cloud linking (own project)
- [ ] Lovable artifact cleanup
- [ ] .claude config sync
- [ ] .gitignore update

Proceed with migration? (Y/n)
```

Wait for user confirmation before proceeding.

---

## Phase 2: Vercel Setup

### Step 2.1: Create vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "regions": ["fra1"],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The `rewrites` rule ensures React Router works correctly on Vercel (SPA client-side routing).

### Step 2.2: Vercel CLI Login

```bash
vercel whoami 2>/dev/null || vercel login
```

### Step 2.3: Link Project

```bash
vercel link
```

### Step 2.4: Set Environment Variables

```bash
# Pull existing env vars (if project was already configured in Vercel dashboard)
vercel env pull .env.local

# Or set env vars if starting fresh — prompt user for values:
echo "Set the following in Vercel Dashboard → Settings → Environment Variables:"
echo "  VITE_SUPABASE_URL = <your-supabase-url>"
echo "  VITE_SUPABASE_ANON_KEY = <your-anon-key>"
```

### Step 2.5: Verify Build

```bash
npm run build
```

If build fails, fix errors before continuing.

---

## Phase 3: Supabase Cloud Setup

### Step 3.1: Initialize Supabase (if needed)

```bash
# Check if supabase is already initialized
ls supabase/config.toml 2>/dev/null || supabase init
```

### Step 3.2: Link to Own Supabase Project

Ask the user for their Supabase project reference:

```
Enter your Supabase project reference (from supabase.com dashboard → Settings → General):
> [user input]
```

```bash
supabase link --project-ref <user-provided-ref>
```

### Step 3.3: Update Supabase Client

Ensure the Supabase client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`:

**Check `src/lib/supabase.ts` (or similar):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

If the client imports from a different location or uses hardcoded values, update it.

### Step 3.4: Apply Migrations

```bash
# Check for existing migrations
ls supabase/migrations/ 2>/dev/null

# Push migrations to the new project
supabase db push
```

### Step 3.5: Verify Supabase Connection

```bash
supabase status
```

---

## Phase 4: Cleanup & Finalize

### Step 4.1: Remove Lovable Artifacts

```bash
# Remove Lovable-specific files
rm -rf .lovable lovable.config.* 2>/dev/null

# Remove GPTEngineer references
grep -rl "GPTEngineer\|gpt-engineer\|lovable-tagger" src/ --include="*.ts" --include="*.tsx" 2>/dev/null
# For each file found, review and remove the Lovable-specific code

# Remove Lovable-specific dependencies
npm uninstall lovable-tagger 2>/dev/null
```

### Step 4.2: Update .gitignore

Ensure `.gitignore` includes:
```
dist/
.vercel/
.env.local
.env.local.example
node_modules/
```

### Step 4.3: Update Environment Files

Create `.env.example` if not present:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4.4: Sync .claude Config

Copy shared `.claude/` content from the orchestrator (source of truth):

```bash
OWNER="richi-solutions"
SOURCE_REPO="orchestrator.richi.solutions"
SHARED_DIRS="agents rules ref skills sync"

mkdir -p .claude
for dir in $SHARED_DIRS; do
  gh api "repos/${OWNER}/${SOURCE_REPO}/contents/.claude/${dir}?ref=main" \
    --jq '.[].download_url' | while read -r url; do
    RELATIVE=$(echo "$url" | sed "s|.*/.claude/${dir}/||")
    DEST_DIR=".claude/${dir}/$(dirname "$RELATIVE")"
    mkdir -p "$DEST_DIR"
    curl -sL "$url" -o ".claude/${dir}/${RELATIVE}"
  done
done

# Copy settings.json
gh api "repos/${OWNER}/${SOURCE_REPO}/contents/.claude/settings.json?ref=main" \
  --jq '.download_url' | xargs curl -sL -o .claude/settings.json
```

Create or update the project-specific `CLAUDE.md` based on the orchestrator template.

### Step 4.5: Sync Config Files

```bash
if [ -d ".claude/sync" ]; then
  cp -r .claude/sync/. .
fi
```

### Step 4.6: Update Project CLAUDE.md

If the project has a local `.claude/CLAUDE.md`, update:
- Deployment references: "Vercel" instead of "Lovable"
- Backend references: "Supabase Cloud (self-provisioned)" instead of "Lovable-managed Supabase"
- Branch strategy: feature/* → PR → Vercel Preview → main → Vercel Production

### Step 4.7: Final Build & Lint Check

```bash
npm run build
npm run lint 2>/dev/null
npx tsc --noEmit 2>/dev/null
```

### Step 4.8: Commit Migration

```bash
git add -A
git commit -m "refactor: migrate from Lovable to Vercel + own Supabase Cloud

Replaced Lovable hosting with Vercel deployment (SPA with rewrites).
Linked own Supabase Cloud project (self-provisioned).
Removed Lovable-specific artifacts and dependencies.
Synced .claude config from orchestrator."

git push origin main
```

---

## Phase 5: Test Deploy

### Step 5.1: Deploy to Vercel Preview

```bash
vercel
```

### Step 5.2: Verify Deployment

Check:
- All routes work (React Router client-side routing)
- Supabase connection works (auth, data queries)
- Environment variables are set correctly
- No Lovable-specific code remains

### Step 5.3: Deploy to Production (if ready)

```bash
echo "Preview deployment successful. To deploy to production: vercel --prod"
```

---

## Phase 6: Summary

```
## Migration Complete

### Before
- Hosting: Lovable (Preview + Publish)
- Supabase: Lovable-managed
- Framework: Vite + React (unchanged)

### After
- Hosting: Vercel (Preview on PR, Production on main)
- Supabase: Own Supabase Cloud project (self-provisioned)
- Framework: Vite + React (unchanged)

### What Changed
- Added vercel.json (Vite SPA config with rewrites)
- Linked Vercel project via CLI
- Linked own Supabase Cloud project
- Removed Lovable-specific artifacts
- Synced .claude config from orchestrator
- Updated .gitignore

### Next Steps
1. Verify Vercel deployment at: <vercel-url>
2. Test all routes in the deployed app
3. Configure custom domain in Vercel Dashboard (Settings → Domains)
4. Set up Supabase environment separation (dev/staging/prod) if needed
5. Run /deploy-check before going to production
```
