# analytics.md

**Richi AI — Unified Analytics Execution Contract**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Agent: Claude Code (implementation) / Lovable (optional prototyping)
Authority: ANALYTICS-CANONICAL

---

# 0 — Purpose

This document defines the unified analytics architecture and execution contract for all products within the Richi AI ecosystem.

It ensures:

* centralized analytics
* consistent event tracking across all products
* deterministic analytics integration for every generated product
* automatic feedback loops for optimization agents

Projects act as event producers.

---

# 1 — Architecture Overview

Canonical data flow:

```
User
 ↓
Product
 ↓
Analytics Interface
 ↓
Analytics Endpoint
 ↓
Analytics Database
 ↓
Analytics Engine
 ↓
Optimization Agent
```

The analytics backend is canonical storage.

---

# 2 — Ownership Model

Ownership rules:

| Component              | Owner            |
| ---------------------- | ---------------- |
| Event capture          | Project          |
| Event transport        | Project          |
| Event storage          | Analytics backend|
| Event processing       | Analytics backend|
| Analytics dashboard    | Analytics backend|
| Optimization decisions | Analytics backend|

Projects must not implement independent analytics storage unless explicitly allowed.

---

# 3 — Required Event Schema

All events must follow this schema:

```
event:

event_id: UUID
event_name: string
event_timestamp: ISO8601
product_slug: string
user_id: UUID or null
session_id: UUID
anonymous_id: UUID

context:
  page_url: string
  referrer: string or null
  user_agent: string
  device_type: string
  country: string or null

properties:
  object
```

Schema must be JSON Schema compliant.

---

# 4 — Required Core Events

Every project must emit these events:

```
page_view

landing_view

signup_started

signup_completed

login_completed

activation_completed

feature_used

conversion_started

conversion_completed

subscription_started

subscription_completed

subscription_canceled
```

These events are mandatory.

---

# 5 — Optional Events

Optional events depending on product type:

```
content_viewed

search_performed

item_created

item_deleted

item_updated

share_triggered

export_triggered
```

Product Architect Agent determines optional events.

---

# 6 — Project Analytics Interface Contract

Each project must implement analytics interface:

```
interface AnalyticsPort {

  track(event_name: string, properties?: object): void

  identify(user_id: UUID): void

  reset(): void

}
```

Implementation must send events to analytics endpoint.

---

# 7 — Analytics Endpoint Contract

Analytics endpoint:

```
POST /functions/v1/analytics-ingest
```

Request body:

```
{
  event_id,
  event_name,
  event_timestamp,
  product_slug,
  user_id,
  session_id,
  anonymous_id,
  context,
  properties
}
```

Authentication:

```
RICHI_PRODUCT_SECRET required
```

Analytics backend validates signature and schema.

---

# 8 — Event Transport Rules

Events must be transmitted:

```
immediately on capture
```

Fallback:

```
queue locally if offline
retry on reconnect
```

Retry policy:

```
retry_count: 5
retry_interval: exponential backoff
```

---

# 9 — Session Model

Each project must maintain session model:

```
session_id: UUID
```

Session begins:

```
on first page load
```

Session ends:

```
after inactivity timeout (default: 30 minutes)
```

---

# 10 — Identity Model

Identity priority order:

```
1. authenticated user_id
2. anonymous_id
```

anonymous_id must be persistent across sessions.

Stored in:

```
localStorage or secure storage
```

---

# 11 — Analytics Storage Model

Analytics backend stores events in canonical table:

```
analytics_events:

event_id
event_name
event_timestamp
product_slug
user_id
session_id
anonymous_id
context
properties
```

Indexes required:

```
product_slug
user_id
event_timestamp
event_name
```

---

# 12 — Privacy and Compliance

Requirements:

* no PII in event properties
* use user_id reference only
* no passwords
* no payment details

GDPR compliance required.

Analytics backend responsible for retention policies.

---

# 13 — Lifecycle Integration

Analytics activation occurs in:

Phase 5 — Growth Activation

Agent:

Growth Activation Agent

Execution:

* install analytics interface in project
* connect project to analytics endpoint
* enable core event tracking

---

# 14 — Optimization Agent Interface

Optimization Agent consumes analytics data:

Input:

```
analytics_events
conversion_rates
funnel_metrics
retention_metrics
```

Output:

```
optimization_actions
```

Examples:

* improve funnel
* adjust onboarding
* prioritize features

---

# 15 — Project Generator Requirements

Project Generator must automatically generate:

```
analytics.ts
analytics interface implementation
analytics endpoint connector
event tracking integration points
```

No manual analytics integration required.

---

# 16 — Failure Handling

If analytics backend unreachable:

```
queue events locally
retry later
```

Events must never be silently dropped.

---

# 17 — Platform Intelligence Layer

Analytics backend aggregates analytics across all projects.

Analytics backend can compute:

```
global conversion rate
per-product performance
cross-product user journeys
top-performing products
```

Analytics backend acts as platform intelligence engine.

---

# 18 — Execution Guarantee

This contract ensures:

* unified analytics across ecosystem
* deterministic event tracking
* centralized intelligence
* compatibility with lifecycle.md
* compatibility with ideation-to-product.md

Analytics integration is automatic and mandatory.
