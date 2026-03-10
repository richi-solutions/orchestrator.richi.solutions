#!/usr/bin/env bash
# Sync shared .claude/ content to all local richi-solutions repos
#
# Usage: bash scripts/sync-local.sh
#
# This is the local equivalent of sync-dotclaude.yml.
# It copies shared .claude/ content from the orchestrator to all
# sibling *.richi.solutions repos and pulls latest from remote.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ORCHESTRATOR_DIR="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$ORCHESTRATOR_DIR")"
SOURCE="${ORCHESTRATOR_DIR}/.claude"

# Shared directories to sync
SHARED_DIRS="agents rules ref skills sync"

# Project-specific files to preserve (never overwrite)
# CLAUDE.md, CLAUDE.local.md, settings.local.json, .mcp.json, reviews/

if [ ! -d "$SOURCE" ]; then
  echo "Error: Orchestrator .claude/ not found at $SOURCE"
  exit 1
fi

echo "Source: $SOURCE"
echo ""

for repo_dir in "$PARENT_DIR"/*.richi.solutions; do
  repo_name=$(basename "$repo_dir")

  # Skip orchestrator itself
  if [ "$repo_name" = "orchestrator.richi.solutions" ]; then
    continue
  fi

  if [ ! -d "$repo_dir/.git" ]; then
    echo "[$repo_name] Not a git repo — skipping"
    continue
  fi

  echo "[$repo_name] Syncing..."

  # Pull latest from remote first
  git -C "$repo_dir" pull --ff-only 2>/dev/null || {
    echo "  Warning: git pull failed (dirty working tree?). Syncing .claude/ anyway."
  }

  # Ensure .claude/ exists
  mkdir -p "$repo_dir/.claude"

  # Sync shared directories (delete old content, copy fresh)
  for dir in $SHARED_DIRS; do
    if [ -d "$SOURCE/$dir" ]; then
      rm -rf "$repo_dir/.claude/$dir"
      cp -r "$SOURCE/$dir" "$repo_dir/.claude/$dir"
    fi
  done

  # Sync settings.json
  if [ -f "$SOURCE/settings.json" ]; then
    cp "$SOURCE/settings.json" "$repo_dir/.claude/settings.json"
  fi

  # Remove old security/ directory if it still exists
  if [ -d "$repo_dir/.claude/security" ]; then
    rm -rf "$repo_dir/.claude/security"
  fi

  # Copy config files from sync/ to repo root
  if [ -d "$repo_dir/.claude/sync" ]; then
    cp -r "$repo_dir/.claude/sync/." "$repo_dir/"
  fi

  # Check for changes
  if [ -z "$(git -C "$repo_dir" status --porcelain)" ]; then
    echo "  Already up to date"
  else
    echo "  Changes detected:"
    git -C "$repo_dir" diff --stat
    git -C "$repo_dir" add -A
    git -C "$repo_dir" commit -m "chore: sync .claude from orchestrator" \
      -m "Synced shared .claude/ content and config files." \
      -m "Automated by scripts/sync-local.sh"
    git -C "$repo_dir" push
    echo "  Synced and pushed"
  fi

  echo ""
done

echo "Done."
