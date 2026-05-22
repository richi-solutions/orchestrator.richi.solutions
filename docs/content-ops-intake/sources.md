# Content-Ops Intake — Source Tracking

**Purpose:** Working file. Tracks which course material informed which sections of `.claude/ref/content-ops/*` pattern docs. Used to resolve later contradictions and credit sources. Not distributed via sync. Delete or archive once ingestion is complete.

**Status:** WORKING (do not consume as authoritative)

---

## Sources Registry

### Sergey Kabankov — AI Video Creators Community

- **Platform:** skool.com/ai-video-creators
- **Instagram:** instagram.com/aivideoskool
- **Language of source:** English
- **Domain:** AI Video / AI Image generation craft

#### Documents ingested

| # | Document | Date Ingested | Target Doc |
|---|---|---|---|
| K1 | `Image Prompting.pdf` — Guide to AI Image Prompting | 2026-05-22 | `visuals.md` §9 + §10 |
| K2 | `SOP_ Step-by-Step AI Cinematic Video Production.pdf` | 2026-05-22 | `visuals.md` §11 |

#### Mapping — K1 (Image Prompting Guide) → visuals.md

| Source Section | Target Section in visuals.md |
|---|---|
| K1 §1 Main Principle (Intention not Randomness) | §10.1 Core Principle |
| K1 §2.1 Subject & Action | §10.2 Prompt Block Structure (block 1) |
| K1 §2.2 Camera & Shot Type | §9.1 Shot Types |
| K1 §2.3 Lens & Focal Length | §9.2 Lens & Focal Length |
| K1 §2.4 Lighting | §9.3 Lighting |
| K1 §2.5 Material & Texture | §9.4 Materials & Textures |
| K1 §2.6 Composition | §9.5 Composition Techniques |
| K1 §2.7 Style References | §9.6 Style Anchors |
| K1 §2.8 Complete Prompt Example | §10.2 (illustrative example) |
| K1 §3 3-Pillar System | §10.3 |
| K1 §4 Language of Prompting | §10.4 Language Discipline |
| K1 §6 JSON Prompting | §10.6 JSON vs Plain Text |
| K1 §7 Practical Tips | §10.7 Iteration Practice |
| K1 §8 Key Takeaways + Cheat Sheet | consolidated across §9 + §10 |
| K1 Formula | §10.5 Prompt Formula |
| K1 Cheat Sheet additions (Dutch Angle, Top/Under light, Diffused, Glass/Water, Symmetry/Asymmetry) | merged into §9 tables |

#### Mapping — K2 (Cinematic Video SOP) → visuals.md

| Source Section | Target Section in visuals.md |
|---|---|
| K2 Phase 1 (Generate Base Character) | §11.1 + §11.2 Image Prompt Rules |
| K2 Phase 2 (Image-to-Image Integration) | §11.1 + §11.3 Integration Prompt Rules |
| K2 Phase 3 (Image-to-Video Animation) | §11.1 + §11.4 Motion Prompt Rules |
| K2 Phase 4 (Final Edit) | §11.1 |
| K2 Appendix (Camera Prompting Guide) | §11.6 Camera Body Reference Library |

#### Excluded as brand-specific (NOT migrated to pattern docs)

- K2 specific snake/jewelry prompts — illustrative for a luxury jewelry commercial; would belong in a brand-instance `brand-visuals.md`, not the pattern.
- K1 specific photographer names (Annie Leibovitz, Bruce Gilden, Helmut Newton) — kept as **example anchors** in §9.6 with explicit note that each brand picks its own.
- K2 specific tool versions (Higgsfield + Nano Banana Pro, Kling 3.0, CapCut) — surfaced in §11.5 as "current state of practice, expected to evolve", not normative.

---

## Open Items / Future Sources

(Add here as new course documents are ingested.)
