# seo.md

**Richi AI — SEO Execution Contract**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Agent: Claude Code (implementation) / Lovable (optional prototyping)
Authority: GROWTH-INFRASTRUCTURE

---

# 0 — Purpose

This document defines the deterministic SEO architecture and execution contract for every product in the Richi AI ecosystem.

It ensures:

* automatic generation of indexable pages
* automatic metadata generation
* automatic sitemap creation
* compatibility with analytics.md and funnel.md
* SEO readiness without manual SEO work

The SEO system converts search traffic into funnel entry points.

---

# 1 — SEO Ownership Model

| Component           | Owner              |
| ------------------- | ------------------ |
| SEO page generation | Project Generator  |
| Metadata generation | Project Generator  |
| Page indexing       | Search engines     |
| SEO analytics       | Analytics backend  |
| SEO optimization    | Optimization Agent |

Project owns page execution.

---

# 2 — SEO Models

Project Generator must select one or more SEO models based on product_spec:

```
landing_page_seo
programmatic_seo
content_seo
tool_seo
hybrid_seo
```

Definitions:

landing_page_seo
Single optimized landing page.

programmatic_seo
Many auto-generated pages targeting specific keywords.

content_seo
Article-based SEO.

tool_seo
Pages targeting tool usage keywords.

hybrid_seo
Combination of multiple models.

---

# 3 — Required SEO Page Types

Every project must generate at minimum:

Primary landing page:

```
/
```

Supporting SEO pages:

```
/use-cases/[slug]
/solutions/[slug]
/features/[slug]
```

Optional programmatic pages:

```
/tool/[keyword]
/generator/[keyword]
/convert/[keyword]
```

Page count determined by Product Architect Agent.

---

# 4 — Page Structure Contract

Each SEO page must include:

```
H1 headline
value proposition
description
CTA (from funnel.md)
structured content sections
internal links
metadata
```

Page must not be empty shell.

Page must contain meaningful content.

---

# 5 — Metadata Contract

Each page must generate metadata:

```
title
description
canonical_url
open_graph_title
open_graph_description
open_graph_image
twitter_card
```

Example:

```
<title>AI Story Generator — Create Stories Instantly</title>

<meta name="description" content="Generate unique stories instantly using AI. Free and fast.">
```

Metadata must be keyword optimized.

---

# 6 — URL Structure Contract

All URLs must follow structure:

```
https://{product-domain}/{page-type}/{keyword-slug}
```

Example:

```
/tool/ai-story-generator
/use-cases/content-creation
/solutions/youtube-creators
```

URLs must be human-readable.

---

# 7 — Sitemap Contract

Project must generate:

```
/sitemap.xml
```

Sitemap must include:

```
all SEO pages
landing pages
use case pages
tool pages
```

Sitemap must auto-update when pages added.

---

# 8 — Robots Contract

Project must generate:

```
/robots.txt
```

Default rules:

```
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /auth/
```

---

# 9 — Internal Linking Contract

Each SEO page must link to:

```
landing page
related SEO pages
conversion entry points
```

Internal linking required for crawlability.

---

# 10 — Structured Data Contract (Schema.org)

Each page must include structured data:

Example:

```
SoftwareApplication
WebApplication
Product
Article
FAQPage
```

JSON-LD format required.

Example:

```
{
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 "name": "AI Story Generator",
 "applicationCategory": "Utility"
}
```

---

# 11 — Funnel Integration Contract

Each SEO page must include:

Primary CTA:

```
Start now
Try free
Generate now
```

CTA must link to funnel entry point.

Integration required with funnel.md.

---

# 12 — Analytics Integration Contract

Each SEO page must emit analytics events:

Required events:

```
page_view
landing_view
conversion_started
conversion_completed
```

Events sent via analytics.md contract.

---

# 13 — Page Generation Rules

Project Generator must generate pages based on:

product_spec:

```
target audience
use cases
features
keyword groups
```

Product Architect Agent determines keyword groups.

---

# 14 — Indexability Rules

SEO pages must be:

```
server-rendered OR statically generated
```

Pages must not rely solely on client-side rendering.

Required for search engine indexing.

---

# 15 — Canonical Authority

Each page must define canonical URL.

Prevent duplicate content issues.

---

# 16 — Lifecycle Integration

SEO generation occurs in lifecycle phase:

Phase 5 — Growth Activation

Agent:

Growth Activation Agent

Execution:

```
generate SEO pages
generate metadata
generate sitemap
connect analytics
connect funnel entry points
```

---

# 17 — Optimization Agent Authority

Optimization Agent may:

```
create new SEO pages
modify metadata
modify linking structure
expand keyword coverage
```

Project must accept optimization instructions.

---

# 18 — Minimum SEO Requirements

Project must launch with minimum:

```
1 landing page
3 supporting SEO pages
metadata
sitemap
robots.txt
```

Launch blocked if requirements not met.

---

# 19 — Platform Intelligence Layer

Analytics backend aggregates SEO performance:

```
traffic volume
conversion rates per page
keyword performance
page performance
```

Optimization Agent uses data to expand SEO footprint.

---

# 20 — Execution Guarantee

This contract guarantees:

* automatic SEO readiness
* automatic traffic acquisition capability
* compatibility with funnel.md and analytics.md
* compatibility with lifecycle.md
* compatibility with ideation-to-product.md

SEO activation is automatic and mandatory.
