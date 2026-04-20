#!/usr/bin/env bash
# Run documentation and/or marketing agents locally across all sibling repos.
#
# Uses `claude -p` with your local OAuth session (Claude Code Subscription)
# instead of the ANTHROPIC_API_KEY path that GitHub Actions uses — so this
# script costs nothing against your API budget. It mirrors the behavior of
# .github/workflows/orchestrate-docs.yml but runs on your machine.
#
# Usage:
#   bash scripts/run-agent-local.sh documentation        # docs agent, all repos
#   bash scripts/run-agent-local.sh marketing            # marketing agent, all repos
#   bash scripts/run-agent-local.sh both                 # both agents, all repos
#   bash scripts/run-agent-local.sh marketing <repo>     # one repo only
#
# Requirements:
#   - `claude` CLI installed and logged in (claude login)
#   - `gh` CLI authenticated (used to skip archived repos)
#   - sibling *.richi.solutions repos cloned next to orchestrator.richi.solutions

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORCHESTRATOR_DIR="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$ORCHESTRATOR_DIR")"

AGENT="${1:-}"
ONLY_REPO="${2:-}"

if [ -z "$AGENT" ] || [[ ! "$AGENT" =~ ^(documentation|marketing|both)$ ]]; then
  echo "Usage: $0 <documentation|marketing|both> [repo-name]"
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "Error: 'claude' CLI not found. Install Claude Code and run 'claude login'."
  exit 1
fi

# Prompts mirror .github/workflows/orchestrate-docs.yml to keep output identical
# regardless of whether the agent runs locally or on GitHub Actions.
DOCS_PROMPT="You are the documentation agent. Read .claude/agents/documentation.md for your full instructions, then analyze this project and generate/update all documentation: README.md, code comments (JSDoc/@fileoverview), architecture docs, CONTRIBUTING.md, and .env.example. CRITICAL RULES: Do NOT modify application logic. Do NOT modify any files under .claude/ — that directory is managed by sync-dotclaude and must not be touched. Do NOT modify MARKETING.md — the marketing agent owns that file."

MARKETING_PROMPT="You are the marketing agent. Read .claude/agents/marketing.md for your full instructions, then analyze this project and generate/update MARKETING.md only. CRITICAL RULES: Only modify MARKETING.md. Do NOT modify README.md, CONTRIBUTING.md, source code, tests, or any files under .claude/. Do NOT invent features that are not in the codebase."

ALLOWED_TOOLS="Bash,Read,Edit,Write,Grep,Glob"

SUCCESS_COUNT=0
SKIPPED_COUNT=0
FAILED_COUNT=0
CHANGED_REPOS=()

run_agent_in_repo() {
  local repo_dir="$1"
  local repo_name
  repo_name=$(basename "$repo_dir")

  if [ "$repo_name" = "orchestrator.richi.solutions" ]; then
    return 0
  fi

  if [ ! -d "$repo_dir/.git" ]; then
    return 0
  fi

  if [ -n "$ONLY_REPO" ] && [ "$repo_name" != "$ONLY_REPO" ]; then
    return 0
  fi

  # Skip archived repos (same check as sync-local.sh)
  if command -v gh >/dev/null 2>&1; then
    local archived
    archived=$(gh api "repos/richi-solutions/$repo_name" --jq .archived 2>/dev/null || echo "")
    if [ "$archived" = "true" ]; then
      echo "[$repo_name] Archived — skipping"
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      return 0
    fi
  fi

  echo ""
  echo "=== [$repo_name] ==="

  # Ensure clean main before running agent
  local current_branch
  current_branch=$(git -C "$repo_dir" branch --show-current)
  if [ "$current_branch" != "main" ]; then
    echo "  Skipping — on branch '$current_branch', not main"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    return 0
  fi

  if ! git -C "$repo_dir" diff --quiet || ! git -C "$repo_dir" diff --cached --quiet; then
    echo "  Skipping — dirty working tree"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    return 0
  fi

  git -C "$repo_dir" pull --ff-only 2>/dev/null || {
    echo "  Skipping — pull failed"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    return 0
  }

  local did_change=0

  # Run selected agents
  if [ "$AGENT" = "documentation" ] || [ "$AGENT" = "both" ]; then
    echo "  Running documentation agent..."
    (cd "$repo_dir" && claude -p "$DOCS_PROMPT" --allowedTools "$ALLOWED_TOOLS" --max-turns 30 >/dev/null 2>&1) || {
      echo "  documentation agent failed"
      FAILED_COUNT=$((FAILED_COUNT + 1))
      return 0
    }
  fi

  if [ "$AGENT" = "marketing" ] || [ "$AGENT" = "both" ]; then
    echo "  Running marketing agent..."
    (cd "$repo_dir" && claude -p "$MARKETING_PROMPT" --allowedTools "$ALLOWED_TOOLS" --max-turns 20 >/dev/null 2>&1) || {
      echo "  marketing agent failed"
      FAILED_COUNT=$((FAILED_COUNT + 1))
      return 0
    }
  fi

  # Commit and push if the agent actually changed something. Always exclude .claude/
  # (managed by sync-dotclaude) so the agent can't accidentally pollute it.
  if [ -n "$(git -C "$repo_dir" status --porcelain 2>/dev/null)" ]; then
    git -C "$repo_dir" checkout -- .claude/ 2>/dev/null || true
    git -C "$repo_dir" add -A -- ':!.claude/'
    if [ -n "$(git -C "$repo_dir" diff --cached --name-only)" ]; then
      local commit_msg="docs: local agent run ($AGENT)"
      if [ "$AGENT" = "both" ]; then
        commit_msg="docs: local documentation + marketing agent run"
      elif [ "$AGENT" = "marketing" ]; then
        commit_msg="docs: local marketing agent run"
      else
        commit_msg="docs: local documentation agent run"
      fi
      git -C "$repo_dir" commit -m "$commit_msg" \
        -m "Ran Claude Code $AGENT agent locally via scripts/run-agent-local.sh." >/dev/null
      git -C "$repo_dir" push 2>&1 | tail -1
      did_change=1
      CHANGED_REPOS+=("$repo_name")
    fi
  fi

  if [ "$did_change" -eq 1 ]; then
    echo "  Pushed changes"
  else
    echo "  No changes"
  fi
  SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
}

echo "Agent: $AGENT"
if [ -n "$ONLY_REPO" ]; then
  echo "Target: $ONLY_REPO only"
else
  echo "Target: all sibling repos"
fi

for repo_dir in "$PARENT_DIR"/*.richi.solutions; do
  run_agent_in_repo "$repo_dir"
done

echo ""
echo "=== Summary ==="
echo "Success: $SUCCESS_COUNT"
echo "Skipped: $SKIPPED_COUNT"
echo "Failed:  $FAILED_COUNT"
if [ "${#CHANGED_REPOS[@]}" -gt 0 ]; then
  echo "Changed and pushed:"
  for r in "${CHANGED_REPOS[@]}"; do
    echo "  - $r"
  done
fi
