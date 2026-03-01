---
name: test-gen
description: Generates Vitest unit tests for a given file. Analyzes exports, dependencies, and edge cases. Use /test-gen [file] to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob, Write
argument-hint: "[filename]"
---

# Test Generator

Generate comprehensive Vitest unit tests for the specified file.

Target file: `$ARGUMENTS`
Test framework: !`cat package.json 2>/dev/null | grep -o '"vitest"' | head -1 || echo "vitest not found"`
Existing tests: !`find src -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" 2>/dev/null | head -10 || echo "none found"`

## Step 1: Analyze the Target File

Read `$ARGUMENTS` and extract:
- All exported functions, classes, components, and types
- Dependencies and imports (what needs mocking)
- Side effects (API calls, database queries, file system access)
- Input parameter types and return types

## Step 2: Check for Existing Tests

Search for existing test files:
- `<filename>.test.ts` / `<filename>.test.tsx`
- `<filename>.spec.ts` / `<filename>.spec.tsx`
- `__tests__/<filename>.ts`

If tests exist, read them and only add missing coverage. Do NOT duplicate existing test cases.

## Step 3: Identify Test Cases

For each export, determine:

| Category | What to test |
|----------|-------------|
| **Happy path** | Normal input produces expected output |
| **Edge cases** | Empty input, null/undefined, boundary values |
| **Error paths** | Invalid input, thrown errors, rejected promises |
| **Async** | Promise resolution/rejection, timeout behavior |
| **Dependencies** | Mock external calls (API, DB, third-party libs) |

## Step 4: Follow Existing Conventions

If existing test files were found in Step 2, match their:
- Import style (`import { describe } from 'vitest'` vs global)
- Mock patterns (`vi.mock`, `vi.fn`, `vi.spyOn`)
- File naming convention (`.test.ts` vs `.spec.ts`)
- Describe/it block structure
- Assertion style (`expect().toBe()`, `expect().toEqual()`)

If no existing tests, use this default structure:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
```

## Step 5: Generate Tests

Write the test file next to the source file (e.g., `src/utils/calc.ts` -> `src/utils/calc.test.ts`).

Rules:
- One `describe` block per exported function/component
- Descriptive test names: `it('returns empty array when input is empty')`
- Arrange-Act-Assert pattern in each test
- Mock external dependencies, never call real APIs/DB
- Test the public interface, not implementation details
- For React components: use `@testing-library/react` if available, otherwise test logic only

## Step 6: Verify

Run the generated tests:

```bash
npx vitest run <test-file-path> --reporter=verbose
```

If tests fail:
- Read the error output
- Fix the test (not the source code)
- Re-run until all pass

## Step 7: Summary

Output:
- Number of test cases generated
- Coverage areas: happy path, edge cases, error paths
- Any exports that were NOT tested (and why)
- Test run result: PASS / FAIL
