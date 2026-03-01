# Agent & Skill Building Guide

Reference for building high-quality Claude Code agents and skills.
Always load this document when creating or modifying agents or skills:
`@.claude/ref/agent-skill-building.md`

---

## Decision Matrix: Agent vs Skill

| Use Case | Choose |
|----------|--------|
| Specialized autonomous task (code review, testing, research) | **Agent** |
| User-invoked command with `/` prefix | **Skill** |
| Needs shell preprocessing (`!`command``) | **Skill** |
| Needs `$ARGUMENTS` from user input | **Skill** |
| Produces large output that would pollute main context | **Agent** |
| Should run in parallel with other tasks | **Agent** |
| Needs persistent memory across sessions | **Agent** |
| Combines both: user invokes, runs in isolation | **Skill** with `context: fork` |
| Agent needs reference knowledge | **Agent** with `skills: [skill-name]` |

---

## Agent Reference

### File Location

| Scope | Path | Shared? |
|-------|------|---------|
| Project | `.claude/agents/<name>.md` | Yes (via git) |
| Global | `~/.claude/agents/<name>.md` | Local only |

### Frontmatter Fields

```yaml
---
# Required
name: my-agent                  # Unique identifier (lowercase, hyphens, max 64 chars)
description: >                  # CRITICAL — this is how Claude decides when to delegate
  One-sentence description of what this agent does and when to use it.

# Recommended
model: sonnet                   # sonnet | opus | haiku | inherit (default: inherit)
tools: Read, Grep, Glob         # Allowlist — only these tools available

# Optional
disallowedTools: Write, Bash    # Denylist — block specific tools (alternative to tools)
maxTurns: 15                    # Max agentic turns before stop (prevents runaway)
permissionMode: acceptEdits     # default | acceptEdits | dontAsk | bypassPermissions | plan
skills:                         # Inject skill content as reference knowledge
  - api-conventions
  - error-patterns
memory: project                 # user | project | local — persistent memory scope
background: false               # true = always run in background
isolation: worktree             # worktree = separate git worktree for file isolation
hooks: {}                       # Lifecycle hooks (PreToolUse, PostToolUse, Stop)
mcpServers: []                  # MCP servers available to this agent
---
```

### Agent Body (System Prompt)

Everything below the `---` becomes the agent's system prompt. Structure it with:

1. **Role statement** — One sentence: "You are a [role] that [does what]."
2. **Input** — What the agent receives and how.
3. **Process** — Numbered steps, each with clear instructions.
4. **Output Format** — Exact structure of the result. Use code blocks for templates.

### Quality Checklist

- [ ] `description` is specific enough for Claude to auto-delegate correctly
- [ ] `model` is explicitly set (don't rely on inherit — be intentional about cost)
- [ ] `tools` is a minimal allowlist — only what the agent actually needs
- [ ] `maxTurns` is set to prevent runaway execution
- [ ] Output format is clearly defined with a template
- [ ] Role statement is one sentence, unambiguous
- [ ] Process steps are numbered and ordered
- [ ] Agent works with zero context from the parent conversation
- [ ] No side effects beyond what's documented (no surprise commits, pushes, etc.)
- [ ] Error/edge cases are addressed (what if scanner finds nothing? what if file missing?)

### Anti-Patterns

| Don't | Do |
|-------|-----|
| Omit `model` — defaults to `inherit` which varies | Set `model: sonnet` (or appropriate) explicitly |
| Give all tools — agent can do anything | Minimal `tools:` allowlist |
| Omit `maxTurns` — agent runs indefinitely | Set `maxTurns: 15-25` depending on task complexity |
| Vague description — Claude won't know when to delegate | Specific: "Runs X, Y, Z. Use when [condition]." |
| Output format left to Claude's discretion | Define exact template in body |
| Agent modifies files without declaring it | State clearly: "This agent WILL modify files" or "read-only" |
| Long unstructured instructions | Numbered steps with clear headers |

---

## Skill Reference

### File Location

| Scope | Path | Shared? |
|-------|------|---------|
| Project | `.claude/skills/<name>/SKILL.md` | Yes (via git) |
| Global | `~/.claude/skills/<name>/SKILL.md` | Local only |
| Legacy | `.claude/commands/<name>.md` | Yes (still works) |

### Frontmatter Fields

```yaml
---
# Recommended
name: my-skill                  # Becomes /my-skill in the slash menu
description: >                  # Shown in autocomplete and used for auto-invocation
  What this skill does.

# Optional
model: sonnet                   # sonnet | opus | haiku | inherit
allowed-tools: Bash, Read, Edit # Tools allowed without user confirmation
context: fork                   # fork = run in isolated subagent (like an agent)
agent: Explore                  # Agent type for context:fork (Explore, Plan, custom name)
disable-model-invocation: true  # true = only manual /skill-name invocation, no auto-trigger
user-invocable: true            # true (default) = visible in / menu
argument-hint: "[filename]"     # Autocomplete hint for expected arguments
hooks: {}                       # Lifecycle hooks
---
```

### Skill Body (Instructions)

Everything below `---` becomes the instructions Claude follows.

#### Shell Preprocessing (Skills only!)

```markdown
Current branch: !`git branch --show-current`
Changed files: !`git diff --name-only`
```

The `!`command`` syntax runs BEFORE Claude sees the prompt. Claude receives the output, not the command. Use this for:
- Injecting current state (git status, file listings, API responses)
- Providing context that changes between invocations
- Fetching data that the skill needs to operate on

**Agents cannot use shell preprocessing.** This is a skill-exclusive feature.

#### Arguments

```markdown
Fix the issue: $ARGUMENTS
Specific file: $0
Second arg: $1
```

User types `/my-skill some-file.ts --verbose` → `$ARGUMENTS` = `some-file.ts --verbose`, `$0` = `some-file.ts`, `$1` = `--verbose`

### Quality Checklist

- [ ] `name` is short, descriptive, lowercase with hyphens
- [ ] `description` clearly states what happens when invoked
- [ ] `disable-model-invocation: true` for destructive or expensive skills
- [ ] Shell preprocessing used where live context is needed
- [ ] `$ARGUMENTS` used if the skill accepts parameters
- [ ] Steps are numbered and ordered
- [ ] `allowed-tools` set if the skill needs Bash/Edit without confirmation
- [ ] `context: fork` set if the skill produces large output
- [ ] No ambiguity — Claude knows exactly what to do without improvising

### Anti-Patterns

| Don't | Do |
|-------|-----|
| Allow auto-invocation for destructive skills | Set `disable-model-invocation: true` |
| Skip preprocessing when live data is needed | Use `!`git status``, `!`ls src/``, etc. |
| Leave tools unrestricted | Set `allowed-tools` explicitly |
| Write instructions that require interpretation | Be prescriptive: "Run this command", not "Consider running" |
| Mix concerns — one skill does 5 different things | One skill = one task. Split if needed. |

---

## Templates

### Minimal Agent

```yaml
---
name: my-agent
description: Does X when Y happens. Use for Z.
model: sonnet
tools: Read, Grep, Glob
maxTurns: 15
---

# My Agent

You are a [role] that [does what].

## Input
You receive [what] in your prompt.

## Process
1. [First step]
2. [Second step]
3. [Third step]

## Output Format
Write to the output file path provided in your prompt:

## Summary
[One sentence]

## Details
[Structured findings]

## Status
PASS | FAIL | NEEDS REVIEW
```

### Minimal Skill

```yaml
---
name: my-skill
description: Does X. Use /my-skill [args] to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read
---

# My Skill

Current state: !`git status --short`

## Step 1: [Action]
[Instructions]

## Step 2: [Action]
[Instructions]

## Step 3: Summary
Output what was done.
```

### Skill with Fork (hybrid)

```yaml
---
name: deep-analysis
description: Deep codebase analysis that runs in isolation.
context: fork
agent: Explore
---

Analyze the codebase for $ARGUMENTS.
Report findings in structured format.
```

---

## Combining Agents and Skills

### Agent that loads skills as knowledge

```yaml
---
name: code-reviewer
skills:
  - api-conventions
  - error-handling-patterns
---
```

The skill content is injected into the agent's context as reference material.
The agent does NOT invoke the skill — it reads the skill's instructions as documentation.

### Skill that delegates to an agent

```yaml
---
name: review-code
context: fork
agent: code-reviewer
---

Review the following file: $ARGUMENTS
```

This runs the `code-reviewer` agent in an isolated fork, triggered by `/review-code filename.ts`.

---

## Model Selection Guide

| Model | Use for | Cost | Speed |
|-------|---------|------|-------|
| `haiku` | Simple search, classification, extraction | Lowest | Fastest |
| `sonnet` | Code review, testing, security scanning, most tasks | Medium | Fast |
| `opus` | Complex architecture decisions, nuanced analysis | Highest | Slowest |
| `inherit` | Inherits from parent — avoid, be explicit | Varies | Varies |

**Rule of thumb:** Start with `sonnet`. Only use `opus` if sonnet demonstrably fails at the task. Use `haiku` for high-volume simple tasks (email classification, file search).
