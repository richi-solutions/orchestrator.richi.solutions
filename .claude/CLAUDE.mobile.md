# Project Instructions — Richi Development Framework (Mobile)

**"Lean Today. Limitless Tomorrow."**

This project follows the **Richi Development Framework (RDF) v4.1**.
Full reference: `rules/core/rdf.md`

This is a **mobile app** repository (`*.app.richi.solutions`).
See RDF Section 00b for the naming convention and platform mapping.

---

## Authority Hierarchy

1. `rules/core/rdf.md` — ROOT AUTHORITY
2. `rules/runtime-contract.md` — RUNTIME AUTHORITY / DEPLOYMENT GATE
3. `ref/*` — Reference contracts (loaded on demand via `@.claude/ref/<path>`)

Higher authority overrides lower. If two rules conflict, the higher one wins.

---

## Core Invariants (Never Break These)

- **Contracts as Law** — All APIs/events typed and validated (Zod, JSON Schema, or Dart equivalent)
- **Ports & Adapters** — Isolate external I/O behind interfaces
- **Domain Purity** — Business logic has no side effects or I/O
- **Error Envelope Standard** — Every function returns `{ ok, data?, error? }` (or platform equivalent)
- **Typed Config Loader** — One validated entry point for all environment vars
- **Versioned Events** — Track app events via stable schemas, no PII
- **English-Only Code Comments** — No exceptions
- **Commit Body Mandatory** — Every `feat`, `fix`, `refactor`, `test` commit includes a body describing what changed and why
- **Secrets via env vars only** — Never in repo or client code
- **RLS enforced** — Row Level Security on all user tables

---

## Platform

This repository is a **mobile app**. The specific framework is determined by
the project itself (check `pubspec.yaml` for Flutter or `package.json` for React Native).

### If React Native (preferred default)

- **Framework:** React Native + Expo + TypeScript
- **Styling:** NativeWind (Tailwind for RN) or StyleSheet
- **State:** TanStack Query + Zustand or Context
- **Navigation:** Expo Router
- **Backend:** Supabase Cloud (Auth, Database, Edge Functions)
- **Build:** EAS Build + EAS Submit
- **Testing:** Jest (unit), Detox or Maestro (E2E)

### If Flutter

- **Framework:** Flutter + Dart
- **State:** Riverpod, Provider, or BLoC
- **Navigation:** GoRouter or auto_route
- **Backend:** Supabase Cloud (Auth, Database, Edge Functions)
- **Build:** Flutter build + Fastlane or EAS-equivalent
- **Testing:** flutter_test (unit/widget), integration_test (E2E)
- **i18n:** flutter_localizations + intl (ARB files)

---

## Folder Structure

### React Native (Expo)

```
src/
  app/               # Expo Router layouts & screens
  features/
    [feature]/
      ui/            # Screens & components
      hooks/         # Feature-specific hooks
      service/       # API calls & business logic
      model/         # Types & state
  shared/            # Design system components
  lib/               # config, logger, Supabase client
  contracts/         # API contracts (shared with web/backend)
    v1/
  i18n/
    locales/
```

### Flutter

```
lib/
  core/              # App-wide utilities, theme, constants
  features/
    [feature]/
      ui/            # Screens & widgets
      service/       # Business logic & API calls
      model/         # Data models & state
  shared/            # Shared widgets & design system
  l10n/              # Localization (ARB files)
assets/
  translations/      # JSON translation files
  images/
test/
```

---

## Branch & Deployment Strategy

```
feature/*  ->  PR  ->  GitHub Actions (lint, typecheck/analyze, test)
                          |
             App review build (EAS Preview / Flutter build)
                          |
main       ->  Production build (EAS Submit / App Store / Google Play)
```

---

## Development Workflow

- **Implementation:** Claude Code (this environment)
- **Backend:** Supabase Cloud (shared with web counterpart if exists)
- **feature branches** for all changes — never commit directly to main

---

## Rules Index

| Rule File | Purpose |
|-----------|---------|
| `rules/core/rdf.md` | Richi Development Framework (ROOT AUTHORITY) |
| `rules/runtime-contract.md` | Deployment gate — must pass before publish |
| `rules/index.md` | Reference map — on-demand files per task |

All specialized guides (UI/UX, Email, Analytics, Mobile, etc.) are in `.claude/ref/`.
Load them on demand: `@.claude/ref/<path>` — see `rules/index.md` for the full map.

**Mobile-specific references:**
- React Native: `@.claude/ref/mobile/react-native-kb.md`
- Flutter: `@.claude/ref/mobile/flutter-kb.md`

**Mandatory:** When creating or modifying agents or skills, always load
`@.claude/ref/agent-skill-building.md` first. All agents/skills must pass the
quality checklist defined in that guide before commit.

---

## Automated Workflows & Merge Conflict Prevention

The `.claude/` directory is managed centrally by the orchestrator and distributed via automated workflows.

### Workflow Schedule

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| `sync-dotclaude.yml` | Daily 05:00 UTC | Distributes `.claude/` from orchestrator to all repos |
| `orchestrate-docs.yml` | Monday 05:00 UTC | Runs documentation agent across all repos |
| `orchestrate-cron.yml` (profile-sync) | Tuesday 05:00 UTC | Syncs README + project metadata to Supabase for n8n |

### Off-Limits for Agents and Manual Edits

| Directory | Managed By | Rule |
|-----------|-----------|------|
| `.claude/` | `sync-dotclaude.yml` | **Never modify in target repos.** Changes get overwritten on next sync and cause merge conflicts. All changes go through the orchestrator. |

### Merge Conflict Prevention Rules

1. **PRs auto-merge immediately** — `orchestrate-docs.yml` squash-merges its own PRs to minimize branch lifetime
2. **Workflows are time-staggered** — sync runs daily at 05:00, docs runs Wednesday at 08:00 (after sync)
3. **`.claude/` is excluded from docs PRs** — git add ignores `.claude/`, and the agent prompt forbids modifying it
4. **Use `git pull --rebase`** — locally, always rebase instead of merge to keep history linear

---

## Deployment Gate (Mobile)

Before any store submission, verify `rules/runtime-contract.md` checklist (adapted for mobile):

- [ ] Contracts validated (schemas on all API boundaries)
- [ ] Error envelope implemented
- [ ] Config loader validated (environment-specific configs)
- [ ] Logger implemented
- [ ] Analytics emitting required events
- [ ] Legal pages / privacy policy present (in-app)
- [ ] Secrets secure (no keys in repo or client code)
- [ ] HTTPS for all API calls
- [ ] RLS enabled on all user tables
- [ ] Supabase Cloud project linked (own project, not managed by third party)
- [ ] App builds without errors (`eas build` / `flutter build`)
