# ADR-0001: Migrate validators package to Zod v4

**Date:** 2025-09  
**Status:** Accepted  
**Deciders:** Experience Assembly team

---

## Context

`@contentful/experiences-validators` uses [Zod](https://zod.dev) to define and enforce the schema for experience entries, component definitions, data sources, and pattern entries. The package previously depended on Zod v3.

Zod v4 was released with significant improvements:

- Smaller bundle size and faster parse performance
- Stricter TypeScript types
- Breaking changes to issue shape (dropped `input` and `received` fields from `invalid_type` issues; new `invalid_key` issue code for record key failures; changed `invalid_value`/`invalid_format` message formats)

Several peer and transitive dependencies in the monorepo were already pulling in Zod v4, creating duplicate installs and potential version conflicts. Renovate flagged the upgrade.

## Decision

Upgrade `@contentful/experiences-validators` to Zod v4 and add a `"zod": "^4.0.0"` override in the root `package.json` so all workspace packages resolve a single Zod version.

Adapt `zodToContentfulError.ts` to Zod v4's changed issue shape:

- **`invalid_type`** — parse `issue.message` (format `"Invalid input: expected X, received Y"`) to recover the received type, since `issue.received` is no longer present.
- **`invalid_key`** — new issue code wrapping record key validation failures; forward to the inner issue while preserving the outer path.
- **Message changes** — update `too_small` / `too_big`, `invalid_value`, and `invalid_format` expected strings in tests to match Zod v4 defaults.

## Consequences

**Positive**

- Single Zod version across the monorepo eliminates duplicate install risk.
- Consumers of `@contentful/experiences-validators` get a smaller validators bundle.
- Zod v4's stricter types surface misuse at compile time.

**Negative / risks**

- Zod v4 is a breaking change for any downstream code that imports Zod types directly from this package's re-exports. Consumers relying on Zod v3 issue shapes in custom error handlers will need to update.
- The `invalid_type` received-type recovery relies on parsing the Zod-generated message string. If Zod changes its message format in a future minor/patch, the regex (`/received (\S+)$/`) will break silently and misclassify type errors as required-field errors. A future ADR should track whether Zod exposes `received` again.
