# funnel.md

**Richi AI — Funnel Execution Contract**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Agent: Claude Code (implementation) / Lovable (optional prototyping)
Authority: GROWTH-INFRASTRUCTURE

---

# 0 — Purpose

This document defines the deterministic funnel architecture for every product in the Richi AI ecosystem.

It ensures:

* every product has a conversion funnel
* funnels are automatically generated
* funnels are measurable via analytics.md
* funnels are optimizable via lifecycle optimization agents
The funnel converts traffic into activated users and activated users into converted users.

---

# 1 — Funnel Architecture Overview

Canonical funnel structure:

```
Traffic
 ↓
Landing Surface
 ↓
Interest Trigger
 ↓
Signup / Entry Point
 ↓
Activation Event
 ↓
Value Realization
 ↓
Conversion Opportunity
 ↓
Conversion
```

Each stage must be implemented.

---

# 2 — Funnel Ownership Model

| Component               | Owner              |
| ----------------------- | ------------------ |
| Landing Pages           | Project            |
| Funnel Logic            | Project            |
| Conversion Tracking     | Project → Analytics|
| Conversion Intelligence | Analytics          |
| Optimization            | Optimization Agent |

Project owns execution.

---

# 3 — Funnel Types

Project Generator must select one funnel type based on product_spec:

```
direct_conversion
freemium_conversion
lead_capture
content_to_signup
utility_activation
```

Definitions:

direct_conversion
User converts immediately after landing.

freemium_conversion
User signs up first, converts later.

lead_capture
User captured via email or signup.

content_to_signup
Content drives signup.

utility_activation
User experiences value first, signup required later.

---

# 4 — Required Funnel Stages

Every funnel must include these stages:

Stage 1 — Landing Surface

Purpose:
Capture user attention.

Required assets:

landing_page
headline
value proposition
primary CTA

Analytics event required:

landing_view

---

Stage 2 — Interest Trigger

Purpose:
Create desire to interact.

Mechanisms:

demo preview
interactive UI
example output
content preview

Analytics event required:

feature_used OR preview_used

---

Stage 3 — Entry Point

Purpose:
Convert visitor into identified user.

Entry types:

signup
anonymous session
free usage session

Analytics events:

signup_started
signup_completed

---

Stage 4 — Activation Event

Purpose:
User experiences core product value.

Activation defined as:

first successful value-producing interaction.

Examples:

tool produces output
user creates object
user completes action

Analytics event required:

activation_completed

---

Stage 5 — Value Realization

Purpose:
User understands product value.

Mechanisms:

visual result
saved output
persistent benefit

Analytics event required:

feature_used

---

Stage 6 — Conversion Opportunity

Purpose:
Present monetization opportunity.

Triggers:

usage limits reached
premium feature accessed
time-based trigger
value-based trigger

Analytics event required:

conversion_started

---

Stage 7 — Conversion

Purpose:
User becomes paying user.

Conversion types:

subscription
purchase
upgrade

Analytics event required:

conversion_completed

---

# 5 — Funnel Asset Generation Contract

Project Generator must generate:

landing page:

```
/landing
```

optional SEO landing pages:

```
/use-case/[slug]
/tool/[slug]
/solution/[slug]
```

conversion entry points:

```
/signup
/login
/pricing
```

conversion triggers inside app UI.

---

# 6 — CTA Structure Contract

Each project must implement:

Primary CTA:

```
Start
Try now
Get started
Generate
Create
```

Secondary CTA:

```
Learn more
See demo
View example
```

CTA must be visible above fold.

---

# 7 — Activation Definition Contract

Product Architect Agent must define activation event in product_spec:

Example:

```
activation_event: first_output_generated
```

Project must track activation_completed event.

Activation must occur within:

```
< 60 seconds preferred
```

---

# 8 — Funnel State Model

Each user has funnel state:

```
ANONYMOUS
IDENTIFIED
ACTIVATED
ENGAGED
CONVERSION_ELIGIBLE
CONVERTED
```

State transitions tracked via analytics events.

---

# 9 — Project Implementation Requirements

Project must implement:

```
landing page
CTA system
activation trigger
conversion trigger
analytics event tracking
```

Project must never launch without funnel.

---

# 10 — Intelligence Layer

Analytics computes:

```
conversion_rate
activation_rate
dropoff_rate
time_to_activation
time_to_conversion
```

Optimization Agent uses data to improve funnel.

---

# 11 — Optimization Agent Authority

The Optimization Agent role is executed by the AI agent (Claude Code) on user request. The agent suggests and implements funnel optimizations when instructed by the user.

Optimization Agent may:

* modify CTA placement
* modify landing page structure
* modify conversion timing
* modify funnel sequence

Project must accept optimization instructions.

---

# 12 — Lifecycle Integration

Funnel activation occurs in lifecycle phase:

Phase 5 — Growth Activation

Agent:

Growth Activation Agent

Execution:

* generate funnel assets
* activate funnel tracking
* connect funnel analytics

---

# 13 — Failure Handling

If funnel incomplete:

```
project launch blocked
```

Project must not deploy without funnel.

---

# 14 — Execution Guarantee

This contract guarantees:

* every project has conversion funnel
* funnel measurable via analytics.md
* funnel optimizable via lifecycle.md

Funnel creation is automatic and mandatory.
