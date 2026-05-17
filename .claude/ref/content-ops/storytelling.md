# storytelling.md

**Richi AI — Storytelling Craft Pattern (Content Operations)**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Authority: STORYTELLING-CRAFT-CANONICAL

---

# 0 — Purpose

This document defines the **storytelling craft framework** used by all Richi AI products. It is the generic counterpart to each product's `content-ops/brand-voice.md`.

It separates:

* **Craft (universal, here)** — hook archetypes, story structures, CTA library, banned-phrase categories, posting structure defaults
* **Brand voice (per-product, in `content-ops/brand-voice.md`)** — concrete voice attributes, specific banned phrases, named series, primary language

A brand's `brand-voice.md` instantiates this pattern. The pattern is craft knowledge — it does not change per product.

---

# 1 — Hook Archetypes

The first 1–3 seconds of video or first line of text. Use exactly one archetype per piece. Mixing weakens both.

| Archetype | Pattern | When to use |
|---|---|---|
| **Stat-driven** | "In N matches across M tournaments, only one player has never lost a tiebreak." | Data-rich verticals, B2B audiences |
| **Contrarian** | "Everyone says X. The data says Y." | Authority-building, polarizing topics |
| **Story-mid-action** | "On match point, court 3, something happened we'd never seen." | High-engagement, narrative content |
| **Behind-the-curtain** | "We almost shipped a feature today that would have broken everything." | Build-in-public, transparency-driven |
| **Question-flip** | "What if your rating could lie to you? It can." | Curiosity gap, educational hooks |
| **Stakes-first** | "If we don't fix this by Friday, the tournament breaks." | Urgency, decision-driven moments |
| **Personal confession** | "I was wrong about X for two years. Here's what I missed." | Trust-building, founder-led brands |
| **List-promise** | "Three things every X gets wrong about Y." | Educational, evergreen content |

Brand instances may pick a *subset* of these archetypes as their default repertoire (documented in `brand-voice.md`).

---

# 2 — Story Structures

## 2.1 — Vertical Video (15–30s)

```
HOOK         ≤ 3s    archetype from Section 1
CONTEXT      ≤ 5s    what / who / when
TENSION      8–15s   problem, decision, unexpected moment
RESOLUTION   3–5s    what happened, what changed
CTA          1–2s    explicit ask
```

## 2.2 — Long-Form Vertical (60–90s)

```
HOOK         ≤ 3s    same as short-form
CONTEXT      ≤ 7s    expanded setup
TENSION      40–60s  multiple beats — escalation, complication, decision
RESOLUTION   5–10s   payoff
CTA          ≤ 5s    explicit ask
```

Never weaken HOOK to make room. If hook fails, nothing after it matters.

## 2.3 — Carousel (4–10 slides)

```
1. HOOK SLIDE       — single sentence, single visual idea
2. CONTEXT SLIDE    — establish stakes
3–8. TENSION SLIDES — one beat per slide
N-1. RESOLUTION     — payoff
N. CTA SLIDE        — explicit ask
```

Each slide must work as a standalone screenshot — users swipe back, screenshot single slides, share them out of context.

## 2.4 — Long-form Text (LinkedIn, blog)

```
HOOK              first line — must survive truncation
PROOF / DATA      one stat or anecdote
NARRATIVE         3–5 paragraphs, one idea each
TAKEAWAY          1 sentence
CTA               explicit ask
```

---

# 3 — Tension Patterns

The middle of a story is where most content dies. These are the recurring tension shapes that hold attention:

| Pattern | Shape |
|---|---|
| **Discovery** | We assumed X. We found Y. Here's the proof. |
| **Decision** | We had to choose between A and B. We picked A because... |
| **Failure-and-fix** | We shipped X. It broke. We fixed it like this. |
| **Comparison** | Format A vs Format B — same players, different outcome. |
| **Reveal** | The thing you don't see in the data: ... |
| **Process** | Step 1 looked easy. Step 4 nearly killed it. |

---

# 4 — CTA Library

Use exactly one CTA per piece. Never stack ("follow AND comment AND share"). Pick one with the highest expected lift for the post's goal.

| CTA Type | Example phrasing | Goal |
|---|---|---|
| **Acquisition** | "Try a free [thing] — link in bio" | Sign-ups, trial starts |
| **Engagement** | "Drop your [X] in the comments" | Algorithmic lift, social proof |
| **Follow** | "Follow for [recurring value]" | Audience growth |
| **Share** | "Tag a [persona] who'd play this" | Network effect |
| **Save** | "Save this — you'll need it next time you [X]" | Algorithmic signal, retention |
| **Question-back** | "Would you have made this decision? Tell me." | Conversation starter |
| **Build-update** | "Subscribe to the build log for weekly updates" | Newsletter / community growth |

CTA matches goal, not preference. An engagement post with a sign-up CTA fails on both metrics.

---

# 5 — Series Cadence Patterns

Recurring series compound — both for the audience (predictability) and the producer (template reuse).

| Pattern | Cadence | What makes it work |
|---|---|---|
| **Weekly recap** | 1×/week | Predictable slot, draws from previous week's data |
| **Themed day** | 1×/week (specific weekday) | "Format Friday", "Match-of-Monday" — calendar lock |
| **Build log** | 1×/week | Founder-led, candid, low production |
| **Spotlight** | 1×/month | Featuring one user / event / decision deeply |
| **Counter-take** | 1×/month | Reaction to industry narrative |
| **Drop** | Event-driven | Tied to releases, announcements — high production |

Don't run more than 3 active series at once. Past 3, each one weakens the others.

---

# 6 — Banned-Phrase Categories

Generic categories every brand should populate in their own `brand-voice.md`:

| Category | Examples (delete per-brand) |
|---|---|
| **SaaS clichés** | "Game-changer", "revolutionize", "next-level", "best-in-class" |
| **Empty AI invocation** | "AI-powered" when not describing actual AI; "ML-driven" without specifics |
| **Sports bro-isms** | "Crushing it", "no days off", "grind never stops" |
| **Tech jargon for non-tech audience** | "Leverage synergies", "agile mindset", "frictionless experience" |
| **False urgency** | "Don't miss out", "limited time" (when neither is true) |
| **Hollow validation** | "Game-changer for the industry", "this changes everything" |

Each brand picks the categories that apply and adds its own veto list.

---

# 7 — Tone Spectrum Framework

Different contexts demand different tones from the same voice. Brands declare their tone for each context in `brand-voice.md`:

| Context | What it usually wants |
|---|---|
| Recap / wrap-up | Celebratory, factual, name-forward |
| Build-in-public | Honest, decision-led, slightly self-deprecating |
| Feature/product post | Concise, "what changed, why it matters" |
| Community moment | Reactive, fast, low-polish OK |
| Authority / thought leadership | Researched, slow, citation-ready |
| Crisis / correction | Direct, no euphemism, owns the error |

A brand voice is *one identity* moving across these tones — never six different voices.

---

# 8 — Localization Pattern

Each brand declares in `brand-voice.md`:

* **Primary language** — full-effort production
* **Secondary languages** — caption / subtitle mirroring
* **Format-specific policy** — e.g. "Reels: voiceover in primary, subs in primary + 1 secondary"

Generic guidance:

* Subtitles on every vertical video — non-negotiable
* Hashtags can be multilingual on IG, single-language on TikTok
* LinkedIn long-form: primary only; mirroring fragments engagement signal

---

# 9 — Output Schema for Generated Content

When LLM-generated content lands in n8n workflows, it must conform to a parseable schema per format:

## 9.1 — Vertical Video Script

```yaml
hook: "single sentence, ≤ 3s readable"
context: "5-second setup"
tension:
  - "beat 1"
  - "beat 2"
resolution: "payoff in 3-5 seconds"
cta:
  type: "engagement | acquisition | follow | share | save"
  phrasing: "exact text"
caption: "platform-ready caption with line breaks"
hashtags:
  - "#tag1"
  - "#tag2"
```

## 9.2 — Carousel

```yaml
slides:
  - role: "hook"
    text: "single sentence"
    visual_note: "what should be on screen"
  - role: "context"
    text: "..."
    visual_note: "..."
caption: "platform-ready caption"
cta:
  type: "..."
  phrasing: "..."
```

Workflows reference these schemas when defining parser logic in `prompts.md`.

---

# 10 — Cross-References

| Topic | Reference |
|---|---|
| 4-phase automation lifecycle | `.claude/ref/content-ops/automation.md` |
| Visual contract (aspect ratios, formats) | `.claude/ref/content-ops/visuals.md` |
| Required analytics events | `.claude/ref/growth/analytics.md` |
| Per-brand voice instances | per repo: `content-ops/brand-voice.md` |

---

# 11 — Versioning & Status

**Version:** 1.0
**Status:** ACTIVE

Future revisions may add:

* Audio / podcast story structures
* Newsletter / email-specific hook patterns
* Multilingual hook-archetype variants
