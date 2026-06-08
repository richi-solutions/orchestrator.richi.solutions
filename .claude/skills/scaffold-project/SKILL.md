---
name: scaffold-project
description: Scaffolds a new project with the full richi-solutions standard — Vite + React + TypeScript + Supabase Cloud + Tailwind + shadcn/ui + Vercel + .claude config. Use /scaffold-project [name] to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit
argument-hint: "[project-name]"
---

# Scaffold New Project

Create a new project with all richi-solutions conventions pre-configured.

Project name: `$ARGUMENTS`

## Step 1: Validate

- Project name must be lowercase, hyphens only
- Target directory: `/c/richi-solutions/$ARGUMENTS`
- Verify directory does NOT already exist

If the directory exists, abort.

## Step 2: Create Vite Project

```bash
cd /c/richi-solutions
npm create vite@latest $ARGUMENTS -- --template react-ts
cd $ARGUMENTS
npm install
```

## Step 3: Install Core Dependencies

```bash
# UI
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node

# Supabase
npm install @supabase/supabase-js

# Routing
npm install react-router-dom

# State & Data
npm install @tanstack/react-query

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# UI Components (shadcn)
npx shadcn@latest init -y
```

## Step 4: Project Structure

Create the standard directory structure:

```
src/
  components/     # Shared UI components
  features/       # Feature modules (each with own components, hooks, types)
  hooks/          # Global custom hooks
  lib/            # Utilities, supabase client, constants
  types/          # Global TypeScript types
  pages/          # Route pages (React Router)
  domain/         # Pure use-cases, no I/O
  ports/          # Interfaces
  adapters/       # Concrete implementations
  contracts/      # API contracts
    v1/
```

Create these directories:
```bash
mkdir -p src/components src/features src/hooks src/lib src/types src/pages
mkdir -p src/domain src/ports src/adapters src/contracts/v1
```

## Step 5: Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Step 6: Environment Files

Create `.env.example`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Create `.env`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Step 7: Vercel Configuration

Create `vercel.json`:
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

## Step 7.5: Quality Gates (CI + strict TypeScript)

The architecture/type-safety gates from `rdf.md` §01/§13 must be wired in from
the first commit — retrofitting them later means fighting accumulated debt.

**Strict tsconfig.** In `tsconfig.app.json` (and any other app tsconfig), set:
```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Canonical ESLint config.** The strict, sync-distributed `eslint.config.js`
arrives in Step 11 (`cp -r .claude/sync/. .`) and overwrites the Vite default.
It uses only the plugins the Vite `react-ts` template already installs — no
extra devDependency needed. It enforces: `no-explicit-any` (error), banned
`as any`/`as never`/`as unknown as` (error), `ban-ts-comment` (error), the
adapter-boundary import rule (error), and `max-lines` (warn). For a greenfield
repo you may immediately tighten `max-lines` to error in the local override.

**Main CI workflow.** Create `.github/workflows/ci.yml` (the sync folder ships
commitlint/security/types-drift as separate additive workflows, but the main
quality pipeline is per-repo so it is not clobbered):
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint          # type-safety + boundary gates block here
      - run: npm run typecheck
      - run: npm run build
      - run: npm run test
```
Add the matching scripts to `package.json` (`lint`, `typecheck`, `test`).

**Mandatory server-state layer.** TanStack Query (installed in Step 3) is the
*only* data-fetching path. Wrap the app in a `QueryClientProvider` and fetch via
query hooks that call adapters — never manual `useEffect` + `useState` fetching:
```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
// <QueryClientProvider client={queryClient}> ... </QueryClientProvider>
```

**Adapter boundary.** Only `src/adapters/**` imports the Supabase client
(`src/lib/supabase.ts`). Pages/components/hooks/domain call an adapter. The
ESLint `no-restricted-imports` rule enforces this; do not weaken it.

## Step 8: Supabase Init

```bash
npx supabase init
```

## Step 9: Git Init & .claude Setup

```bash
git init
git add -A
git commit -m "feat: initial project scaffold

Vite + React + TypeScript + Tailwind CSS + shadcn/ui.
Supabase Cloud client configured. Vercel deployment ready."
```

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

Create a project-specific `CLAUDE.md` for this project. Use the orchestrator's CLAUDE.md as a template but adapt the project-specific instructions.

```bash
git add .claude/
git commit -m "chore: add .claude from orchestrator"
```

## Step 10: GitHub Repo

Create the GitHub repo and push:

```bash
git remote add origin https://github.com/richi-solutions/$ARGUMENTS.git
git push -u origin main
```

If the repo doesn't exist yet, instruct the user to create it on GitHub first.

## Step 11: Sync Config

Copy all standardized configs from `.claude/sync/` to their target locations:

```bash
if [ -d ".claude/sync" ]; then
  cp -r .claude/sync/. .
  git add .
  git commit -m "chore: sync config from .claude/sync"
fi
```

## Step 12: Vercel Setup

```bash
# Login to Vercel (if not already)
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local
```

## Step 13: Summary

```
## Project Scaffolded: $ARGUMENTS

### Tech Stack
- Vite + React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Cloud (client configured)
- React Router + TanStack Query
- React Hook Form + Zod
- Vercel deployment ready

### Structure
src/
  pages/       — route pages (React Router)
  components/  — shared UI
  features/    — feature modules
  hooks/       — global hooks
  lib/         — supabase client, utils
  types/       — global types
  contracts/   — API contracts
  domain/      — pure business logic
  ports/       — interfaces
  adapters/    — implementations

### .claude
- Copied from orchestrator.richi.solutions (source of truth)
- All agents, skills, rules, and synced config included
- Updates distributed automatically via sync-dotclaude.yml

### Next Steps
1. Fill in .env with Supabase credentials (or use `vercel env pull`)
2. Link Supabase project: `supabase link --project-ref <ref>`
3. Run `vercel link` to connect to Vercel project
4. Create your first feature with /new-feature
```
