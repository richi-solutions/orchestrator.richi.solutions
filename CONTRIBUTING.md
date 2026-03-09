# Contributing Guide

## Branch Naming

```
feature/<short-description>     # new functionality
fix/<short-description>         # bug fix
chore/<short-description>       # dependency update, tooling, cleanup
docs/<short-description>        # documentation only
refactor/<short-description>    # code restructuring without behavior change
```

## Commit Messages

Conventional Commits format is required. All `feat`, `fix`, `refactor`, and `test` commits must have a body.

```
feat: add ux-analyst sweep job

Add a new agent prompt for UX analysis and register ux-analyst
as a valid sweep job in schedule.yaml. The agent audits frontend
repos for accessibility, loading states, and responsive design.

fix: handle empty agent prompt on missing depends_on

Chain jobs with no depends_on field returned an unhandled error
instead of a structured failure result.

chore: upgrade @anthropic-ai/sdk to 0.40.0

docs: document supabase-db-audit workflow inputs
```

Rules:
- Subject line: imperative mood, max 72 characters
- Body: mandatory for `feat`, `fix`, `refactor`, `test`
- Blank line between subject and body
- Code comments and all documentation: English only

## Adding a New Job

1. Create an agent prompt in `agents/<name>.md`
2. Add the job entry to `schedule.yaml`
3. Add the matching cron expression to `.github/workflows/orchestrate-cron.yml` (both `on.schedule` and the `case` statement)
4. Add the job name to the `workflow_dispatch` options in `orchestrate-cron.yml`

## Adding a New Reusable Workflow

1. Create `.github/workflows/<name>.yml` with `on: workflow_call`
2. Document inputs, outputs, and secrets in the workflow header comment
3. Add a usage example to `README.md` under "Reusable GitHub Actions"

## Code Style

- TypeScript strict mode (`tsconfig.json`)
- All exported functions, classes, and port interfaces must have JSDoc comments
- `@fileoverview` headers on all service, domain, port, and adapter files
- Return `Result<T>` from all service operations — no raw exceptions at boundaries
- Log with `logger.info/warn/error` using snake_case event names and a context object

## Testing

- Place test files next to source: `foo.ts` → `foo.test.ts`
- Mock all external I/O (fs, adapters) via `vi.mock()` or injected port interfaces
- Follow Arrange-Act-Assert pattern
- Run before committing: `npm test`

## PR Process

1. Branch off `main`
2. Write tests for new logic
3. Run `npm test` — all tests must pass
4. Open a PR against `main`
5. PR description must summarize what changed and why

## Deployment

Merging to `main` does not auto-deploy. Deployment is manual via Railway dashboard or CLI. The `sync-security.yml` workflow runs automatically on push to `main` when `.claude/security/**` files change.
