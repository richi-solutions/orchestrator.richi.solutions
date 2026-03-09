# Test Coverage Documentation

**Framework:** Vitest v4
**Run command:** `npm test`
**Last run:** 42 tests, all passing, 702ms

---

## Test Matrix

| Module | File | Tests | Coverage Areas |
|--------|------|-------|----------------|
| **Result Utility** | `src/lib/result.test.ts` | 4 | success/failure constructors, null data, error envelope |
| **Schedule Schema** | `src/contracts/v1/schedule.schema.test.ts` | 6 | JobDefinition validation, defaults, unknown types, ScheduleConfig |
| **JobResult Schema** | `src/contracts/v1/job-result.schema.test.ts` | 5 | Full result, _commitMeta, _socialMeta, invalid status, missing fields |
| **Executor** | `src/executor/executor.test.ts` | 5 | Routing to all 4 handlers, unknown job type fallback |
| **SweepHandler** | `src/executor/handlers/sweep.handler.test.ts` | 3 | Full sweep success, partial failure, discovery failure propagation |
| **AggregateHandler** | `src/executor/handlers/aggregate.handler.test.ts` | 4 | Empty commits, multi-repo collection, Claude failure (partial), discovery failure |
| **ChainHandler** | `src/executor/handlers/chain.handler.test.ts` | 10 | Missing depends_on, dependency timeout (fake timers), social meta parsing, non-JSON output, Claude failure, JSON with fences, invalid JSON, missing contents |
| **Scheduler** | `src/scheduler/scheduler.test.ts` | 5 | Job names, manual trigger, non-existent job, start/stop lifecycle |

**Total: 42 tests across 8 test files**

---

## Coverage by Layer

| Layer | Modules Tested | Status |
|-------|---------------|--------|
| **Contracts/Schemas** | JobResult, Schedule | Covered |
| **Pure Utilities** | Result (success/failure) | Covered |
| **Executor Routing** | Executor dispatch | Covered |
| **Handler Logic** | Sweep, Aggregate, Chain | Covered |
| **Scheduler** | Start, stop, manual trigger | Covered |
| **Adapters** | SupabaseStore, GitHub, Claude | Not yet (external I/O) |
| **Routes** | health, trigger | Not yet (Express integration) |
| **Middleware** | requireApiKey | Not yet |
| **Config** | loadEnv, loadSchedule | Not yet (process.exit) |

---

## What's Mocked

| Dependency | Mock Strategy |
|-----------|---------------|
| `fs.readFileSync` | `vi.mock('fs')` — returns fake agent prompt |
| `DiscoveryPort` | Object mock — returns fake repo lists |
| `GitHubPort` | Object mock — returns fake commits |
| `ClaudePort` | Object mock — returns fake completions |
| `StorePort` | Object mock — `vi.fn()` for all methods |
| `node-cron` | Real (lightweight, no external calls) |

---

## Not Tested (and why)

| Module | Reason | Priority |
|--------|--------|----------|
| `SupabaseStoreAdapter` | Needs Supabase client mock (network I/O) | Medium |
| `GitHubAdapter` | Needs Octokit mock (network I/O) | Medium |
| `ClaudeAdapter` | Needs Anthropic SDK mock (network I/O) | Low |
| `loadEnv` | Calls `process.exit(1)` on failure — hard to test safely | Low |
| `loadSchedule` | Calls `process.exit(1)` on failure — hard to test safely | Low |
| `health/trigger routes` | Needs Express supertest setup | Medium |
| `requireApiKey` | Needs Express request/response mocks | Medium |
| `ProvisionHandler` | Stub implementation (TODO in code) | Low |

---

## Key Test Scenarios

### ChainHandler — parseSocialOutput
- Valid JSON with snake_case keys → maps to camelCase
- JSON wrapped in markdown code fences → strips fences and parses
- Invalid JSON → returns null (graceful degradation)
- Missing `contents` array → returns null
- Empty string → returns null

### AggregateHandler — commit collection
- No commits in 24h → success with empty _commitMeta
- Commits across multiple repos → collects and groups by repo
- Claude summarization fails → partial status with commit count preserved

### SweepHandler — concurrent execution
- All repos succeed → status: success
- Some repos fail → status: partial with per-repo results
- Discovery failure → propagated as Result failure

---

## Adding Tests

1. Place test files next to source: `foo.ts` → `foo.test.ts`
2. Use `vi.mock()` for external dependencies (fs, adapters)
3. Use port interfaces for dependency injection
4. Follow Arrange-Act-Assert pattern
5. Run: `npm test` (single run) or `npm run test:watch` (watch mode)
