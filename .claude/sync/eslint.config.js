import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Canonical richi-solutions ESLint config — distributed via orchestrator sync.
// Enforces the architecture & type-safety gates from rdf.md §01/§13 and the
// runtime-contract deployment gate.
//
// IMPORTANT: this file is copied to every repo's root by sync-dotclaude.yml and
// pushed directly to main. It therefore MUST load with only the plugins already
// present in every repo's baseline (typescript-eslint, react-hooks,
// react-refresh) — no new devDependencies, or ESLint would fail to load
// everywhere. Heavier rules that need extra plugins (eslint-plugin-boundaries
// for full layer isolation, type-checked rules) are added per-project by
// /scaffold-project for greenfield strictness; here the adapter boundary is
// enforced with core no-restricted-imports, which needs no plugin.

// Banned type-assertion escapes. Pure-syntax selectors (no type info needed),
// so they run anywhere. These are the patterns that let a stale generated
// types.ts hide real errors — the root cause behind the cast debt.
const BANNED_ASSERTIONS = [
  {
    selector: "TSAsExpression > TSAnyKeyword",
    message:
      "`as any` is banned. Type it correctly, or regenerate the Supabase types (`supabase gen types`).",
  },
  {
    selector: "TSAsExpression > TSNeverKeyword",
    message:
      "`as never` is banned. It almost always means a stale generated types.ts — run `supabase gen types` so the table/RPC is known.",
  },
  {
    selector: "TSAsExpression > TSUnknownKeyword",
    message:
      "`as unknown as` double-assertion is banned. Narrow the type properly instead of erasing it.",
  },
];

// Only the adapter layer (and the generated integration client itself) may
// import the Supabase client. UI, pages, hooks, domain must go through an
// adapter — this keeps external I/O behind the boundary (rdf.md §02).
const SUPABASE_CLIENT_PATTERNS = [
  "@/integrations/supabase/client",
  "**/integrations/supabase/client",
  "@/lib/supabase",
  "**/lib/supabase",
];

export default tseslint.config(
  { ignores: ["dist", "supabase/functions/**", "**/*.config.{js,ts}"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Type-safety gate (rdf.md §01 — Type Safety invariant). Errors block CI.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "no-restricted-syntax": ["error", ...BANNED_ASSERTIONS],

      // Hygiene — visible but non-blocking so it does not bury PRs in unrelated
      // noise. Tighten to "error" per-repo once the backlog is clear.
      "@typescript-eslint/no-unused-vars": "warn",

      // Architecture boundary gate (rdf.md §02). Errors block CI.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: SUPABASE_CLIENT_PATTERNS,
              message:
                "Import the Supabase client only inside src/adapters/**. UI, pages, hooks and domain must call an adapter, not the client directly.",
            },
          ],
        },
      ],

      // File-size gate (rdf.md §02 — no god files). Warn first; scaffold sets
      // this to "error" for new repos, and existing repos flip it after the
      // god-file decomposition phase.
      "max-lines": ["warn", { max: 400, skipBlankLines: true, skipComments: true }],
    },
  },

  // Adapters and the generated integration client are the only places allowed
  // to import the Supabase client.
  {
    files: ["src/adapters/**", "src/integrations/supabase/**"],
    rules: { "no-restricted-imports": "off" },
  },

  // Generated Supabase types are huge and contain inevitable `any`/large size —
  // never lint them.
  {
    files: ["src/integrations/supabase/types.ts"],
    rules: {
      "max-lines": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Tests legitimately mock and cast — relax the type-safety escapes here.
  {
    files: ["**/*.test.{ts,tsx}", "src/test/**", "e2e/**"],
    rules: {
      "no-restricted-syntax": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "max-lines": "off",
    },
  },
);
