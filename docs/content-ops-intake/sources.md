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

### TMS Media

- **Source label:** TMS Media (second course provider; full attribution TBD)
- **Language of source:** English
- **Domain:** Personal brand building, short-form video content strategy

#### Documents ingested

| # | Document | Date Ingested | Final Target Doc (post-trim) |
|---|---|---|---|
| T1 | `How_To_Post_-_Instagram_-_Transcript.txt` | 2026-05-22 | `storytelling.md` §8.2 + §10.1; `automation.md` §3.1 (most excluded as operator UI) |
| T2 | `How_To_Post_-_TikTok_-_Transcript.txt` | 2026-05-22 | same as T1 |
| T3 | `Making_Changes_To_Your_Videos_With_Analytics_-_Transcript.txt` | 2026-05-22 | `measurement.md` |
| T4 | `This_Is_Going_To_Be_A_Journey_-_Transcript.txt` | 2026-05-22 | **excluded** (mindset prose) |
| T5 | `The_One_Strategy_That_GUARANTEES_Success_-_Transcript.txt` | 2026-05-22 | `measurement.md` §6 Cadence (single-line reference only) |
| T6 | `_LIVE_Building_a_Personal_Brand_-_Market_Research_And_Picking_A_Niche` | 2026-05-22 | `storytelling.md` §1 Topic Discovery |
| T7 | `_LIVE_Building_a_Personal_Brand_-_Scripting_Shooting_and_Editing_A_Video` | 2026-05-22 | `visuals.md` §12.1 Shot List Schema (rest excluded as operator workflow) |
| T8 | `_LIVE_Building_a_Personal_Brand_-_Editing_A_Video_From_Start_To_Finish` | 2026-05-22 | `visuals.md` §12.2 Export Specs (rest excluded) |
| T9 | `_LIVE_Building_a_Personal_Brand_-_Posting_And_Iterating_A_Video` | 2026-05-22 | `measurement.md` §5 Iteration Loop + `storytelling.md` §2 (Foreshadowing hook) |
| T10 | `_LIVE_Building_a_Personal_Brand_-_Getting_A_Brand_Deal_After_3_Posts` | 2026-05-22 | **excluded** (anecdote) |

#### Excluded as not pattern-level (NOT migrated)

- UI walkthroughs of Instagram/TikTok upload screens (button taps, toggle locations) — ephemeral, will change.
- Specific editing decisions from the live DaVinci edit (which take to keep, which to cut) — demonstration, not principle.
- The "Weights and Measures" niche case study itself (snake, tuna, Subway footlong, toilet paper) — illustrative instance, not pattern.
- The brand-deal anecdote (one offer from a cheese-grater company).
- Mindset / encouragement / "marathon not sprint" content (T4 fully, plus prose throughout other docs).
- Operator workflow content from T7/T8 (scripting discipline, lighting>set, equipment baseline, ruthless cutting, subtitle workflow) — removed in the 2026-05-22 trim pass.

#### Notable extractions (post-trim)

- **Viral ratios** (T3, from analysis of 1000+ videos): 1 save per 3 likes, 1 share per 8 likes — in `measurement.md` §3.
- **Foreshadowing hook** (T9): hook archetype in `storytelling.md` §2.
- **Iteration loop discipline** (T9): "don't batch when iterating" — in `measurement.md` §5.2.
- **Platform character bias** (T1/T2): IG=polish, TikTok=authenticity — in `storytelling.md` §8.2.
- **Caption + Hashtag rules** (T1/T2): ≤ 2 sentences before line break, 3–5 hashtags — in `storytelling.md` §10.1.

#### 2026-05-22 — Structural refactor

`channel-strategy.md` was dissolved. Survivors distributed:

| Content | New location |
|---|---|
| Caption & Hashtag rules | `storytelling.md` §10.1 |
| Platform character bias (IG vs TikTok) | `storytelling.md` §8.2 |
| Channel-mix + AI-disclosure schema | `automation.md` §3.1 |
| Native-posting + hashtag-rule enforcement | `automation.md` Phase 1 deliverables |
| Native-posting, pre-upload editing, cover/thumbnail, interaction settings, "what doesn't move the needle" | **removed** (operator workflow) |

Same trim pass also removed: `measurement.md` §1 Mindset, §9 Brand-Deal anecdote; `visuals.md` §10.1 Core Principle prose, §10.7 Iteration Practice prose, §11.5 Tool-Stack names, §12.2/12.3/12.4/12.5/12.7 (operator-workflow content from live-action production).

---

## Open Items / Future Sources

(Add here as new course documents are ingested. TMS Media batches 2+ pending.)
