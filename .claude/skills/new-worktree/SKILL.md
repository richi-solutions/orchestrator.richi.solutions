---
name: new-worktree
description: Creates a new git worktree for a feature branch, installs dependencies, copies .env files, and opens VS Code on it. Use to spin up an isolated working copy when running parallel Claude Code sessions. Invoke as /new-worktree [feature-name].
disable-model-invocation: true
allowed-tools: Bash, Read
argument-hint: "[feature-name]"
---

# New Worktree

Spin up a new git worktree for parallel Claude Code session work.

Full reference: `@.claude/ref/workflow/worktrees.md`

Feature name: `$ARGUMENTS`

Current repo: !`git rev-parse --show-toplevel`
Current branch: !`git branch --show-current`
Existing worktrees: !`git worktree list`

---

## Step 1: Validate input

- `$ARGUMENTS` must be a non-empty, lowercase, hyphen-separated identifier
  (e.g. `i18n-cleanup`, `knockout-group-phase`)
- If it contains uppercase letters, spaces, or special characters other than
  hyphens, abort and explain the naming convention to the user.
- If `$ARGUMENTS` is empty, abort and ask the user for the feature name.

## Step 2: Resolve paths

From the current repo path, compute:

- `repo_root` = `git rev-parse --show-toplevel`
- `repo_name` = basename of `repo_root` (e.g. `padel-league.richi.solutions`)
- `project_prefix` = `repo_name` with `.richi.solutions` stripped
  (e.g. `padel-league`)
- `parent_dir` = parent of `repo_root`
- `worktree_path` = `<parent_dir>/<project_prefix>.<feature-name>`
- `branch_name` = `feat/<feature-name>`

Example:
- Repo: `c:\richi-solutions\padel-league.richi.solutions`
- Feature: `i18n-cleanup`
- → worktree: `c:\richi-solutions\padel-league.i18n-cleanup`
- → branch: `feat/i18n-cleanup`

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

## Step 7: Open VS Code

```bash
code <worktree_path>
```

This opens a new VS Code window. The user starts a fresh Claude Code session
there. The current session (in the main worktree) continues independently.

If `code` is not on PATH, skip this step and tell the user the path to open
manually.

## Step 8: Report

Output a concise summary:

```
✓ Worktree ready

  Path:   <worktree_path>
  Branch: <branch_name> (based on origin/main)
  Deps:   installed
  Env:    copied N file(s)
  IDE:    new VS Code window opened (or: open manually)

Continue work in the new VS Code window. This session is unaffected.
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
