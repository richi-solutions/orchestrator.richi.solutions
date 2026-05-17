# visuals.md

**Richi AI — Visual Contract Pattern (Content Operations)**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Authority: VISUAL-CONTRACT-CANONICAL

---

# 0 — Purpose

This document defines the **platform-driven visual contract** for content production across all Richi AI brands. It is the generic counterpart to each product's `content-ops/brand-visuals.md`.

It separates:

* **Visual contract (universal, here)** — aspect ratios per channel, safe zones, motion principles, imagery rules, asset-set requirements
* **Brand visuals (per-product, in `content-ops/brand-visuals.md`)** — concrete colors, typography, logo files, brand-specific templates

A brand's `brand-visuals.md` instantiates this pattern with its own design tokens (typically sourced from `tailwind.config.ts` + `src/index.css` to stay in sync with the live product).

---

# 1 — Aspect Ratios per Channel

| Channel | Format | Aspect | Min Resolution | Max File Size |
|---|---|---|---|---|
| Instagram Reel | Vertical video | 9:16 | 1080×1920 | 250 MB |
| Instagram Story | Vertical | 9:16 | 1080×1920 | 100 MB |
| Instagram Feed (square) | Square | 1:1 | 1080×1080 | 30 MB |
| Instagram Feed (portrait) | Portrait | 4:5 | 1080×1350 | 30 MB |
| Instagram Carousel | Portrait or Square | 4:5 or 1:1 | 1080×1350 / 1080×1080 | 30 MB per slide |
| TikTok | Vertical video | 9:16 | 1080×1920 | 287 MB |
| YouTube Shorts | Vertical video | 9:16 | 1080×1920 | 256 MB |
| LinkedIn post image | Landscape | 1.91:1 | 1200×627 | 5 MB |
| LinkedIn document carousel | Portrait | 4:5 | 1080×1350 | 100 MB |
| LinkedIn video | Landscape or Square | 16:9 or 1:1 | 1920×1080 or 1080×1080 | 5 GB |
| X (Twitter) image | Landscape | 16:9 | 1600×900 | 5 MB |
| X (Twitter) video | Landscape | 16:9 | 1920×1080 | 512 MB |
| OpenGraph (web preview) | Landscape | 1.91:1 | 1200×630 | 8 MB |

Never letterbox to fit a wrong aspect — re-frame instead. Letterboxing on TikTok / IG Reels actively suppresses reach.

---

# 2 — Safe Zones

Platform UI eats edges of the canvas. Critical content (headlines, faces, key data) stays inside safe zones.

## 2.1 — Vertical 9:16 (Instagram Reel, TikTok, Shorts)

Frame: 1080×1920

| Zone | Pixels reserved | Why |
|---|---|---|
| Top margin | 220 px | Account name + profile photo overlay |
| Bottom margin | 380 px | Caption preview + CTA buttons + audio attribution |
| Side margins | 80 px each | Right side: action rail (like / comment / share) |

**Effective safe canvas for headlines:** ~920×1320 inside 1080×1920.

## 2.2 — Square 1:1 (Feed)

Frame: 1080×1080

| Zone | Pixels reserved |
|---|---|
| Bottom margin | 120 px (caption truncation) |
| Side margins | 60 px |

## 2.3 — Portrait 4:5 (Feed Portrait, Carousel)

Frame: 1080×1350

| Zone | Pixels reserved |
|---|---|
| Top margin | 80 px |
| Bottom margin | 140 px |
| Side margins | 60 px |

## 2.4 — Landscape 1.91:1 (LinkedIn, OG image)

Frame: 1200×627

| Zone | Pixels reserved |
|---|---|
| Bottom margin | 100 px (LinkedIn text overlay on hover) |
| Side margins | 60 px |

---

# 3 — Imagery Style Rules

These apply to every brand. Brand-specific overrides go in `brand-visuals.md`.

| Do | Don't |
|---|---|
| Real footage, real subjects (with consent) | Generic stock imagery — recognizable as stock kills authenticity |
| High contrast, clear focal point | Low-contrast, busy compositions |
| One accent color "pop" per scene | Saturating accent across the whole frame |
| Data overlays in monospace, high-contrast plate | Data overlays with low-contrast white-on-white |
| Faces eye-line in upper third (vertical) | Faces in dead-center (looks like a passport photo) |
| Subjects looking *into* the frame | Subjects facing the edge of the frame |
| Single point of interest per slide | Multiple competing focal points |

---

# 4 — Motion & Sound Principles

Apply across all vertical video formats.

## 4.1 — Pacing

| Element | Default |
|---|---|
| Hook payoff | ≤ 1.5s from start |
| Average shot length (sport / data content) | 1.5–2.5s |
| Average shot length (talking head / narrative) | 3–5s |
| Maximum static shot | 4s — anything longer needs motion (zoom, parallax, text reveal) |

## 4.2 — Transitions

| Preferred | Avoid |
|---|---|
| Hard cuts | Slow dissolves (cinematic but mobile-killing) |
| Match cuts (action continues across cut) | Random whip pans |
| J-cuts / L-cuts (audio bridges shots) | Heavy template-style 3D transitions |

## 4.3 — Audio

| Element | Default |
|---|---|
| Music | Mood-matched, never overpowering voiceover |
| Voiceover loudness | -16 LUFS integrated |
| Music ducking | -12 dB under voiceover |
| Sound effects | Sparingly — one per beat maximum |

Brand-specific music libraries / VO talent declared in `brand-visuals.md`.

## 4.4 — Subtitles

* Non-negotiable on every vertical video — 85% of mobile views are sound-off
* High-contrast plate behind text (not raw white text on busy background)
* Max 2 lines visible at a time
* Synced to phrase boundaries, not arbitrary word counts

---

# 5 — Required Asset Sets per Brand

Every brand maintains these assets, paths documented in `brand-visuals.md`:

| Asset | Variants required |
|---|---|
| Primary logo | Color (vector), white-on-dark, dark-on-light |
| Icon / mark | Square, transparent background |
| Open Graph default | 1200×630, brand-colored |
| Reel cover template | 1080×1920, with headline + brand mark zone |
| Carousel slide template | Both 1080×1080 and 1080×1350 variants |
| Lower-third (data overlay) | Reusable in motion graphics tool |
| Brand watermark | Subtle, used on UGC repost |

---

# 6 — Color & Typography Contract (Schema)

Each brand's `brand-visuals.md` MUST publish design tokens in this shape:

## 6.1 — Color Schema

```yaml
colors:
  primary:
    hsl: "H S% L%"
    hex: "#RRGGBB"
    usage: "CTAs, primary buttons, hero accents"
  accent:
    hsl: "H S% L%"
    hex: "#RRGGBB"
    usage: "..."
  # additional brand roles
status:
  success: "..."
  warning: "..."
  live: "..."          # if applicable
  destructive: "..."   # never used in marketing visuals
```

Source-of-truth for these tokens: the live product's `src/index.css` CSS variables. Brand visuals doc mirrors them, does not redefine.

## 6.2 — Typography Schema

```yaml
fonts:
  display:
    family: "..."
    weights: [400, 700, 800]
    source: "Google Fonts | self-hosted | custom"
  body:
    family: "..."
    weights: [400, 500]
  mono:
    family: "..."
    weights: [400, 700]
hierarchy:
  reel_headline:
    font: "display"
    weight: 800
    relative_size: "XXL"
  reel_body:
    font: "body"
    weight: 500
    relative_size: "M"
  # ... and so on per use case
```

---

# 7 — Template Schema

For each reusable visual template the brand defines:

```yaml
template:
  name: "match-recap-carousel"
  source: "figma | canva | custom"
  url: "..."
  aspect: "4:5"
  variables:
    - tournament_name
    - winner_name
    - final_score
    - date
  slot_count: 6
  channel_targets: ["instagram_carousel", "linkedin_document"]
```

Templates live in the brand's design tool of choice (Figma, Canva). The `brand-visuals.md` lists them and their URLs.

---

# 8 — Accessibility Baseline

Applies to every brand:

| Requirement | Threshold |
|---|---|
| Text contrast vs background | WCAG AA: 4.5:1 for body, 3:1 for large text |
| Subtitle contrast | 7:1 (higher than UI because video brightness varies) |
| Subtitle font size | ≥ 4% of frame height |
| No flashing content | ≤ 3 flashes/second (epilepsy safe) |
| Don't rely on color alone | E.g. score-up/score-down: arrow + color, not color alone |

---

# 9 — Cross-References

| Topic | Reference |
|---|---|
| 4-phase automation lifecycle | `.claude/ref/content-ops/automation.md` |
| Storytelling craft (hooks, structures, CTAs) | `.claude/ref/content-ops/storytelling.md` |
| Brand UI/UX standards (web app) | `.claude/ref/generation/ui-ux-guide.md` |
| Per-brand visual instances | per repo: `content-ops/brand-visuals.md` |

---

# 10 — Versioning & Status

**Version:** 1.0
**Status:** ACTIVE

Future revisions may add:

* Live-stream / event-streaming visual contracts
* AR / interactive content visual rules
* AI-generated imagery quality gates
