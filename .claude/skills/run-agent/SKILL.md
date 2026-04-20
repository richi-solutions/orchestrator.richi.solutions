---
name: run-agent
description: >
  Runs the documentation or marketing agent locally across all sibling richi.solutions
  repos using your Claude Code Subscription (not the API). Mirrors the
  orchestrate-docs.yml workflow but spares API credits. Commits and pushes
  changes directly to each repo's main branch.
disable-model-invocation: true
allowed-tools: Bash
argument-hint: "<documentation|marketing|both> [repo-name]"
---

# Run Agent Locally

Runs a generative agent (`documentation` or `marketing`) across all local sibling repos using `claude -p` on your Subscription, then commits and pushes changes directly. GitHub Actions equivalent: [orchestrate-docs.yml](../../../.github/workflows/orchestrate-docs.yml) — but that path burns API credits.

## When to use

- After a wave of feature work, refresh READMEs + MARKETING.md on all repos in one go
- Before a stakeholder demo — ensure marketing copy reflects the current state
- Monthly hygiene run instead of re-enabling the (expensive) scheduled workflow

## When NOT to use

- The target repo has uncommitted changes (skipped automatically)
- The target repo is on a feature branch (skipped — agent runs only on `main`)
- You want audit logs in GitHub Actions (this runs locally, only git history records it)

## Arguments

`$ARGUMENTS` parsing:
- First arg: `documentation`, `marketing`, or `both`
- Optional second arg: a single repo name (e.g. `padel-league.richi.solutions`) to limit the run

## Current branch state

!`git -C "$(pwd)" branch --show-current 2>&1 || echo "not-a-repo"`

## What this skill does

1. Validates the first argument is `documentation`, `marketing`, or `both`.
2. Delegates to `scripts/run-agent-local.sh $ARGUMENTS` — the actual loop lives there so both CLI and slash-command users share the same logic.
3. Reports the summary (success / skipped / failed per repo).

## Execute

```bash
bash scripts/run-agent-local.sh $ARGUMENTS
```

## Safety notes

- Archived repos are skipped (`gh api ... --jq .archived`).
- Dirty or non-main branches are skipped — no silent merges into in-flight work.
- `.claude/` is excluded from any commit — that directory is distributed by sync-dotclaude and must not drift.
- Each agent runs on its own Claude Code turn — failures in one repo don't stop the others.
- Pushes go directly to `main`. There is no PR review step. Run locally only when you trust the agent's output for this kind of change.
