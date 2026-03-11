# Runtime Contract

**Authority Level: RUNTIME-CRITICAL — overrides feature implementation**

Full reference: `@rules/ref/` (load on demand)

---

## Runtime Invariants (BLOCKING — never violate)

| Invariant | Rule |
|-----------|------|
| Contracts as Law | All API boundaries schema-validated (Zod). Versioned schemas required. |
| Error Envelope | All operations return `{ ok, data? }` or `{ ok: false, error: { code, message }, traceId }`. No raw exceptions to UI. |
| Domain Purity | Business logic has no I/O. External I/O behind ports/adapters. |
| Typed Config | All env vars loaded + validated on startup. Fail fast on invalid config. Secrets never in repo. |
| Logger Facade | Unified info/warn/error interface. traceId in all logs. No uncontrolled console.log in production. |
| RLS Enforced | Row-level security on all user tables. Users never access other users' data. |
| HTTPS | All production traffic HTTPS only. |
| Analytics Events | page_view, signup_started, signup_completed, activation_completed, feature_used, conversion_completed — no PII. |

---

## Error Codes (standard taxonomy)

`VALIDATION_FAILED` | `UNAUTHORIZED` | `FORBIDDEN` | `NOT_FOUND` | `RATE_LIMIT` | `UPSTREAM_UNAVAILABLE` | `INTERNAL_ERROR`

---

## Deployment Gate Checklist

Block deployment until all pass:

- [ ] Contracts validated (Zod schemas on all API boundaries)
- [ ] Error envelope implemented (`{ ok, data? }` / `{ ok: false, error, traceId }`)
- [ ] Config loader validated (fail-fast on startup)
- [ ] Logger implemented (info/warn/error + traceId)
- [ ] Analytics emitting required events
- [ ] Legal pages present
- [ ] Secrets secure (no keys in repo or client)
- [ ] HTTPS enabled
- [ ] RLS enabled on all user tables
- [ ] Vercel project linked and environment variables configured
- [ ] Supabase Cloud project linked (own project, not managed by third party)
- [ ] `vite build` passes without errors

---

## Post-Deployment (first 24h)

Verify: analytics ingest, signup/login, funnel events, error rates.
Check Vercel deployment logs and Supabase Edge Function logs for errors.
