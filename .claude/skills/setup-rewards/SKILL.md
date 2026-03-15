---
name: setup-rewards
description: Sets up the rewards, referral, and feature voting system. Creates database schema, Edge Functions, client hooks, and components. Use /setup-rewards to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
---

# Setup Rewards & Feature Voting

Configure the rewards, referral tracking, and feature voting system for this project.

**Architecture reference:** Always load `.claude/ref/generation/rewards.md` first.
That document is the **single source of truth** for all schemas, event lists,
and code patterns used here. Do NOT deviate from it.

Project structure: !`ls src/ 2>/dev/null || echo "no src/ directory"`
Existing Supabase: !`ls supabase/migrations/ 2>/dev/null || echo "no migrations"`
Package manager: !`[ -f bun.lockb ] && echo "bun" || ([ -f pnpm-lock.yaml ] && echo "pnpm" || ([ -f yarn.lock ] && echo "yarn" || echo "npm"))`
Existing rewards: !`grep -rl "reward\|referral\|feature.request\|feature.vote" src/ 2>/dev/null | head -5 || echo "none"`
Existing monetization: !`grep -rl "subscription\|billing\|stripe" src/ 2>/dev/null | head -3 || echo "none"`
Edge functions: !`ls supabase/functions/ 2>/dev/null || echo "no edge functions"`

---

## Step 1: Validate Environment

1. Confirm this is a Consumer-Pro project (check for `src/`, `supabase/`, `.claude/`)
2. Confirm Supabase is initialized (`supabase/config.toml` exists)
3. Check if monetization is set up (look for `subscriptions` table in migrations)
   - If YES: `days` rewards can create reward subscriptions
   - If NO: warn that only `credits` rewards will work until monetization is set up
4. Check if reward tables already exist in migrations. If yes, warn and ask before overwriting.

---

## Step 2: Database Migration

Create a new Supabase migration with the rewards schema.

Run:
```bash
npx supabase migration new add_rewards_and_feature_voting
```

Write the migration SQL using the exact schemas from **rewards.md Section 3**:

- **`reward_actions` table** --- Section 3.1
- **`user_rewards` table** --- Section 3.2 (with indexes and RLS)
- **`referrals` table** --- Section 3.3 (with indexes and RLS)
- **`feature_requests` table** --- Section 3.4 (with indexes and RLS)
- **`feature_votes` table** --- Section 3.5 (with UNIQUE constraint and RLS)
- **Vote count trigger** --- Section 3.6
- **Referral code generation function** --- Section 3.7
- **`user_reward_summary` view** --- Section 3.8

---

## Step 3: Seed Data

Add the default reward actions from **rewards.md Section 9**.

If monetization is set up, set `reward_plan_id` to the Pro plan's ID.
If not, leave `reward_plan_id` as NULL and set `reward_type` to `credits`.

---

## Step 4: Edge Functions

Create Edge Functions per **rewards.md Section 4** exactly --- copy the implementation code from there.

- `supabase/functions/claim-reward/index.ts` --- Section 4.1
- `supabase/functions/track-referral/index.ts` --- Section 4.2
- `supabase/functions/feature-requests/index.ts` --- Section 4.3
- `supabase/functions/my-rewards/index.ts` --- Section 4.4

Ensure `supabase/functions/_shared/` exists with `edgeConfig.ts` and `edgeResult.ts`.

---

## Step 5: Zod Contracts

Create `src/contracts/v1/rewards.schema.ts` per **rewards.md Section 3.9**.

---

## Step 6: Client-Side Integration

### Hooks

- `src/hooks/useRewards.ts` per **rewards.md Section 5.1**
- `src/hooks/useFeatureRequests.ts` per **rewards.md Section 5.2**

### Components

- `src/components/ReferralCard.tsx` per **rewards.md Section 5.3**
- `src/components/FeatureBoard.tsx` per **rewards.md Section 5.4**

---

## Step 7: i18n Keys

Add the i18n keys from **rewards.md Section 10** to the project's locale files:
- `src/i18n/locales/en.json`
- `src/i18n/locales/de.json` (translate values to German)
- Other locale files as applicable

---

## Step 8: Analytics Events

If an analytics service/emitter exists in the project (check `src/lib/analytics.ts`
or similar), add ALL reward events defined in **rewards.md Section 6**.

If no analytics layer exists yet, skip this step and note it in the summary.

---

## Step 9: Summary

Output:

```
## Rewards & Feature Voting Setup Complete

### Components Created
- [x] Database schema (5 tables + 1 view + 1 trigger + 1 function)
- [x] Edge Functions (4 functions)
- [x] React Hooks (useRewards, useFeatureRequests)
- [x] React Components (ReferralCard, FeatureBoard)
- [x] Zod Contracts
- [x] Seed Data (default reward actions)
- [x] i18n Keys

### Files Created
- supabase/migrations/XXXXXXXXX_add_rewards_and_feature_voting.sql
- supabase/functions/claim-reward/index.ts
- supabase/functions/track-referral/index.ts
- supabase/functions/feature-requests/index.ts
- supabase/functions/my-rewards/index.ts
- src/contracts/v1/rewards.schema.ts
- src/hooks/useRewards.ts
- src/hooks/useFeatureRequests.ts
- src/components/ReferralCard.tsx
- src/components/FeatureBoard.tsx

### Monetization Integration
- [ ] Subscription system detected: YES/NO
- [ ] reward_plan_id configured: YES/NO (if NO, only credits rewards work)

### Next Steps
1. [ ] Apply migration: `supabase db push` (or `supabase db reset` locally)
2. [ ] If monetization exists: set `reward_plan_id` on reward actions to the Pro plan ID
3. [ ] Add /rewards route to React Router (show ReferralCard + reward history)
4. [ ] Add /feature-requests route to React Router (show FeatureBoard)
5. [ ] Integrate referral code tracking in signup flow (read `ref` URL param)
6. [ ] Add ReferralCard to profile/settings page
7. [ ] Test referral flow: generate code → share → signup → verify rewards
8. [ ] Customize reward_amount values per app
```
