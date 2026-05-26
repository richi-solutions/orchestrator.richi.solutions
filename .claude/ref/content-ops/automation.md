# content-automation.md

**Richi AI — Content Automation & Social Engagement Execution Contract**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Agent: Claude Code (implementation)
Authority: CONTENT-OPS-CANONICAL

---

# 0 — Purpose

This document defines the architecture and execution contract for content automation across all Richi AI products.

It ensures:

* consistent folder structure for content operations per product
* deterministic phase-by-phase rollout of content automation
* clear separation between pattern (this doc) and instance (per-product content)
* policy-compliant integration with Meta (Instagram/Facebook) and TikTok platforms
* clean boundary between content automation and adjacent modules (Knowledge Base, Analytics)

---

# 1 — Scope

In scope:

* n8n-driven content generation workflows (scripts, posts, video assets)
* Brand-specific strategy, storytelling, visuals documentation
* Meta and TikTok Developer App integration (Personal / Development Mode)
* Content performance analytics ingest from platform APIs
* Inbound DM and comment response automation

Out of scope:

* Knowledge Base architecture (separate module, consumed in Phase 4)
* Generic platform analytics (see analytics.md)
* Marketing-attribution funnels (see funnel.md)
* App Review / public-mode Meta apps (future revision)

---

# 2 — Pattern vs Instance

| Layer | Owner | Location |
|---|---|---|
| Pattern (this doc) | Orchestrator | `.claude/ref/content-ops/automation.md` |
| Storytelling craft pattern | Orchestrator | `.claude/ref/content-ops/storytelling.md` |
| Visual contract pattern | Orchestrator | `.claude/ref/content-ops/visuals.md` |
| Folder structure | Standard, enforced | per repo: `content-ops/` |
| Strategy (per-brand) | Per-product | per repo: `content-ops/strategy.md` |
| Brand voice (per-brand) | Per-product | per repo: `content-ops/brand-voice.md` |
| Brand visuals (per-brand) | Per-product | per repo: `content-ops/brand-visuals.md` |
| n8n workflows + prompts | Per-product | per repo: `content-ops/workflows/<name>/` |
| Meta / TikTok app credentials | Per-product (own brand accounts) | per repo: Vercel / Supabase secrets |
| Runtime code (webhooks, ingest, UI) | Per-product, follows RDF | per repo: `supabase/functions/`, `src/pages/admin/` |

Each product runs its own Meta Developer App and TikTok Developer App in Personal / Development Mode. No App Review required. Apps are NOT shared across products — each brand has its own app and its own connected accounts.

---

# 3 — Folder Structure (per repo)

Top-level `content-ops/` is mandatory once Phase 1 begins:

```
content-ops/
  README.md                           # Index, current phase, owners
  strategy.md                         # Audiences, channels, cadence, KPIs (per-brand)
  brand-voice.md                      # Voice attributes, banned phrases, series naming
                                      #   ↳ follows .claude/ref/content-ops/storytelling.md pattern
  brand-visuals.md                    # Brand colors, typography, logo, templates
                                      #   ↳ follows .claude/ref/content-ops/visuals.md pattern
  workflows/
    <workflow-slug>/
      README.md                       # Trigger, inputs, outputs, edge cases
      workflow.json                   # n8n export (canonical: n8n, mirrored here)
      prompts.md                      # System prompts + parsers per node
  meta-app/                           # Phase 2+
    README.md                         # App ID, permissions, token refresh notes
    accounts.md                       # Linked IG/FB accounts
  tiktok-app/                         # Phase 2+
    README.md                         # Client key, scopes, token refresh notes
    accounts.md                       # Linked TikTok accounts
```

The two pattern docs (`storytelling.md` and `visuals.md`) in this folder define the *framework* (hook archetypes, story structures, CTA library, aspect ratios, safe zones, motion defaults). Each product's `brand-voice.md` and `brand-visuals.md` instantiate that pattern with brand-specific substance (PadelLeague's voice ≠ Moviemind's voice).

Runtime code does NOT live under `content-ops/`. It follows RDF placement:

| Concern | Location |
|---|---|
| Meta webhook handler | `supabase/functions/meta-webhook/` |
| TikTok webhook handler | `supabase/functions/tiktok-webhook/` |
| Token refresh cron | `supabase/functions/social-token-refresh/` |
| Analytics ingest cron | `supabase/functions/social-analytics-ingest/` |
| Admin dashboard | `src/pages/admin/content/` |
| Inbox / response UI | `src/pages/admin/inbox/` |
| DB schema | `supabase/migrations/*_content_*.sql` |

---

# 4 — Phase Lifecycle

Content automation rolls out in four phases. Each phase has an entry trigger, deliverables, and gates that block the next phase.

## Phase 1 — Start

**Entry trigger:** n8n instance operational, brand has at least one social account, first content piece planned.

**Deliverables:**

* `content-ops/` folder created
* `strategy.md` filled — target platforms, audience, posting cadence
* `brand-voice.md` filled — instantiates `storytelling.md` pattern with brand-specific voice attributes, banned phrases, series
* `brand-visuals.md` filled — instantiates `visuals.md` pattern with brand-specific colors, fonts, logo, templates
* At least one n8n workflow versioned in `content-ops/workflows/<name>/`
* Prompts maintained in `prompts.md` — copy-paste destination for n8n nodes

**Gate to Phase 2:**

* Workflow runs end-to-end in n8n
* Brand identity decisions documented (voice + visuals)
* At least one social account exists for the brand

## Phase 2 — Anbindung (Platform Connection)

**Entry trigger:** Phase 1 gates met, brand owns its IG / FB / TikTok accounts.

**Deliverables:**

* Meta Developer App created in Personal / Development Mode (no App Review)
* TikTok Developer App created in Sandbox mode
* Test users registered on both platforms (own accounts only)
* OAuth flow implemented, long-lived tokens stored in Supabase
* Token refresh cron deployed (`social-token-refresh`)
* `meta-app/` and `tiktok-app/` docs filled with App IDs, scopes, linked accounts

**Required env vars:**

| Var | Purpose |
|---|---|
| `META_APP_ID` | Meta Developer App ID |
| `META_APP_SECRET` | Meta App Secret (Supabase secret only, never client) |
| `META_WEBHOOK_VERIFY_TOKEN` | Webhook subscription verification |
| `TIKTOK_CLIENT_KEY` | TikTok Developer App Client Key |
| `TIKTOK_CLIENT_SECRET` | TikTok Client Secret (Supabase secret only) |

**Required DB tables:**

* `social_accounts` (account_id, platform, access_token, refresh_token, expires_at — RLS: admin-only)
* `social_tokens_audit` (token rotation log)

Tokens encrypted at rest (Supabase Vault or equivalent). Never logged in plaintext.

**Gate to Phase 3:**

* OAuth round-trip works for IG and TikTok
* Long-lived tokens refresh automatically >7 days without manual intervention
* Webhook verification endpoint registered and confirmed by platform

## Phase 3 — Content Analytics

**Entry trigger:** Phase 2 stable, posts being published, performance data wanted.

**Deliverables:**

* Daily ingest cron pulls post metrics from Meta Graph API and TikTok Display API
* `content_posts` and `content_metrics` tables populated
* Admin dashboard at `src/pages/admin/content/` shows: reach, impressions, engagement, top posts
* Analytics events emitted to central analytics backend (`content_post_published`, `content_metrics_ingested`) — see analytics.md

**Required DB tables:**

* `content_posts` (platform, platform_post_id, published_at, content_type — RLS: admin-only)
* `content_metrics` (post_id, metric_name, value, captured_at — RLS: admin-only)

**Gate to Phase 4:**

* Daily sync runs 7 consecutive days without errors
* Dashboard displays current KPIs
* Engagement volume justifies the cost of Phase 4 (project-specific threshold)

## Phase 4 — User Response Management

**Entry trigger:** Phase 3 stable, inbound engagement volume justifies automation.

**Deliverables:**

* Meta webhook handler subscribed to messages + comments
* TikTok webhook handler subscribed to comments
* Webhook signature verification implemented (Meta `X-Hub-Signature-256`, TikTok equivalent)
* Inbound message + comment storage (`social_inbound` table)
* Bot response service wired to product's Knowledge Base module via defined interface
* Human-escalation inbox at `src/pages/admin/inbox/`
* Confidence threshold + fallback rules configurable

**Platform compliance rules (binding):**

| Rule | Meta (IG / FB) | TikTok |
|---|---|---|
| Inbound DM reply within 24h window | Automated allowed | Automated allowed (limited API surface) |
| Reply to comments on own posts | Automated allowed | Automated allowed |
| Outbound DM after 24h window | Only via approved Message Tags (`HUMAN_AGENT`, `ACCOUNT_UPDATE`, `CONFIRMED_EVENT_UPDATE`, `POST_PURCHASE_UPDATE`) — not for marketing | Not allowed |
| Proactive / cold DM | Prohibited | Prohibited |
| Bulk outreach | Prohibited (ban risk) | Prohibited (ban risk) |
| Bot identification | Where platform requires (e.g. first message of conversation) | Where platform requires |

Rationale: inbound-only is the platform-permitted automation surface. Outbound automation is policy-blocked.

**Required DB tables:**

* `social_inbound` (platform, sender_id, message_type, content, received_at — RLS: admin-only)
* `social_outbound` (in_reply_to_id, content, sent_at, status — RLS: admin-only)
* `social_escalations` (inbound_id, reason, assigned_to, resolved_at)

**Required env vars (additive to Phase 2):**

* `META_PAGE_ACCESS_TOKEN_<account>` (per linked page)
* `KB_API_URL` — interface to Knowledge Base module (module defined elsewhere)

**Knowledge Base boundary:**

This contract does NOT define KB architecture. The bot service consumes the product's Knowledge Base via a stable interface (REST endpoint or function call). The KB lives as a separate module / service and is referenced as an external dependency only.

**Gate to operation:**

* Webhook receives events, persists, responds within 24h window
* Confidence threshold tuned: low-confidence inbound is escalated to human
* No outbound messaging implemented (compliance protection)
* Rate limits enforced per platform quota

---

# 5 — Required Analytics Events

Emitted via the central analytics interface (see analytics.md):

| Event | When | Required Fields |
|---|---|---|
| `content_workflow_run_started` | n8n triggers | workflow_slug, source |
| `content_workflow_run_completed` | n8n finishes | workflow_slug, status, duration_ms |
| `content_post_published` | Post lands on platform | platform, platform_post_id, content_type |
| `content_metrics_ingested` | Daily sync | platform, post_count, metric_count |
| `social_inbound_received` | Webhook event | platform, message_type |
| `social_response_sent` | Bot replies | platform, confidence, kb_match_score |
| `social_escalated_to_human` | Bot defers | platform, reason |

No PII in event payloads. Platform user IDs are non-PII identifiers. Message content is NEVER logged in analytics.

---

# 6 — Canonical Source of Truth

| Asset | Canonical Source | Mirrored To |
|---|---|---|
| Storytelling pattern, visual contract | Orchestrator (`.claude/ref/content-ops/`) | All product repos (via sync) |
| Brand strategy, voice, visuals | Repo (`content-ops/strategy.md`, `brand-voice.md`, `brand-visuals.md`) | — |
| Prompts | Repo (`content-ops/workflows/<x>/prompts.md`) | n8n (manual paste or future MCP sync) |
| n8n workflow definition | n8n instance | Repo (`content-ops/workflows/<x>/workflow.json`, exported periodically) |
| Tokens | Supabase Vault | — |
| Brand accounts | `content-ops/meta-app/accounts.md` + `tiktok-app/accounts.md` | — |

Conflict-resolution rule: if repo and n8n diverge, the **prompt source of truth is the repo**; the **workflow structure source of truth is n8n**. Re-export from n8n on every meaningful structural change.

---

# 7 — Security Baseline

* All platform tokens stored in Supabase Vault or equivalent — never in `.env` files committed to repo
* Webhook endpoints verify platform signatures before processing any payload
* Token refresh runs server-side (Edge Function), never in client
* RLS: all `social_*` and `content_*` tables admin-only by default
* Outbound rate limiters per platform quota (Meta: 200 msgs/sec per page; TikTok: project-specific, stricter)
* Bot reply content runs through guardrails (PII redaction, profanity / brand-risk filters) before send

---

# 8 — Cross-References

| Topic | Reference |
|---|---|
| Storytelling craft (hooks, structures, CTAs) | `.claude/ref/content-ops/storytelling.md` |
| Visual contract (aspect ratios, safe zones, motion) | `.claude/ref/content-ops/visuals.md` |
| Event schema + analytics backend | `.claude/ref/growth/analytics.md` |
| SEO of published content | `.claude/ref/growth/seo.md` |
| Conversion funnel from content | `.claude/ref/growth/funnel.md` |
| Knowledge Base (consumed in Phase 4) | TBD — separate module, future ref |
| Email automation | `.claude/ref/generation/email-implementation.md` |
| Vendor DPA status (Meta, TikTok, n8n) | `.claude/ref/compliance/vendor-knowledge-base.md` |

---

# 9 — Versioning & Status

**Version:** 1.1
**Status:** ACTIVE
**Initial scope:** 4 phases, Meta + TikTok, Personal / Development Mode apps, inbound-only response automation.

**Changelog:**

* **1.1 (2026-05-17):** Moved into `content-ops/` subfolder. Split per-repo `storytelling-guide.md` / `visuals-guide.md` into orchestrator-side patterns (`storytelling.md`, `visuals.md`) and per-repo brand instances (`brand-voice.md`, `brand-visuals.md`).
* **1.0 (2026-05-16):** Initial scope.

Future revisions may add:

* Production Mode apps with App Review
* Additional platforms (LinkedIn, YouTube Shorts, X)
* n8n MCP integration for bidirectional sync between repo and n8n instance
* Cross-product content syndication patterns
* Outbound campaigns under approved Message Tags