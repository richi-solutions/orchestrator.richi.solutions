# ideation-to-product.md

**Richi AI — Idea → Product Execution Contract**
Version: 1.0
Status: ACTIVE
Execution Mode: AGENT-EXECUTABLE
Agent: Lovable AI (planning) / Claude Code (implementation)

---

# 0 — Purpose

This document defines the deterministic transformation of an abstract idea into a fully specified, generator-ready product definition ("Product Spec").

This specification is used as the canonical input for the App Generator Agent.

The goal is to eliminate ambiguity and ensure that every idea can be converted into a production-ready product with consistent architecture and growth infrastructure.

---

# 1 — Execution Role

Agent Role: Product Architect Agent
(This role is assumed by the Lovable AI agent when the user submits an idea for transformation into a product specification.)

The agent must:

* analyze the idea
* resolve ambiguity
* infer missing elements using best practices
* produce a complete Product Spec
* ensure compatibility with the Richi Consumer-Pro framework

The agent must NOT ask questions.

The agent must make reasonable assumptions when necessary.

---

# 2 — Input Contract

Input must contain at minimum:

```
Idea:
[free-form description]
```

Optional input fields:

```
Target audience (optional)
Platform preference (optional)
Monetization preference (optional)
Constraints (optional)
Examples or references (optional)
```

---

# 3 — Output Contract (Product Spec)

The agent must output a complete Product Specification in the following structure.

This output is passed directly to the App Generator.

---

# 4 — Product Spec Structure

Return exactly this structure:

```
PRODUCT_SPEC:

1. Product Identity
   product_name:
   product_slug:
   tagline:
   one_sentence_description:

2. Problem Definition
   core_problem:
   current_alternatives:
   why_current_solutions_fail:

3. Target Audience
   primary_user_persona:
   secondary_personas:
   user_motivation:
   user_pain_level: (low | medium | high | extreme)

4. Solution Definition
   core_value_proposition:
   primary_outcome_for_user:
   time_to_value: (<1min | <5min | <1h | multi-session)

5. Core Features (MVP)
   feature_1:
   feature_2:
   feature_3:
   feature_4:
   feature_5:

6. Future Features (Post-MVP)
   expansion_feature_1:
   expansion_feature_2:
   expansion_feature_3:

7. Platform Surface
   frontend_type: (web_app | mobile_app | hybrid | content_site | tool)
   requires_auth: (true | false)
   requires_subscription: (true | false)
   offline_mode: (none | offline_light | offline_full)

8. Monetization Model
   monetization_type: (subscription | freemium | ads | one_time | hybrid | none)
   free_tier_definition:
   paid_tier_definition:
   value_metric:
   expected_price_range:

9. Growth Strategy

   Primary acquisition channels:
   acquisition_channel_1:
   acquisition_channel_2:
   acquisition_channel_3:

   Growth mechanism:
   (seo | viral | utility | creator-driven | paid | hybrid)

10. SEO Strategy

   SEO model:
   (programmatic | landing-page | content-driven | none)

   indexable page types:
   page_type_1:
   page_type_2:
   page_type_3:

   primary keyword categories:
   keyword_group_1:
   keyword_group_2:

11. Funnel Definition

   funnel_type:
   (direct_conversion | lead_capture | freemium_conversion | content_to_signup)

   funnel steps:

   step_1:
   step_2:
   step_3:
   step_4:

   activation trigger:
   conversion trigger:

12. Analytics Event Model

   required events:

   page_view
   landing_view
   signup_started
   signup_completed
   activation_completed
   feature_used
   conversion_started
   conversion_completed

   optional events:
   (defined based on product type)

13. App Generator Configuration

   app_type: (tool | platform | content_engine | hybrid)

   generator_modules_required:

   auth_module: (true | false)
   billing_module: (true | false)
   seo_module: (true | false)
   analytics_module: (true | false)
   funnel_module: (true | false)

14. Platform Classification

   product_category:
   (utility | media | productivity | ai_tool | creator_tool | platform | other)

   expected_complexity:
   (low | medium | high)

   scalability_target:
   (micro_product | scalable_product | platform_candidate)

15. Execution Priority

   MVP_scope_definition:

   must_have_features:
   feature_1:
   feature_2:
   feature_3:

   exclude_from_MVP:
   feature_1:
   feature_2:

16. Strategic Assessment

   defensibility_level: (low | medium | high)
   network_effect_potential: (none | low | medium | high)
   automation_potential: (low | medium | high | extreme)
   platform_expansion_potential: (low | medium | high)

```

---

# 5 — Agent Execution Rules

The agent must:

* resolve ambiguity autonomously
* prefer simple MVP scope over complex initial builds
* optimize for rapid deployment and validation
* ensure compatibility with Consumer-Pro standards

The agent must NOT:

* ask clarifying questions
* output incomplete specs
* output marketing text instead of structured definitions

---

# 6 — Generator Compatibility Guarantee

This output must be directly consumable by:

App Generator Agent
SEO Agent
Analytics Agent
Funnel Agent

No additional interpretation should be required.

---

# 7 — Example Input

```
Idea:
A tool that converts YouTube videos into summarized notes automatically.
```

---

# 8 — Example Output

```
PRODUCT_SPEC:

product_name: VideoNote
product_slug: videonote
tagline: Turn videos into structured knowledge
one_sentence_description: Converts long videos into concise structured notes instantly

...
```

---

# 9 — Execution Guarantee

This contract ensures that any valid idea can be transformed into a deterministic, generator-ready product specification compatible with the Richi AI Product Factory.

This is the root execution contract of the system.
