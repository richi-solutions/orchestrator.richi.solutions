# measurement.md

**Richi AI — Content Performance Measurement & Iteration Pattern**
Version: 1.1
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Authority: MEASUREMENT-CANONICAL

---

# 0 — Purpose

Constraints and diagnostic frameworks used by content agents and strategic advisors to evaluate published content and feed insights into the next production cycle.

Brand-specific numeric targets (baseline retention, growth, ratio thresholds) live in per-repo `content-ops/strategy.md`.

---

# 1 — Primary Signal: Watch Time

Watch time is the dominant driver of short-form algorithmic distribution. Every content brief that lands in an n8n LLM prompt must include an explicit watch-time target derived from §6 brand targets — never a generic "make it engaging" instruction.

| Metric | Definition |
|---|---|
| Average view duration | Mean seconds watched per impression |
| Retention percentage | Average view duration ÷ video length |
| Completion rate | Percentage of viewers who watch to the end |

Empirical benchmark spread (outperformer vs underperformer at scale):

| Metric | Outperformer | Underperformer |
|---|---|---|
| Average retention | ~50% | ~20% |
| Completion rate | ~11% | ~2% |

---

# 2 — Retention Graph Diagnostics

The retention graph (currently TikTok-only; Instagram does not surface this) shows where viewers drop off.

## 2.1 — Graph-Shape Diagnostic Codes

| Shape | Diagnosis | Agent action |
|---|---|---|
| Steep drop in first 1–3s | **Hook problem** | Rewrite hook using a different archetype (see `storytelling.md` §2) |
| Steep mid-video dip | **Pacing / content problem at that moment** | Locate timestamp, trim or restructure that beat |
| Long flat decline | **Healthy** — natural attrition | Iterate on hook to widen the funnel; pacing is fine |
| Steep terminal drop just before payoff | Payoff anticipated correctly but stretched too long | Tighten between resolution and CTA |

## 2.2 — When the Diagnostic Tool Is Missing

When the platform does not surface a retention graph, substitute:

- Average view duration ÷ video length (manual retention calculation)
- Completion rate as proxy for end-of-video health
- Comments referencing specific timestamps (anecdotal but informative)

Without a retention graph, default to the hypothesis "hook is weak" first — most common failure mode.

---

# 3 — Engagement Metrics & Ratio Targets

## 3.1 — Metric Definitions

Precise vocabulary for cross-platform analytics work. Brands and agents MUST distinguish these — conflating them produces misleading reports.

| Metric | Definition |
|---|---|
| **Impressions** | Total times the video was loaded / shown. Counts repeat views from the same account. Always ≥ Reach. |
| **Reach** (Accounts Reached) | Unique accounts that saw the video at least once. The audience-size metric. |
| **Accounts Engaged** | Unique accounts that liked, commented, saved, shared, or followed from the post. Subset of Reach. |
| **Average View Duration** | Mean seconds watched per impression. Drives §2 retention diagnostics. |
| **Completion Rate** | Percentage of viewers who watched to the end. |
| **Follower / Non-Follower Split** | Used for §4 Hub-vs-Hero and §5 Stage-Detection. |

When a metric is reported, the definition MUST be explicit. "12k engagement" is ambiguous — write "12k accounts engaged" or "12k total likes + comments". Impressions/Reach conflation is the most common source of inflated retention claims (high impressions ÷ low reach makes the same audience look like a wider one).

## 3.2 — Ratio Targets

Two ratios reliably distinguish virality-trajectory videos from passive-consumption videos:

| Ratio | Viral Target |
|---|---|
| **Saves : Likes** | 1 save per 3 likes |
| **Shares : Likes** | 1 share per 8 likes |

Interpretation:

| Pattern | Meaning |
|---|---|
| Both ratios met | Built to spread; algorithmic signal strong |
| Both ratios missed, high likes | **Passive consumption** — entertaining but no return-value or social currency. Fix payoff or CTA. |
| Low saves only | Content lacks reference value |
| Low shares only | Content lacks social currency |

Use as scorecard alongside watch time, not as absolute rule.

---

# 4 — Hub vs Hero Diagnostic (Follower Composition)

Instagram surfaces a Followers / Non-Followers split per post.

| Signal | Type | Agent action |
|---|---|---|
| Majority Non-Followers | **Hero content** — resonates with strangers | Replicate hook structure, topic angle, format in next 3–5 posts |
| Majority Followers | **Hub content** — nurtures existing audience | If consistently followers-only, brand is plateauing — experiment with new formats |
| Balanced | Mixed | Stable long-term — both retention and modest growth |

Brand declares target Hero ratio in `strategy.md` (e.g. "≥ 40% non-follower views on Hero posts; ≥ 70% follower views on Hub posts").

---

# 5 — Algorithm Push-Stage Mechanic

The algorithm pushes a video through three escalating audience pools. Every video starts in Stage 1; only watch-time + engagement signals carry it to Stage 2 and 3. The follower / non-follower split per post is the primary diagnostic for which stage a video reached.

| Stage | Audience pool | Promotion trigger |
|---|---|---|
| Stage 1 | Mostly followers + small new-audience seed | Strong watch time + engagement in this pool |
| Stage 2 | Reduced followers + larger new-audience pool | Strong watch time held among new viewers |
| Stage 3 | Almost exclusively new audience | Exponential virality — algorithm fans out until signal degrades |

## 5.1 — Stage Detection

Read the follower / non-follower split (Instagram: post → Insights; TikTok: post → Analytics):

| Split | Interpretation |
|---|---|
| > 80% followers | **Stuck in Stage 1** — hook or topic did not earn Stage 2 promotion |
| 40–60% / 40–60% | **Mid-Stage 2** — video earned promotion, still cross-feeding from base |
| > 70% non-followers | **Stage 3** — viral trajectory active |

## 5.2 — Strategic Implications

| Pattern | Action |
|---|---|
| Repeated Stage 1 caps | Hook is the bottleneck — iterate per `storytelling.md` §2 archetypes |
| Stage 2 plateau (rarely reaches Stage 3) | Idea solid for existing audience, lacks broad relatability — apply `storytelling.md` §1.7 4-elements check |
| Frequent Stage 3 hits | Replicate hook + idea structure in next 3–5 pieces (see §4 Hero replication rule) |

## 5.3 — Mental Model: Algorithm = Audience

Replace "the algorithm doesn't like my video" with "the audience doesn't like my video." Stages 2 and 3 are not algorithmic favor — they are aggregate human watch behavior. Diagnostic prompts and brief-writing improve when the algorithm is treated as a proxy for audience response, not a separate adversary.

---

# 6 — Iteration Loop

```
1. Plan & Script    →  apply prior learnings
2. Shoot & Edit
3. Post (all channels)
4. Wait 24–72h      →  enough for retention/ratio data
5. Diagnose         →  retention graph + ratios + comments
6. Decide:
   a) Re-upload with revisions  (if diagnosis points to a fixable hook/pacing problem and topic is still relevant)
   b) Carry learnings forward   (if topic exhausted or fix is structural)
7. Apply to next video
```

## 6.1 — Re-Upload Discipline

Re-uploading a revised video is legitimate; platforms do not penalize it.

| Rule | Reason |
|---|---|
| Remove prior version before re-uploading | Prevents profile-grid duplication; fresh distribution |
| Change only what the diagnosis points to | Multivariate changes destroy signal-to-noise of the experiment |
| Wait ≥ 24h between original and revision | Avoids platform spam-detection edge cases |
| Track via `parent_post_id` (see `automation.md` Phase 3) | Iteration chain queryable for analytics |

## 6.2 — Batching Policy

| Phase | Batching policy |
|---|---|
| First 30 posts of new format / new account | **Never batch.** Post one, analyze, then next. |
| After format validated (consistent baseline) | Light batching (3–5 ahead), review analytics before each release |
| Mature format (50+ posts same structure) | Heavy batching acceptable; iteration loop at seasonal cadence |

## 6.3 — Format Commitment Threshold

Switching formats too early destroys learning signal and resets algorithmic classification. Operators MUST commit to a single format (per `storytelling.md` §1.9) for **7–10 published videos** before considering format change.

Iteration levers in order of priority — exhaust each before moving down:

| # | Lever | Why this order |
|---|---|---|
| 1 | **Hook** | Highest leverage — most underperformance is hook failure (see `storytelling.md` §2) |
| 2 | **Idea** | Apply 4-elements check (`storytelling.md` §1.7) — ≥ 2 elements required |
| 3 | **Pacing / dead-space edit** | Cheapest watch-time lever — cut every non-essential second; "dead space" is the #1 cause of skip behavior |
| 4 | **Format** | Only after 7–10 videos with hook + idea + pacing already iterated |

Switching format before exhausting levers 1–3 means the brand never learns whether the format was the actual problem. The algorithm also needs format consistency to classify the account and route distribution — frequent format-jumping resets that classification (compounds the §5 Stage-1 cap).

Decisions on format change MUST be data-led (retention graph, ratios, stage detection per §5), never emotional ("this didn't go viral, format must be wrong").

---

# 7 — Cadence Patterns

| Cadence | Pieces / month | Phase fit |
|---|---|---|
| Weekly | ~4 | Mature brand, high production-per-piece |
| Bi-weekly | ~12–15 | Growth phase, solo creator |
| Every other day | ~15 | Aggressive growth, validated format |
| Daily | ~30 | Skill-compression accelerator (100-day-challenge tactic — finite, not steady-state) |

Reassess cadence per brand phase:

| Brand phase | Cadence target |
|---|---|
| Format-finding (first 30 posts) | Whatever sustains full quality |
| Validated format, growth focus | Highest sustainable cadence |
| Mature, sustaining audience | Drop to weekly; redirect energy to higher-production pieces |

---

# 8 — Per-Brand Targets (Schema)

## 8.1 — Success Model: Targets Are Not Always Viral

Targets are brand-specific and explicitly **not required to be viral-trajectory**. A brand with 5,000 highly engaged followers in a high-LTV niche can outperform a 500k-follower entertainment account on revenue terms. The schema below lets brands set targets on whichever axis matches their economic model — three common models:

| Brand model | Primary target axis | Secondary axis | Anti-pattern |
|---|---|---|---|
| **Volume / reach** | High reach, high non-follower share (§4 Hero ratio) | Watch time | Optimizing for revenue per follower — model doesn't apply at scale |
| **Niche revenue** | Engagement density (high saves:likes, shares:likes — §3.2) | Audience-decision-maker concentration | Optimizing for follower count — irrelevant to revenue |
| **Authority / trust** | Follower quality (industry-leader concentration, repeat viewing) | Save ratio | Optimizing for non-follower reach — pulls audience-fit downward |

Brands MUST declare their model in `strategy.md` before setting numeric targets. Optimizing on the wrong axis (e.g. chasing reach when revenue comes from 5k niche followers) wastes iteration budget on the wrong levers.

## 8.2 — Target Schema

`content-ops/strategy.md` declares concrete numeric targets:

```yaml
measurement_targets:
  watch_time:
    avg_retention_pct_baseline: ...    # e.g. 35
    avg_retention_pct_winning: ...     # e.g. 50
    completion_rate_baseline: ...      # e.g. 5
    completion_rate_winning: ...       # e.g. 11
  engagement_ratios:
    saves_per_likes_target: 0.33       # 1:3
    shares_per_likes_target: 0.125     # 1:8
  follower_composition:
    hero_min_non_follower_pct: ...     # e.g. 40
    hub_min_follower_pct: ...          # e.g. 70
  cadence:
    primary_platform: "tiktok | instagram | ..."
    posts_per_week: ...
    multi_platform_targets: ["tiktok", "instagram", ...]
  iteration:
    re_upload_review_window_h: ...     # e.g. 72
    max_re_uploads_per_video: ...      # e.g. 2
```

Targets are evidence-based: set after the first 10–20 posts produce a baseline, not aspirational from day one.

---

# 9 — Cross-References

| Topic | Reference |
|---|---|
| 4-phase content lifecycle (analytics is Phase 3) | `.claude/ref/content-ops/automation.md` |
| Hook archetypes (primary lever for retention) | `.claude/ref/content-ops/storytelling.md` §2 |
| Story structures (lever for mid-video retention) | `.claude/ref/content-ops/storytelling.md` §3 |
| Analytics event schema (technical layer) | `.claude/ref/growth/analytics.md` |
| Per-brand measurement targets | per repo: `content-ops/strategy.md` |

---

# 10 — Versioning & Status

**Version:** 1.3
**Status:** ACTIVE

**Changelog:**

* **1.3 (2026-05-22):** Restructured §3 to "Engagement Metrics & Ratio Targets" with new §3.1 Metric Definitions (Impressions / Reach / Accounts Engaged / Avg View Duration / Completion Rate / Follower Split — closes cross-platform vocabulary gap that produced ambiguous reports) and §3.2 Ratio Targets (existing content). Restructured §8 to add §8.1 Success Model: Targets Are Not Always Viral (Volume / Niche-Revenue / Authority brand models with anti-pattern per model — codifies non-viral success-target framing) and §8.2 Target Schema (existing yaml). Source: Part-Time Creator Academy / TMS Media — Reading Your Analytics, Builder's Mindset, Power of a Personal Brand.
* **1.2 (2026-05-22):** Added §5 Algorithm Push-Stage Mechanic with §5.1 Stage Detection (follower/non-follower thresholds), §5.2 Strategic Implications (Stage-1-cap / Stage-2-plateau / Stage-3-hit playbooks), §5.3 Mental Model "Algorithm = Audience". Added §6.3 Format Commitment Threshold (7–10 videos, iteration-lever order: hook → idea → pacing → format) inside renamed §6 Iteration Loop. Renumbered §5 Iteration Loop → §6 (sub-sections §5.1/§5.2 → §6.1/§6.2), §6 Cadence → §7, §7 Per-Brand Targets → §8, §8 Cross-References → §9, §9 Versioning → §10. Closes algorithm-push-mechanic and format-commitment-threshold gaps. Source: Part-Time Creator Academy / TMS Media transcripts.
* **1.1 (2026-05-22):** Trim pass — removed §1 Mindset & Principles (operator content), §9 Brand-Deal-Threshold anecdote, narrative prose throughout. Restructured for agent-prompt and strategic-advisor consumption only. Renumbered §2→§1 through §10→§8. Source: TMS Media (course transcripts).
* **1.0 (2026-05-22):** Initial scope.

Future revisions may add:

* YouTube long-form measurement
* Cross-platform attribution (single piece, multi-channel)
* Series-level KPIs
* Comment-sentiment as leading indicator
