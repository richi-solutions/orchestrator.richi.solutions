---
name: deploy-check
description: Pre-deployment checklist that verifies build, tests, lint, env vars, Vercel config, Supabase migrations, and git state. Use /deploy-check before every deployment.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob
argument-hint: "[environment]"
---

# Pre-Deployment Check

Run all checks before deploying. Fail fast on any blocker.

Environment: `$ARGUMENTS` (default: production)
Current branch: !`git branch --show-current`
Uncommitted changes: !`git status --short`
Last commit: !`git log --oneline -1`
Package manager: !`[ -f bun.lockb ] && echo "bun" || ([ -f pnpm-lock.yaml ] && echo "pnpm" || ([ -f yarn.lock ] && echo "yarn" || echo "npm"))`

## Step 1: Git State

Verify clean git state:
- No uncommitted changes (warn if working tree is dirty)
- Current branch is `main` or a release branch (warn if on feature branch)
- Branch is up to date with remote: `git fetch origin && git rev-list HEAD..origin/main --count`

If uncommitted changes exist: **WARN** but continue. If behind remote: **BLOCK**.

## Step 2: Build

Run the project build:

```bash
npm run build 2>&1 || exit 1
```

Replace `npm` with the detected package manager. If the build fails: **BLOCK**.

## Step 3: Type Check

If `tsconfig.json` exists:

```bash
npx tsc --noEmit 2>&1
```

If type errors exist: **BLOCK**.

## Step 4: Lint

If a lint script exists in `package.json`:

```bash
npm run lint 2>&1
```

If lint errors exist: **WARN** (not blocking unless errors, warnings are OK).

## Step 5: Tests

Run the test suite:

```bash
npm run test -- --run 2>&1 || npx vitest run 2>&1
```

If tests fail: **BLOCK**.

## Step 6: Environment Variables

Check that all required env vars are set:

1. Read `.env.local.example` or `.env.example` to get the list of required variables
2. Check each variable exists in `.env.local` or `.env.production`
3. Flag any missing variables

For Vite projects, verify:
- `VITE_SUPABASE_URL` is set
- `VITE_SUPABASE_ANON_KEY` is set

Missing env vars: **BLOCK**.

## Step 7: Vercel Configuration

Check Vercel setup:

1. Check if `vercel.json` exists (recommended for SPA routing)
2. Check if `.vercel/project.json` exists (indicates `vercel link` was run)
3. Run `vercel whoami 2>/dev/null` to verify CLI login

Missing Vercel link: **WARN** — remind to run `vercel link`.
Vercel CLI not logged in: **WARN** — remind to run `vercel login`.

## Step 8: Pending Migrations

If `supabase/migrations/` exists:
- Check for migration files not yet applied: `supabase migration list 2>/dev/null`
- Check for uncommitted migration files in the directory

Unapplied migrations: **WARN** — remind to run `supabase db push` after deploy.

## Step 9: Bundle Size (optional)

If `dist/` exists after build:

```bash
du -sh dist/ 2>/dev/null
```

Report total build output size. Flag if over 5MB: **WARN**.

## Step 10: Summary

```
## Deploy Check Results

Branch: <branch> (<clean/dirty>)
Remote: <up to date / N commits behind>

| Check            | Status              |
|------------------|---------------------|
| Build            | PASS / FAIL         |
| Type Check       | PASS / FAIL / SKIP  |
| Lint             | PASS / WARN / SKIP  |
| Tests            | PASS / FAIL / SKIP  |
| Env Vars         | PASS / MISSING: ... |
| Vercel Config    | PASS / WARN         |
| Supabase Link    | PASS / WARN / SKIP  |
| Migrations       | PASS / PENDING: ... |
| Bundle Size      | <size> (OK / WARN)  |

### Verdict
READY TO DEPLOY / BLOCKED (fix issues above first)

### Blockers
- <list of blocking issues, if any>

### Warnings
- <list of non-blocking warnings, if any>

### Deployment
Vercel auto-deploys on push to main. To trigger manually:
- Preview: `vercel`
- Production: `vercel --prod`
```
