# Architecture Overview

## System Purpose

The orchestrator is a cross-cutting automation service for the `richi-solutions` GitHub organization. It discovers repositories, executes AI-powered analysis jobs against them on a schedule, and persists results to a Supabase database. It also hosts reusable GitHub Actions workflows that are distributed to all org repos.

---

## Architectural Pattern: Ports & Adapters

The codebase follows the Hexagonal (Ports & Adapters) pattern throughout.

- **Ports** are TypeScript interfaces in `src/<domain>/<name>.port.ts`
- **Adapters** are concrete implementations in `src/<domain>/<name>.adapter.ts`
- **Handlers** are the application/domain layer — they depend only on port interfaces, never on concrete adapters
- **`server.ts`** is the composition root: it instantiates all adapters, injects them into handlers, and wires the HTTP server

This means every handler is independently testable using mock implementations of the ports.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Trigger Layer                                                   │
│  ┌──────────────────────┐    ┌──────────────────────────────┐   │
│  │  GitHub Actions      │    │  Express HTTP Server         │   │
│  │  orchestrate-cron    │    │  POST /api/trigger/:jobName  │   │
│  │  (calls /api/trigger)│    │  GET  /api/jobs              │   │
│  └──────────┬───────────┘    │  GET  /health                │   │
│             │                └──────────────┬───────────────┘   │
└─────────────┼────────────────────────────────┼───────────────────┘
              │                                │
┌─────────────▼────────────────────────────────▼───────────────────┐
│  Application Layer                                               │
│  ┌─────────────────┐    ┌───────────────────────────────────┐   │
│  │    Scheduler    │    │         Executor                  │   │
│  │  (node-cron)    │    │  routes by JobDefinition.type     │   │
│  │  reads schedule │    │  ┌─────────┬──────┬───────┬─────┐ │   │
│  │  .yaml          │    │  │ Sweep   │ Agg. │ Chain │ Prov│ │   │
│  └─────────────────┘    │  └─────────┴──────┴───────┴─────┘ │   │
│                         └───────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────────┐
│  Port Interfaces                                                 │
│  DiscoveryPort | GitHubPort | ClaudePort | StorePort             │
│  ExecutorPort                                                    │
└─────────────────────────────────────────────────────────────────┘
              │
┌─────────────▼────────────────────────────────────────────────────┐
│  Adapter Layer (I/O)                                             │
│  ┌──────────────────┐  ┌───────────────┐  ┌────────────────────┐│
│  │ GitHubDiscovery  │  │ GitHubAdapter │  │  ClaudeAdapter     ││
│  │ Adapter          │  │ (Octokit)     │  │  (Anthropic SDK)   ││
│  │ (caches 1 hour)  │  │               │  │  (retry 3x)        ││
│  └──────────────────┘  └───────────────┘  └────────────────────┘│
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  SupabaseStoreAdapter                                        ││
│  │  job_runs | commit_summaries | social_content | ...          ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Descriptions

### `server.ts` — Composition Root

Instantiates all adapters and handlers, wires the Express app, and starts the scheduler. This is the only place where concrete types are used — everywhere else depends on interfaces.

Handles two job execution paths:
1. Scheduled execution via `Scheduler` → `executeJob()`
2. Manual execution via `POST /api/trigger/:jobName` → `Scheduler.triggerManually()`

After every job, `executeJob()` persists the result to `job_runs` and optionally to use-case-specific tables (`commit_summaries`, `social_content`).

### `Scheduler`

Wraps `node-cron`. Reads the schedule config and registers one cron task per job. Also exposes `triggerManually()` for the HTTP trigger route. When `DISABLE_CRON=true`, the scheduler is not started — this is the recommended mode when GitHub Actions controls the schedule.

### `Executor`

A pure dispatch router. Calls the appropriate handler based on `JobDefinition.type`. Returns `Result<JobResult>`.

### `SweepHandler`

Fan-out pattern: discovers all repos, then runs a Claude call for each repo. Concurrency is capped at 3 parallel workers. Results are collected per-repo with individual success/failure tracking. Overall status is `success` if all repos succeed, `partial` if some fail, `failure` if all fail.

### `AggregateHandler`

Collects structured data from all repos in sequence (currently: git commits from the last 24 hours via `github.listCommitsSince`). Groups commits by repo, formats them as Markdown, and runs a single Claude call to generate a summary. If no commits exist, returns success with an empty `_commitMeta`.

### `ChainHandler`

Depends on an upstream job result. Polls `store.getLatestJobRun(depends_on)` every 60 seconds until the dependency has a result from today, or a 30-minute timeout is reached. Then uses the upstream output as the user message for Claude. Attempts to parse Claude's output as social content JSON (`parseSocialOutput`), attaching it as `_socialMeta` if successful.

### `ProvisionHandler`

Stub implementation. Discovers repos with `has_testusers: true` in their `.claude/project.yaml` and logs them as skipped. Full testuser provisioning is pending project-specific implementation.

### `GitHubDiscoveryAdapter`

Queries the GitHub API for all org repos, filters to those ending in `.richi.solutions` (excluding the orchestrator itself and `.claude`), and reads the optional `.claude/project.yaml` from each. Results are cached in memory for 1 hour to avoid hitting GitHub API rate limits.

### `ClaudeAdapter`

Wraps the Anthropic SDK. Implements exponential backoff retry (up to 3 attempts) on rate limit (429) and server errors (5xx). Default model and max tokens are configurable via environment variables.

### `SupabaseStoreAdapter`

Persists job results to Supabase. Uses the service role key (bypasses RLS). All tables have RLS enabled with a `service_full_access` policy for the service role.

---

## Data Flow: Daily Commit Summary + Social Content

```
21:59 UTC  GitHub Actions cron fires
           → POST /api/trigger/daily-commits
           → AggregateHandler.run()
               → discovery.discoverRepos()
               → github.listCommitsSince() per repo (last 24 h)
               → claude.complete(commit-summarizer prompt + all commits)
               → store.saveJobRun(result)
               → store.saveCommitSummary(result._commitMeta)

22:59 UTC  GitHub Actions cron fires
           → POST /api/trigger/commits-to-social
           → ChainHandler.run()
               → polls store.getLatestJobRun('daily-commits') until today's result
               → claude.complete(social-media-writer prompt + commit summary)
               → parseSocialOutput(claude response) → _socialMeta
               → store.saveJobRun(result)
               → store.saveSocialContent(each content piece)
                   → insert social_content row
                   → insert social_content_components rows
                   → insert social_content_platforms rows
```

---

## Data Flow: Security Sweep

```
02:00 UTC  GitHub Actions cron fires
           → POST /api/trigger/security-scan
           → SweepHandler.run()
               → discovery.discoverRepos() (cached)
               → for each repo (max 3 parallel):
                   → claude.complete(security-reviewer prompt + repo metadata)
               → store.saveJobRun(result)
```

---

## Database Schema

All tables have RLS enabled. Access is via the Supabase service role key only.

### `job_runs`
Central audit log for every job execution.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Auto-generated |
| `job_name` | text | Job name from `schedule.yaml` |
| `job_type` | text | `sweep`, `aggregate`, `chain`, `provision` |
| `started_at` | timestamptz | Job start time |
| `completed_at` | timestamptz | Job end time |
| `duration_ms` | integer | Execution duration |
| `status` | text | `success`, `partial`, `failure` |
| `targets` | text[] | Repo names targeted |
| `results` | jsonb | Per-target result array |
| `summary` | text | Optional human-readable summary |

### `commit_summaries`
One row per `daily-commits` job run.

| Column | Type | Description |
|--------|------|-------------|
| `job_run_id` | UUID FK | References `job_runs.id` |
| `summary_date` | date | Date of the summary |
| `content` | text | Full Claude-generated summary |
| `repos_active` | text[] | Repos with commits |
| `total_commits` | integer | Total commit count |

### `social_content` + `social_content_components` + `social_content_platforms`
Normalized social media content from `commits-to-social`. One `social_content` row per content type per run, with child rows for components and platform mappings.

### Other sweep result tables
`security_scans`, `code_reviews`, `docs_audits` — one row per repo per sweep job run. (Currently written only via `_commitMeta` / `_socialMeta` path; per-sweep-result persistence is not yet implemented in `SupabaseStoreAdapter`.)

---

## Error Handling

All service operations return `Result<T>`:

```typescript
// Success
{ ok: true, data: T }

// Failure
{ ok: false, error: { code: string; message: string }, traceId: string }
```

Error codes:
- `EXECUTOR_ERROR` — invalid job type, missing agent prompt, missing `depends_on`
- `GITHUB_ERROR` — GitHub API failures
- `CLAUDE_ERROR` — Anthropic API failures after retries
- `STORE_ERROR` — Supabase database failures
- `DISCOVERY_ERROR` — repo discovery or `project.yaml` parse failures

The `ClaudeAdapter` retries on 429 and 5xx errors with exponential backoff (1s, 2s, 4s).

---

## GitHub Actions Architecture

Two complementary execution modes:

**Mode 1: Railway + GitHub Actions cron (production)**

The Railway service runs with `DISABLE_CRON=true`. GitHub Actions (`orchestrate-cron.yml`) fires on schedule and calls `POST /api/trigger/:jobName`. This gives reliable scheduling with GitHub Actions audit logs while keeping job execution inside the long-running service process.

**Mode 2: In-process cron (fallback / local dev)**

When `DISABLE_CRON` is not set, the service starts its own node-cron tasks from `schedule.yaml`. This works for local development and as a fallback if GitHub Actions are unavailable.

**Reusable workflows** (`gitleaks.yml`, `semgrep.yml`, `osv-scan.yml`, `supabase-advisor.yml`, `supabase-db-audit.yml`) are defined in this repo and called by `security.yml` in each project repo. The canonical `security.yml` is automatically distributed to all org repos by `sync-security.yml` whenever the source changes in `.claude/security/`.

---

## Key Design Decisions

**Why Ports & Adapters?**
Every handler can be unit-tested with mock ports. The 42-test suite has no network calls — all external I/O is injected via interfaces.

**Why two cron modes?**
GitHub Actions schedules are more reliable than in-process cron in a containerized environment (restarts, Railway sleep). But in-process cron works for local development without any external dependencies.

**Why chain polling instead of events?**
The `ChainHandler` polls the database for the upstream result rather than using a message queue or event bus. This keeps the architecture simple (no additional infrastructure) at the cost of a 1-minute polling latency. The 30-minute timeout handles the case where the upstream job fails or is delayed.

**Why agent prompts as Markdown files?**
Agent prompts are loaded at job execution time from the `agents/` directory. This allows prompt updates without redeployment — the Docker image includes the `agents/` directory, so only container rebuilds update them.

**Why service-role Supabase access?**
The orchestrator has no user context — it is a backend service. All tables are service-role-only with RLS enabled, which blocks any accidental client-side access.
