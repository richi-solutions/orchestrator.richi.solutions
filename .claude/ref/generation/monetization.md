# Monetization Architecture Contract

**Version:** 2.0
**Status:** ACTIVE
**Authority:** RDF GENERATION CONTRACT
**Depends on:** `rules/core/rdf.md` (ROOT AUTHORITY)

---

## 1 --- Purpose

Defines the architecture for cross-platform monetization using
**Supabase as Single Source of Truth** (SSOT). Supports Stripe (Web),
Apple App Store, and Google Play as payment providers --- all syncing
into one unified subscription model.

**Design principle:** Supabase is SSOT. RevenueCat handles mobile
billing (Apple + Google) as a managed abstraction layer, eliminating
receipt validation, JWS chain verification, and provider-specific
webhook plumbing. Stripe handles web billing directly.

**Why RevenueCat (v2.0 change):** Direct Apple StoreKit 2 + Google
Play Billing integration requires maintaining receipt validation,
two separate webhook handlers (ASSN V2 + RTDN via Pub/Sub),
provider-specific OAuth flows, and tracking format changes across
every WWDC / Google I/O. RevenueCat abstracts all of this behind one
SDK and one webhook format. Cost: $0 until $2.5k MTR, then 1%.

**Vendor-exit strategy:** RevenueCat is a convenience layer, not a
lock-in. The universal identifiers (`original_transaction_id` for
Apple, `purchase_token` for Google) are stored in `user_subscriptions`
and belong to us. To exit:
1. Replace `react-native-purchases` with `react-native-iap` in the mobile client.
2. Replace the single `revenuecat-webhook` with separate `apple-webhook` (ASSN V2) and
   `google-webhook` (RTDN) edge functions.
3. Set `APPLE_SHARED_SECRET` + `GOOGLE_SERVICE_ACCOUNT_JSON` in edge function secrets.
4. No DB migration needed --- the `user_subscriptions` schema is provider-agnostic.

---

## 2 --- Architecture Overview

```
+-------------------------------------------------------------+
|                    Supabase (SSOT)                           |
|  +-----------------------+  +-------------+  +--------+     |
|  | user_subscriptions    |  | entitlements |  |  auth  |     |
|  +-----------------------+  +-------------+  +--------+     |
+-----+----------------+----------------+-------------+--------+
      |                |                              |
      v                v                              v
+----------+   +-----------------+               +----------+
| Stripe   |   | RevenueCat      |               | Clients  |
| Webhook  |   | Webhook (single)|               | (check)  |
+----------+   +-----------------+               +----------+
      ^                ^                              |
      |                |                              v
+----------+   +-----------------+               +----------+
| Stripe   |   | RevenueCat SDK  |               | Web App  |
| Checkout |   | (iOS + Android) |               | Mobile   |
+----------+   +-----------------+               +----------+
                    |         |
              +----------+ +-----------+
              | StoreKit | | Play      |
              | 2 (iOS)  | | Billing   |
              +----------+ +-----------+
```

**Flow:**

1. **Web:** User purchases via Stripe Checkout. Stripe webhook writes to `user_subscriptions`.
2. **Mobile:** User purchases via RevenueCat SDK. RevenueCat handles receipt
   validation with Apple/Google. RevenueCat webhook fires our `revenuecat-webhook`
   edge function, which normalizes the event and writes to `user_subscriptions`.
3. All clients check entitlements via Supabase (`check-subscription` edge function
   or direct RLS-protected query).
4. `user_id` from Supabase Auth is the universal linking key. RevenueCat receives
   it as `appUserID` during `Purchases.configure()`.

---

## 3 --- Data Model

### 3.1 Subscription Table

One active subscription per user. Source of truth for billing status.

The table name is project-specific (`user_subscriptions` or `subscriptions`).
The column set is the contract --- names may vary slightly per project.

**Required columns:**

| Column | Type | Purpose |
|--------|------|---------|
| `user_id` | UUID (FK auth.users, UNIQUE) | Universal linking key |
| `tier` | TEXT or ENUM | `'free'` / `'basic'` / `'pro'` |
| `subscription_source` | TEXT or ENUM | `'stripe'` / `'apple'` / `'google'` / `'manual'` / `'referral'` |
| `provider_customer_id` | TEXT (nullable) | Stripe `cus_xxx`, Apple `originalTransactionId`, Google `orderId` |
| `provider_subscription_id` | TEXT (nullable) | Stripe `sub_xxx`, Apple `originalTransactionId`, Google `purchaseToken` |
| `status` | TEXT | `'active'` / `'trialing'` / `'past_due'` / `'canceled'` / `'expired'` |
| `current_period_start` | TIMESTAMPTZ | Billing period start |
| `current_period_end` | TIMESTAMPTZ | Billing period end (NULL for lifetime) |
| `cancel_at_period_end` | BOOLEAN | User intends to cancel |
| `will_renew` | BOOLEAN | Auto-renewal active |
| `created_at` | TIMESTAMPTZ | Row creation |
| `updated_at` | TIMESTAMPTZ | Last modification (auto via trigger) |

**RLS:**
- SELECT: `auth.uid() = user_id` (users see own)
- INSERT/UPDATE/DELETE: service_role only (via edge functions)

**Audit trail:** `subscription_events` table logs every webhook event
with `user_id`, `subscription_source`, `event_type`, `provider_event_id`,
`payload` (JSONB). Same RLS pattern.

### 3.2 Entitlement Resolution

Entitlements are derived from the active subscription, not stored separately:

```sql
SELECT tier, status, current_period_end, cancel_at_period_end
FROM user_subscriptions
WHERE user_id = $1
  AND status IN ('active', 'trialing')
  AND (current_period_end > now() OR current_period_end IS NULL);
```

If no row matches, user is on `free` tier.

### 3.3 Zod Contracts

```typescript
import { z } from "zod";

export const EntitlementSchema = z.object({
  plan: z.string(),
  features: z.array(z.string()),
  status: z.enum(["active", "trialing", "past_due", "canceled", "expired", "none"]),
  expiresAt: z.string().datetime().nullable(),
  willCancel: z.boolean(),
});

export type Entitlement = z.infer<typeof EntitlementSchema>;
```

---

## 4 --- Edge Function Patterns

### 4.1 Stripe Webhook Handler (Web)

Uses `stripe.webhooks.constructEvent()` for signature verification. Handles:
- `checkout.session.completed` --- upsert subscription
- `customer.subscription.updated` --- sync status changes
- `customer.subscription.deleted` --- mark expired
- `invoice.payment_failed` --- mark past_due

Resolves `user_id` from `session.metadata.user_id` (checkout) or by
looking up the existing row via `stripe_customer_id` (updates/deletions).

### 4.2 RevenueCat Webhook Handler (Mobile)

**Replaces** the separate Apple ASSN V2 and Google RTDN handlers from v1.0.
RevenueCat sends a single, normalized webhook for ALL mobile stores.

```typescript
// supabase/functions/revenuecat-webhook/index.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/edgeConfig.ts";
import { edgeLogger } from "../_shared/edgeLogger.ts";
import { timingSafeEqual } from "../_shared/securityUtils.ts";

const PRODUCT_TIER_MAP: Record<string, "basic" | "pro"> = {
  moviemind_basic_monthly: "basic",
  moviemind_basic_yearly: "basic",
  moviemind_pro_monthly: "pro",
  moviemind_pro_yearly: "pro",
};

// RevenueCat event types -> internal status
const EVENT_STATUS_MAP: Record<string, string> = {
  INITIAL_PURCHASE: "active",
  RENEWAL: "active",
  PRODUCT_CHANGE: "active",
  CANCELLATION: "active",   // still active until period end
  UNCANCELLATION: "active",
  BILLING_ISSUE: "past_due",
  SUBSCRIBER_ALIAS: "active",
  SUBSCRIPTION_PAUSED: "paused",
  TRANSFER: "active",
  EXPIRATION: "expired",
  REFUND: "expired",
};

serve(async (req: Request): Promise<Response> => {
  // ... verify Authorization header via timingSafeEqual
  // ... parse event body
  // ... map event.type -> status, event.product_id -> tier
  // ... upsert user_subscriptions WHERE user_id = event.app_user_id
  // ... insert subscription_events for audit trail
  // ... return 200 { received: true }
});
```

Key differences from direct integration:
- **One handler** instead of two (Apple + Google)
- **No receipt validation** --- RevenueCat already validated before sending the webhook
- **No OAuth flows** --- no Google service account JWT, no Apple JWS chain verification
- **Simpler user resolution** --- `event.app_user_id` is always the Supabase user_id

### 4.3 Entitlement Check Function

Unchanged. Queries `user_subscriptions` for the authenticated user's active
subscription. Returns `{ ok: true, data: Entitlement }`. Called by both
web and mobile clients via `check-subscription`.

---

## 5 --- Cross-Platform Sync

### 5.1 Linking Mechanism

| Platform | How user_id is passed | Where it ends up |
|----------|----------------------|------------------|
| **Stripe** | `metadata.user_id` on Checkout Session | Stripe webhook reads it on `checkout.session.completed` |
| **RevenueCat (iOS + Android)** | `Purchases.configure({ appUserID: supabaseUserId })` | RevenueCat webhook sends it as `app_user_id` |

**Requirement:** All client implementations MUST pass the Supabase `user_id`.

### 5.2 Conflict Resolution

If a user has subscriptions on multiple providers: take the highest-tier
active subscription. The `check-subscription` function handles this by
querying with `status IN ('active', 'trialing')` and returning the
highest tier.

### 5.3 Grace Periods

| Provider | Grace Period | Behavior |
|----------|-------------|----------|
| **Stripe** | Configurable (default: 3 retries over ~2 weeks) | Status: `past_due` |
| **Apple (via RevenueCat)** | 6-16 days (Apple manages) | RevenueCat event: `BILLING_ISSUE` |
| **Google (via RevenueCat)** | 3-7 days (configurable) | RevenueCat event: `BILLING_ISSUE` |

During grace period, subscription status is `past_due`. Entitlement check
treats `past_due` as **not active**.

---

## 6 --- Client-Side Patterns

### 6.1 Mobile: RevenueCat SDK (React Native)

```typescript
// Initialization (in providers.tsx or app root)
import Purchases from 'react-native-purchases';

await Purchases.configure({
  apiKey: Platform.OS === 'ios'
    ? REVENUECAT_IOS_KEY
    : REVENUECAT_ANDROID_KEY,
  appUserID: supabaseUserId,
});

// Purchase flow
const offerings = await Purchases.getOfferings();
const pkg = offerings.current?.availablePackages[0];
const { customerInfo } = await Purchases.purchasePackage(pkg);
// RevenueCat validates receipt, fires webhook -> DB updated.
// Refresh subscription store to pick up the change.

// Restore flow
const { customerInfo } = await Purchases.restorePurchases();
```

### 6.2 Web: Stripe Checkout

Unchanged. `edgeFunctionsService.createCheckout({ tier, billingCycle })`
-> open hosted Stripe URL -> `subscriptionStore.refresh()` on return.

### 6.3 Purchase Facade Pattern

The mobile app uses a `purchase.facade.ts` that abstracts the provider:

```typescript
export const purchaseFacade = {
  async subscribe(tier, cycle): Promise<Result<void>>,
  async restore(): Promise<Result<number>>,
  async manageSubscription(source): Promise<Result<{ action: ManageAction }>>,
};
```

This allows swapping RevenueCat for direct integration without changing the UI layer.

---

## 7 --- Environment Variables

### 7.1 Required (Stripe --- Web)

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...  # client-side only
```

### 7.2 Required (RevenueCat --- Mobile)

```
# Edge Function secret (webhook auth)
REVENUECAT_WEBHOOK_SECRET=<from RevenueCat Dashboard>

# Client-side (mobile app config / env)
REVENUECAT_IOS_API_KEY=appl_...
REVENUECAT_ANDROID_API_KEY=goog_...
```

### 7.3 Store-Specific (set in RevenueCat Dashboard, NOT in Supabase)

RevenueCat manages the Apple/Google credentials itself:
- Apple: App-Specific Shared Secret (from App Store Connect)
- Google: Service Account JSON (from Google Cloud Console)

These credentials are **not** needed in Supabase edge function secrets.

---

## 8 --- Analytics Events

| Event | Trigger | Required Fields |
|-------|---------|-----------------|
| `subscription_started` | New subscription created | provider, plan_id, price_cents |
| `subscription_renewed` | Subscription renewed | provider, plan_id |
| `subscription_canceled` | User cancels | provider, plan_id, reason |
| `subscription_expired` | Subscription expires | provider, plan_id |
| `paywall_shown` | Paywall gate displayed | feature, context |
| `paywall_converted` | User upgrades from paywall | feature, plan_id |
| `checkout_started` | Checkout flow initiated | provider, plan_id |
| `checkout_completed` | Checkout flow completed | provider, plan_id, price_cents |
| `checkout_abandoned` | Checkout flow abandoned | provider, plan_id |

**No PII** in events. Use hashed user IDs. Price in cents, not formatted strings.

---

## 9 --- Security Checklist

- [ ] Stripe webhook signature verified (`stripe.webhooks.constructEvent`)
- [ ] RevenueCat webhook authenticated via `Authorization: Bearer <secret>` header
- [ ] No subscription data stored client-side (always server-verified)
- [ ] RLS on `user_subscriptions` (users see only their own)
- [ ] All secrets in environment variables (never in code or client)
- [ ] Stripe publishable key only key exposed to browser
- [ ] RevenueCat API keys are platform-specific (iOS key on iOS, Android key on Android)
- [ ] Entitlement check requires valid JWT
- [ ] Webhook endpoints are idempotent (upsert, not insert)

---

## 10 --- Setup Checklists

### 10.1 Stripe (Web)

1. Create Stripe account at stripe.com
2. Create Products + Prices (matching tier structure)
3. Configure Customer Portal (cancellation, plan changes)
4. Register webhook: `https://<supabase-ref>.supabase.co/functions/v1/stripe-webhook`
5. Select events: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.payment_failed`
6. Set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` in Supabase secrets

### 10.2 RevenueCat (Mobile)

1. Create RevenueCat account at revenuecat.com
2. Create a Project in RevenueCat Dashboard
3. **iOS App:** Add app with Apple App-Specific Shared Secret
4. **Android App:** Add app with Google Play Service Account JSON
5. **Products:** Create Products matching your SKUs
6. **Entitlements:** Create entitlements (`basic`, `pro`) and attach products
7. **Offerings:** Create an offering with packages for each tier/cycle
8. **Webhook:** Configure URL:
   `https://<supabase-ref>.supabase.co/functions/v1/revenuecat-webhook`
   Set Authorization header. Copy secret to `REVENUECAT_WEBHOOK_SECRET` in Supabase.
9. Copy API keys (iOS `appl_...`, Android `goog_...`) to mobile app config.

### 10.3 App Store Connect (iOS)

1. Create subscription group
2. Add auto-renewable subscription products (matching RevenueCat product IDs)
3. Set prices per territory, add localized display names
4. Generate App-Specific Shared Secret -> enter in RevenueCat Dashboard
5. Enable In-App Purchase capability for your bundle ID
6. Create Sandbox Tester accounts
7. Complete Paid Apps Agreement + Banking/Tax

### 10.4 Google Play Console (Android)

1. Create subscription products (matching RevenueCat product IDs)
2. Create at least one base plan per subscription (monthly/yearly)
3. Create Service Account with Android Publisher API access ->
   download JSON key -> enter in RevenueCat Dashboard
4. Upload internal testing AAB + add license tester emails
5. Activate subscriptions

---

## Changelog

### v2.0 (2026-04-12)

- **BREAKING:** Replaced direct Apple StoreKit 2 + Google Play Billing integration
  with RevenueCat as the default mobile billing middleware.
- Removed separate `apple-webhook` (ASSN V2) and `google-webhook` (RTDN) in favor
  of a single `revenuecat-webhook`.
- Removed `verify-apple-subscription` and `verify-google-subscription` edge functions.
- Simplified env var requirements: Apple/Google credentials configured in
  RevenueCat Dashboard, not in Supabase secrets.
- Added vendor-exit strategy documenting how to revert to direct integration.
- Data model and DB schema unchanged --- Supabase remains SSOT.

### v1.0 (Initial)

- Direct integration with Stripe (Web), Apple StoreKit 2 (iOS), Google Play
  Billing Library 6+ (Android).
- Separate Apple ASSN V2 and Google Play RTDN webhook handlers.
