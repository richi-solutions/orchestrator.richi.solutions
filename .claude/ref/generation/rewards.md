# Rewards, Referrals & Feature Voting Contract

**Version:** 1.0
**Status:** ACTIVE
**Authority:** RDF GENERATION CONTRACT
**Depends on:** `rules/core/rdf.md` (ROOT AUTHORITY), `ref/generation/monetization.md`

---

## 1 --- Purpose

Defines the architecture for a cross-platform rewards, referral, and feature
voting system. Designed to work alongside the monetization system
(`monetization.md`) using Supabase as Single Source of Truth.

**Three pillars:**

1. **Reward Actions** --- Users earn free time or credits through defined actions
2. **Referral Tracking** --- Who referred whom, rewards for both sides
3. **Feature Requests & Voting** --- Public board where users vote on feature ideas

**Design principles:**

- Reward type is adaptive: subscription-based apps grant free days,
  usage-based apps grant credits. Configurable per app via `reward_actions`.
- Rewards integrate with the existing subscription system (`provider: 'reward'`)
  --- no changes to `check-entitlement` needed.
- Feature voting is public --- users see and vote on each other's requests.
- Schema is centralized in the orchestrator, distributed to all apps.

---

## 2 --- Architecture Overview

```
+--------------------------------------------------------------+
|                     Supabase (SSOT)                          |
|  +---------+  +-----------+  +----------+  +--------------+  |
|  | reward  |  | user      |  | referrals|  | feature      |  |
|  | actions |  | rewards   |  |          |  | requests     |  |
|  +---------+  +-----------+  +----------+  +--------------+  |
+------+-------------+---------------+---------------+---------+
       |             |               |               |
       v             v               v               v
+------------+  +----------+  +------------+  +-------------+
| claim      |  | my       |  | track      |  | feature     |
| reward     |  | rewards  |  | referral   |  | requests    |
+------------+  +----------+  +------------+  +-------------+
       ^             ^               ^               ^
       |             |               |               |
+------+-------------+---------------+---------------+---------+
|                     Client Apps                              |
|  +----------+  +-----------+  +----------+  +-----------+    |
|  | Referral |  | Rewards   |  | Reward   |  | Feature   |    |
|  | Card     |  | Banner    |  | History  |  | Board     |    |
|  +----------+  +-----------+  +----------+  +-----------+    |
+--------------------------------------------------------------+
```

**Flow (Rewards):**

1. Developer defines reward actions in `reward_actions` table (e.g. referral = 7 days)
2. User completes an action (refers friend, leaves review, shares app)
3. Client or Edge Function creates entry in `user_rewards` (status: pending)
4. User claims reward via `claim-reward` Edge Function
5. If `reward_type: 'days'` --- upsert subscription with `provider: 'reward'`
6. If `reward_type: 'credits'` --- add to credit balance
7. Existing `check-entitlement` picks up reward subscriptions automatically

**Flow (Feature Requests):**

1. User submits feature request via `feature-requests` Edge Function
2. Other users browse and vote on requests
3. Developer sees ranked list (by vote count) per app
4. Developer updates status (planned, in_progress, done, declined)

---

## 3 --- Data Model

### 3.1 `reward_actions` Table

Defines which actions earn which rewards. Managed by the developer.

```sql
CREATE TABLE public.reward_actions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,            -- 'referral', 'review', 'share', 'onboarding'
  display_name    TEXT NOT NULL,                   -- 'Refer a Friend'
  description     TEXT,                            -- 'Get 7 days Pro for each friend you invite'
  -- Reward configuration
  reward_type     TEXT NOT NULL CHECK (reward_type IN ('days', 'credits')),
  reward_amount   INTEGER NOT NULL,                -- 7 (days) or 100 (credits)
  reward_plan_id  UUID REFERENCES public.plans(id), -- Which plan to grant (for days rewards)
  -- Limits
  max_per_user    INTEGER,                         -- NULL = unlimited
  requires_verification BOOLEAN NOT NULL DEFAULT false,
  -- Referrer gets reward too (for referral actions)
  referrer_reward_amount INTEGER,                  -- NULL = no referrer reward
  -- Status
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public readable so users can see available rewards
ALTER TABLE public.reward_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reward actions are publicly readable"
  ON public.reward_actions FOR SELECT USING (true);
```

### 3.2 `user_rewards` Table

Tracks earned rewards per user.

```sql
CREATE TABLE public.user_rewards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id       UUID NOT NULL REFERENCES public.reward_actions(id),
  -- Reward details (denormalized for history)
  reward_type     TEXT NOT NULL CHECK (reward_type IN ('days', 'credits')),
  reward_amount   INTEGER NOT NULL,
  -- Status
  status          TEXT NOT NULL CHECK (status IN (
    'pending', 'claimed', 'expired', 'rejected'
  )) DEFAULT 'pending',
  -- Metadata (action-specific: referral_code, review_url, etc.)
  metadata        JSONB DEFAULT '{}',
  -- Timestamps
  claimed_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_user_rewards_user_status
  ON public.user_rewards (user_id, status);

CREATE INDEX idx_user_rewards_action
  ON public.user_rewards (action_id);

-- RLS: Users can only see their own rewards
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON public.user_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update (via Edge Functions)
CREATE POLICY "Service role manages rewards"
  ON public.user_rewards FOR ALL
  USING (auth.role() = 'service_role');
```

### 3.3 `referrals` Table

Tracks referral relationships.

```sql
CREATE TABLE public.referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code   TEXT NOT NULL UNIQUE,
  -- Status
  status          TEXT NOT NULL CHECK (status IN (
    'pending', 'completed', 'rewarded'
  )) DEFAULT 'pending',
  -- Link to rewards (nullable until rewarded)
  referrer_reward_id  UUID REFERENCES public.user_rewards(id),
  referred_reward_id  UUID REFERENCES public.user_rewards(id),
  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_referrals_code
  ON public.referrals (referral_code);

CREATE INDEX idx_referrals_referrer
  ON public.referrals (referrer_id);

-- RLS: Users can see referrals where they are the referrer
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- Only service role can insert/update
CREATE POLICY "Service role manages referrals"
  ON public.referrals FOR ALL
  USING (auth.role() = 'service_role');
```

### 3.4 `feature_requests` Table

Public feature request board.

```sql
CREATE TABLE public.feature_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 200),
  description     TEXT CHECK (char_length(description) <= 2000),
  -- Status (managed by developer)
  status          TEXT NOT NULL CHECK (status IN (
    'open', 'planned', 'in_progress', 'done', 'declined'
  )) DEFAULT 'open',
  -- Denormalized vote count for sorting
  vote_count      INTEGER NOT NULL DEFAULT 0,
  -- Developer response (optional)
  admin_response  TEXT,
  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feature_requests_votes
  ON public.feature_requests (vote_count DESC);

CREATE INDEX idx_feature_requests_status
  ON public.feature_requests (status);

-- RLS: Public readable, users can create their own
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Feature requests are publicly readable"
  ON public.feature_requests FOR SELECT USING (true);

CREATE POLICY "Users can create feature requests"
  ON public.feature_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own (title/description only, not status/vote_count)
CREATE POLICY "Users can update own requests"
  ON public.feature_requests FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only service role can change status/vote_count
CREATE POLICY "Service role manages all requests"
  ON public.feature_requests FOR ALL
  USING (auth.role() = 'service_role');
```

### 3.5 `feature_votes` Table

One vote per user per request.

```sql
CREATE TABLE public.feature_votes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_request_id  UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One vote per user per request
  UNIQUE (user_id, feature_request_id)
);

CREATE INDEX idx_feature_votes_request
  ON public.feature_votes (feature_request_id);

-- RLS: Users can see and manage their own votes
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own votes"
  ON public.feature_votes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own votes"
  ON public.feature_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON public.feature_votes FOR DELETE
  USING (auth.uid() = user_id);
```

### 3.6 Vote Count Trigger

Keeps `feature_requests.vote_count` in sync automatically.

```sql
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feature_requests
    SET vote_count = vote_count + 1, updated_at = now()
    WHERE id = NEW.feature_request_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feature_requests
    SET vote_count = vote_count - 1, updated_at = now()
    WHERE id = OLD.feature_request_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_vote_count
  AFTER INSERT OR DELETE ON public.feature_votes
  FOR EACH ROW EXECUTE FUNCTION update_vote_count();
```

### 3.7 Referral Code Generation

Auto-generate referral code on user signup.

```sql
-- Function to generate a unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- 8-char alphanumeric code
    code := upper(substr(md5(random()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
```

### 3.8 User Reward Summary View

Aggregated reward overview per user.

```sql
CREATE OR REPLACE VIEW public.user_reward_summary AS
SELECT
  user_id,
  SUM(CASE WHEN reward_type = 'credits' AND status = 'claimed'
    THEN reward_amount ELSE 0 END)::INTEGER AS total_credits_earned,
  SUM(CASE WHEN reward_type = 'days' AND status = 'claimed'
    THEN reward_amount ELSE 0 END)::INTEGER AS total_days_earned,
  COUNT(*) FILTER (WHERE status = 'pending')::INTEGER AS pending_rewards,
  COUNT(*) FILTER (WHERE status = 'claimed')::INTEGER AS claimed_rewards
FROM public.user_rewards
GROUP BY user_id;
```

### 3.9 Zod Contracts

Source of truth for client-side validation. Store at `src/contracts/v1/rewards.schema.ts`.

```typescript
// src/contracts/v1/rewards.schema.ts
import { z } from "zod";

export const RewardActionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  rewardType: z.enum(["days", "credits"]),
  rewardAmount: z.number().int().positive(),
  maxPerUser: z.number().int().positive().nullable(),
  requiresVerification: z.boolean(),
  isActive: z.boolean(),
});

export const UserRewardSchema = z.object({
  id: z.string().uuid(),
  actionId: z.string().uuid(),
  rewardType: z.enum(["days", "credits"]),
  rewardAmount: z.number().int(),
  status: z.enum(["pending", "claimed", "expired", "rejected"]),
  metadata: z.record(z.unknown()).optional(),
  claimedAt: z.string().datetime().nullable(),
  expiresAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export const ReferralSchema = z.object({
  id: z.string().uuid(),
  referralCode: z.string(),
  status: z.enum(["pending", "completed", "rewarded"]),
  referredCount: z.number().int().optional(),
  createdAt: z.string().datetime(),
});

export const FeatureRequestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().max(2000).nullable(),
  status: z.enum(["open", "planned", "in_progress", "done", "declined"]),
  voteCount: z.number().int(),
  adminResponse: z.string().nullable(),
  hasVoted: z.boolean().optional(),
  createdAt: z.string().datetime(),
});

export const RewardSummarySchema = z.object({
  totalCreditsEarned: z.number().int(),
  totalDaysEarned: z.number().int(),
  pendingRewards: z.number().int(),
  claimedRewards: z.number().int(),
  referralCode: z.string(),
  referralCount: z.number().int(),
});

// Input schemas
export const ClaimRewardInputSchema = z.object({
  rewardId: z.string().uuid(),
});

export const TrackReferralInputSchema = z.object({
  referralCode: z.string().min(1).max(20),
});

export const FeatureRequestInputSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().max(2000).optional(),
});

export const FeatureVoteInputSchema = z.object({
  featureRequestId: z.string().uuid(),
});

// Types
export type RewardAction = z.infer<typeof RewardActionSchema>;
export type UserReward = z.infer<typeof UserRewardSchema>;
export type Referral = z.infer<typeof ReferralSchema>;
export type FeatureRequest = z.infer<typeof FeatureRequestSchema>;
export type RewardSummary = z.infer<typeof RewardSummarySchema>;
export type ClaimRewardInput = z.infer<typeof ClaimRewardInputSchema>;
export type TrackReferralInput = z.infer<typeof TrackReferralInputSchema>;
export type FeatureRequestInput = z.infer<typeof FeatureRequestInputSchema>;
export type FeatureVoteInput = z.infer<typeof FeatureVoteInputSchema>;
```

---

## 4 --- Edge Function Patterns

All functions follow the RDF Edge Function pattern (see KB Section 19).

### 4.1 Claim Reward

```typescript
// supabase/functions/claim-reward/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/edgeConfig.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    // 1. Authenticate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Missing token" }, traceId: requestId },
        401,
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return jsonResponse(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid token" }, traceId: requestId },
        401,
      );
    }

    // 2. Parse input
    const { rewardId } = await req.json();
    if (!rewardId) {
      return jsonResponse(
        { ok: false, error: { code: "VALIDATION_FAILED", message: "rewardId required" }, traceId: requestId },
        400,
      );
    }

    // 3. Fetch reward and action
    const { data: reward } = await supabase
      .from("user_rewards")
      .select("*, reward_actions(*)")
      .eq("id", rewardId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single();

    if (!reward) {
      return jsonResponse(
        { ok: false, error: { code: "NOT_FOUND", message: "Reward not found or already claimed" }, traceId: requestId },
        404,
      );
    }

    // 4. Claim the reward
    await supabase
      .from("user_rewards")
      .update({ status: "claimed", claimed_at: new Date().toISOString() })
      .eq("id", rewardId);

    // 5. Grant the reward
    if (reward.reward_type === "days") {
      // Create/extend a reward subscription
      const rewardPlanId = reward.reward_actions.reward_plan_id;
      if (!rewardPlanId) {
        return jsonResponse(
          { ok: false, error: { code: "INTERNAL_ERROR", message: "No reward plan configured" }, traceId: requestId },
          500,
        );
      }

      const now = new Date();
      const periodEnd = new Date(now.getTime() + reward.reward_amount * 24 * 60 * 60 * 1000);

      // Check for existing reward subscription
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id, current_period_end")
        .eq("user_id", user.id)
        .eq("provider", "reward")
        .eq("status", "active")
        .gt("current_period_end", now.toISOString())
        .single();

      if (existingSub) {
        // Extend existing reward subscription
        const existingEnd = new Date(existingSub.current_period_end);
        const newEnd = new Date(existingEnd.getTime() + reward.reward_amount * 24 * 60 * 60 * 1000);
        await supabase
          .from("subscriptions")
          .update({
            current_period_end: newEnd.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq("id", existingSub.id);
      } else {
        // Create new reward subscription
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          plan_id: rewardPlanId,
          provider: "reward",
          provider_subscription_id: `reward_${rewardId}`,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        });
      }
    }

    // For credits: balance is derived from user_reward_summary view
    // No additional action needed --- claiming the reward adds to the total

    return jsonResponse({
      ok: true,
      data: {
        rewardType: reward.reward_type,
        rewardAmount: reward.reward_amount,
        status: "claimed",
      },
      traceId: requestId,
    }, 200);

  } catch (error) {
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" }, traceId: requestId },
      500,
    );
  }
});

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

### 4.2 Track Referral

```typescript
// supabase/functions/track-referral/index.ts
//
// Called when a new user signs up with a referral code.
// Creates rewards for both referrer and referred user.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/edgeConfig.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    // 1. Authenticate (the newly signed-up user)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Missing token" }, traceId: requestId },
        401,
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return jsonResponse(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid token" }, traceId: requestId },
        401,
      );
    }

    // 2. Parse input
    const { referralCode } = await req.json();
    if (!referralCode) {
      return jsonResponse(
        { ok: false, error: { code: "VALIDATION_FAILED", message: "referralCode required" }, traceId: requestId },
        400,
      );
    }

    // 3. Find referral
    const { data: referral } = await supabase
      .from("referrals")
      .select("*")
      .eq("referral_code", referralCode)
      .eq("status", "pending")
      .single();

    if (!referral) {
      return jsonResponse(
        { ok: false, error: { code: "NOT_FOUND", message: "Invalid or already used referral code" }, traceId: requestId },
        404,
      );
    }

    // 4. Prevent self-referral
    if (referral.referrer_id === user.id) {
      return jsonResponse(
        { ok: false, error: { code: "VALIDATION_FAILED", message: "Cannot use own referral code" }, traceId: requestId },
        400,
      );
    }

    // 5. Get referral reward action
    const { data: action } = await supabase
      .from("reward_actions")
      .select("*")
      .eq("name", "referral")
      .eq("is_active", true)
      .single();

    if (!action) {
      return jsonResponse(
        { ok: false, error: { code: "NOT_FOUND", message: "Referral program not active" }, traceId: requestId },
        404,
      );
    }

    // 6. Check referrer's max referrals
    if (action.max_per_user) {
      const { count } = await supabase
        .from("user_rewards")
        .select("id", { count: "exact", head: true })
        .eq("user_id", referral.referrer_id)
        .eq("action_id", action.id);

      if (count && count >= action.max_per_user) {
        return jsonResponse(
          { ok: false, error: { code: "RATE_LIMIT", message: "Referrer has reached maximum referrals" }, traceId: requestId },
          429,
        );
      }
    }

    // 7. Create rewards for both users
    const referredReward = await supabase
      .from("user_rewards")
      .insert({
        user_id: user.id,
        action_id: action.id,
        reward_type: action.reward_type,
        reward_amount: action.reward_amount,
        status: "pending",
        metadata: { referral_code: referralCode, role: "referred" },
      })
      .select("id")
      .single();

    let referrerRewardId = null;
    if (action.referrer_reward_amount) {
      const referrerReward = await supabase
        .from("user_rewards")
        .insert({
          user_id: referral.referrer_id,
          action_id: action.id,
          reward_type: action.reward_type,
          reward_amount: action.referrer_reward_amount,
          status: "pending",
          metadata: { referral_code: referralCode, role: "referrer" },
        })
        .select("id")
        .single();
      referrerRewardId = referrerReward.data?.id;
    }

    // 8. Update referral status
    await supabase
      .from("referrals")
      .update({
        referred_id: user.id,
        status: "completed",
        completed_at: new Date().toISOString(),
        referred_reward_id: referredReward.data?.id,
        referrer_reward_id: referrerRewardId,
      })
      .eq("id", referral.id);

    return jsonResponse({
      ok: true,
      data: {
        rewardType: action.reward_type,
        rewardAmount: action.reward_amount,
        referrerRewarded: !!action.referrer_reward_amount,
      },
      traceId: requestId,
    }, 200);

  } catch (error) {
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" }, traceId: requestId },
      500,
    );
  }
});

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

### 4.3 Feature Requests (CRUD + Voting)

```typescript
// supabase/functions/feature-requests/index.ts
//
// GET    --- List all feature requests (public, sorted by votes)
// POST   --- Create a new feature request (authenticated)
// POST   --- Vote/unvote on a feature request (authenticated)
// Action determined by request body: { action: "create" | "vote" | "unvote" }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/edgeConfig.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    if (req.method === "GET") {
      return await handleList(req, requestId);
    }

    if (req.method === "POST") {
      // Authenticate for all POST actions
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return jsonResponse(
          { ok: false, error: { code: "UNAUTHORIZED", message: "Missing token" }, traceId: requestId },
          401,
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return jsonResponse(
          { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid token" }, traceId: requestId },
          401,
        );
      }

      const body = await req.json();

      switch (body.action) {
        case "create":
          return await handleCreate(user, body, requestId);
        case "vote":
          return await handleVote(user, body, requestId);
        case "unvote":
          return await handleUnvote(user, body, requestId);
        default:
          return jsonResponse(
            { ok: false, error: { code: "VALIDATION_FAILED", message: "Invalid action" }, traceId: requestId },
            400,
          );
      }
    }

    return jsonResponse(
      { ok: false, error: { code: "VALIDATION_FAILED", message: "Method not allowed" }, traceId: requestId },
      405,
    );
  } catch (error) {
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" }, traceId: requestId },
      500,
    );
  }
});

async function handleList(req: Request, requestId: string) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "open";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  // Optionally include user's vote status
  const authHeader = req.headers.get("Authorization");
  let userId: string | null = null;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id || null;
  }

  const { data: requests, error } = await supabase
    .from("feature_requests")
    .select("*")
    .eq("status", status)
    .order("vote_count", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: error.message }, traceId: requestId },
      500,
    );
  }

  // If authenticated, attach vote status
  let enrichedRequests = requests;
  if (userId && requests.length > 0) {
    const requestIds = requests.map((r: any) => r.id);
    const { data: votes } = await supabase
      .from("feature_votes")
      .select("feature_request_id")
      .eq("user_id", userId)
      .in("feature_request_id", requestIds);

    const votedIds = new Set((votes || []).map((v: any) => v.feature_request_id));
    enrichedRequests = requests.map((r: any) => ({
      ...r,
      has_voted: votedIds.has(r.id),
    }));
  }

  return jsonResponse({
    ok: true,
    data: enrichedRequests,
    traceId: requestId,
  }, 200);
}

async function handleCreate(user: any, body: any, requestId: string) {
  const { title, description } = body;

  if (!title || title.length < 5 || title.length > 200) {
    return jsonResponse(
      { ok: false, error: { code: "VALIDATION_FAILED", message: "Title must be 5-200 characters" }, traceId: requestId },
      400,
    );
  }

  if (description && description.length > 2000) {
    return jsonResponse(
      { ok: false, error: { code: "VALIDATION_FAILED", message: "Description max 2000 characters" }, traceId: requestId },
      400,
    );
  }

  // Rate limit: max 5 open requests per user
  const { count } = await supabase
    .from("feature_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "open");

  if (count && count >= 5) {
    return jsonResponse(
      { ok: false, error: { code: "RATE_LIMIT", message: "Maximum 5 open feature requests" }, traceId: requestId },
      429,
    );
  }

  const { data, error } = await supabase
    .from("feature_requests")
    .insert({
      user_id: user.id,
      title,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: error.message }, traceId: requestId },
      500,
    );
  }

  return jsonResponse({ ok: true, data, traceId: requestId }, 201);
}

async function handleVote(user: any, body: any, requestId: string) {
  const { featureRequestId } = body;

  if (!featureRequestId) {
    return jsonResponse(
      { ok: false, error: { code: "VALIDATION_FAILED", message: "featureRequestId required" }, traceId: requestId },
      400,
    );
  }

  const { error } = await supabase
    .from("feature_votes")
    .insert({ user_id: user.id, feature_request_id: featureRequestId });

  if (error) {
    if (error.code === "23505") {
      // Already voted (unique constraint violation)
      return jsonResponse(
        { ok: false, error: { code: "VALIDATION_FAILED", message: "Already voted" }, traceId: requestId },
        409,
      );
    }
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: error.message }, traceId: requestId },
      500,
    );
  }

  return jsonResponse({ ok: true, data: { voted: true }, traceId: requestId }, 200);
}

async function handleUnvote(user: any, body: any, requestId: string) {
  const { featureRequestId } = body;

  if (!featureRequestId) {
    return jsonResponse(
      { ok: false, error: { code: "VALIDATION_FAILED", message: "featureRequestId required" }, traceId: requestId },
      400,
    );
  }

  const { error } = await supabase
    .from("feature_votes")
    .delete()
    .eq("user_id", user.id)
    .eq("feature_request_id", featureRequestId);

  if (error) {
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: error.message }, traceId: requestId },
      500,
    );
  }

  return jsonResponse({ ok: true, data: { voted: false }, traceId: requestId }, 200);
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

### 4.4 My Rewards

```typescript
// supabase/functions/my-rewards/index.ts
//
// Returns the authenticated user's reward summary, history, and referral code.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/edgeConfig.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    // 1. Authenticate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Missing token" }, traceId: requestId },
        401,
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return jsonResponse(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid token" }, traceId: requestId },
        401,
      );
    }

    // 2. Get reward summary
    const { data: summary } = await supabase
      .from("user_reward_summary")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // 3. Get reward history
    const { data: history } = await supabase
      .from("user_rewards")
      .select("*, reward_actions(name, display_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // 4. Get or create referral code
    let { data: referral } = await supabase
      .from("referrals")
      .select("referral_code")
      .eq("referrer_id", user.id)
      .eq("status", "pending")
      .limit(1)
      .single();

    if (!referral) {
      // Create a new referral entry with a generated code
      const { data: newReferral } = await supabase
        .from("referrals")
        .insert({
          referrer_id: user.id,
          referral_code: generateCode(),
        })
        .select("referral_code")
        .single();
      referral = newReferral;
    }

    // 5. Count completed referrals
    const { count: referralCount } = await supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .eq("status", "completed");

    // 6. Get available reward actions
    const { data: availableActions } = await supabase
      .from("reward_actions")
      .select("*")
      .eq("is_active", true);

    return jsonResponse({
      ok: true,
      data: {
        summary: summary || {
          total_credits_earned: 0,
          total_days_earned: 0,
          pending_rewards: 0,
          claimed_rewards: 0,
        },
        history: history || [],
        referralCode: referral?.referral_code || null,
        referralCount: referralCount || 0,
        availableActions: availableActions || [],
      },
      traceId: requestId,
    }, 200);

  } catch (error) {
    return jsonResponse(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" }, traceId: requestId },
      500,
    );
  }
});

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

---

## 5 --- Client-Side Patterns

### 5.1 React Hook: `useRewards`

```typescript
// src/hooks/useRewards.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface RewardSummary {
  summary: {
    total_credits_earned: number;
    total_days_earned: number;
    pending_rewards: number;
    claimed_rewards: number;
  };
  history: Array<{
    id: string;
    reward_type: "days" | "credits";
    reward_amount: number;
    status: string;
    created_at: string;
    reward_actions: { name: string; display_name: string };
  }>;
  referralCode: string | null;
  referralCount: number;
  availableActions: Array<{
    id: string;
    name: string;
    display_name: string;
    description: string;
    reward_type: "days" | "credits";
    reward_amount: number;
  }>;
}

export function useRewards() {
  const queryClient = useQueryClient();

  const query = useQuery<RewardSummary>({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("my-rewards");
      if (error || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to fetch rewards");
      }
      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });

  const claimReward = useMutation({
    mutationFn: async (rewardId: string) => {
      const { data, error } = await supabase.functions.invoke("claim-reward", {
        body: { rewardId },
      });
      if (error || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to claim reward");
      }
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  const trackReferral = useMutation({
    mutationFn: async (referralCode: string) => {
      const { data, error } = await supabase.functions.invoke("track-referral", {
        body: { referralCode },
      });
      if (error || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to track referral");
      }
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });

  return {
    ...query,
    rewards: query.data,
    claimReward,
    trackReferral,
  };
}
```

### 5.2 React Hook: `useFeatureRequests`

```typescript
// src/hooks/useFeatureRequests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface FeatureRequest {
  id: string;
  title: string;
  description: string | null;
  status: string;
  vote_count: number;
  admin_response: string | null;
  has_voted?: boolean;
  created_at: string;
}

export function useFeatureRequests(status: string = "open") {
  const queryClient = useQueryClient();

  const query = useQuery<FeatureRequest[]>({
    queryKey: ["feature-requests", status],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        `feature-requests?status=${status}`,
        { method: "GET" },
      );
      if (error || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to fetch feature requests");
      }
      return data.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });

  const createRequest = useMutation({
    mutationFn: async (input: { title: string; description?: string }) => {
      const { data, error } = await supabase.functions.invoke("feature-requests", {
        body: { action: "create", ...input },
      });
      if (error || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to create request");
      }
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    },
  });

  const vote = useMutation({
    mutationFn: async (featureRequestId: string) => {
      const { data, error } = await supabase.functions.invoke("feature-requests", {
        body: { action: "vote", featureRequestId },
      });
      if (error || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to vote");
      }
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    },
  });

  const unvote = useMutation({
    mutationFn: async (featureRequestId: string) => {
      const { data, error } = await supabase.functions.invoke("feature-requests", {
        body: { action: "unvote", featureRequestId },
      });
      if (error || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to unvote");
      }
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-requests"] });
    },
  });

  return {
    ...query,
    requests: query.data,
    createRequest,
    vote,
    unvote,
  };
}
```

### 5.3 React Component: `ReferralCard`

```tsx
// src/components/ReferralCard.tsx
import { useRewards } from "@/hooks/useRewards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function ReferralCard() {
  const { rewards, isLoading } = useRewards();
  const { t } = useTranslation();

  if (isLoading || !rewards?.referralCode) return null;

  const referralAction = rewards.availableActions.find((a) => a.name === "referral");
  const shareUrl = `${window.location.origin}?ref=${rewards.referralCode}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: t("rewards.referral.shareTitle"),
        url: shareUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("rewards.referral.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {referralAction && (
          <p className="text-sm text-muted-foreground">
            {referralAction.description}
          </p>
        )}

        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
            {rewards.referralCode}
          </code>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {t("common.copy")}
          </Button>
          <Button size="sm" onClick={handleShare}>
            {t("common.share")}
          </Button>
        </div>

        {rewards.referralCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("rewards.referral.count", { count: rewards.referralCount })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### 5.4 React Component: `FeatureBoard`

```tsx
// src/components/FeatureBoard.tsx
import { useState } from "react";
import { useFeatureRequests } from "@/hooks/useFeatureRequests";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface FeatureBoardProps {
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export function FeatureBoard({ showCreateButton = true, onCreateClick }: FeatureBoardProps) {
  const [status, setStatus] = useState("open");
  const { requests, vote, unvote, isLoading } = useFeatureRequests(status);
  const { t } = useTranslation();

  const handleToggleVote = (request: any) => {
    if (request.has_voted) {
      unvote.mutate(request.id);
    } else {
      vote.mutate(request.id);
    }
  };

  const statusTabs = ["open", "planned", "in_progress", "done"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {statusTabs.map((s) => (
            <Button
              key={s}
              variant={status === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus(s)}
            >
              {t(`rewards.featureBoard.status.${s}`)}
            </Button>
          ))}
        </div>
        {showCreateButton && onCreateClick && (
          <Button onClick={onCreateClick}>
            {t("rewards.featureBoard.submit")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : requests?.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {t("rewards.featureBoard.empty")}
        </p>
      ) : (
        <div className="space-y-3">
          {requests?.map((request) => (
            <Card key={request.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <button
                  onClick={() => handleToggleVote(request)}
                  className={`flex flex-col items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                    request.has_voted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <span className="text-lg font-bold">{request.vote_count}</span>
                  <span className="text-xs">{t("rewards.featureBoard.votes")}</span>
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{request.title}</h4>
                    {request.status !== "open" && (
                      <Badge variant="secondary">{t(`rewards.featureBoard.status.${request.status}`)}</Badge>
                    )}
                  </div>
                  {request.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {request.description}
                    </p>
                  )}
                  {request.admin_response && (
                    <p className="mt-2 rounded bg-muted p-2 text-sm">
                      {request.admin_response}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 6 --- Analytics Events

Extension of the core events defined in `ref/growth/analytics.md`.

| Event | Trigger | Required Fields |
|-------|---------|-----------------|
| `referral_created` | User generates/shares referral code | referral_code |
| `referral_completed` | Referred user signs up | referral_code, referrer_id_hash |
| `reward_earned` | Reward entry created (pending) | action_name, reward_type, reward_amount |
| `reward_claimed` | User claims a pending reward | action_name, reward_type, reward_amount |
| `reward_subscription_granted` | Reward days applied as subscription | days, plan_id |
| `feature_request_created` | User submits a feature request | request_id_hash |
| `feature_request_voted` | User votes on a feature request | request_id_hash, vote_count |
| `feature_request_status_changed` | Developer changes request status | request_id_hash, old_status, new_status |

**No PII** in events. Use hashed IDs. Reward amounts as integers.

---

## 7 --- Security Checklist

- [ ] RLS enabled on all tables (`user_rewards`, `referrals`, `feature_requests`, `feature_votes`)
- [ ] Users can only see their own rewards and referrals
- [ ] Feature requests are public readable but only own creatable
- [ ] Users can only vote once per feature request (UNIQUE constraint)
- [ ] Self-referral prevented (server-side check)
- [ ] Rate limiting: max 5 open feature requests per user
- [ ] Rate limiting: max_per_user enforced on reward actions
- [ ] All Edge Functions require JWT (except GET feature-requests)
- [ ] All responses follow Error Envelope format
- [ ] Webhook endpoints are idempotent (upsert patterns)
- [ ] No secrets needed beyond standard Supabase Auth

---

## 8 --- Entitlement Integration

Rewards integrate with the existing monetization system (`monetization.md`)
without requiring changes to `check-entitlement`.

**How it works:**

When a user claims a `days` reward, the `claim-reward` function creates or
extends a subscription in the `subscriptions` table:

```
provider: 'reward'
provider_subscription_id: 'reward_{reward_id}'
plan_id: {reward_plan_id from reward_actions}
status: 'active'
current_period_end: now() + reward_days
```

The existing `check-entitlement` function (from `monetization.md` Section 4.4)
already queries for active subscriptions regardless of provider. Reward
subscriptions are picked up automatically.

**Important:** The `subscriptions` table must already exist (from `/setup-monetization`).
The `reward_actions.reward_plan_id` must reference a valid plan in the `plans` table.
If no monetization setup exists yet, `days` rewards cannot be used --- only `credits`.

**For credits:** The balance is derived from the `user_reward_summary` view.
Credit consumption logic is app-specific and not covered by this contract.

---

## 9 --- Seed Data

Default reward actions to insert after migration:

```sql
-- Referral: Both sides get rewarded
INSERT INTO public.reward_actions (name, display_name, description, reward_type, reward_amount, referrer_reward_amount, max_per_user)
VALUES ('referral', 'Refer a Friend', 'Invite a friend and both of you get 7 days Pro free', 'days', 7, 7, 20);

-- App Store Review
INSERT INTO public.reward_actions (name, display_name, description, reward_type, reward_amount, requires_verification, max_per_user)
VALUES ('review', 'Leave a Review', 'Rate us on the App Store and get 3 days Pro free', 'days', 3, true, 1);

-- Social Share
INSERT INTO public.reward_actions (name, display_name, description, reward_type, reward_amount, max_per_user)
VALUES ('share', 'Share on Social Media', 'Share the app and earn 1 day Pro free', 'days', 1, false, 5);
```

These are templates. Adjust `reward_amount`, `reward_type`, and `reward_plan_id`
per app based on the monetization model.

---

## 10 --- i18n Keys

```json
{
  "rewards": {
    "referral": {
      "title": "Refer a Friend",
      "shareTitle": "Check out this app!",
      "count": "{{count}} friends referred",
      "count_one": "1 friend referred"
    },
    "banner": {
      "title": "Earn Free Pro Access",
      "description": "Complete actions to earn rewards"
    },
    "history": {
      "title": "Reward History",
      "empty": "No rewards yet. Start earning!",
      "pending": "Pending",
      "claimed": "Claimed",
      "expired": "Expired"
    },
    "featureBoard": {
      "title": "Feature Requests",
      "submit": "Suggest a Feature",
      "empty": "No requests yet. Be the first!",
      "votes": "votes",
      "status": {
        "open": "Open",
        "planned": "Planned",
        "in_progress": "In Progress",
        "done": "Done"
      }
    }
  }
}
```
