---
name: new-feature
description: Scaffolds a new feature with all required files following project conventions. Creates component, types, API integration, and test stubs. Use /new-feature [description] to invoke.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Grep, Glob
argument-hint: "[feature description]"
---

# New Feature Scaffolding

Scaffold a complete feature based on the description provided.

Feature request: `$ARGUMENTS`
Project structure: !`ls src/ 2>/dev/null || echo "no src/ directory"`
Package manager: !`[ -f bun.lockb ] && echo "bun" || ([ -f pnpm-lock.yaml ] && echo "pnpm" || ([ -f yarn.lock ] && echo "yarn" || echo "npm"))`
Framework: !`cat package.json 2>/dev/null | grep -oE '"(react|next|vue|svelte|express)"' | head -1 || echo "unknown"`
Existing features: !`ls src/features/ 2>/dev/null || ls src/pages/ 2>/dev/null || ls src/components/ 2>/dev/null | head -10 || echo "no feature dirs"`

## Step 1: Understand the Project

Read these files to understand project conventions:
- `src/` directory structure (feature-based, page-based, or flat)
- An existing feature/component as reference for patterns
- `tsconfig.json` for path aliases
- Routing setup (react-router, file-based, etc.)

Determine the project pattern:
- **Feature-based:** `src/features/<name>/` with components, hooks, types, api
- **Page-based:** `src/pages/<name>/` with co-located components
- **Flat:** `src/components/`, `src/hooks/`, `src/types/` separated by type

## Step 2: Plan the Feature

Based on the description and project pattern, determine which files to create:

| File Type | When needed | Example path |
|-----------|------------|-------------|
| **Component** | Always (for UI features) | `src/features/<name>/<Name>.tsx` |
| **Types** | Always | `src/features/<name>/types.ts` |
| **Hook** | When state/logic is needed | `src/features/<name>/use<Name>.ts` |
| **API** | When backend calls are needed | `src/features/<name>/api.ts` |
| **Test** | Always | `src/features/<name>/<Name>.test.tsx` |
| **Route** | When new page is needed | Update router config |

## Step 3: Analyze Dependencies

Check if required libraries are already installed:
- UI components (shadcn, MUI, etc.)
- Form handling (react-hook-form, zod)
- State management (zustand, context)
- API client (tanstack-query, fetch wrapper, supabase client)

Do NOT install new dependencies. Use what the project already has.

## Step 4: Create Files

For each file, follow these rules:
- Match existing import patterns and path aliases
- Match existing naming conventions (PascalCase components, camelCase hooks)
- Match existing code style (arrow functions vs declarations, export style)
- Use existing UI component library, not raw HTML
- Use existing API patterns (supabase client, fetch wrapper, etc.)
- Types must be explicit TypeScript, no `any`
- Error handling must follow the project's error envelope pattern

### Component Template Priorities

1. If project uses shadcn/ui: use shadcn components
2. If project uses another UI library: use that
3. Otherwise: semantic HTML with existing CSS approach

### API Integration

1. If project uses Supabase: use the existing supabase client
2. If project uses tanstack-query: create query/mutation hooks
3. If project uses a custom API layer: follow that pattern

## Step 5: Wire Up

- Add route entry if this is a new page
- Add navigation link if appropriate
- Export from barrel files (`index.ts`) if the project uses them
- Do NOT modify unrelated files

## Step 6: Test Stubs

Create a test file with:
- `describe` block with the feature name
- `it.todo()` stubs for each testable behavior
- Correct imports and mock setup ready to fill in

Do NOT write full test implementations — only stubs. Use `/test-gen` for full tests.

## Step 7: Summary

Output:
```
## Feature Scaffolded: <name>

### Files Created
- <path> — <what it contains>

### Files Modified
- <path> — <what was changed>

### Next Steps
- [ ] Implement component logic in <file>
- [ ] Add API queries in <file> (if applicable)
- [ ] Run /test-gen <component> to generate tests
- [ ] Add to navigation (if not auto-wired)
```
