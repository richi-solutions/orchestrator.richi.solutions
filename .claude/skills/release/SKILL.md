---
name: release
description: Creates a release — bumps version, generates changelog from commits, tags, and optionally pushes. Use /release [major|minor|patch] to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read, Edit
argument-hint: "[major|minor|patch]"
---

# Release

Create a new release with version bump, changelog, and git tag.

Bump type: `$ARGUMENTS` (default: patch)
Current version: !`cat package.json 2>/dev/null | grep -oP '"version":\s*"\K[^"]+' || echo "0.0.0"`
Current branch: !`git branch --show-current`
Unreleased commits: !`git log $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~20")..HEAD --oneline 2>/dev/null || git log --oneline -20`

## Step 1: Validate State

Before releasing, verify:
- Current branch is `main` (abort if not)
- Working tree is clean: `git status --porcelain`
- Branch is up to date with remote: `git fetch origin && git rev-list HEAD..origin/main --count`

If any check fails, report the issue and stop.

## Step 2: Determine New Version

Parse the current version and bump according to `$ARGUMENTS`:

| Current | Bump | New |
|---------|------|-----|
| 1.2.3 | patch | 1.2.4 |
| 1.2.3 | minor | 1.3.0 |
| 1.2.3 | major | 2.0.0 |

If `$ARGUMENTS` is empty, default to `patch`.

## Step 3: Generate Changelog

Collect all commits since the last tag (or last 20 commits if no tags exist).

Categorize by Conventional Commits prefix:

```markdown
## [<new-version>] - <YYYY-MM-DD>

### Added
- <feat: commit messages>

### Fixed
- <fix: commit messages>

### Changed
- <refactor: / chore: commit messages>

### Documentation
- <docs: commit messages>
```

If a `CHANGELOG.md` exists, prepend the new section. If not, create it.

## Step 4: Bump Version

Update the version in `package.json`:

```bash
npm version <bump-type> --no-git-tag-version
```

## Step 5: Commit and Tag

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): v<new-version>"
git tag -a "v<new-version>" -m "Release v<new-version>"
```

## Step 6: Push

Ask before pushing. Then:

```bash
git push origin main --follow-tags
```

## Step 7: Summary

```
## Release Created

Version: <old> -> <new>
Tag: v<new-version>
Commits included: <count>
Changelog: CHANGELOG.md updated

### Changes in this release
<changelog content>
```
