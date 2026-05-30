# _test-recap

**Status:** TEST FIXTURE for `n8n-prompt-builder` / `n8n-prompt-reviewer` agents. Not a real n8n workflow.

---

## Trigger
Manual (test invocation only).

## Inputs
None — fixture purposes.

## Outputs
None — fixture purposes.

## LLM Nodes

1. **Storytelling Agent** — generates a vertical-video script for a recap-style piece. Role: storytelling / script. Output schema: `storytelling.md §11.2` (Vertical Video Script).
2. **Caption Generator** — generates the post caption + hashtag set. Role: caption / hashtag. Output schema: `storytelling.md §11.1` (Caption & Hashtag Rules).

## Edge cases
N/A — fixture only.
