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

# 9 — Visual Design Language

The shared vocabulary used to describe a frame. Brands inherit this vocabulary; they declare their default choices (e.g. preferred shot types, lens, lighting style) in `brand-visuals.md`. Sections §1–§8 above govern the **output** (where it goes, what specs); this section governs the **content of the frame itself**.

## 9.1 — Shot Types

Choose exactly one shot type per frame. Mixing reads as visual indecision.

| Shot Type | Description | Effect |
|---|---|---|
| Extreme Close-Up (ECU) | Very tight (eye, lips, ring) | Intimacy, tension |
| Close-Up (CU) | Face / chest | Emotion, drama |
| Medium Shot (MS) | Waist-up | Balance of emotion & context |
| Full Shot (FS) | Full body | Figure + slight context |
| Long Shot (LS) | Hero in environment | Atmosphere, location focus |
| Extreme Wide Shot (EWS) | Person as a dot in landscape | Epic scale |
| Over-the-Shoulder (OTS) | From behind a character | Presence, cinematic |
| POV (Point of View) | First-person | Immersion |
| Bird's Eye View | From above (drone-like) | Overview, abstraction |
| Worm's Eye View | From below | Power, dominance |
| Dutch Angle | Tilted camera | Energy, tension, instability |

## 9.2 — Lens, Aperture & ISO

Optical parameters that shape the frame beyond what shot type alone controls. Declare all three in any prompt that aims for photorealism — missing values let the model drift to stock-photo defaults.

### 9.2.1 — Focal Length

Focal length changes not just zoom but spatial perception.

| Lens Type | Range | Effect | Typical Use |
|---|---|---|---|
| Ultra-Wide | 14–24mm | Drama, distortion, dramatic space | Architecture, streets |
| Wide | 24–35mm | Lots of environment, dynamic | Street, travel, reportage |
| Standard | 35–50mm | "Human eye" look | Documentary, lifestyle |
| Portrait | 85–135mm | Background compression, subject isolation | Portraits |
| Telephoto | 200mm+ | Isolation, flat background | Sports, wildlife |

### 9.2.2 — Aperture (Depth of Field)

| Aperture | Effect | Typical Use |
|---|---|---|
| f/1.2–f/1.8 | Razor-thin focus plane, creamy bokeh | Portrait isolation, hero close-ups |
| f/2.0–f/2.8 | Shallow depth, subject pops, background soft | Editorial portrait, low-light action |
| f/4.0–f/5.6 | Moderate depth, subject + near context sharp | Lifestyle, product, group shots |
| f/8.0–f/11 | Deep field, most of frame sharp | Landscape, architecture, documentary |
| f/16+ | Everything sharp, sun starbursts | Wide landscape, hyper-detail product |

### 9.2.3 — Shutter Speed (Motion)

| Shutter | Effect | Typical Use |
|---|---|---|
| 1/2000s+ | Freezes fast action mid-air | Sports, splashes, wildlife |
| 1/500s | Freezes most human action | Street, lifestyle action |
| 1/125s | Standard handheld, mild motion freeze | Documentary, portrait |
| 1/30s | Motion blur on moving subject, sharp static | Gritty reportage, motorcycle pans |
| 1/4s+ | Heavy blur, light trails | Long exposure, night, abstract |

### 9.2.4 — ISO (Grain & Noise)

| ISO | Effect | Look |
|---|---|---|
| ISO 50–100 | Clean, no grain, max detail | Studio, controlled light, commercial |
| ISO 200–400 | Negligible grain, slight texture | Daylight documentary, "1990s film" |
| ISO 800–1600 | Visible grain, "fast film" character | Gritty editorial, low-light street |
| ISO 3200+ | Heavy grain, noise, raw feeling | Concert, night, surveillance aesthetic |

State all three in the prompt as a triplet: `f/1.4, 1/125s, ISO 400`. A model that receives only "85mm lens" without aperture defaults to mid-range (~f/4) and loses the bokeh that defines portrait look.

## 9.3 — Lighting

Light is the primary creator of mood. Always specify source, direction, quality, and temperature — never a vague feeling like "good lighting".

### 9.3.1 — Sources

| Source | Effect |
|---|---|
| Natural light (window / sun) | Alive, realistic, soft |
| Softbox / Studio strobes | Clean, controlled, commercial |
| Neon / LED signs | Futuristic, bright accents, cyberpunk |
| Candlelight / Fire | Intimacy, mysticism, coziness |
| Practical lights (visible in frame) | Realism, "life inside the scene" |

### 9.3.2 — Direction

| Direction | Effect |
|---|---|
| Front-lit | Flat face, minimal shadows |
| Side-lit (Rembrandt) | Depth, drama, sculptural |
| Backlit | Silhouette, halo, magic |
| Rim light | Contour highlight, separates subject from background |
| Top light | Harsh downward shadows, mystery |
| Under light | Horror vibe, surrealism |

### 9.3.3 — Quality

| Quality | Effect |
|---|---|
| Hard light | Sharp shadows, drama, texture |
| Soft light | Diffused, gentle, beauty look |
| Diffused light | Even, "clean" commercial look |

### 9.3.4 — Color Temperature

| Temperature | Range | Effect |
|---|---|---|
| Warm | 2700–3500K | Coziness, romance, nostalgia |
| Neutral Daylight | 5000–5600K | Realistic balance |
| Cool | 6000–7000K | Techy, distant, cold |

## 9.4 — Materials & Textures

AI models do not "see" like humans. Tactility must be declared explicitly or the image reads as plastic.

| Material | Variants to specify | Effect |
|---|---|---|
| Metal | matte, brushed, polished, scratched | Industrial, technical vibe |
| Fabric | silk (glossy), denim (rough), wool (warm), leather (patina) | Luxury, casual, warmth, ruggedness |
| Skin | visible pores, micro-wrinkles, slight tone irregularities | Realism, "life" |
| Glass / Water | reflections, condensation | Depth, dynamism |

## 9.5 — Composition Techniques

| Technique | Effect |
|---|---|
| Rule of Thirds | Balance, natural look |
| Centered | Formal, iconic |
| Negative Space | Air, drama, area for text overlay |
| Leading Lines | Guides the viewer's eye |
| Foreground / Midground / Background | Depth, dimension |
| Symmetry | Harmony, minimalism |
| Asymmetry | Movement, energy |

## 9.6 — Style Anchors

Anchoring a frame to an existing aesthetic shortcuts an LLM toward predictable output. Three valid anchor categories:

| Category | Examples (each brand picks its own) |
|---|---|
| Photographers | Annie Leibovitz (dramatic portrait), Bruce Gilden (harsh street), Helmut Newton (fashion) |
| Films / Cinematographers | Blade Runner 2049 (neon + fog), Dune (sandy monumentality), Drive (night & neon), Roger Deakins (teal & amber) |
| Eras | 1970s ads, 1990s grunge, 1920s art deco |

Each brand's `brand-visuals.md` declares 1–3 default anchors per content type. Mixing more than 3 anchors in one prompt dilutes them all.

## 9.7 — Aesthetic Decision Algorithm

Style Anchors (§9.6) name specific aesthetic references. This section governs how to **choose** an aesthetic upstream of those references — driven by the content's goal, not operator taste.

### 9.7.1 — Decision Flow

```
Goal  →  Audience  →  Emotion  →  Base Aesthetic  →  Substyle  →  Style Kit  →  Prompt
```

| Step | Output |
|---|---|
| Goal | What action should the viewer take? (sign up, share, save, follow, buy) |
| Audience | B2B / consumer / creator / mixed |
| Emotion | Target feeling (trust, hype, nostalgia, awe, edge, calm) |
| Base Aesthetic | Pick ONE of seven (§9.7.2) |
| Substyle | Micro-style refinement (§9.7.5) |
| Style Kit | Lock palette + light + texture (§9.7.6) |
| Prompt | Apply §10.4 formula with locked Style Kit |

Skipping any step lets the model pick — randomness. Locking each step is what makes outputs feel like one brand, not seven.

### 9.7.2 — The 7 Base Aesthetics

Pick exactly one per piece. Mixing two reads as visual indecision.

| Base Aesthetic | Meta-message | Starter style keywords |
|---|---|---|
| Cinematic | Story, depth, emotion | low-key, haze, shallow DOF, filmic grade |
| Minimalist | Clarity, trust, premium | neutral palette, negative space, soft diffused light |
| Editorial / Fashion | Luxury, confidence, trend | studio light, glossy textures, bold pose |
| Dreamy / Soft | Gentle, nostalgic, emotional | pastels, bloom, soft haze, romantic light |
| Retro / Vintage | Memory, authenticity, human | warm film tones, grain, slight softness, flash vibe |
| Gritty / Dark | Edge, power, rebellion | high contrast, desaturated, harsh side light, urban texture |
| Futuristic / Tech | Innovation, speed, efficiency | neon rim, chrome, clean geometry, glowing reflections |

### 9.7.3 — Style Dials

Each base aesthetic is tuned along six axes. Brand `brand-visuals.md` declares default dial positions per format. Dials remain coherent within a piece — e.g. a Minimalist aesthetic on the Hard-light dial drifts into Editorial.

| Dial | Left | Right |
|---|---|---|
| Palette | Warm = emotional / human | Cool = smart / tech |
| Light | Soft = gentle / premium | Hard = intense / edgy |
| Contrast | Low = calm / airy | High = dramatic / powerful |
| Texture | Clean = modern / trust | Grain + haze = memory / mood |
| Composition | Minimal = clarity | Busy = energy / chaos |
| Motion + edit | Slow = cinematic / premium | Fast cuts = hype / youth |

### 9.7.4 — Goal → Style Decision Matrix

| Video goal | Target emotion | Base aesthetic | Substyle candidates |
|---|---|---|---|
| Sell premium product / service | Trust + premium | Minimalist (primary), Editorial (backup) | Neo-Minimalism, Brutalist Minimalism, Pastel Editorial |
| SaaS / AI launch | Innovation + speed | Futuristic, Minimalist | Retro-Futurism, Cyberpunk (premium), Neo-Minimalism |
| Brand film / storytelling | Emotion + depth | Cinematic, Dreamy | Dark Academia, Film Photography Aesthetic |
| Personal brand (warm + intimate) | Human + relatable | Dreamy, Retro | Film Photography Aesthetic, Indie Sleaze |
| Streetwear / nightlife / edge | Power + rebellion | Gritty | Grunge Revival, Indie Sleaze |
| Nostalgia / memory / real | Authenticity | Retro | Film Photography Aesthetic, Y2K (90s flash) |
| Youth / playful / pop | Fun + energy | Dreamy, Editorial (colorful) | Y2K, Barbiecore, Vaporwave |
| Education / explainer | Clarity + competence | Minimalist, Cinematic (clean) | Neo-Minimalism, Brutalist Minimalism |
| Art / experimental | Surprise + culture | Pick ONE: Futuristic, Retro, or Gritty | Vaporwave, Retro-Futurism, Cyberpunk |

### 9.7.5 — Substyles Vocabulary

Substyles refine the base aesthetic. Not exhaustive — brand `brand-visuals.md` may extend with proprietary substyles.

`Barbiecore`, `Brutalist Minimalism`, `Cyberpunk`, `Dark Academia`, `Film Photography Aesthetic`, `Grunge Revival`, `Indie Sleaze`, `Neo-Minimalism`, `Pastel Editorial`, `Retro-Futurism`, `Vaporwave`, `Y2K`

### 9.7.6 — Style Kit Schema

Per-brand, per-format Style Kit lives in `brand-visuals.md`. Style Kits are reusable across pieces — they lock visual decisions so prompts only vary subject + action.

```yaml
style_kits:
  - name: "hero-product-shot"
    base_aesthetic: "Minimalist"
    substyle: "Neo-Minimalism"
    palette: ["#F8F8F6", "#1A1A1A", "#C2A878"]
    light: "soft, diffused, side-key"
    contrast: "low"
    texture: "clean"
    composition: "centered with negative space"
    motion: "slow push-in"
```

---

# 10 — AI Prompt Craft for Visual Generation

The language layer above the design vocabulary in §9. Constraints below are direct LLM-prompt rules for visual-generation agents.

## 10.1 — Prompt Block Structure

Every visual prompt is layered across these seven blocks. Missing blocks are not defaults — they are randomness the model fills in.

| # | Block | What it locks down |
|---|---|---|
| 1 | Subject & Action | Who is in the frame and what is happening |
| 2 | Camera & Shot Type | Viewer's point of view (see §9.1) |
| 3 | Lens & Focal Length | Optics and spatial perception (see §9.2) |
| 4 | Lighting | Source, direction, quality, temperature (see §9.3) |
| 5 | Material & Texture | Surface properties for tactility (see §9.4) |
| 6 | Composition | Framing rule (see §9.5) |
| 7 | Style Reference | Aesthetic anchor (see §9.6) |

Block 1 (Subject & Action) takes priority — abstraction here breaks everything downstream. "A happy person" fails; "A young woman laughing while holding a cup of coffee, sitting on a balcony at sunset" sets context.

For **motion prompts** Block 1 is necessary but not sufficient. The full scene flow — what happens when, who reacts to whom, in what spatial blocking, with what emotional arc — must be declared per §10.8 Action Block. Cinematography without choreography produces visually clean but causally incoherent clips.

## 10.2 — The 3-Pillar System

| Pillar | What it adds | Example |
|---|---|---|
| **Structure** (Technical Base) | Camera, light, materials, composition | "handheld 35mm, f/2.8, 1/30s, ISO 400, gritty 90s analog style" |
| **Reference** (Style) | Anchor to a known aesthetic | "Styled like 1970s motorcycle ads with Bruce Gilden authenticity" |
| **Vision** (Emotion) | How the viewer should feel | "Intense, gritty, unfiltered realism" |

All three pillars required. Missing one produces hollow output.

## 10.3 — Language Discipline

**Technical beats emotional. Always.**

| Avoid | Use instead |
|---|---|
| "Moody portrait" | "85mm portrait, f/1.4, soft side lighting, warm 3200K tones" |
| "Good lighting" | "Soft golden-hour sunlight (3200K), backlit, lens flare on edges, warm glow on skin" |
| "Cool motorcycle at night" | "Motocross rider mid-lean, handheld 35mm, f/2.8, 1/30s, ISO 400, gritty 90s analog style" |

Vocabulary is that of a working DP: focal length, aperture, rim light, diffusion, grain, color temperature in Kelvin. Brand voice colors subject and tone; never softens the technical layer.

## 10.4 — Prompt Formula

```
[Shot + Lens + Aperture] + [Lighting: source / direction / temperature] + [Materials & Textures] + [Composition] + [Style Reference]
```

Worked example:

> "Medium close-up portrait, 85mm lens at f/1.4, soft window light from camera left (3200K warm), shallow depth of field, visible skin texture, subject centered with negative space on the right, inspired by Annie Leibovitz editorial style."

## 10.5 — JSON vs Plain Text

| Output Type | Format |
|---|---|
| Photography / photorealism | Plain text — JSON limits nuance |
| Illustration / 3D / stylized art | JSON — locks structure (camera, lighting, palette, pose) |

Stylized JSON skeleton:

```json
{
  "camera": { "angle": "front three-quarter view", "lens": "35mm" },
  "lighting": { "type": "studio three-point", "shadow_style": "soft cell-shaded" },
  "color_palette": ["#F4D03F", "#2980B9"],
  "character_pose": "dynamic running mid-stride"
}
```

n8n workflows branch by output type: photo-realism emits plain text, illustration emits JSON.

## 10.6 — Alpha Prompt System

Per-workflow prompt templates declare five fixed sections: **role, context, instructions, constraints, examples**. Lives in `content-ops/workflows/<name>/prompts.md`. Per-brand keyword libraries (proven phrasings for cameras, lighting, materials) live in `brand-visuals.md`.

## 10.7 — Iteration Discipline

A prompt is a hypothesis, not a final artifact. Operators MUST treat prompt quality as a closed loop, not a single shot.

### 10.7.1 — A/B Testing

For any prompt that ships to production rotation:

| Rule | Why |
|---|---|
| Generate ≥ 2 variants per prompt before publishing | First output is rarely the best — model variance is high |
| Change ONE block per variant (light OR lens OR style anchor) | Single-variable testing isolates which block moved the result |
| Record the winning variant in `brand-visuals.md` keyword library | Captures proven phrasings instead of regenerating tribal knowledge |
| Discard, do not "patch", losing variants | Patched bad prompts accumulate cruft |

### 10.7.2 — Reference Bank

Every brand maintains a reference bank of target outputs (real photos, stills, prior wins). Lives at `content-ops/reference-bank/` per brand.

| Reference Type | Purpose |
|---|---|
| Aspirational frames | The look the brand is reaching for — used for reverse-engineering |
| Brand-validated wins | Past outputs that passed review — anchor for consistency |
| Anti-references | Looks to avoid (off-brand, stock-photo aesthetic) — used as negative prompts |

### 10.7.3 — Reverse-Engineering

For any aspirational frame in the reference bank, the operator writes a hypothesis prompt that would produce it. Compare generated output to the reference; refine until the hypothesis prompt converges. The converged prompt joins the keyword library.

### 10.7.4 — Comparison Loop

Standard iteration cycle for any new prompt:

```
generate → compare to reference → record delta → refine ONE block → repeat
```

Cap at 5 cycles per prompt. If no convergence after 5, the gap is in the design vocabulary (§9), not the prompt — fix upstream.

### 10.7.5 — Keyword Library Maintenance

Per-brand `brand-visuals.md` keyword library entries follow this shape:

```yaml
keyword_libraries:
  lighting:
    - phrase: "soft golden-hour sunlight (3200K), backlit, lens flare on edges"
      proven_for: ["portrait", "outdoor lifestyle"]
      added: 2026-05-22
  camera_bodies:
    - phrase: "shot on ARRI ALEXA 35, 35mm anamorphic"
      proven_for: ["cinematic narrative"]
      added: 2026-05-22
```

Entries are added only after a prompt wins A/B testing — not on first use.

## 10.8 — Action Block (mandatory for motion prompts)

Visual blocks §10.1 lock the *look* of a single frame. The Action Block locks the *performance* across time. Without it the motion model fills causality with noise — actions compress or stretch arbitrarily, subjects react before they should, expressions cut instead of transition.

A still prompt MAY use the Action Block for staging clarity. A motion prompt MUST.

### 10.8.1 — Required Slots

| Slot | What it locks | Failure mode if missing |
|---|---|---|
| **Beat sheet** | Each action timestamped to ±0.5s | Actions compress into 1s or stretch to 4s arbitrarily |
| **Choreography** | Who moves first, who reacts, with what delay | Simultaneous motion, no causal staggering |
| **Causality** | What triggers each action (internal state or external event) | Movements read as glitchy / arbitrary |
| **Spatial blocking** | Position relative to camera + other subjects, eye-line direction, body axis | Subjects drift, look into dead space, distances morph |
| **Emotional arc** | Start state → pivot trigger frame → end state, per subject | Expressions cut instead of transition, or never change |

### 10.8.2 — Beat Sheet Format

Table per clip. Trigger column is mandatory — uncaused actions render as motion glitches.

| Time | Subject | Action | Trigger |
|---|---|---|---|
| 0.0s | A | frozen upright, eyes forward, mouth closed | continuation from prior shot |
| 0.0–1.5s | A | shallow rapid breathing, no other motion | residual shock |
| 1.5s | B | bedding rustles as she stirs | A's stillness registers as wrong |
| 2.0s | B | props up on right elbow, head turns toward A | concern |

### 10.8.3 — Causality Rule

Every action answers *what caused it*. "She wakes up" fails. "She wakes because his stillness and breathing pattern register as wrong" works. Motion models read causality as motion smoothness — uncaused actions render as glitches or arbitrary jitter.

Internal triggers (a thought forming, a decision crystallizing) are as valid as external ones (a sound, a touch) — but must be named.

### 10.8.4 — Spatial Blocking

At clip start, declare for each subject:

| Field | Format |
|---|---|
| Distance from camera | close / medium / far, or explicit (e.g. ~50cm, ~1.2m) |
| Distance from other subjects | touching / arm's length / explicit |
| Eye-line direction | to camera / screen-left / screen-right / off-frame / to other subject |
| Body axis | square to camera / 45° / profile |

Declare blocking *changes* in the beat sheet (e.g. eye-line pivots from forward to screen-right at 1.0s).

### 10.8.5 — Emotional Arc

Per subject, three states: **start → pivot → end**. The pivot names the trigger frame that flips the arc.

> Subject A — start: blank shock (0.0s) → pivot: head-turn at 1.0–1.8s → end: quiet determination (1.8s held to clip end).

A subject with no arc still declares it (e.g. "Subject B — passive concern, no pivot, unchanged at clip end") — the model otherwise invents one.

### 10.8.6 — Action Block Anti-Patterns

| Anti-pattern | Why it fails | Fix |
|---|---|---|
| "She wakes and looks at him concerned" | No timing, no trigger, no blocking | Beat sheet with trigger column |
| "He looks determined and grabs his phone" | Two actions, no order, no transition trigger | Stagger with timestamps + named pivot |
| "They share a quiet intimate moment" | Pure vision, zero structure | Replace with concrete subject actions per beat |
| Multi-shot prompt with one Action Block covering both | Beat-sheet collapses across the cut | One Action Block per shot, with cut declared as a beat |

## 10.9 — Material Separation Rule

When any subject is illuminated by a screen, monitor, mirror, glass, polished metal, or other reflective / emissive surface, motion models will often **transfer the source's surface texture onto the receiving skin** — scanlines, pixel grids, display banding, mirror seams appearing as a "veil" on a face. The model literalizes "screen lights face" as "screen-pixel structure renders on face."

This is a **material** problem, not a lighting problem. Dimming or removing the light does not fix it; explicit material separation does.

### 10.9.1 — The Three-Hebel Fix

| Hebel | Rule |
|---|---|
| **Receiver-side declaration** | Name the receiving surface explicitly as opaque organic matter with its own micro-texture (pores, stubble, sub-surface scattering, fabric weave). Never let it default. |
| **Verb separation** | Never use the illuminant as the verb-subject acting on the receiver. Wrong: "the screen lights his face." Right: "warm light from the device wraps around his lower jaw." |
| **Concept-name negatives** | Name the failure mode in the negatives, not the visual symptom. Wrong: "no scanlines." Right: "face must not appear as a display surface, no pixel grid on flesh, no display structure on skin." |

### 10.9.2 — Trigger Surfaces

The rule applies whenever any of these appear in the prompt as a light source touching a subject:

| Surface | Typical hallucination |
|---|---|
| Phone / tablet / monitor screen | Scanlines, pixel grid, display banding on skin |
| Mirror / polished metal | Seams, edges, mirror surface texture on skin |
| Glass (windows, displays) | Reflection content baked into skin |
| Water surface | Caustic patterns embedded in skin |
| Stained glass / patterned light | Pattern projected as skin texture instead of as light play |

### 10.9.3 — Worked Example

```
LIGHTING
- KEY: warm 3800K under-light from the phone in his hands — dramatic cinematic
  catching jaw and cheekbones.
- RIM: cool 5600K moonlight from camera-right separating his head from the
  dark background.

MATERIALS
- Skin is opaque organic matter: pores, micro-texture, light stubble, natural
  sub-surface scattering, soft specular highlights on illuminated planes.
- The phone is a discrete physical object held in front of his chest, a
  separate surface from his face. Light from the phone is pure diffuse
  illumination only — no screen content, no pixel pattern, no display
  structure transfers onto his face.

NEGATIVES
Do not render: face appearing as a display surface, screen pixels rendered on
facial skin, scanline texture embedded in skin, display structure on facial
features, translucent veil over the face, holographic skin overlay, pixel
grid on flesh, screen content reflected through the face, moiré on skin,
rolling-shutter banding on skin, CRT scanline pattern on skin.
```

Dramatic lighting is preserved. Only the texture-transfer halluzination is suppressed.

---

# 11 — AI Production Workflow

Tool-independent rules for producing AI cinematic content end-to-end. Specific tools (image generators, video generators, editors) are operator choices declared in `brand-visuals.md`.

## 11.1 — Four-Phase Pipeline

| Phase | Input | Output |
|---|---|---|
| 1 — Image Generation | Text prompt | Base reference frame (still) |
| 2 — Image-to-Image Integration | Base ref + product/asset refs | Composited static frame |
| 3 — Image-to-Video Animation | Composited frame + motion prompt | Animated clip (5–15s) |
| 4 — Final Edit | Multiple clips | Published video |

Phase outputs are always saved before advancing — every phase is independently re-runnable.

## 11.2 — Phase 1 Rules: Image Prompt

| Rule | Why |
|---|---|
| Always define camera AND lighting | Locks realism. Missing either lets the model drift to stock-photo defaults. |
| Set format and quality explicitly | Vertical 9:16 default for short-form; 2K is optimal detail/cost balance |
| Use the §10.4 formula | Same formula applies whether base portrait or hero product shot |
| Save the best result as the **base reference** | Identity lock for downstream phases |

## 11.3 — Phase 2 Rules: Integration Prompt (Image-to-Image)

Merging a base subject with product/environment references requires explicit physical-interaction constraints. Vague instructions produce floating, weightless composites.

| Constraint | Why |
|---|---|
| Realistic weight distribution | Prevents objects sitting "on top of" rather than "into" the subject |
| Natural gravity behavior | Stops jewelry, fabric, accessories from defying gravity |
| Slight indentation under contact | Sells the weight of the added element |
| Accurate contact shadows | Without shadows the integration reads as collage |
| Reflections on adjacent surfaces | Closes the realism gap (e.g. diamond highlights on adjacent skin/metal) |
| "No floating elements" | Explicit negative — model tends toward floating by default |

State reference roles explicitly: "reference 1 is the base subject, reference 2 is placed at [exact body part]". Vague placement produces random placement.

## 11.4 — Phase 3 Rules: Motion Prompt (Image-to-Video)

Strictest phase. Motion models hallucinate. Every motion prompt declares **what moves, how, and explicitly what must NOT happen**.

| Rule | Why |
|---|---|
| Subject-lock one element | Prevents drift mid-clip |
| Define ONE camera movement | Stacked camera moves break |
| Define ONE subject movement | Coupled motions read as confusion |
| State explicit negatives | "No tongue movement", "mouth remains closed" — ban hallucination targets by name |
| Set duration explicitly (5s or 15s) | Longer clips multiply hallucination risk |

**Recovery rule when motion breaks:** simplify to one camera move + one subject move. If a complex shot still fails, split into two clips and rejoin in Phase 4.

## 11.4.5 — Motion Prompt Canonical Order

Motion prompts assemble in this fixed order so the model parses *intent* before *constraints*. Skipping or reordering reduces adherence measurably — the same blocks in the wrong order produce drift.

| # | Block | Source |
|---|---|---|
| 1 | Scene + first/last frame anchors | per clip |
| 2 | Reference subjects (identity locks) | per clip |
| 3 | Action Block — full | §10.8 |
| 4 | Camera movement (ONE) | §11.4 |
| 5 | Lighting transitions | §9.3 + clip-specific |
| 6 | Materials (when illuminant surfaces are involved) | §10.9 |
| 7 | Audio (only if using a native-audio model — Veo 3, Seedance with audio, etc.) | clip-specific |
| 8 | Negatives — by concept name, not visual symptom | §10.9.1 + clip-specific |
| 9 | Duration + format | clip-specific |

Block 6 (Materials) is mandatory whenever a screen, mirror, glass, or other reflective / emissive surface appears in the lighting block. See §10.9 for the failure mode this prevents.

Block 8 (Negatives) names *concepts*, not *symptoms*. "No scanlines" describes what the operator sees; "face must not appear as a display surface" describes what the model is doing wrong. Models steer better on the wrong-doing description.

## 11.5 — Camera Body Reference Library

Including a real camera body in the prompt steers the model toward a specific photographic look:

| Camera Body | When to use |
|---|---|
| ARRI ALEXA 35 | Cinematic shots, soft depth, natural color grading |
| Hasselblad H6D | Premium high-end close-ups, rich macro detail |
| RED KOMODO 6K | True cinematic, film-like look |
| Sony A7R IV | Ultra-realistic, high-detail images |

Brands may extend this list in `brand-visuals.md` with preferred bodies for their content type.

---

# 12 — Production Output Specifications

Constraints and schemas that bound the output of any production workflow (AI-generated or live-action). Operator-side production decisions (tool choice, editing technique, equipment) are out of scope for this pattern doc.

## 12.1 — Shot List Schema

Production workflows emit a structured shot list per piece:

| Column | Purpose |
|---|---|
| `shot_id` | Sequential identifier (Shot 1, Shot 2…) for cross-reference with edit timeline and script beats |
| `line` | Exact dialogue, word-for-word — or `[live reaction]` for unscripted moments |
| `shot_description` | What is in frame: framing, action, on-screen behaviour |
| `audio_source` | `on-camera` (lavalier captured at filming) OR `voiceover` (recorded separately) |
| `wardrobe` | Talent wardrobe (for continuity across multi-day shoots) |
| `location` | Where the shot is filmed |
| `props_cast` | Props required on set + cast members in shot. Used as pre-shoot checklist so producer verifies all items are on-hand before filming. Without this column, missing-prop discoveries happen on set and waste shoot time. |
| `structural_role` | `hook` / `substance` / `payoff` / `bridge` / `cta` |

## 12.2 — Export Specifications

Standard short-form vertical export:

| Setting | Value |
|---|---|
| Codec | H.264 |
| Resolution | 1080 × 1920 (9:16 vertical) |
| Frame rate | 30 FPS |
| Container | MP4 |
| Audio | AAC, integrated loudness -16 LUFS (see §4.3) |
| Subtitles | Burned in (see §4.4) |

Matches TikTok, Instagram Reels, YouTube Shorts, and LinkedIn vertical-video input expectations. Re-export per-platform only if a platform specifies different requirements.

## 12.3 — Live-Action Capture Specifications

The capture side of the pipeline. These are the **minimum** capture settings that survive the Phase 4 edit (§12.2 Export Specs) without quality loss. Operator-specific tool steps (device Settings menus) live in per-brand `brand-visuals.md`; the values below are platform-agnostic minimums.

| Setting | Value | Why |
|---|---|---|
| Resolution | 4K (3840×2160) | Headroom for reframing, stabilization, and 1080p export with crop budget |
| Frame rate | 30 FPS | Matches export frame rate (§12.2); avoids cadence conversion artifacts |
| HDR | Disabled | HDR capture creates editing-pipeline color mismatches with non-HDR delivery platforms |
| White balance | Locked | Auto-WB drifts mid-clip → cuts become visible. Lock to the dominant light source. |
| Capture app | Device default camera app | In-app capture (TikTok / Instagram cameras) downsamples and pre-compresses — never use for source footage. Default app preserves max quality and enables clean off-device transfer. |
| Grid + level overlay | Enabled | Composition discipline (rule of thirds — §9.5) and horizon stability |

### 12.3.1 — Capture Hygiene

Production-hygiene minimums that affect every shot:

| Rule | Reason |
|---|---|
| Clean the lens before every shoot | Fingerprints and dust create haze that no edit fully removes |
| Stabilize the camera (tripod, gimbal, or braced grip) | Handheld shake destroys retention faster than any other capture flaw |
| Position eye-line on the top-third grid line for face-forward shots | Matches Rule of Thirds (§9.5); eyes-centered reads as passport photo |
| Shoot the face from a slightly elevated angle | Flatters jawline; eliminates the "double-chin" foreshortening of low-angle |
| Default light source = window with diffuse natural light | Free, soft, flattering; see §9.3.1 Sources |

These rules apply to live-action shoots regardless of subject. AI-generated content (§11) inherits the same composition rules through prompt construction; capture hygiene applies only to live-action capture.

### 12.3.2 — Production Priority Hierarchy

When budget or attention is finite, allocate in this order. Reordering reliably degrades perceived quality more than the budget saved.

| Priority | Rule |
|---|---|
| 1. **Audio clarity** | Bad audio kills retention faster than any visual flaw. Viewers tolerate slightly grainy video; they do not tolerate muffled voice, room reverb, or wind noise. Microphone upgrade comes before any other gear upgrade. |
| 2. **Adequate lighting** | Lighting upgrades perceived video quality more than camera upgrades. Window light during day, ring light / panel at night. Soft, diffused, front-of-subject (see §9.3). |
| 3. **Stabilization** | Tripod / brace / gimbal — shake destroys retention; static is fine. |
| 4. **Camera resolution** | Bottom of the list. Modern smartphone cameras (post-2021) satisfy all needs per §12.3. Camera upgrades beyond smartphone are last priority, not first. |

**Friction-as-killer rule.** Every step between "I have an idea" and "I am recording" must be removed, or the content does not get made. Test: from idea to recording in ≤ 60 seconds. If longer, identify and remove the friction (gear retrieval, setup assembly, environment prep). A dedicated permanent setup (camera mounted, mic plugged in, lighting positioned) consistently outperforms an on-demand assembly setup regardless of which setup has better specs — because the permanent setup gets used and the assembly setup gets skipped.

## 12.4 — Edit Discipline

The cut phase of the pipeline. Capture Specs (§12.3) and Export Specs (§12.2) bracket the input and output; this section governs what happens between. Editor-tool choice (DaVinci Resolve, Premiere, CapCut, FCP) is an operator decision declared in `brand-visuals.md`; the discipline below applies regardless of tool.

| Rule | Reason |
|---|---|
| Lock vertical orientation (1080×1920) before timeline editing begins | Re-orienting mid-edit loses footage to crop; locks composition early |
| Cut all dead space — pauses, filler words, slow starts, mid-sentence resets | The #1 cause of mid-video skip (see `measurement.md` §6.3 iteration-lever 3) |
| Match audio levels across all clips in the timeline | Cuts between loud and quiet clips break immersion; viewers skip rather than adjust volume |
| Insert a punch-in (~10–15% zoom on the same clip) every 4–6 seconds of static talking-head | Re-engages viewer attention; mimics a multi-camera setup with one camera. Single highest-leverage edit move once dead space is already cut. |
| End the cut immediately after the payoff lands | "Overstayed payoff" dilutes the close-loop signal — every extra second after the payoff is a watch-time tax (see `storytelling.md` §3.0) |
| Audio loudness normalized to -16 LUFS integrated, music ducked -12 dB under voiceover | Platform-target loudness; quieter videos sound amateur, louder videos clip (see §4.3) |
| Burn subtitles in at the cut (do not rely on platform auto-captions for primary copy) | Auto-caption accuracy varies; burned-in subtitles are deterministic (see §4.4) |
| Pick the cover frame deliberately — single most striking visual element from the timeline | The cover represents the piece on the profile grid and in feed previews; a poor cover suppresses click-through even on strong videos. Selection happens at export, not as platform default frame-0. |

Punch-in pacing for talking-head pieces converts a one-take recording into something that reads as a directed production. The model: capture one continuous take, then build perceived camera moves through edit-time zooms and cuts.

Per-platform overlays / on-app titling (TikTok and Instagram native text overlays) may produce platform-native typography. When using them, brand `brand-visuals.md` declares which text layers stay in the edit vs which are added in-app — never both for the same layer.

### 12.4.1 — Goldfish Framework (Visual Stimulus Cadence)

The underlying principle behind dead-space cuts, punch-ins, and overlay timing. Treat audience attention as a timer that resets every time something visually changes on screen. If nothing changes for longer than the audience-tolerance window, the timer hits zero and the viewer scrolls.

| Audience age skew | Reset cadence |
|---|---|
| Younger (≤ 25) | ~3 seconds — strict |
| Mixed | ~4–5 seconds |
| Older (40+) | 6–10 seconds — overly fast cuts read as "jarring" |

Reset triggers cycle: text pop, angle change, b-roll cut, overlay graphic, punch-in zoom, sound-effect hit, on-screen subtitle update. A trigger reused back-to-back loses its reset power — alternate trigger types rather than repeating the same one.

Goldfish-cadence is a **floor** for visual stimulus, not a target to exceed. Faster than the cadence reads as chaotic noise and pushes the same skip behavior as too-slow. Brand `brand-visuals.md` declares the audience-age-skew tolerance per format.

### 12.4.2 — Abstract Visuals

Visuals do not need to literally match the spoken content — abstract visuals that resemble or evoke the topic work as well as literal ones. The standard producer failure mode is "I have no footage of [X], so I'll skip the visual" — wrong; use abstract footage that signals [X].

| Spoken topic | Literal visual (often unavailable) | Abstract visual (stock-available) |
|---|---|---|
| "I flew to Hong Kong to close a deal" | Footage of the actual trip | Two hands shaking; a generic skyline |
| "We struggled to find a co-founder" | Footage of the search | Empty office; two desks, one chair filled |
| "I rewrote the codebase in a weekend" | Footage of coding | Time-lapse of any keyboard / screen / clock |

Stock-footage libraries (Pexels, Pixabay, Storyblocks) plus brand-shot reusable b-roll cover most abstract-visual needs. The visual just needs to give the eye something to feed on while the audio carries the substance — Goldfish cadence (§12.4.1) is satisfied whether the visual is literal or abstract.

---

# 13 — Cross-References

| Topic | Reference |
|---|---|
| 4-phase automation lifecycle | `.claude/ref/content-ops/automation.md` |
| Storytelling craft (topic, hooks, structures, CTAs, output schema) | `.claude/ref/content-ops/storytelling.md` |
| Performance measurement & iteration | `.claude/ref/content-ops/measurement.md` |
| Brand UI/UX standards (web app) | `.claude/ref/generation/ui-ux-guide.md` |
| Per-brand visual instances | per repo: `content-ops/brand-visuals.md` |
| Per-brand prompt templates | per repo: `content-ops/workflows/<name>/prompts.md` |

---

# 14 — Versioning & Status

**Version:** 1.11
**Status:** ACTIVE

**Changelog:**

* **1.11 (2026-05-30):** Added §10.8 Action Block (mandatory for motion prompts) with five required slots — beat sheet, choreography, causality, spatial blocking, emotional arc — plus anti-pattern table. Closes the scene-precision gap where prompts described cinematography (camera, lens, light) without describing what *happens* across time; clips were visually clean but causally incoherent. Added §10.9 Material Separation Rule for screen / mirror / glass / water illuminants — prevents surface-texture transfer onto receiving skin (scanlines, pixel grids, display banding rendered as "veil" on a face). Three-Hebel fix: receiver-side declaration, verb separation, concept-name negatives. Added §11.4.5 Motion Prompt Canonical Order — fixed 9-block assembly sequence so models parse intent before constraints. Updated §10.1 to point motion prompts at §10.8. Source: padel-league.richi.solutions content-ops field session 2026-05-30 (Seedance face-as-screen halluzination + missing causality in 3-clip sequence).
* **1.10 (2026-05-24):** Extended §12.1 Shot List Schema with `shot_id` (sequential identifier for timeline/script cross-reference) and `props_cast` (pre-shoot on-hand checklist column). Closes "missing prop on set" failure mode. Added Cover Frame Selection rule to §12.4 Edit Discipline table — explicit cover-frame pick at export (not platform-default frame-0) for profile-grid and feed-preview click-through. Source: TMS Media Shotlist Template, Posting Checklist (Cover/Thumbnail section).
* **1.9 (2026-05-23):** Added §12.4.1 Goldfish Framework (visual-stimulus cadence — 3s younger / 4–5s mixed / 6–10s older audience tolerances; reset-trigger cycling; floor-not-target rule) and §12.4.2 Abstract Visuals (stock/b-roll signalling for non-literal references — Hong-Kong/handshake-skyline pattern). Codifies the underlying principle that punch-ins and dead-space cuts (§12.4) operationalize. Source: Part-Time Creator Academy — Goldfish Framework, Visual Pacification, What To Do And When (HRE).
* **1.8 (2026-05-22):** Added §12.3.2 Production Priority Hierarchy (Audio > Lighting > Stabilization > Camera-resolution — budget allocation order) and Friction-as-killer rule (≤ 60 s idea-to-recording test; dedicated permanent setup beats on-demand assembly regardless of specs). Codifies what to upgrade first and why production friction silently kills consistency. Source: Part-Time Creator Academy / TMS Media — Camera Selection / Audio / Lighting.
* **1.7 (2026-05-22):** Added §12.4 Edit Discipline (vertical-orientation lock, dead-space cuts, audio-level matching, punch-in pacing for talking-head re-engagement, end-on-payoff rule, LUFS normalization, burned-in subtitles). Codifies the cut phase between §12.3 Capture and §12.2 Export. Tool-agnostic — specific editor choice (DaVinci Resolve, Premiere, CapCut, FCP) remains operator decision in `brand-visuals.md`. Source: Part-Time Creator Academy / TMS Media — Editing Your Video.
* **1.6 (2026-05-22):** Added §12.3 Live-Action Capture Specifications (4K/30 FPS / HDR-off / WB-locked / default camera app / grid+level) and §12.3.1 Capture Hygiene (lens cleaning, stabilization, eye-line top-third, slight high-angle face shot, window-light default). Closes the capture-side gap that §12.2 Export Specifications presupposed but did not define. Operator-specific device menu steps remain in per-brand `brand-visuals.md`. Source: TMS Media Camera Mastery Field Guide.
* **1.5 (2026-05-22):** Added §9.7 Aesthetic Decision Algorithm with six sub-sections — §9.7.1 Decision Flow (Goal → Audience → Emotion → Base Aesthetic → Substyle → Style Kit → Prompt), §9.7.2 The 7 Base Aesthetics (Cinematic / Minimalist / Editorial / Dreamy / Retro / Gritty / Futuristic), §9.7.3 Style Dials (6-axis tuning matrix), §9.7.4 Goal → Style Decision Matrix (9 goal-emotion-aesthetic rows), §9.7.5 Substyles Vocabulary, §9.7.6 Style Kit Schema. Closes the upstream-aesthetic-selection gap — §9.6 named *which* references, §9.7 governs *which kind* of references and *why*. Source: AVCC Aesthetic Selection Cheat Sheet.
* **1.4 (2026-05-22):** Expanded §9.2 from Focal Length only to "Lens, Aperture & ISO" with new §9.2.1 Focal Length, §9.2.2 Aperture, §9.2.3 Shutter Speed, §9.2.4 ISO sub-tables — closes camera-settings vocabulary gap so prompts declare aperture/shutter/ISO as triplet, not implied. Added §10.7 Iteration Discipline (A/B testing, reference bank, reverse-engineering, comparison loop, keyword library maintenance schema) — codifies prompt-quality loop instead of one-shot generation. Source: AIVideoSkool "Guide to AI Image Prompting".
* **1.3 (2026-05-22):** Trim pass — removed mindset/principle prose from §10.1, operator-iteration prose from §10.7, tool-name specifics from §11.5, and operator workflow content from §12.2–§12.5 + §12.7. §10 renumbered internally (§10.1 cut → §10.2–§10.7 → §10.1–§10.6). §11.5 Camera Body Reference Library renumbered from §11.6. §12 reduced to Production Output Specifications (Shot List Schema + Export Specs only). Internal ref §10.5 → §10.4. Removed cross-ref to dissolved `channel-strategy.md`.
* **1.2 (2026-05-22):** Added §12 Live-Action Production Workflow. Renumbered Cross-References → §13 and Versioning → §14. Source: TMS Media (course transcripts).
* **1.1 (2026-05-22):** Added §9 Visual Design Language, §10 AI Prompt Craft, §11 AI Production Workflow. Renumbered Cross-References to §12 and Versioning to §13. Source: Sergey Kabankov / AI Video Creators Community.
* **1.0 (initial):** Aspect ratios, safe zones, imagery style rules, motion & sound principles, asset sets, color/typography contract, template schema, accessibility baseline.

Future revisions may add:

* Live-stream / event-streaming visual contracts
* AR / interactive content visual rules
* AI-generated imagery quality gates
* Color grading craft (LUTs, palette systems)
