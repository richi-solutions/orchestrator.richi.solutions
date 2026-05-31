---
name: new-worktree
description: Creates a new git worktree for a branch, installs dependencies, copies .env files, and opens VS Code on it. Use to spin up an isolated working copy when running parallel Claude Code sessions. Invoke as /new-worktree [prefix/]<name>.
disable-model-invocation: true
allowed-tools: Bash, Read
argument-hint: "[prefix/]<name>  (e.g. discover-bug, fix/discover-bug, chore/cleanup-stash)"
---

# New Worktree

Spin up a new git worktree for parallel Claude Code session work.

Full reference: `@.claude/ref/workflow/worktrees.md`

Argument: `$ARGUMENTS`

Current repo: !`git rev-parse --show-toplevel`
Current branch: !`git branch --show-current`
Existing worktrees: !`git worktree list`

---

## Step 1: Parse and validate input

`$ARGUMENTS` accepts two forms:

1. **Bare name** — e.g. `discover-bug` → prefix defaults to `feat/`
2. **Prefixed name** — e.g. `fix/discover-bug`, `chore/cleanup-stash`,
   `docs/api-readme`, `refactor/league-adapter`

Valid prefixes: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `hotfix`,
`ops`. Anything else → abort and list the valid set.

The name portion (after the `/`) must be a non-empty, lowercase,
hyphen-separated identifier. Uppercase letters, spaces, or special characters
other than hyphens → abort and explain.

If `$ARGUMENTS` is empty → abort and ask the user.

## Step 2: Resolve paths

From the current repo path, compute:

- `repo_root` = `git rev-parse --show-toplevel`
- `repo_name` = basename of `repo_root` (e.g. `padel-league.richi.solutions`)
- `project_prefix` = `repo_name` with `.richi.solutions` stripped
  (e.g. `padel-league`)
- `parent_dir` = parent of `repo_root`
- `prefix` = the parsed prefix from Step 1 (default `feat`)
- `name` = the parsed name from Step 1
- `worktree_path` = `<parent_dir>/<project_prefix>.<name>`
- `branch_name` = `<prefix>/<name>`

Examples:
- `/new-worktree i18n-cleanup` on `padel-league.richi.solutions`
  → worktree `padel-league.i18n-cleanup`, branch `feat/i18n-cleanup`
- `/new-worktree fix/discover-bug` on `padel-league.richi.solutions`
  → worktree `padel-league.discover-bug`, branch `fix/discover-bug`
- `/new-worktree hotfix/webhook-crash` on `padel-league.richi.solutions`
  → worktree `padel-league.webhook-crash`, branch `hotfix/webhook-crash`

## Step 3: Pre-flight checks

Abort with a clear error if:

- The worktree path already exists (`Test-Path` / `-d`)
- The branch already exists locally (`git show-ref --verify refs/heads/<branch_name>`)
- The branch is already checked out in another worktree
  (parse `git worktree list` output)

## Step 4: Create the worktree

```bash
git fetch origin
git worktree add <worktree_path> -b <branch_name> origin/main
```

If `origin/main` does not exist (e.g. solo repo without remote), fall back to
local `main`.

## Step 5: Install dependencies

```bash
cd <worktree_path>
npm install
```

If the repo uses `pnpm` (detected by `pnpm-lock.yaml`), use `pnpm install`
instead. If `bun` (detected by `bun.lockb`), use `bun install`.

## Step 6: Copy environment files

For each of these files that exists in `repo_root` but is in `.gitignore`,
copy it to `worktree_path`:

- `.env`
- `.env.local`
- `.env.development`
- `.env.development.local`

Use a non-destructive copy (don't overwrite if it somehow already exists in
the new worktree — though Step 3 should have prevented that).

## Step 7: Reset session-local state

A fresh worktree must start without inherited Claude session locks. The
following files are per-session and should not carry over from another
worktree's checkout:

```bash
rm -f <worktree_path>/.claude/scheduled_tasks.lock
rm -f <worktree_path>/.claude/*.lock
```

This is best-effort — missing files are not an error.

## Step 8: Open VS Code

```bash
code <worktree_path>
```

This opens a **new** VS Code window. **Tell the user explicitly:**

> Start a new Claude Code session in the new window. **Do not continue
> the current session** — it is attached to the main worktree's workspace
> and will keep editing files there if you keep using it for code changes.
>
> The current session is fine for reviewing, browsing, or kicking off
> further worktrees. It is *not* fine for editing the new feature.

If `code` is not on PATH, skip the `code` invocation and tell the user the
absolute path to open manually. Still emit the "new session" guidance.

## Step 9: Report

Output a concise summary:

```
✓ Worktree ready

  Path:   <worktree_path>
  Branch: <branch_name> (based on origin/main)
  Deps:   installed
  Env:    copied N file(s)
  Locks: cleared
  IDE:    new VS Code window opened (or: open manually)

➜  Start a NEW Claude Code session in the new window.
   Do NOT continue editing in this session — it lives in the main worktree.
```

---

## Notes

- This skill creates a new branch from `origin/main`. It does not check out an
  existing remote branch. To work on an existing branch, the user should run
  `git worktree add <path> <branch>` manually (no `-b` flag).
- The skill does not commit, push, or merge anything. It only sets up the
  workspace.
- Cleanup after PR merge is the user's responsibility:
  `git worktree remove <path>` + `git branch -d <branch>`. A future
  `/cleanup-worktree` skill can automate this.
