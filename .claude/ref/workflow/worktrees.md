# Git Worktrees — Parallel Session Workflow

**Authority Level: Reference (load on demand)**

Load via `@.claude/ref/workflow/worktrees.md` when working on multi-session workflows, debugging branch-switching issues across parallel Claude Code sessions, or onboarding a new repo.

---

## 0 — The Hard Rule

**The main clone path (`<project>.richi.solutions/`) is the read-only baseline.**
It is reserved for `git pull`, `gh pr` browsing, deploy commands, and quick
inspection. **No coding session edits files there — ever.**

Every coding session — even a five-minute hotfix — runs in its own worktree:

```
/new-worktree <feature-name>
```

The cost is trivial: one `git worktree add` + a new VS Code window. The
cost of *not* doing this is severe, and the failure mode is silent:

- Session A switches the branch in the main path
- Session B (still attached to the same path) suddenly sees a different tree
- Session B's untracked files now appear to belong to whatever branch is checked out
- `git stash`-based recovery becomes ambiguous: which stash belongs to which session?

This pattern has produced real damage in the field: lost untracked work,
unrelated themes mixed into the same commit, branch ownership confusion
across sessions. **It is non-negotiable for this organisation.**

If you find yourself about to edit a file in the main path, stop and run
`/new-worktree` first. If you are already mid-edit in the main path,
abort, stash, switch to a worktree, and pop the stash there.

---

## 1 — Why worktrees

Every Claude Code session in VS Code attaches to the workspace's working directory. Git allows **only one branch checked out per working directory**. When multiple Claude Code sessions run in parallel against the same workspace:

- Session A switches to `feat/foo` → Session B's view of the working tree also changes
- Session B's in-progress (WIP) changes get auto-stashed by the harness to prevent loss
- After several switches, the stash list becomes ambiguous: which stash belongs to which session?

This is fine with one or two sessions, breaks down with three or more.

**Git worktrees solve it:** each session runs in its own working directory, but all share the same `.git/` underneath. Same commits, same branches, same remote — but isolated working copies. No auto-stash, no cross-session interference.

> Antigravity (Anthropic's first-party IDE) creates worktrees automatically per session. The VS Code extension does not — you set them up yourself.

---

## 2 — Mental model

| Concept | Today's branch workflow | Worktree workflow |
|---------|------------------------|-------------------|
| Where you work | One directory, switch branches | Many directories, each pinned to a branch |
| Branch switch | `git checkout <branch>` | `cd ../<other-worktree>` |
| Parallel sessions | Stash chaos | Each session in its own worktree |
| WIP isolation | None (sessions overwrite each other) | Total |

The branch is still the unit of change. The worktree is just **where** you check it out.

---

## 3 — Naming convention

Standard layout for richi-solutions repos:

```
c:\richi-solutions\
├── <project>.richi.solutions\          ← Main worktree, always on main
├── <project>.<feature-a>\              ← Worktree for feat/<feature-a>
├── <project>.<feature-b>\              ← Worktree for feat/<feature-b>
└── <project>.<hotfix-name>\            ← Worktree for hotfix/<name>
```

Rule: `<project>.<short-feature-name>` — same project prefix as the main worktree, so files-list / dropdown grouping still works in your file manager.

Examples for `padel-league.richi.solutions`:

```
c:\richi-solutions\padel-league.richi.solutions\    ← main
c:\richi-solutions\padel-league.i18n\               ← feat/i18n-cleanup
c:\richi-solutions\padel-league.knockout\           ← feat/knockout-group-phase
c:\richi-solutions\padel-league.training\           ← feat/training-marketplace
```

---

## 4 — Lifecycle

### 4.1 — Create

From the main worktree:

```bash
cd c:\richi-solutions\<project>.richi.solutions
git fetch origin
git worktree add ../<project>.<feature> -b feat/<feature> origin/main
```

What happens:
1. Creates folder `../<project>.<feature>`
2. Creates new branch `feat/<feature>` based on `origin/main`
3. Checks that branch out into the new folder

### 4.2 — Bootstrap the worktree

Each worktree is an isolated working copy → needs its own dependencies and env:

```bash
cd ../<project>.<feature>
npm install
cp ../<project>.richi.solutions/.env.local .env.local
```

Files NOT in git (must be copied or recreated per worktree):
- `node_modules/`
- `.env`, `.env.local`
- `.vercel/`, `.supabase/` (locally-linked project metadata)
- Any IDE-local cache (`.next/`, `dist/`, `coverage/`)

### 4.3 — Work

Open a new VS Code window on the worktree:

```bash
code .
```

Claude Code (VS Code extension) attaches to this window's workspace. It sees only this worktree. The main worktree's session is unaffected.

### 4.4 — Clean up after merge

After the PR is merged on GitHub:

```bash
cd c:\richi-solutions\<project>.richi.solutions
git fetch origin --prune
git worktree remove ../<project>.<feature>
git branch -d feat/<feature>            # local branch
git remote prune origin                 # optional
```

### 4.5 — Inspect / repair

```bash
git worktree list                       # show all worktrees
git worktree prune                      # remove stale entries (after manual folder delete)
git worktree repair                     # fix broken worktree metadata
```

---

## 5 — Trade-offs

### 5.1 — Advantages

| Advantage | Detail |
|-----------|--------|
| **Real session isolation** | One session cannot move another's branch out from under it |
| **No auto-stash dance** | WIP stays in the worktree; the harness has nothing to stash |
| **Parallel build/test** | Each worktree can run `npm run dev`, tests, type-check concurrently — assuming different ports |
| **Instant branch switch** | `cd <worktree>` is O(1) — no `git checkout` rewriting half the working tree |
| **Safe hotfix flow** | Spin up a hotfix worktree from main without disturbing your feature WIP |
| **Clean mental model** | "What am I working on?" = "which folder am I in?" |
| **Reviewer-friendly** | Reviewer can `git worktree add` your PR branch, run the app, and never lose their own WIP |

### 5.2 — Disadvantages and mitigations

| Disadvantage | Mitigation |
|-------------|------------|
| **Multiple `node_modules`** (500MB–1GB each) | Use `pnpm` (content-addressable store, ~5MB per `node_modules` via symlinks) or accept the disk cost |
| **`.env` files copied manually** | Add a setup script that pulls from password manager or syncs from main worktree |
| **Dev server port collisions** | Set `server.port: process.env.PORT ?? 5173` in `vite.config.ts` and put a different `PORT=` in each worktree's `.env.local` |
| **Local Supabase only runs once** | `supabase start` binds host ports — only one worktree can run it locally at a time. Other worktrees use cloud staging or the same local instance |
| **One branch checked out at most once** | Can't have `feat/foo` checked out in two worktrees. Rarely a problem in practice |
| **Per-worktree IDE config** | `.vscode/settings.json` is in git, propagates automatically. Workspace-local settings go through normally |
| **Forgotten worktrees** | Run `git worktree prune` periodically. Or write a `cleanup-worktrees.sh` that removes worktrees whose branches are merged |
| **`.claude/` distribution** | Distributed per-repo by `sync-dotclaude.yml`. Each worktree is the same repo, so the sync arrives in all worktrees on the next pull |

---

## 6 — Patterns

### 6.1 — Pattern: "Main + features"

You have one long-running main worktree and spin up feature worktrees as needed. Each feature gets merged and the worktree removed.

```
<project>.richi.solutions\    ← always on main, used for fetches & reviews
<project>.<feature-1>\        ← spawned, worked on, merged, deleted
<project>.<feature-2>\        ← spawned for next task
```

### 6.2 — Pattern: "Parallel tracks"

You have multiple long-running tracks (e.g., frontend + backend rewrite) that span weeks. Each track has its own worktree that survives multiple PRs.

```
<project>.richi.solutions\    ← main
<project>.frontend\           ← feat/frontend-rewrite (PRs come and go on this branch)
<project>.backend\            ← feat/backend-migration
<project>.hotfix\             ← spawned as needed for urgent fixes
```

### 6.3 — Pattern: "Per Claude session"

You routinely run multiple Claude Code sessions in parallel. Each session gets its own worktree mapped to its current task.

```
<project>.richi.solutions\    ← reserved for the human (browsing, reviews)
<project>.session-a\          ← Claude session A working on feat/X
<project>.session-b\          ← Claude session B working on feat/Y
<project>.session-c\          ← Claude session C working on feat/Z
```

When a session finishes, that worktree is removed and the slot is reused for the next task.

---

## 7 — Common pitfalls

### 7.1 — Worktree is on a branch that was force-pushed

If someone force-pushes the branch you have checked out in a worktree, your local branch state is now behind the remote. `git pull --rebase` fixes it. Don't `git reset --hard origin/<branch>` without checking what unstaged changes you have.

### 7.2 — Trying to check out a branch already in another worktree

```
$ git worktree add ../foo feat/bar
fatal: 'feat/bar' is already used by worktree at 'c:\richi-solutions\padel-league.bar'
```

Either remove the other worktree first (`git worktree remove`), or check out the branch in the existing one. You cannot have the same branch in two places.

### 7.3 — Manual folder deletion without `git worktree remove`

If you `rm -rf` a worktree folder, git keeps stale metadata. Run `git worktree prune` to clean it up.

### 7.4 — `.gitignore` differences

Each worktree shares the same `.gitignore` (it's tracked). But `.git/info/exclude` is **per-worktree** — meaning local-only ignores don't propagate. Useful or surprising depending on intent.

---

## 8 — When NOT to use worktrees

- You only ever run one Claude Code session and one branch at a time → branch checkouts are fine
- You're on a tiny repo where `node_modules` × 4 is prohibitive and disk is tight
- You're on a CI runner that already has isolated checkouts

For the richi-solutions multi-session workflow, worktrees are the recommended default whenever you anticipate running more than one Claude Code session against the same repo concurrently.

---

## 9 — Skill integration

The slash command `/new-worktree <feature-name>` automates sections 4.1–4.3:

```
/new-worktree i18n-cleanup
```

→ creates `../<project>.i18n-cleanup`, runs `npm install`, copies `.env.local`, opens VS Code on the new worktree.

See `.claude/skills/new-worktree/SKILL.md`.
