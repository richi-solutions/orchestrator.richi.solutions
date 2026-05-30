# content-ops/ — TEST FIXTURE

**This folder is NOT a real content brand.** The orchestrator repo does not produce social media content — it distributes patterns.

This `content-ops/` directory exists solely as a regression fixture for the `n8n-prompt-builder` and `n8n-prompt-reviewer` agents (see `.claude/agents/n8n-prompt-*.md`).

## What's here

| File | Purpose |
|---|---|
| `brand-voice.md` | Minimal stub — voice attributes, spokesperson, banned phrases |
| `brand-visuals.md` | Minimal stub — palette, typography, one style kit |
| `strategy.md` | Minimal stub — niche, cadence, measurement targets |
| `workflows/_test-recap/README.md` | Fixture workflow with 2 LLM nodes declared |
| `workflows/_test-recap/prompts.md` | Output of a builder run; clean baseline (no banned phrases in scope) |

## Running the agents against this fixture

```
# In an orchestrator Claude Code session:
"Use the n8n-prompt-builder agent on _test-recap"
"Use the n8n-prompt-reviewer agent on _test-recap"
```

Expected after a clean builder run: reviewer reports `PASS`.

## What this fixture validates

- Pattern references in `.claude/ref/content-ops/*.md` resolve correctly
- Brand-instance composition (voice + visuals + strategy) renders into prompts.md
- Output schema is copied verbatim (Reviewer check 3)
- Banned-phrase scan is correctly scoped to Role / Constraints / Parser logic / Override sections (Reviewer check 4)
- Spokesperson reference is present (Reviewer check 5)
- Node coverage matches the workflow README (Reviewer check 6)
- Section sizes stay under the 300-line limit (Reviewer check 7)

## For real brand repos

Real brand repos (e.g. `padel-league.richi.solutions/content-ops/`) replace these stubs with actual brand instances. They do NOT inherit this fixture — this lives only in the orchestrator.
