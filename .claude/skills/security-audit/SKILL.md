---
name: security-audit
description: Run a full security audit — gitleaks, semgrep, Supabase RLS checks. Fixes all findings and re-runs until clean.
disable-model-invocation: true
allowed-tools: Bash, Read, Edit, Grep, Glob
---

# Security Audit

Run a comprehensive security audit on this project. Fix all findings autonomously.

Current git status: !`git status --short`
Supabase project: !`ls supabase/migrations/ 2>/dev/null | tail -5 || echo "No supabase directory"`

## Step 1: Run Scanners

Run all applicable scanners:

```bash
# Secret scanning
gitleaks detect --source . --no-git --report-format json --report-path /tmp/gitleaks-report.json 2>&1 || true

# SAST
semgrep --config=auto --json --output /tmp/semgrep-report.json . 2>&1 || true
```

Read both report files and understand all findings.

## Step 2: Check Supabase RLS

If `supabase/migrations/` exists:
- Read all migration files
- For every `CREATE TABLE` in `public` schema, verify RLS is enabled and at least one policy exists
- Flag missing RLS

## Step 3: Check Environment Files

- Verify `.env` and `.env.*` (except `.env.example`) are in `.gitignore`
- Run `git ls-files | grep '\.env'` to find tracked env files (exclude .env.example and vite-env.d.ts)
- Scan `src/` for hardcoded API keys or tokens

## Step 4: Fix All Findings

For each finding:
- **Secrets in code:** Replace with env var reference, add to `.env.example`
- **Tracked .env files:** `git rm --cached`
- **SAST issues:** Apply semgrep's recommended fix
- **Missing RLS:** Generate migration file with RLS + basic policy

## Step 5: Re-run Until Clean

Re-run all scanners from Step 1. If findings remain, fix and repeat. Stop after 3 cycles or when clean.

## Step 6: Summary

Output what was found, what was fixed, and final scan status.
