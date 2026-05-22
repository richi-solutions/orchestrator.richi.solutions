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

## 9.2 — Lens & Focal Length

Focal length changes not just zoom but spatial perception.

| Lens Type | Range | Effect | Typical Use |
|---|---|---|---|
| Ultra-Wide | 14–24mm | Drama, distortion, dramatic space | Architecture, streets |
| Wide | 24–35mm | Lots of environment, dynamic | Street, travel, reportage |
| Standard | 35–50mm | "Human eye" look | Documentary, lifestyle |
| Portrait | 85–135mm | Background compression, subject isolation | Portraits |
| Telephoto | 200mm+ | Isolation, flat background | Sports, wildlife |

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

---

# 10 — AI Prompt Craft for Visual Generation

This section governs how visual prompts are written, regardless of which AI tool generates the output. It is the **language layer** above the design vocabulary in §9.

## 10.1 — Core Principle: Intention, Not Randomness

> Style is a repeatable system of decisions — not a lucky accident.
> Consistency matters more than the "perfect" shot.

A user writes "cool car" and hopes for luck. An art director describes time of day, lighting, lens, and mood — and gets a predictable result. Pattern docs and brand instances exist to keep every product on the "art director" side of that line.

## 10.2 — Prompt Block Structure

Every visual prompt is layered across these seven blocks. Missing blocks are not "default values" — they are randomness the model fills in.

| # | Block | What it locks down |
|---|---|---|
| 1 | Subject & Action | Who is in the frame and what is happening |
| 2 | Camera & Shot Type | Viewer's point of view (see §9.1) |
| 3 | Lens & Focal Length | Optics and spatial perception (see §9.2) |
| 4 | Lighting | Source, direction, quality, temperature (see §9.3) |
| 5 | Material & Texture | Surface properties for tactility (see §9.4) |
| 6 | Composition | Framing rule (see §9.5) |
| 7 | Style Reference | Aesthetic anchor (see §9.6) |

Block 1 (Subject & Action) takes priority — being too abstract here breaks everything downstream. "A happy person" fails; "A young woman laughing while holding a cup of coffee, sitting on a balcony at sunset" sets context (age, action, environment).

## 10.3 — The 3-Pillar System

Every finished prompt sits on three pillars. Missing any one produces hollow output.

| Pillar | What it adds | Example |
|---|---|---|
| **Structure** (Technical Base) | Camera, light, materials, composition | "handheld 35mm, f/2.8, 1/30s, ISO 400, gritty 90s analog style" |
| **Reference** (Style) | Anchor to a known aesthetic | "Styled like 1970s motorcycle ads with Bruce Gilden authenticity" |
| **Vision** (Emotion) | How the viewer should feel | "Intense, gritty, unfiltered realism" |

Structure without Reference reads sterile. Reference without Vision reads imitative. Vision without Structure reads as wishful thinking.

## 10.4 — Language Discipline

**Technical beats emotional. Always.**

| Avoid | Use instead |
|---|---|
| "Moody portrait" | "85mm portrait, f/1.4, soft side lighting, warm 3200K tones" |
| "Good lighting" | "Soft golden-hour sunlight (3200K), backlit, lens flare on edges, warm glow on skin" |
| "Cool motorcycle at night" | "Motocross rider mid-lean, handheld 35mm, f/2.8, 1/30s, ISO 400, gritty 90s analog style" |

The vocabulary is that of a working photographer or DP: focal length, aperture, rim light, diffusion, grain, color temperature in Kelvin. Brand voice colors the subject and tone; it does not soften the technical layer.

## 10.5 — Prompt Formula

The repeatable assembly order:

```
[Shot + Lens + Aperture] + [Lighting: source / direction / temperature] + [Materials & Textures] + [Composition] + [Style Reference]
```

Worked example:

> "Medium close-up portrait, 85mm lens at f/1.4, soft window light from camera left (3200K warm), shallow depth of field, visible skin texture, subject centered with negative space on the right, inspired by Annie Leibovitz editorial style."

A strong prompt is a layered structure — not a single sentence of adjectives. Each layer adds precision; together they collapse the space of possible outputs.

## 10.6 — JSON vs Plain Text

| Output Type | Format | Why |
|---|---|---|
| Photography / photorealism | Plain text | JSON limits nuance — natural language carries more contextual signal |
| Illustration / 3D / stylized art | JSON | JSON locks structure (camera, lighting, color palette, pose) without ambiguity |

Example JSON skeleton for stylized 3D:

```json
{
  "camera": { "angle": "front three-quarter view", "lens": "35mm" },
  "lighting": { "type": "studio three-point", "shadow_style": "soft cell-shaded" },
  "color_palette": ["#F4D03F", "#2980B9"],
  "character_pose": "dynamic running mid-stride"
}
```

n8n workflows that branch by output type should select format accordingly. Photo-realism branches emit plain text prompts; illustration branches emit JSON.

## 10.7 — Iteration Practice

Treat prompting as a measurement discipline, not a one-shot.

| Practice | What it is |
|---|---|
| **Keyword library** | Per-brand bank of proven keywords for cameras, lighting, materials. Lives in `brand-visuals.md`. |
| **A/B testing** | Generate the same scene with one block varied (e.g. lens swap). Compare. Record winner. |
| **Reference bank** | Curated folder of inspiration images. Periodically reverse-engineer styles into reusable prompt fragments. |
| **Comparison loop** | Generate → compare to reference → record improvements → next generation. Loop until match or budget exhausted. |
| **Alpha Prompt System** | Per-workflow prompt template with five fixed sections: role, context, instructions, constraints, examples. Lives in `content-ops/workflows/<name>/prompts.md`. |

> Random prompts = casino. Systematic prompts = direction.

---

# 11 — AI Production Workflow

This section governs the **process** of producing AI cinematic content end-to-end. Tools listed in §11.5 are current state of practice and expected to evolve — the **rules** in §11.2–§11.4 are tool-independent and persist.

## 11.1 — Four-Phase Pipeline

| Phase | Input | Output | Default Tool (§11.5) |
|---|---|---|---|
| 1 — Image Generation | Text prompt | Base reference frame (still) | Higgsfield + Nano Banana Pro |
| 2 — Image-to-Image Integration | Base ref + product / asset refs | Composited static frame | Higgsfield (image-ref mode) |
| 3 — Image-to-Video Animation | Composited frame + motion prompt | Animated clip (5–15s) | Kling 3.0 |
| 4 — Final Edit | Multiple clips | Published video | CapCut |

Phase outputs are always saved before advancing — every phase is independently re-runnable.

## 11.2 — Phase 1 Rules: Image Prompt

| Rule | Why |
|---|---|
| Always define camera AND lighting | Locks realism. Missing either lets the model drift into stock-photo defaults. |
| Set format and quality explicitly | Vertical 9:16 default for short-form; 2K is the optimal detail/cost balance |
| Use the §10.5 formula | Same prompt formula applies whether the output is a base portrait or a hero product shot |
| Save the best result as the **base reference** | This frame becomes the identity lock for downstream phases |

## 11.3 — Phase 2 Rules: Integration Prompt (Image-to-Image)

When merging a base subject with product or environment references, the model must be told how the elements physically interact. Vague instructions produce floating, weightless composites.

Explicit physical-realism constraints to include:

| Constraint | Why |
|---|---|
| Realistic weight distribution | Prevents objects sitting "on top of" rather than "into" the subject |
| Natural gravity behavior | Stops jewelry, fabric, accessories from defying gravity |
| Slight indentation under contact | Sells the weight of the added element |
| Accurate contact shadows | Grounds the composite — without shadows the integration reads as collage |
| Reflections on adjacent surfaces | Closes the realism gap (e.g. diamond highlights on adjacent skin / metal) |
| "No floating elements" | Explicit negative — model tends toward floating by default |

State the reference roles explicitly: "reference 1 is the base subject, reference 2 is placed at [exact body part]". Vague placement produces random placement.

## 11.4 — Phase 3 Rules: Motion Prompt (Image-to-Video)

The strictest phase. Motion models hallucinate. Every motion prompt declares **what moves, how it moves, and explicitly what must NOT happen**.

| Rule | Why |
|---|---|
| Subject-lock one element | Prevents the model from drifting attention mid-clip |
| Define ONE camera movement | "Smooth track", "slow push-in" — never stack camera moves |
| Define ONE subject movement | E.g. "hand lifts upward" — coupled motions read as confusion |
| State explicit negatives | "No tongue movement", "mouth remains closed", "no aggressive behavior" — anything the model commonly hallucinates must be banned by name |
| Set duration explicitly (5s or 15s) | Longer clips multiply hallucination risk |

**Recovery rule when motion breaks or morphs:** simplify. Strip the prompt to one camera move + one subject move at a time. If a complex shot still fails, split it into two clips and rejoin in Phase 4.

## 11.5 — Current Tool Stack

> Marked as **state of practice** as of doc version 1.1, not normative. The pipeline in §11.1 persists across tool changes; specific tools below should be revisited each minor version bump.

| Phase | Tool | Notes |
|---|---|---|
| 1 — Image Generation | Higgsfield + Nano Banana Pro | Vertical 9:16, quality 2K |
| 2 — Integration | Higgsfield (image-ref upload) | Accepts base ref + product refs |
| 3 — Video Generation | Kling 3.0 | 1080p, 5–15s duration |
| 4 — Edit | CapCut | Cut, music, sound design, export |

Brands may substitute alternatives in `brand-visuals.md` but must preserve the four-phase contract.

## 11.6 — Camera Body Reference Library

Including a real camera body in the prompt steers the model toward a specific photographic look. Recommended defaults:

| Camera Body | When to use |
|---|---|
| ARRI ALEXA 35 | Cinematic shots, soft depth, natural color grading |
| Hasselblad H6D | Premium high-end close-ups, rich macro detail |
| RED KOMODO 6K | True cinematic, film-like look |
| Sony A7R IV | Ultra-realistic, high-detail images |

Brands may extend this list in `brand-visuals.md` with preferred bodies for their content type.

---

# 12 — Cross-References

| Topic | Reference |
|---|---|
| 4-phase automation lifecycle | `.claude/ref/content-ops/automation.md` |
| Storytelling craft (hooks, structures, CTAs) | `.claude/ref/content-ops/storytelling.md` |
| Brand UI/UX standards (web app) | `.claude/ref/generation/ui-ux-guide.md` |
| Per-brand visual instances | per repo: `content-ops/brand-visuals.md` |
| Per-brand prompt templates | per repo: `content-ops/workflows/<name>/prompts.md` |

---

# 13 — Versioning & Status

**Version:** 1.1
**Status:** ACTIVE

**Changelog:**

* **1.1 (2026-05-22):** Added §9 Visual Design Language (shot types, lens, lighting, materials, composition, style anchors), §10 AI Prompt Craft (core principle, block structure, 3-pillar system, language discipline, formula, JSON vs plain text, iteration practice), §11 AI Production Workflow (4-phase pipeline, per-phase prompt rules, current tool stack, camera body reference). Renumbered Cross-References to §12 and Versioning to §13. Source: Sergey Kabankov / AI Video Creators Community (Image Prompting Guide + Cinematic Video SOP). See `docs/content-ops-intake/sources.md` for full mapping.
* **1.0 (initial):** Aspect ratios, safe zones, imagery style rules, motion & sound principles, asset sets, color/typography contract, template schema, accessibility baseline.

Future revisions may add:

* Live-stream / event-streaming visual contracts
* AR / interactive content visual rules
* AI-generated imagery quality gates
* Editing & sound-design craft (when more source material lands — candidate for split into `production.md`)
* Color grading craft (LUTs, palette systems)
