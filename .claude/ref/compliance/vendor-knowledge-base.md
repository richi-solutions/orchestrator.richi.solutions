# Vendor Knowledge Base — DPA, Transfer & AI Act Status

**Version:** 1.0.0
**Status:** ACTIVE
**Scope:** Reference for `privacy-reviewer` and `ai-act-reviewer` agents.

This document maps common SaaS vendors found in the Richi tech stack to their:
- Data Processing Agreement (DPA) mechanism
- Hosting region(s) and EU/EEA availability
- International transfer mechanism (DPF, SCCs)
- Detection signals in source code
- AI Act relevance (where applicable)

When a vendor is not listed here, the agent must:
1. Mark the vendor with status `Unverified — manual confirmation required`
2. Add it to the audit report under "Vendors requiring manual classification"

---

## Detection Methodology

For each vendor, the agent checks the following signals (in order):

1. **package.json** — explicit dependency or `@scope/<vendor>` import
2. **Environment variables** — vendor-specific names in `.env.example`, `vercel.json`, `supabase/config.toml`
3. **Code references** — import paths, API endpoints, client instantiation
4. **Configuration files** — `vercel.json`, `supabase/config.toml`, `next.config.js`, etc.

A vendor is considered included in the project when at least one signal is matched.

---

## Vendor Catalogue

### Hosting & Infrastructure

#### Vercel Inc.
- **Category:** Frontend hosting, edge network, serverless functions
- **Detection signals:** `vercel.json`, `.vercel/` directory, `@vercel/*` packages, `VERCEL_*` env vars
- **Default region:** Configurable; Frankfurt (`fra1`) for EU workloads
- **DPA:** Included in Vercel Customer ToS (https://vercel.com/legal/dpa)
- **International transfer:** EU-US Data Privacy Framework (Vercel is DPF-certified). SCCs as fallback inside Customer DPA.
- **User obligations:** Verify region setting includes EU presence for EU user data. No additional signature required for standard plans.

#### Supabase Inc.
- **Category:** Backend platform (Auth, Database, Storage, Edge Functions, Realtime)
- **Detection signals:** `supabase/` directory, `@supabase/*` packages, `SUPABASE_*` env vars
- **Default region:** User-selected at project creation (incl. EU regions: `eu-central-1`, `eu-west-2`)
- **DPA:** Included in Supabase Subscription Agreement (https://supabase.com/legal/dpa)
- **International transfer:** EU-US DPF where applicable; SCCs in Subscription Agreement
- **User obligations:** Confirm EU project region for EU user data. Document region choice.

#### Cloudflare Inc.
- **Category:** CDN, DNS, edge workers, R2 storage
- **Detection signals:** `wrangler.toml`, `@cloudflare/*` packages, `CLOUDFLARE_*` env vars
- **Default region:** Global edge network; data residency configurable for Enterprise
- **DPA:** Available at https://www.cloudflare.com/cloudflare-customer-dpa/ — must be executed
- **International transfer:** EU-US DPF (Cloudflare is DPF-certified) + SCCs
- **User obligations:** Execute DPA via dashboard (Profile → Privacy & Compliance).

#### GitHub Inc.
- **Category:** Source control, CI/CD (Actions)
- **Detection signals:** `.github/` directory, `git remote -v` shows `github.com`
- **Default region:** USA (multi-region replication)
- **DPA:** GitHub Customer DPA — execute in Organization Settings → Privacy
- **International transfer:** EU-US DPF (Microsoft is DPF-certified) + SCCs
- **User obligations:** Sign GitHub Customer DPA at organization level. Required even for free accounts when storing personal data.

---

### AI / Machine Learning

#### OpenAI L.L.C.
- **Category:** LLM inference (GPT models), embeddings, image generation
- **Detection signals:** `openai` package, `OPENAI_API_KEY`, imports from `openai`
- **Default region:** USA (multi-region: us-east, us-west). EU residency available via Azure OpenAI Service.
- **DPA:** Execute via OpenAI Console (Settings → Organization → Compliance → Data Processing Addendum)
- **International transfer:** EU-US DPF (OpenAI L.L.C. is DPF-certified) + SCCs in DPA
- **User obligations:**
  1. Sign DPA in OpenAI Console
  2. Enable Zero Data Retention (ZDR) via API support request for sensitive data
  3. Confirm "API data is not used for training" setting (default since March 2023)
- **AI Act relevance:** OpenAI is a GPAI provider. Deployers inherit transparency obligations under Art. 50.

#### Anthropic, PBC
- **Category:** LLM inference (Claude models)
- **Detection signals:** `@anthropic-ai/sdk` package, `ANTHROPIC_API_KEY`, imports from `@anthropic-ai/sdk`
- **Default region:** USA. EU residency via AWS Bedrock (Frankfurt) or Google Cloud Vertex AI.
- **DPA:** Execute via Anthropic Console (Settings → Compliance) or contact compliance@anthropic.com
- **International transfer:** EU-US DPF (Anthropic is DPF-certified) + SCCs
- **User obligations:**
  1. Sign DPA via Console
  2. API data is not used for training by default — verify in Privacy Policy
  3. For EU residency, route via AWS Bedrock (eu-central-1) or Vertex AI
- **AI Act relevance:** Anthropic is a GPAI provider. Deployer obligations apply under Art. 50.

#### Replicate, Inc.
- **Category:** ML model hosting (image, video, audio generation)
- **Detection signals:** `replicate` package, `REPLICATE_API_TOKEN`
- **Default region:** USA
- **DPA:** Available on request; contact privacy@replicate.com
- **International transfer:** SCCs required (Replicate is not DPF-listed as of last review — verify current status at https://www.dataprivacyframework.gov/list)
- **User obligations:** Request and execute DPA. Conduct Transfer Impact Assessment (TIA) for EU user data.
- **AI Act relevance:** Provides access to multiple GPAI and specialised models. Deployer must classify use-case and assess transparency obligations per model used.

#### Hugging Face, Inc.
- **Category:** Model hosting, inference API, datasets
- **Detection signals:** `@huggingface/inference`, `HF_TOKEN`, imports from `huggingface`
- **Default region:** USA; EU inference endpoints available
- **DPA:** Available at https://huggingface.co/terms-of-service — execute via account settings
- **International transfer:** SCCs in DPA; verify DPF status
- **User obligations:** Sign DPA. Document specific models used (each may have own licence and AI Act classification).
- **AI Act relevance:** Aggregator of GPAI and specialised models. Per-model assessment required.

#### Mistral AI
- **Category:** LLM inference
- **Detection signals:** `@mistralai/mistralai` package, `MISTRAL_API_KEY`
- **Default region:** EU (Paris, France) — primary advantage for EU compliance
- **DPA:** Included in Terms of Service (https://mistral.ai/terms/) — French DPA available on request
- **International transfer:** Not applicable for EU-only routing
- **User obligations:** Confirm EU-only API endpoint usage. Sign DPA.
- **AI Act relevance:** EU-based GPAI provider. Likely simplifies AI Act compliance for EU deployers.

---

### Payments

#### Stripe Inc.
- **Category:** Payment processing, subscriptions, invoicing
- **Detection signals:** `stripe` or `@stripe/stripe-js` package, `STRIPE_*` env vars
- **Default region:** USA + Ireland (Stripe Payments Europe Ltd. for EU customers)
- **DPA:** Included in Stripe Services Agreement (https://stripe.com/legal/dpa)
- **International transfer:** EU-US DPF (Stripe is DPF-certified) + SCCs in DPA
- **User obligations:** Confirm EU customers are routed through Stripe Payments Europe Ltd. (automatic based on customer location).

#### Lemon Squeezy
- **Category:** Merchant of record, payment processing
- **Detection signals:** `@lemonsqueezy/lemonsqueezy.js` package, `LEMONSQUEEZY_*` env vars
- **Default region:** USA
- **DPA:** Available at https://www.lemonsqueezy.com/dpa — execute via account
- **International transfer:** SCCs in DPA
- **User obligations:** As merchant of record, Lemon Squeezy assumes some controller obligations. Document this in subprocessor list.

#### Paddle.com Market Limited
- **Category:** Merchant of record, payment processing
- **Detection signals:** `@paddle/paddle-js` package, `PADDLE_*` env vars
- **Default region:** UK + USA
- **DPA:** Included in Paddle Services Agreement (https://www.paddle.com/legal/dpa)
- **International transfer:** UK-EU adequacy + SCCs for non-UK transfers
- **User obligations:** Standard ToS coverage. Verify region routing.

---

### Email & Notifications

#### Resend Inc.
- **Category:** Transactional email
- **Detection signals:** `resend` package, `RESEND_API_KEY`
- **Default region:** USA; EU region available
- **DPA:** Available at https://resend.com/legal/dpa — execute via account settings
- **International transfer:** EU-US DPF where applicable; SCCs in DPA
- **User obligations:** Sign DPA. Use EU region for EU recipient data where possible.

#### SendGrid (Twilio Inc.)
- **Category:** Transactional and marketing email
- **Detection signals:** `@sendgrid/mail` package, `SENDGRID_API_KEY`
- **Default region:** USA
- **DPA:** Twilio DPA covers SendGrid (https://www.twilio.com/legal/data-protection-addendum)
- **International transfer:** EU-US DPF (Twilio is DPF-certified) + SCCs
- **User obligations:** Execute DPA via Twilio Console.

#### Postmark (ActiveCampaign)
- **Category:** Transactional email
- **Detection signals:** `postmark` package, `POSTMARK_*` env vars
- **Default region:** USA
- **DPA:** Available on request; standard SCCs included
- **International transfer:** SCCs
- **User obligations:** Request DPA via support.

#### Loops
- **Category:** Transactional and lifecycle email
- **Detection signals:** `loops` package, `LOOPS_API_KEY`
- **Default region:** USA
- **DPA:** Available on request via support
- **International transfer:** SCCs in DPA
- **User obligations:** Request and execute DPA.

#### Twilio Inc. (SMS / Voice)
- **Category:** SMS, voice, WhatsApp messaging
- **Detection signals:** `twilio` package, `TWILIO_*` env vars
- **Default region:** USA + Ireland
- **DPA:** Included in Twilio Customer Agreement
- **International transfer:** EU-US DPF + SCCs
- **User obligations:** Execute DPA. TCPA (USA) consent management is the customer's responsibility.

---

### Analytics & Observability

#### PostHog Inc.
- **Category:** Product analytics, session replay, feature flags
- **Detection signals:** `posthog-js` or `posthog-node` package, `POSTHOG_*` env vars
- **Default region:** USA cloud or EU cloud (https://eu.posthog.com)
- **DPA:** Included in Terms (https://posthog.com/terms) + signed addendum on request
- **International transfer:** EU-US DPF + SCCs (USA cloud); not applicable for EU cloud
- **User obligations:** Use EU cloud for EU user data. Configure session replay PII masking. Document tracked events.

#### Sentry (Functional Software, Inc.)
- **Category:** Error monitoring, performance, logging
- **Detection signals:** `@sentry/*` packages, `SENTRY_*` env vars
- **Default region:** USA cloud or EU cloud
- **DPA:** Available at https://sentry.io/legal/dpa — execute via Settings → Legal & Compliance
- **International transfer:** EU-US DPF + SCCs (USA cloud); not applicable for EU cloud
- **User obligations:**
  1. Execute DPA
  2. Enable PII data scrubbing (Settings → Security & Privacy → Data Scrubbing)
  3. Use EU cloud for EU user data where required
  4. Set `sendDefaultPii: false` in SDK initialisation

#### Google Analytics 4 (Alphabet Inc.)
- **Category:** Web analytics
- **Detection signals:** `gtag.js`, `react-ga4` package, `GA_MEASUREMENT_ID`, `G-` prefixed IDs
- **Default region:** USA
- **DPA:** Google Ads Data Processing Terms (https://privacy.google.com/businesses/processorterms/) — accept in Admin → Account Settings
- **International transfer:** EU-US DPF (Google is DPF-certified) + SCCs
- **User obligations:**
  1. Accept Data Processing Terms in GA4 Admin
  2. Enable IP Anonymisation (default in GA4)
  3. Configure data retention (default 14 months)
  4. Implement Consent Mode v2 for EU traffic (mandatory since March 2024)
  5. Document on cookie banner

#### Plausible Analytics
- **Category:** Privacy-first web analytics
- **Detection signals:** `plausible-tracker` package, `<script src="https://plausible.io/js/...">`
- **Default region:** EU (Frankfurt) — self-described as GDPR-compliant by design
- **DPA:** Available at https://plausible.io/dpa — execute via account settings
- **International transfer:** Not applicable (EU-only hosting)
- **User obligations:** Sign DPA. Cookie banner not required if Plausible is sole tracker (no personal data processed).

#### Umami (self-hosted or cloud)
- **Category:** Privacy-first web analytics
- **Detection signals:** `@umami/*` packages, Umami script tag
- **Default region:** Self-hosted (operator's choice) or Umami Cloud (USA)
- **DPA:** For Umami Cloud: available on request. Self-hosted: not applicable (operator is controller).
- **International transfer:** Depends on hosting choice
- **User obligations:** Document hosting region. For self-hosted: cookie banner not required if no personal data is collected.

#### Mixpanel
- **Category:** Product analytics
- **Detection signals:** `mixpanel-browser` package, `MIXPANEL_*` env vars
- **Default region:** USA or EU residency (Enterprise plan)
- **DPA:** Available at https://mixpanel.com/legal/dpa — execute via account
- **International transfer:** EU-US DPF + SCCs
- **User obligations:** Execute DPA. Configure data retention. Use EU residency for EU user data where contractually possible.

---

### Authentication

#### Clerk Inc.
- **Category:** Authentication, user management
- **Detection signals:** `@clerk/*` packages, `CLERK_*` env vars
- **Default region:** USA
- **DPA:** Available at https://clerk.com/legal/dpa — execute via dashboard
- **International transfer:** EU-US DPF + SCCs
- **User obligations:** Sign DPA. Document use as identity processor.

#### Auth0 (Okta, Inc.)
- **Category:** Authentication, identity management
- **Detection signals:** `@auth0/*` packages, `AUTH0_*` env vars
- **Default region:** USA, EU, AU, JP (selectable at tenant creation)
- **DPA:** Included in Okta Master Subscription Agreement
- **International transfer:** EU-US DPF + SCCs
- **User obligations:** Confirm EU tenant region for EU user data. Execute DPA.

#### WorkOS, Inc.
- **Category:** SSO, SCIM, enterprise auth
- **Detection signals:** `@workos-inc/node` package, `WORKOS_*` env vars
- **Default region:** USA
- **DPA:** Available at https://workos.com/legal/dpa
- **International transfer:** SCCs in DPA
- **User obligations:** Execute DPA.

#### Kinde
- **Category:** Authentication, user management
- **Detection signals:** `@kinde-oss/*` packages, `KINDE_*` env vars
- **Default region:** USA, EU, AU regions available
- **DPA:** Available at https://kinde.com/dpa — execute via account
- **International transfer:** SCCs; DPF status to verify
- **User obligations:** Use EU region for EU users. Execute DPA.

---

### Search & Other

#### Algolia, Inc.
- **Category:** Search-as-a-service
- **Detection signals:** `algoliasearch` package, `ALGOLIA_*` env vars
- **Default region:** Multi-region; EU regions available
- **DPA:** Available at https://www.algolia.com/policies/dpa/
- **International transfer:** EU-US DPF + SCCs
- **User obligations:** Use EU region for EU user data. Execute DPA.

#### Meilisearch
- **Category:** Search engine (self-hosted or Meilisearch Cloud)
- **Detection signals:** `meilisearch` package, `MEILI_*` env vars
- **Default region:** Self-hosted: operator's choice. Cloud: EU + USA available.
- **DPA:** Cloud: available at https://www.meilisearch.com/legal/dpa
- **International transfer:** Depends on hosting
- **User obligations:** Document region. Self-hosted: operator is controller, no third-party DPA needed.

#### Pusher / Ably
- **Category:** Realtime messaging
- **Detection signals:** `pusher` / `ably` packages
- **Default region:** Multi-region
- **DPA:** Available on request from each vendor
- **International transfer:** SCCs
- **User obligations:** Execute DPA. Document region routing.

---

## AI Act Quick-Reference: GPAI Providers

The following vendors qualify as General-Purpose AI (GPAI) providers under the EU AI Act, triggering deployer obligations for the integrating party:

| Vendor | GPAI Status | Deployer Obligations Triggered |
|---|---|---|
| OpenAI L.L.C. | GPAI provider (GPT-4, GPT-4o, o-series) | Art. 50 transparency, Art. 26 deployer duties |
| Anthropic, PBC | GPAI provider (Claude family) | Art. 50 transparency, Art. 26 deployer duties |
| Mistral AI | GPAI provider (EU-based) | Art. 50 transparency, Art. 26 deployer duties |
| Google (Gemini API) | GPAI provider | Art. 50 transparency, Art. 26 deployer duties |
| Meta (Llama via API) | GPAI provider (when deployed via inference API) | Art. 50 transparency, Art. 26 deployer duties |
| Hugging Face | Aggregator — assess per model | Per-model classification required |
| Replicate | Aggregator — assess per model | Per-model classification required |

For each vendor identified in the project, the `ai-act-reviewer` agent must:
1. Determine whether the use is provider-side or deployer-side
2. Map each AI use-case to the appropriate risk class
3. Document Art. 50 transparency measures where applicable

---

## Maintenance Note

This catalogue is a living reference. When a new vendor is encountered:
1. Add an entry following the existing structure
2. Verify DPF status at https://www.dataprivacyframework.gov/list
3. Confirm DPA URL and execution mechanism via vendor documentation
4. Bump the document version (MINOR for additions, MAJOR for restructuring)
5. Append a Change History entry above the catalogue
