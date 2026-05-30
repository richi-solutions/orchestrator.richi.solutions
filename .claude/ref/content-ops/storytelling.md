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

# 1 — Topic Discovery & Validation

Upstream decision — what content topic a brand makes content about, before any craft choice. Topic is the highest-leverage decision in the content pipeline.

## 1.1 — Founder-Fit Rule

Pick topics the creator has knowledge or genuine interest in, not topics chosen for perceived market size alone.

## 1.2 — Validation Channels

| Channel | What to look for |
|---|---|
| Google Search | Articles, news, complaints, forum threads on the topic |
| Google Trends | Search-volume direction over last 12–24 months; upward trajectory |
| Geographic distribution (Google Trends) | Concentrated vs spread (concentrated = niche dominance; spread = larger TAM) |
| Subreddit search | Dedicated subreddit; 50k+ members = strong demand evidence |
| News articles | Mainstream press coverage in last 24 months |
| AnswerThePublic (or equivalent) | Actual questions people search — direct video-brief input |
| Existing platform content | Low-follower accounts on the topic earning high views — proves topic-driven distribution |

## 1.3 — TAM Signals

A topic worth a long-running series should hit most:

- Search-volume trending upward over 12–24 months
- Multiple major geographies showing interest
- Active community (subreddit / forum / Discord) with regular new posts
- Mainstream news coverage in last 24 months
- Low-follower creator content on the topic earning above-baseline views

4–5 signals = viable as primary brand axis. 1–2 signals = marginal, niche only.

## 1.4 — Format Repeatability Check

| Question | Pass condition |
|---|---|
| Can this topic produce 50+ episodes in the same format? | Yes |
| Does each episode swap the subject, not the format? | Yes |
| Are production costs per episode roughly constant? | Yes |
| Does the format produce a built-in question for the viewer? | Yes |

Topics that fail must be reformatted before committing.

## 1.5 — Engagement-Multiplier Angles

Angles that compound with hook archetypes and increase retention:

| Angle | Effect |
|---|---|
| Consumer advocacy / corporate-greed | "Robin Hood" framing — high share rate |
| Investigation / fact-checking | Built-in question — high retention |
| Experiment with reveal | Setup → experiment → result; compounds with Foreshadowing hook (§2) |
| Stakes-personal-universal | Topic affects every viewer's daily life — high stick rate |

Angles can be combined. An investigation-with-reveal about corporate practices affecting daily life stacks all four.

## 1.6 — Topic → Brand-Voice Pipeline

Topic is the input to `brand-voice.md`. Voice then drives hooks/structures/CTAs. Visual choices in `brand-visuals.md` are also downstream. Topic discovery happens before voice and visuals — voice and visuals are responses to topic, not parallel decisions.

## 1.7 — The 4 Elements of a Viral Idea

Quality criteria applied to any topic-instance idea after §1.5 angle selection. An idea is worth producing when it carries **≥ 2** of these elements; ≥ 3 is high-virality posture. None of these compensate for narrow relatability (a great idea inside a tiny TAM still caps out at TAM size).

| Element | What it means | Mechanism |
|---|---|---|
| Relatability | Audience sees themselves in the topic | Drives identification + share intent |
| Curiosity | Idea provokes a question only the video can answer | Drives watch-through |
| Reaction | Idea evokes a felt response (laughter, surprise, disgust, awe) | Drives share + comment |
| Seems unrealistic | Idea is rare, extreme, or counter-intuitive at first glance | Drives re-watch + "no way" reflex |

Relatability and audience size compound: niche-only relatability (e.g. cryptographers) is fatal to virality even if the other three elements stack. Pick topics where the relatable population is large.

**Borrowed-Familiarity Pattern.** Relatability does not require an in-niche reference. Pull a high-recognition external element (popular show, song, cultural moment) into the brand's niche and add the brand's value layer on top. Example: a real-estate creator asking *"how much would it cost to rent Monica's apartment from Friends?"* — Friends has nothing to do with real estate, but the borrowed familiarity hacks attention; the niche-value (real-estate analysis) is delivered after the hook lands. This compounds with §1.8 reference-mining: borrowed elements should be **demonstrably popular**, not the creator's own work.

## 1.8 — Reference-Mining (Steal Like an Artist)

Generating ideas from a blank page is the wrong default. Operators MUST mine proven references first — both within and across niches.

| Step | Action |
|---|---|
| 1 | Pull 10–20 videos in the brand's niche that crossed the viral threshold (≥ 500k–1M views) **AND** the brand's own past top-performers — internal wins are the highest-fidelity reference because audience-fit is already proven |
| 2 | For each, log: hook archetype (§2), idea structure, format (§1.9), engagement-multiplier angle (§1.5) |
| 3 | Pull 5–10 viral videos from **adjacent niches** — cross-pollination forces idea adaptation, which becomes the original angle |
| 4 | Use the platform's Inspiration tab (TikTok Creator Tools → For Your Inspiration; Instagram Professional Dashboard → Inspiration) as a leading signal — the platform is publishing intent |
| 5 | Never replicate shot-for-shot. The idea is borrowed; the execution, opinion, and perspective are the brand's own |

Trends are reference-mining at scale — an idea so viral that the platform itself rebroadcasts the format.

## 1.9 — Format Taxonomy (Proven Viral Formats)

Format = how the topic is presented. Distinct from §3 Story Structures (which govern beat ordering inside any format) and §2 Hook (which is the opening of any format). New brands and new accounts pick **ONE** format from this list and commit before experimenting — format commitment rule in `measurement.md` §6.3.

| Format | Mechanism | Production load |
|---|---|---|
| **Social interview / strangers** | Random-answer curiosity + reaction capture | Mid (on-location) |
| **Educational** | Information transfer; value-for-time exchange | Low (talking head + b-roll) |
| **Skit** | Comedic relief through relatable scenarios | High (writing + acting) |
| **Reaction** | Co-watch dynamic; viewer reacts vicariously | Very low (screen rec + cam) |
| **Information aggregation** | Curates dispersed information into one digestible piece | Low (research + edit) |
| **Story time** | Personal narrative with stakes or absurdity | Low (talking head) |
| **Day in the life** | Voyeur access to a profession / lifestyle / location | Mid (multi-shot day) |
| **Challenge / experiment** | Setup → execution → reveal | Mid–high (depends on scope) |
| **Expertise showcase** | Demonstration of rare skill or talent | Mid (performance + capture) |

Brand `brand-voice.md` declares one primary format and optionally one secondary for series differentiation. More than two active formats per brand fragments audience classification.

## 1.10 — Niche Commitment & Authority Stance

Founder-Fit (§1.1) tells you which topic the founder can sustain. This section governs how strictly to scope it and what authority position to take.

### 1.10.1 — Niche Commitment

| Rule | Why |
|---|---|
| One niche per brand | Multiple niches confuse the algorithm's audience-classification and dilute follow-through |
| Commit for ≥ 12 months before assessing | Audience-build compounds over time; the first 6 months are noise |
| Scope-expand only after established baseline | Adding adjacent topics works after audience is locked; before lock-in, drives them away |

The "I'm bored, let me try something else" instinct is the failure mode. Boredom in month 3 is normal — the discipline is staying in the niche through the boredom to reach the audience-compounding phase.

### 1.10.2 — Authority Stance

Two viable stances per niche. Brand `brand-voice.md` declares stance; switching stance mid-build resets audience trust.

| Stance | Positioning | Content style | Trust mechanism |
|---|---|---|---|
| **Expert** | Subject-matter authority teaches beginners | Tip / framework / breakdown | Credentials + clarity |
| **Enthusiast** | A few steps ahead of the audience, documenting journey | Process / learning-in-public | Relatability + pace |

Enthusiast is the under-used option. A creator does NOT need to be an expert to build a niche audience — they need to be one step ahead of the people behind them. The Enthusiast stance also produces better Edutainment-mode content (§3.5) because the creator remembers what it feels like not to know.

---

# 2 — Hook Archetypes

The first 1–3 seconds of video or first line of text. Use exactly one archetype per piece per modality.

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
| **Foreshadowing** | "Two of these three brands shorted you. We measured all of them — watch to see which." | Reveal-driven content (investigations, experiments, transformations); the payoff itself is the value |

Brand instances pick a *subset* of these archetypes as their default repertoire (documented in `brand-voice.md`).

## 2.1 — Hook Stacking Across Modalities

Hook archetypes stack across four modalities. Stacking ONE archetype across multiple modalities compounds retention; stacking multiple archetypes in the same modality does not.

| Modality | Mechanism | Example |
|---|---|---|
| **Audio** | First voiceover / on-screen speech | Stat-driven opener, Story-mid-action line |
| **Visual** | First on-screen image / motion | Prop drop, transformation reveal, extreme close-up |
| **Text overlay** | First burned-in on-screen text | Bold statement, striking statistic |
| **Caption** | First line of post caption (lowest priority — only reads if user pauses on the post) | Question that resolves only by watching |

Valid stacking examples (one archetype × multiple modalities):

- Visual prop drop + Audio Foreshadowing line + Text-overlay stat — all three reinforce one archetype
- Visual transformation reveal + Audio Personal confession — two modalities, one archetype

Invalid stacking (multiple archetypes × one modality):

- Audio Stat-driven opener mid-cut to Audio Question-flip — viewer can't tell which hook to read

Brand `brand-voice.md` may declare a default stacking pattern for its primary format.

## 2.2 — Open-Loop / Close-Loop Principle

Every hook in §2 opens a curiosity loop in the viewer's mind. The Payoff (§3 macro frame) closes it. A piece that opens a loop and never closes it leaves the viewer feeling cheated — drives down save/share ratios and trains the audience to distrust future hooks.

| Stage | Mechanism | Failure mode |
|---|---|---|
| Open | Hook poses a question the video promises to answer | Question too vague → viewer doesn't feel a loop opened → instant skip |
| Hold | Substance defers the answer while delivering value | Answer revealed too early → loop closes mid-video → drop-off |
| Close | Payoff delivers the exact answer the hook promised | Answer never delivered OR doesn't match what was promised → trust breaks, no save/share |

The loop must be **specific**. "Watch what happens next" opens nothing because the question is vague. "How much does Monica's apartment cost?" opens a single closeable loop.

Multi-loop discipline: complex pieces may open multiple loops (one in hook, one mid-substance). Every loop opened MUST close before the video ends. Unclosed loops accumulate as audience frustration.

## 2.3 — Hook Template Library

50 proven fill-in-the-blank templates. Brand `brand-voice.md` curates a working subset (5–15 templates) matched to its voice — using all 50 dilutes brand consistency. Each template maps to one or more archetypes from §2.

1. I can't believe I found these…
2. Must have [PRODUCT]
3. Watch until the end!
4. This may be controversial but ___
5. What if I told you ___
6. Here's how ___
7. This is why I'll NEVER go back to X
8. [X] mistakes you're making with ___
9. I really wish I knew this when starting out in [niche]
10. You don't need [expensive product] to solve [pain point]
11. You're probably using [product] wrong
12. 3 big mistakes you're making when ___
13. This feels illegal to know: ___
14. Come with me to do ___
15. What would you do if ___?
16. Did you know that ___?
17. This is a reminder to do ___
18. This is the story of ___
19. This tip will save you hours on ___
20. 5 mistakes you are probably making when you ___
21. The BEST ___ I've ever used
22. You need this free tool for ___
23. This hack changed my life
24. Watch what happens when [X]
25. I bet you didn't know [X]
26. If you're not doing this, you're missing out
27. Instead of doing ___ do ___
28. Unpopular opinion: ___
29. I don't know why nobody is talking about this
30. This trick will save you hours
31. I bought ___ so you don't have to
32. I messed up ___
33. Is it just me or ___?
34. There's nothing more painful than ___
35. You won't believe this ___
36. Are you struggling to ___, then ___
37. I wish I knew this sooner ___
38. I can't believe I just learned this
39. Stop doing [X]
40. Do ___ if you want ___
41. This tip will blow your mind
42. If you ever ___ keep watching
43. Have you ever ___?
44. Here's a secret that other [niche] aren't telling you
45. Top 3 reasons why you should ___
46. Is it just me or ___?
47. I need your help
48. I was going to gatekeep this but ___
49. What most people are doing wrong when it comes to ___
50. This is your sign to ___

Templates are starting points — every published hook MUST be tested against the §2.2 Open-Loop test (is the question specific and closeable?).

## 2.4 — Mid-Video Re-Hooks

A piece longer than ~15 seconds requires re-hooks every 8–15 seconds to renew attention. Without them, retention drops linearly through the substance even when the opening hook landed.

| Pattern | Where it fires | Example phrasing |
|---|---|---|
| **Contrast pivot** | After a setup beat | "But here's what most people get wrong..." |
| **Reveal tease** | Before the payoff | "The real secret is ___" |
| **Numbered escalation** | Inside list / multi-beat content | "Tip #3 is the one that changed everything" |
| **Visual punch-in** | Static talking-head (see `visuals.md` §12.4) | (no copy — the zoom IS the re-hook) |

Re-hooks are calibrated to maintain attention, not seize it — slightly more compelling than surrounding sentences, but not so attention-grabbing that they compete with the opening hook. Long-form pieces (§3.2, §3.4) stack 3–5 re-hooks; short-form (§3.1) typically needs 0–1.

## 2.5 — Hook Principles

Meta-craft principles that apply across all archetypes and modalities.

### 2.5.1 — Framing

**Knowledge gap.** Write the hook from the perspective of a viewer with zero prior context — no familiarity with the topic, the brand, or the format. Producers consistently overestimate how much the viewer already knows. A hook that requires explanation is not a hook.

**Audience filter.** The hook also functions as a filter — only viewers interested in the underlying niche watch through. Generic broad-appeal hooks attract broad-appeal followers who churn out of subsequent niche content. A slightly less viral hook that attracts the right audience compounds better than a broadly viral hook that attracts the wrong audience.

### 2.5.2 — Quality Elements

Seven quality elements that the §2 archetypes embody. Aim for **≥ 2** elements per hook; ≥ 3 is high-quality posture. Elements 2 and 3 appear in almost every working hook — if a hook only carries those two, add at least one of elements 4–7 to differentiate from the saturated baseline.

| # | Element | Mechanism |
|---|---|---|
| 1 | **Polarity** | Bank on a positive emotion (inspiration, hope, helpfulness) OR a negative emotion (fear, anger, sadness). Negative is over-used and saturating — positive often outperforms in niches where negative has become cliché. |
| 2 | **Question-generative** | Trigger a specific, answerable question in the viewer's mind. See §2.2 Open-Loop Principle. |
| 3 | **Emotion trigger** | Produce one of four reactions: **WTF** (shock, surprise, disgust), **LOL** (humor), **That's interesting** (intrigue, curiosity), **LFG** (excitement, hype). Each maps to a different sharing-behavior pattern. |
| 4 | **Pattern disruption** | Open with something visually or audibly unlike the surrounding feed. Most videos start with talking-head — a non-talking-head opener interrupts the scroll pattern. |
| 5 | **Frame break** | Challenge an opinion the viewer holds as true. ("The best way to heat pizza is NOT the microwave.") The viewer watches to decide whether to revise their frame. |
| 6 | **8 Human Desires alignment** | Survival; enjoyment of life / life extension; food & beverages; freedom from fear / pain / danger; sexual companionship; comfortable living; superiority / social-comparison; care of loved ones; social approval. Hooks that ladder into one or more desires perform across demographics. |
| 7 | **Extremes** | Lean into the most / biggest / fastest / smallest / cheapest / scariest / oldest / youngest variant. Audiences rarely see extremes in daily life — the rarity itself is the hook. |

## 2.6 — Topical Hook Patterns

§2 archetypes describe *structural* patterns (how the hook is shaped). The patterns below describe *topical* patterns (what content territory the hook operates in). The two axes combine — a single hook can be a "List-promise archetype" structurally and a "Money pattern" topically.

| Pattern | What it banks on | Example |
|---|---|---|
| **Listicle** | Numbered enumeration; tells the viewer exactly what they're getting | "The 5 best places to stay in Mexico" |
| **Money** | Curiosity about cost — most expensive / cheapest / least affordable extremes | "I found the cheapest apartment in Manhattan" |
| **Extreme** | Superlatives in any dimension (biggest / smallest / brightest / oldest) | "This is the world's tiniest action camera" |
| **Taboo** | Asks questions normally off-limits in everyday conversation (income, embarrassing moment, body count) | "How much do you make running that yacht?" |
| **Shock-and-awe** | Visually or factually astonishing event that triggers WTF reaction | Volcano hit by lightning; tornado over a train |
| **Mildly infuriating** | Triggers low-level frustration; bait for "actually that's wrong" engagement comments | Stereotype-defying scenario played straight |
| **Niche call-out** | Directly addresses a specific audience identifier ("parents", "runners", "beginner X") | "Beginner runners, here are 3 tips I wish I knew" |
| **Famous person / thing** | Borrows recognition of a known person, product, location, or moment | "Post Malone wrote on a fan's credit card" |
| **Viral-video hijack** | Opens with the first seconds of an already-viral video / sound, then cuts to brand content | Car dealerships piggybacking on trending audios |

Brand `brand-voice.md` declares 2–4 topical patterns as the brand's default repertoire. Mixing too many topical patterns dilutes brand recognition — audiences develop heuristics for what topical-territory the brand operates in.

---

# 3 — Story Structures

## 3.0 — Macro Frame: Hook → Substance → Payoff

Every story structure below decomposes into the same three-part macro shape. Use this as the validity check for any structure variant.

| Phase | Share of runtime | Job |
|---|---|---|
| **Hook** | First 5–7 seconds (or ≤ first 10% of runtime) | Open the curiosity loop (§2.2) |
| **Substance** | 75–80% of runtime | Deliver value (§3.5 Laugh-or-Learn) while holding the loop open |
| **Payoff** | Final 5–10 seconds | Close the loop (§2.2). Save-test: would a viewer save this for later? If not, the payoff is weak. |

Common failure modes:
- **No payoff** — substance ends without closing the loop (e.g. photo-setup videos that never show the final photo). Destroys save/share.
- **Overstayed payoff** — payoff lands, then video continues. End the video immediately after the payoff lands; don't dilute it.
- **Substance without curiosity hold** — value delivered, but no opened loop pulling the viewer through. Watch time drops in mid-section.

The HOOK / CONTEXT / TENSION / RESOLUTION / CTA beats in §3.1–§3.4 are micro-decompositions of this same macro shape: HOOK = Hook, CONTEXT+TENSION+RESOLUTION = Substance+Payoff, CTA = post-payoff ask.

## 3.1 — Vertical Video (15–30s)

```
HOOK         ≤ 3s    archetype from Section 2
CONTEXT      ≤ 5s    what / who / when
TENSION      8–15s   problem, decision, unexpected moment
RESOLUTION   3–5s    what happened, what changed
CTA          1–2s    explicit ask
```

## 3.2 — Long-Form Vertical (60–90s)

```
HOOK         ≤ 3s    same as short-form
CONTEXT      ≤ 7s    expanded setup
TENSION      40–60s  multiple beats — escalation, complication, decision
RESOLUTION   5–10s   payoff
CTA          ≤ 5s    explicit ask
```

## 3.3 — Carousel (4–10 slides)

```
1. HOOK SLIDE       — single sentence, single visual idea
2. CONTEXT SLIDE    — establish stakes
3–8. TENSION SLIDES — one beat per slide
N-1. RESOLUTION     — payoff
N. CTA SLIDE        — explicit ask
```

Each slide must work as a standalone screenshot — users swipe back, screenshot single slides, share out of context.

## 3.4 — Long-form Text (LinkedIn, blog)

```
HOOK              first line — must survive truncation
PROOF / DATA      one stat or anecdote
NARRATIVE         3–5 paragraphs, one idea each
TAKEAWAY          1 sentence
CTA               explicit ask
```

## 3.5 — Substance Value Mode (Laugh or Learn)

The Substance phase (§3.0 macro frame) delivers value in exactly one of three modes. Brand `brand-voice.md` declares a default mode per format.

| Mode | What it delivers | Mechanism |
|---|---|---|
| **Learn** | Information, tips, insight, expertise | Value-for-time exchange — viewer leaves smarter |
| **Laugh** | Entertainment, comedy, surprise | Emotional response — viewer leaves with a felt experience |
| **Edutainment** | Both — teach via entertainment | Compounds both retention drivers; highest ceiling but highest production demand |

Edutainment is the highest-leverage mode but is not free — it requires both subject-matter authority AND comedic/narrative timing. Brands without both should commit to single-mode Learn or Laugh until skills mature.

The mode determines acceptable production decisions: a Learn-mode talking-head video tolerates low production polish if the information density is high; a Laugh-mode skit tolerates loose information if the comedic timing lands. Crossing wires (low-polish + low-information Learn; over-produced + unfunny Laugh) is the standard failure mode.

## 3.6 — Save/Share Design Framework

Watch time (`measurement.md` §1) is the dominant algorithmic signal, but cannot be designed for directly — you cannot make a video "more watched." You CAN make a video that is more likely to be **saved** or **shared**, and the act of saving/sharing requires watching, which lifts watch time as a byproduct.

Before filming, the producer MUST answer at least one of these two questions with a specific reason:

| Question | If yes, the design is: |
|---|---|
| Why would someone save this? | Save-optimized — see §3.6.1 |
| Why would someone share this? | Share-optimized — see §3.6.2 |

A single piece optimizes for ONE of the two, not both. Trying for both dilutes both.

### 3.6.1 — Save Drivers

| Driver | Mechanism | Example content |
|---|---|---|
| **Practical value** | Viewer needs the information for a task they will perform | Tutorials, recipes, frameworks, checklists |
| **Future relevance** | Viewer expects the information to apply at a later, predictable moment | Travel tips for an upcoming trip, career advice, reference data |

Save-optimized pieces lean into Learn-mode (§3.5). Information density and tactical clarity beat polish — viewers save things they will *use*, not things that are merely interesting.

### 3.6.2 — Share Drivers

| Driver | Mechanism | Example content |
|---|---|---|
| **Relatability** | Viewer thinks "this is so my friend" — sharing as social currency | Niche-specific inside jokes, meme-able truths |
| **Emotion** | Viewer feels something strongly enough to want others to feel it too | Shock, awe, indignation, laughter, inspiration |
| **Value** | Viewer wants someone in their circle to benefit from the same insight | High-utility tips with broad applicability |

Share-optimized pieces enter Stage 2/3 push (`measurement.md` §5) faster than save-optimized pieces because share-events propagate outside the existing follower base immediately.

This framework precedes hook selection, structure choice, and prompt construction — it is the upstream design lens that determines what kind of hook, substance mode, and CTA the piece needs.

## 3.7 — Scripting Discipline

Scripting is the bridge between idea and shoot. A piece without a script gets re-shot, edited heavily, or never finished. The deliverable is a document that the brand could hand to a substitute and still produce the piece.

### 3.7.1 — Pre-Script Checklist

Before writing a line, the producer answers:

| Question | Purpose |
|---|---|
| What is the purpose of this video? | Education, entertainment, problem-solve, conversion — see §3.5 |
| How is the content shown? | Talking head, screen-rec, b-roll, generated visuals |
| What overlays will appear? | On-screen text, data callouts, citations |
| What sources / evidence back the claim? | Pre-resolved before filming — finding a stat mid-edit kills momentum |
| What are the story beats? | Maps onto §3.0 macro frame: Hook → Substance → Payoff |
| How does the viewer change after watching? | Knew nothing → knows X; felt neutral → felt Y; ambivalent → motivated to do Z |

If any answer is "I'll figure it out while filming", the piece is not ready to film.

**Order rule: write the hook first.** The first question above (Purpose) resolves into a working hook before the rest of the script is written. Hook-first authoring prevents the standard failure mode of building a video without a hook, then bolting one on. If a strong hook cannot be written from the topic, the topic is the problem — change topic before continuing to script.

### 3.7.2 — Word-for-Word vs Bullet Script

| Style | Strength | Weakness | Best fit |
|---|---|---|---|
| **Word-for-word** | Tight pacing, exact wording, lower edit overhead | Higher write time; risks sounding robotic if delivered as written | High-information density (educational), short-form where every second counts |
| **Bullet outline** | Natural conversational tone, faster to write, allows in-take improvisation | Higher edit overhead, risk of rambling, harder to control duration | Personality-driven content, story-time, long-form |

Word-for-word scripts MUST be written in spoken cadence — read aloud during writing, rewrite anything that feels unnatural. Include filler words where they would naturally land in speech.

### 3.7.3 — Brain-Dump Method

1. Dump every idea, fact, angle, line related to the topic — unordered, unstructured
2. Step away for ≥ 10 minutes (longer for long-form)
3. Return and structure into Hook / Substance / Payoff (§3.0)
4. Cut anything that doesn't serve the one main idea

The step-away is non-optional. Tunnel-vision in one continuous writing session is the standard failure mode — fresh eyes catch what tunnel-vision misses.

### 3.7.4 — One Main Idea Per Piece

Each piece carries exactly one idea. Multi-idea pieces split into multiple pieces — three sharp single-idea pieces beats one diluted multi-idea piece. The single-idea constraint also forces the producer to identify what the idea actually is, which often exposes that "the idea" was really three vague ones.

### 3.7.5 — Script Includes Visuals

A script is not "the words." It is the document that produces the piece. Even silent / no-voiceover pieces have a script — covering structure, on-screen text, and key visual beats. The shot list (`visuals.md` §12.1) is downstream of the script.

## 3.8 — Conversion-Mode Structure (Direct-Response Template)

A specialized story structure used when the explicit goal of the piece is sales conversion (paid product, service, lead-magnet sign-up). Distinct from §3.1–§3.4 general engagement structures and from §3.5 Learn/Laugh/Edutainment — Convert is the 4th substance mode, but it has a fixed beat sequence rather than free-form structure.

Beat sequence:

```
1. CALL-OUT       identify target audience explicitly ("Founders running B2B SaaS — this is for you")
2. HOOK           §2 archetype that resonates with the called-out demographic
3. PAIN-POINT     amplify the problem the offer solves; viewer must feel seen
4. OUTCOME        paint the after-state — what life / business looks like with the problem solved
5. PROOF          social proof, results, credentials — earns the right to pitch
6. OBJECTION      address the single biggest reason the viewer hesitates ("can't afford it" / "no time")
7. PITCH          explicit description of the product / service / offer
8. SNEAK-PEEK     show the thing — UI screenshots, output samples, behind-the-scenes
9. FEATURES       what's included; differentiators
10. OFFER         price, scarcity, bonus, guarantee
11. CTA           single explicit ask — link in bio, DM, comment-trigger
```

Rules:

| Rule | Why |
|---|---|
| Use only for explicit-conversion pieces | Conversion structure feels sales-y when applied to nurture / relationship content — collapses Hub-content trust (§6.2) |
| Cadence ≤ 10–20% of total content | Brands publishing >20% conversion-mode pieces train the audience that "this is an ad account" — non-conversion content stops being trusted |
| One objection per piece | Multiple objections fragment the pitch; pick the highest-frequency objection from real sales conversations |
| CTA matches offer specificity | Generic CTA on a specific offer drops conversion. Match wording exactly to the offer described in beats 7–10. |
| Disclosure if paid partnership | If the offer is a third-party's, apply §10.6 Sponsored Content Discipline in parallel |

Brand `brand-voice.md` declares approved conversion-mode offer templates. Proven offers may be re-shot with the same beat sequence and only the OUTCOME / PROOF / SNEAK-PEEK / OFFER beats varied — same structure becomes a repeatable conversion machine.

---

# 4 — Tension Patterns

Tension shapes that hold attention through the middle of a story:

| Pattern | Shape |
|---|---|
| **Discovery** | We assumed X. We found Y. Here's the proof. |
| **Decision** | We had to choose between A and B. We picked A because... |
| **Failure-and-fix** | We shipped X. It broke. We fixed it like this. |
| **Comparison** | Format A vs Format B — same players, different outcome. |
| **Reveal** | The thing you don't see in the data: ... |
| **Process** | Step 1 looked easy. Step 4 nearly killed it. |

---

# 5 — CTA & Engagement Triggers

## 5.1 — CTA Library

Exactly one CTA per piece. Never stack ("follow AND comment AND share"). Pick the one with highest expected lift for the post's goal.

| CTA Type | Example phrasing | Goal |
|---|---|---|
| **Acquisition** | "Try a free [thing] — link in bio" | Sign-ups, trial starts |
| **Engagement** | "Drop your [X] in the comments" | Algorithmic lift, social proof |
| **Follow** | "Follow for [recurring value]" | Audience growth |
| **Share** | "Tag a [persona] who'd play this" | Network effect |
| **Save** | "Save this — you'll need it next time you [X]" | Algorithmic signal, retention |
| **Question-back** | "Would you have made this decision? Tell me." | Conversation starter |
| **Build-update** | "Subscribe to the build log for weekly updates" | Newsletter / community growth |

CTA must match goal. Engagement post with sign-up CTA fails on both metrics.

**CTA placement: end of piece only, never mid-video.** Mid-video CTAs (especially sales / promotional asks) trigger skip behavior in viewers who haven't yet committed to the payoff. Placing the CTA after the payoff lands means only viewers who watched through self-select for the ask — higher conversion, no drop-off cost.

## 5.2 — Engagement Triggers (In-Video)

Distinct from §5.1 CTAs (explicit asks). Engagement triggers are in-video stimuli that generate comments without asking. Use sparingly — overuse trains audiences to recognize the device and discount it.

| Trigger | Mechanism | Required discipline |
|---|---|---|
| **Light-controversy opinion** | Take a side on a low-stakes preference (e.g. tool choice, workflow, terminology). Both sides comment — agreers reinforce, disagreers argue. | Opinion MUST be genuine and held over time. Faked controversy collapses trust on repeat. NEVER use for high-stakes topics (politics, religion, identity). |
| **Intentional micro-mistake** | Plant a tiny non-load-bearing error (mispronunciation, swapped word, harmless typo). Audience comments to correct. | Error must NOT affect the validity of the substance. Don't be wrong about the actual claim — just about a small detail. |
| **Question-back in substance** | Pose a specific answerable question inside the substance (not just at CTA). Viewer mentally answers, then often comments. | Question must be specific enough to have a real answer ("which one would you pick: A or B?") — not vague. |

Engagement triggers do not replace strong watch time. They lift videos that already have decent watch time into Stage 2/3 push (see `measurement.md` §5) by accelerating engagement-ratio targets (see `measurement.md` §3).

Limit: at most ONE engagement trigger per piece. Stacking triggers reads as manipulation.

---

# 6 — Series & Content-Mix Cadence

## 6.1 — Series Cadence Patterns

| Pattern | Cadence | What makes it work |
|---|---|---|
| **Weekly recap** | 1×/week | Predictable slot, draws from previous week's data |
| **Themed day** | 1×/week (specific weekday) | "Format Friday", "Match-of-Monday" — calendar lock |
| **Build log** | 1×/week | Founder-led, candid, low production |
| **Spotlight** | 1×/month | Featuring one user / event / decision deeply |
| **Counter-take** | 1×/month | Reaction to industry narrative |
| **Drop** | Event-driven | Tied to releases, announcements — high production |

Max 3 active series at once. Past 3, each weakens the others.

## 6.2 — Hero vs Hub Content Mix

Hero/Hub is a **production-planning framework** distinct from `measurement.md` §4 (which uses the same vocabulary as a post-publication diagnostic). This section governs deliberate content production decisions made before shoot.

| Type | Purpose | Production load | Cadence | Audience |
|---|---|---|---|---|
| **Hero** | Reach new audiences; engineered for virality | High — multi-day plan / shoot / edit | ~1×/week | Cold (non-followers) |
| **Hub** | Deepen relationship with existing audience; convert followers → customers | Low — under 1 hour idea-to-publish | 3–7×/week | Warm (existing followers) |

| Mistake | Why it fails |
|---|---|
| All Hero, no Hub | Viral video lands, audience finds no follow-up — they forget the brand within days |
| All Hub, no Hero | Audience never grows beyond current followers; brand plateaus |
| Hero-quality production demands on Hub content | Production cost destroys cadence; consistency dies first |

A brand can succeed with ONLY Hub content (some do — see `measurement.md` §8.1 Niche-Revenue model). A brand cannot succeed with only Hero content, because the missing Hub layer means no audience-relationship to convert.

## 6.3 — Series Discipline

Three rules every series must follow. Violating any of these collapses series performance.

| Rule | Why |
|---|---|
| **Stand-alone-per-video** | Each piece must be a complete experience for a viewer who has not seen prior episodes. Most viewers see one piece, not the full series. Mid-arc episodes that depend on prior context lose new viewers. |
| **First-party content** | Series content is filmed for the short-form vertical format from scratch — never repurposed from long-form or off-platform content. Audiences detect the mismatch in pacing, framing, and hook structure. |
| **Input-controlled goal** | Series goal must be something the creator controls (e.g. "100 videos teaching X"). Goals dependent on outcomes outside the creator's control ("100 days of demos until I get signed") collapse if the outcome doesn't land — and the audience gets no value during the wait. |

Counter-example: a music artist running "100 days of my demos until I get signed" violates all three — each video requires context, depends on listener investment in prior episodes, has no take-home value, and the goal depends on a record-label decision the creator can't force.

Correct pattern: "100 days of music-production tips" — input-controlled, every video stands alone, every video gives the viewer a take-home skill. The artist can still showcase her own music as examples while teaching.

---

# 7 — Banned-Phrase Categories

Categories every brand populates with concrete vetoes in `brand-voice.md`:

| Category | Examples (delete per-brand) |
|---|---|
| **SaaS clichés** | "Game-changer", "revolutionize", "next-level", "best-in-class" |
| **Empty AI invocation** | "AI-powered" when not describing actual AI; "ML-driven" without specifics |
| **Sports bro-isms** | "Crushing it", "no days off", "grind never stops" |
| **Tech jargon for non-tech audience** | "Leverage synergies", "agile mindset", "frictionless experience" |
| **False urgency** | "Don't miss out", "limited time" (when neither is true) |
| **Hollow validation** | "Game-changer for the industry", "this changes everything" |

Each brand picks applicable categories and adds its own vetoes.

---

# 8 — Tone Spectrum & Platform Character

Different contexts demand different tones from one voice. Brands declare per-context tone in `brand-voice.md`.

## 8.1 — Context Tone Matrix

| Context | Default tone |
|---|---|
| Recap / wrap-up | Celebratory, factual, name-forward |
| Build-in-public | Honest, decision-led, slightly self-deprecating |
| Feature / product post | Concise, "what changed, why it matters" |
| Community moment | Reactive, fast, low-polish OK |
| Authority / thought leadership | Researched, slow, citation-ready |
| Crisis / correction | Direct, no euphemism, owns the error |

A brand voice is *one identity* moving across tones — never six different voices.

## 8.2 — Platform Character Bias

The same video performs differently per platform because audience expectations differ. When planning content per platform:

| Platform | Rewards | De-prioritizes |
|---|---|---|
| Instagram Reels | Visual polish, aesthetic composition, well-lit subjects, recognizable production value | Rough, low-fi authenticity |
| TikTok | Authenticity, raw moments, conversational tone, real environments | Over-polished, ad-like production |
| YouTube Shorts | Educational density, watchable-without-context structure, voice clarity | Trend-dependent humor that ages |
| LinkedIn (video) | Talking-head domain expertise, slow pacing, named subjects | Quick cuts, viral-format tropes |

Strategic-advisor rule: produce one version that fits the brand's primary platform. Same video posted to secondary platforms will perform asymmetrically — accept that as the cost of multi-platform data collection (see `measurement.md`).

## 8.3 — Spokesperson Continuity

A brand built on personal connection requires a single recognizable face for the audience to bond with. Audiences follow people, not topics — even when the topic is the explicit value the content delivers. Rotating spokespeople resets the parasocial bond every appearance and reverts the brand to logo-distribution dynamics (slower growth, weaker trust, no compounding follower asset).

| Rule | Why |
|---|---|
| One primary on-camera spokesperson per brand | Trust and parasocial bond form around a person, not a logo or topic |
| Same person across formats and tone shifts (§8.1) | Format/tone can flex within one identity; faces cannot |
| Spokesperson swap requires an explicit transition arc | Audience experiences silent swap as identity loss; without handover, follower base churns |
| Voiceover-only formats use one recognizable voice | Same principle in audio: listeners bond with a vocal identity, not just the words |
| Multi-person formats (interview, panel) anchor one constant face | Variable cast works if a single anchor remains across episodes |

Brand `brand-voice.md` declares the primary spokesperson (name + role) and any approved secondary spokespeople with their explicit role (e.g. "interviewer rotates; host = constant").

This rule is strongest for personal brands and SMB / agency brands. For large multi-brand enterprises with multiple sub-brands, each sub-brand still needs its own continuous face — the rule applies per recognizable identity, not per legal entity.

---

# 9 — Localization Pattern

Per-brand declarations in `brand-voice.md`:

- **Primary language** — full-effort production
- **Secondary languages** — caption / subtitle mirroring
- **Format-specific policy** — e.g. "Reels: voiceover in primary, subs in primary + 1 secondary"

Rules:

- Subtitles on every vertical video — non-negotiable
- Hashtags can be multilingual on IG, single-language on TikTok
- LinkedIn long-form: primary only; mirroring fragments engagement signal

---

# 10 — Distribution Discipline

Rules and myth-busts for publishing content. Most "algorithm hacks" are folklore; the rules below are what actually moves the needle.

## 10.1 — Cross-Posting

| Rule | Reason |
|---|---|
| Cross-post the same piece to every relevant short-form platform | TikTok / Instagram Reels / YouTube Shorts / Facebook Reels / Snapchat Spotlight — same piece, separate native uploads. Reach compounds; no penalty for cross-posting. |
| Never upload a watermarked file from another platform | A TikTok-watermarked file uploaded to Instagram = throttled reach. Always export the clean master from the editor (see `visuals.md` §12.2), then upload natively per platform. |
| Track per-platform performance separately | Same piece performs asymmetrically. Per-platform data over time reveals what works where (see `measurement.md` §4 Hub-vs-Hero diagnostic per platform). |

## 10.2 — Hashtag Discipline

Restates and extends the rules from §11.1 (Caption & Hashtag Rules):

| Rule | Reason |
|---|---|
| 3–5 relevant hashtags per post | More signals spam; fewer limits algorithmic categorization |
| 1 broad (audience pool) + 2–3 niche (topic specificity) | Pure-broad hashtags (`#fyp`, `#viral`) don't lift reach and signal low effort. Pure-niche only limits algorithmic categorization. |
| Match hashtags to actual niche, not aspirational niche | Mis-tagging puts the post in front of an audience that won't engage, suppressing reach |
| Zero hashtags is acceptable | Hashtags do not make a marginal video viral. Production quality and hook do. |

## 10.3 — Posting Time

Posting time does not move algorithmic performance on Instagram / TikTok / YouTube Shorts. Algorithms are engagement-based, not chronological. Publish when the piece is ready; do not delay-for-timing.

The platform's "most active times" graph is a measurement, not a constraint. Posts published off-peak surface to the same audience within hours — the algorithm catches up.

## 10.4 — Engagement Aftercare

| Practice | Effect |
|---|---|
| Reply to genuine user comments | Lifts engagement signal; strengthens parasocial bond (see §8.3) |
| Comment on your own post to fake engagement | No effect — platforms detect creator-self-engagement and discount it |
| "Post and ghost" (publish without immediate engagement) | Acceptable. No algorithmic penalty for not engaging in the first minutes. Reply when convenient. |

## 10.5 — Shadow-Ban Myth

"Shadow-banning" (covert reach suppression) is largely myth. Documented cases exist only for content that violates community guidelines (sensitive topics, policy boundaries, copyrighted material). For standard creator content, a sudden drop in reach is almost always:

- Audience interest shifted from the topic
- Format reached saturation in the audience
- A content trend changed under the creator's feet
- Hook quality regressed

Diagnosing "I've been shadow-banned" before checking hook, topic, and `measurement.md` §5 push-stage data is the standard failure mode. If genuine shadow-ban is suspected, check community-guideline status in the platform's creator portal first.

## 10.6 — Sponsored Content Discipline

When a piece is paid for, or produced in exchange for value (cash, product, service), platform AND legal rules require explicit disclosure. Non-disclosure is the standard failure mode — both fines (FTC US, EU consumer law) and platform reach throttling have been observed.

| Rule | Why |
|---|---|
| Check the platform's "Paid partnership" / "Sponsored content" flag on every paid post | TikTok, Instagram, YouTube all require it; algorithms route disclosed paid posts differently and platform legal exposure shifts to the disclosed sponsor |
| Tag the sponsoring brand in the post | Algorithmic association + brand-visibility commitment to the sponsor |
| Verbal AND text-overlay disclosure within first 3 seconds | Some jurisdictions require disclosure that survives muted playback — verbal + text covers both. "#ad" / "Paid partnership with [brand]" minimum |
| Sunset sponsor link after agreed window (default 24h in bio) | Bio-link slot reverts to brand's primary offer; prevents stale-sponsor association polluting future link clicks |
| Match content to brand's authenticity baseline | Sponsored content that disguises itself as organic content erodes spokesperson-continuity trust (§8.3) across the entire feed, not just the sponsored post |
| Spokesperson must genuinely use / endorse the product | Faked endorsement is the fastest way to detonate parasocial bond; one inauthentic sponsor can churn months of audience-building |

Brand `brand-voice.md` declares the disclosure-language template and approved disclosure placement so spokespersons execute consistently across deals. Operational concerns (invoicing, brand-asset delivery, analytics-sharing back to sponsor) live in the brand's per-engagement contracts, not in this pattern doc.

---

# 11 — Output Schema for Generated Content

LLM-generated content for n8n workflows conforms to a parseable schema per format.

## 11.1 — Caption & Hashtag Rules

Constraints for the `caption` and `hashtags` fields in the schemas below:

| Field | Rule |
|---|---|
| Caption | ≤ 2 sentences before line break (truncation point matters most) |
| Caption | Functions as **secondary hook** — short, intriguing fragment that previews without revealing the payoff |
| Caption | Never compensates for a weak video hook |
| Hashtags | 3–5 relevant tags, no more |
| Hashtags | Mix of 1 broad (audience pool) + 2–3 niche (topic specificity) |
| Hashtags | Never unrelated trending tags (platforms can suppress hashtag-spam) |

## 11.2 — Vertical Video Script

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
caption: "≤ 2 sentences before line break — secondary hook"
hashtags:
  - "#tag1"     # 3-5 total, 1 broad + 2-3 niche
  - "#tag2"
```

## 11.3 — Carousel

```yaml
slides:
  - role: "hook"
    text: "single sentence"
    visual_note: "what should be on screen"
  - role: "context"
    text: "..."
    visual_note: "..."
caption: "≤ 2 sentences before line break — secondary hook"
hashtags:
  - "#tag1"     # 3-5 total
cta:
  type: "..."
  phrasing: "..."
```

Workflows reference these schemas when defining parser logic in `prompts.md`.

---

# 12 — Cross-References

| Topic | Reference |
|---|---|
| 4-phase automation lifecycle | `.claude/ref/content-ops/automation.md` |
| Visual contract (aspect ratios, formats, prompt craft) | `.claude/ref/content-ops/visuals.md` |
| Performance measurement & iteration | `.claude/ref/content-ops/measurement.md` |
| Required analytics events | `.claude/ref/growth/analytics.md` |
| Per-brand voice instances | per repo: `content-ops/brand-voice.md` |

---

# 13 — Versioning & Status

**Version:** 1.8
**Status:** ACTIVE

**Changelog:**

* **1.8 (2026-05-24):** Added §3.8 Conversion-Mode Structure (11-beat Direct-Response template: Call-out → Hook → Pain-point → Outcome → Proof → Objection → Pitch → Sneak-peek → Features → Offer → CTA; rules: explicit-conversion only, ≤ 10–20% cadence cap, one objection per piece, CTA-offer specificity match). Added §10.6 Sponsored Content Discipline (paid-partnership flag, brand-tagging, verbal+text disclosure ≤ 3s, bio-link sunset, authenticity-baseline match, genuine-endorsement rule). Source: Part-Time Creator Academy — Flex Script Writing Worksheet, Posting Checklist (Sponsored Video section).
* **1.7 (2026-05-23):** Added §2.5 Hook Principles (§2.5.1 Framing: Knowledge-Gap + Audience-Filter; §2.5.2 Quality Elements: 7 meta-craft principles — Polarity / Question-generative / Emotion-4-trigger / Pattern-disruption / Frame-break / 8-Human-Desires / Extremes; ≥ 2 per hook). Added §2.6 Topical Hook Patterns (Listicle / Money / Extreme / Taboo / Shock-and-awe / Mildly-infuriating / Niche-call-out / Famous-person-or-thing / Viral-video-hijack — distinct topical axis from §2 structural archetypes). Added hook-first authoring order rule to §3.7.1 Pre-Script Checklist. Inserted new §10 Distribution Discipline (§10.1 Cross-Posting / §10.2 Hashtag Discipline / §10.3 Posting Time / §10.4 Engagement Aftercare / §10.5 Shadow-Ban Myth). Renumbered §10 Output Schema → §11 (sub-sections §10.1/§10.2/§10.3 → §11.1/§11.2/§11.3), §11 Cross-References → §12, §12 Versioning → §13. Source: Part-Time Creator Academy — Viral Hooks Masterclass (Anatomy Part 1, Hook Types, Hook Purpose), Posting Misconceptions.
* **1.6 (2026-05-22):** Added §1.10 Niche Commitment & Authority Stance (single-niche rule + ≥12-month commitment + Expert/Enthusiast positioning with trust mechanism). Expanded §2.1 from 2-modality to 4-modality hook stacking (Audio / Visual / Text overlay / Caption) with valid/invalid stacking patterns. Added §2.4 Mid-Video Re-Hooks (Contrast pivot / Reveal tease / Numbered escalation / Visual punch-in; 8–15s cadence). Added §3.6 Save/Share Design Framework (upstream design lens before hook selection — save drivers vs share drivers; one per piece, not both). Added §3.7 Scripting Discipline (Pre-Script Checklist / Word-for-Word vs Bullet / Brain-Dump Method / One Main Idea / Script Includes Visuals). Added CTA-placement-rule to §5.1 (end-only, never mid-video). Restructured §6 to "Series & Content-Mix Cadence": §6.1 Series Cadence Patterns (existing table), §6.2 Hero vs Hub Content Mix (production-planning framework distinct from measurement.md §4 diagnostic), §6.3 Series Discipline (Stand-alone / First-party / Input-controlled rules with music-artist counter-example). Source: Part-Time Creator Academy / TMS Media — Hook-Substance-Payoff, Save/Share Framework, How to Script Your Videos, Hero vs Hub Content, Power of a Series, Find Your Niche.
* **1.5 (2026-05-22):** Added §8.3 Spokesperson Continuity (single recognizable face per brand; parasocial bond mechanism; rules for spokesperson swap, voiceover formats, multi-person formats). Extended §1.8 step 1 to include the brand's own past top-performers as highest-fidelity references for reference-mining (internal wins beat external benchmarks because audience-fit is already proven). Source: Part-Time Creator Academy / TMS Media — Power of a Personal Brand, Reading Your Analytics.
* **1.4 (2026-05-22):** Extended §1.7 with Borrowed-Familiarity Pattern (external-reference relatability — Friends-apartment-style attention-hacking). Added §2.2 Open-Loop / Close-Loop Principle (the curiosity-loop mechanism unifying all hooks; multi-loop discipline). Added §2.3 Hook Template Library (50 proven fill-in-the-blank templates; brands curate 5–15). Added §3.0 Macro Frame: Hook → Substance → Payoff (3-part shape that all §3.1–§3.4 micro-structures decompose into; save-test for payoff quality). Added §3.5 Substance Value Mode (Learn / Laugh / Edutainment taxonomy with mode-production-match rules). Restructured §5 to "CTA & Engagement Triggers": §5.1 CTA Library (existing), §5.2 Engagement Triggers (Light-controversy opinion / Intentional micro-mistake / Question-back in substance). Source: Part-Time Creator Academy / TMS Media — Hook-Substance-Payoff Framework, 50 Hook Examples, Bank On Relatability, Secrets to Create Engagement.
* **1.3 (2026-05-22):** Extended §1 with three new subsections — §1.7 The 4 Elements of a Viral Idea (Relatability / Curiosity / Reaction / Unrealistic; ≥ 2 threshold), §1.8 Reference-Mining (Steal Like an Artist workflow with platform Inspiration-tab signal), §1.9 Format Taxonomy (9 proven viral formats with mechanism + production load). Closes idea-quality, idea-sourcing, and format-vocabulary gaps. Source: Part-Time Creator Academy / TMS Media transcripts.
* **1.2 (2026-05-22):** Trim pass — removed prose from §1, §2, §3, §4, §5, §6, §7, §9; converted to scannable constraint-tables. Added §8.2 Platform Character Bias (absorbed from dissolved `channel-strategy.md`). Added §10.1 Caption & Hashtag Rules (absorbed from dissolved `channel-strategy.md`). Removed cross-ref to dissolved `channel-strategy.md`.
* **1.1 (2026-05-22):** Added §1 Topic Discovery & Validation. Added Foreshadowing hook archetype. Added §2.1 Stacked Hooks. Renumbered §1–§11 to §2–§12.
* **1.0 (initial):** Hook archetypes (8), story structures, tension patterns, CTA library, series cadence patterns, banned-phrase categories, tone spectrum, localization, output schema.

Future revisions may add:

* Audio / podcast story structures
* Newsletter / email-specific hook patterns
* Multilingual hook-archetype variants
