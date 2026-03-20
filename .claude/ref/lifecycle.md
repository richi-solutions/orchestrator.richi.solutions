# lifecycle.md

**Richi AI — Product Lifecycle Orchestration Contract**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Agent: Claude Code (implementation) / Lovable (optional prototyping)

---

# 0 — Purpose

This document defines the deterministic lifecycle of every product created within the Richi AI ecosystem.

It specifies:

* lifecycle phases
* execution order
* agent responsibilities
* input/output contracts
* activation conditions
* system orchestration rules

This lifecycle ensures that any idea can be transformed into a live, scalable product within the Richi AI ecosystem.

This document is executed by the Lifecycle Orchestrator Agent.

---

# 1 — Lifecycle Overview

Every product passes through exactly these phases:

```
Phase 0 — Ideation
Phase 1 — Product Specification
Phase 2 — App Generation
Phase 3 — Deployment
Phase 4 — Growth Activation
Phase 5 — Optimization
Phase 6 — Platform Integration (optional)
```

Each phase has strict entry and exit conditions.

No phase may be skipped.

---

# 2 — Phase Definitions

---

# Phase 0 — Ideation

Purpose:
Capture initial product idea.

Input:

```
idea_input:
  description: string
  optional_metadata: object
```

Agent:
Idea Intake Agent

Output:

```
idea_record:
  idea_id
  timestamp
  raw_input
```

Exit Condition:
idea_record stored

Next Phase:
Phase 1 — Product Specification

---

# Phase 1 — Product Specification

Purpose:
Transform idea into generator-ready Product Spec.

Agent:
Product Architect Agent

Execution Contract:
ideation-to-product.md

Input:

```
idea_record
```

Output:

```
product_spec
```

Storage Location:

```
/products/{product_slug}/product-spec.json
```

Exit Condition:
valid product_spec generated

Next Phase:
Phase 2 — App Generation

---

# Phase 2 — App Generation

Purpose:
Generate complete production-ready app.

Agent:
App Generator Agent

Execution Contracts:

* Richi Development Framework (RDF)
* UI/UX Guide
* Legal Pages Contract
* product_spec

Input:

```
product_spec
```

Output:

```
app_instance:
  frontend
  backend
  database_schema
  auth_integration
  billing_integration
```

Storage Location:

```
/apps/{product_slug}/
```

Exit Condition:
app_instance fully generated

Next Phase:
Phase 3 — Deployment

---

# Phase 3 — Deployment

Purpose:
Deploy app to production environment.

Agent:
Deployment Agent

Input:

```
app_instance
```

Output:

```
live_app_instance
```

Deployment Targets:

* React + Vite + Vercel + Supabase Cloud
* custom domain (optional)
* mobile deployment (optional)

Exit Condition:
app accessible via public URL

Next Phase:
Phase 4 — Growth Activation

---

# Phase 4 — Growth Activation

Purpose:
Activate growth infrastructure.

Agent:
Growth Activation Agent

Execution Contracts:

* seo.md
* analytics.md
* funnel.md

Input:

```
live_app_instance
product_spec
```

Output:

SEO Infrastructure:

```
seo_pages
metadata
sitemap
internal linking structure
```

Analytics Infrastructure:

```
event_tracking
analytics_interface
```

Funnel Infrastructure:

```
landing_pages
conversion_flows
CTA structure
activation triggers
```

Exit Condition:
growth infrastructure active

Next Phase:
Phase 5 — Optimization

---

# Phase 5 — Optimization

Purpose:
Continuously improve product performance.

Agent:
Optimization Agent

Input:

```
analytics_data
funnel_data
user_behavior_data
```

Output:

```
optimization_actions
```

Examples:

* conversion optimization
* UX improvements
* feature prioritization
* funnel adjustments

Execution Frequency:

continuous

Exit Condition:

none (continuous phase)

Next Phase:

Phase 6 optional

---

# Phase 6 — Platform Integration (Optional)

Purpose:

Integrate successful app into platform-level systems.

Activation Condition:

```
if:
  user_count > threshold
  OR
  revenue > threshold
  OR
  strategic importance high
```

Agent:

Platform Integration Agent

Output:

```
platform-integrated product
```

Possible Actions:

* expose APIs
* enable cross-product integrations
* enable network effects

Exit Condition:

product classified as platform asset

---

# 3 — Agent Execution Order

The sequential execution is controlled by the user. Each phase is triggered by the user as an instruction to the AI agent (Claude Code). The agent does not advance phases autonomously.

Strict execution order:

```
Idea Intake Agent
→ Product Architect Agent
→ App Generator Agent
→ Deployment Agent
→ Growth Activation Agent
→ Optimization Agent
→ Platform Integration Agent (optional)
```

All agent roles are executed by the AI agent (Claude Code) on user request.

Agents must execute sequentially.

Parallel execution is not allowed unless explicitly defined.

---

# 4 — Failure Handling

If any phase fails:

```
retry_count = 3
```

If retry fails:

```
mark phase as failed
pause lifecycle
notify system
```

Manual intervention allowed.

---

# 5 — State Model

Each product must maintain lifecycle state:

```
product_state:

IDEA_CAPTURED
SPEC_GENERATED
APP_GENERATED
DEPLOYED
GROWTH_ACTIVE
OPTIMIZING
PLATFORM_INTEGRATED
```

State must be persisted.

---

# 6 — Lifecycle Execution Guarantee

This lifecycle guarantees deterministic transformation:

Idea → Product → Live App → Growth → Platform Asset

This lifecycle is the execution backbone of the Richi AI Product Factory.

---

# 7 — Compatibility

This lifecycle is compatible with:

* ideation-to-product.md
* Richi Development Framework (RDF)
* SEO Contract
* Analytics Contract
* Funnel Contract

---

# 8 — Orchestrator Authority

This document has highest authority over product execution order.

Agents must obey lifecycle phase sequencing.

No phase execution outside defined lifecycle is permitted.
