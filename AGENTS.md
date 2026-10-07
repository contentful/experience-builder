# AGENTS.md — experience-builder

Read this before modifying any code. It routes to context and states invariants a coding agent cannot derive from source alone.

## Quick Reference

| Question | Go to |
| --- | --- |
| How the system fits together | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Specialized dev procedures | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Why past decisions were made | [docs/ADRs/](./docs/ADRs/) |
| Getting started and running tests | [README.md](./README.md) |

## Guardrails

**Browser target is Chrome 91 — `structuredClone` is not available.** The `compat/compat` ESLint rule enforces a Chrome 91 floor. `structuredClone` requires Chrome 98+; use `lodash/cloneDeep` instead. Source: `.eslintrc.cjs` browsers override.

**PostMessage `source: 'customer-app'` is a Studio contract.** Every outbound SDK message carries this exact string (see `packages/core/src/communication/sendMessage.ts`). The Studio editor filters incoming messages on this literal. Changing it silently breaks editor communication.

**Drag-and-drop lives in `packages/visual-editor`, not in the SDK.** DnD was removed from `packages/experience-builder-sdk` at the v3.0.0 breaking change. The SDK sends node coordinates via postMessage; DnD handling belongs in the host app. Adding drag-and-drop logic to the SDK is a regression.

**`packages/*/dist/` and `packages/*/build/` are build outputs — never edit them.** They are overwritten on every `npm run build`.

**SSR: guard every `window` access.** Follow the pattern in `packages/core/src/communication/sendMessage.ts`: early-return when `typeof window === 'undefined'`. All new browser-global access must be guarded.

**`'use client'` is required on consumer-facing components.** `packages/experience-builder-sdk/src/ExperienceRoot.tsx` carries this directive. Any new top-level component that uses React hooks or browser APIs needs it for Next.js RSC compatibility.

## Safety & Permissions

- Edit freely inside `packages/*/src/`.
- Never edit `packages/*/dist/`, `packages/*/build/`, or `node_modules/`.
- All changes to `main`, `next`, and `development` go through pull requests — no direct pushes.
- Changes to `.github/workflows/` affect NPM releases; request team review before merging.

**High-impact areas — test in test apps before merging:**
- `packages/core/src/communication/` — postMessage pipeline; a regression here silently breaks Studio ↔ SDK communication for all editors.
- `packages/core/src/entity/` (EntityStore) — Zustand store; re-render-sensitive. Use `useShallow` for object selectors.
- `packages/experience-builder-sdk/src/ExperienceRoot.tsx` — the consumer entry point; any render-frequency regression affects all SDK users.

## Build & Quality

Commands are in `package.json`. One is not:

```bash
npx nx reset   # clears the NX build cache; run when npm run build hangs without an error
```

`packages/experience-builder-sdk` uses Jest; `core`, `visual-editor`, `components`, and `validators` use Vitest. `npm run test` from the repo root runs all suites.
