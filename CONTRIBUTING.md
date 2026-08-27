# CONTRIBUTING.md — experience-builder

## Conventions

- **Commits** — follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `type(scope): subject`. Types used in this repo: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`. Scope is typically the package name (e.g., `fix(visual-editor): ...`). Source: `commitlint.config.cjs` and `git log`.
- **Branches** — create feature branches from `development` using `<type>/<short-description>` (e.g., `fix/image-transform-recovery`). Source: `git log --oneline`.
- **Pull requests** — open against `development` for all normal work. Use **Squash and merge** into `development`. Use **Create a merge commit** when merging `development` → `next` → `main`. Source: `README.md` § Branching & release process.

## Specialized Procedures

### Release process

The full release process is documented in `README.md` § [Branching & release process](./README.md#branching--release-process). The three-branch model (`development` → `next` → `main`) is non-obvious; read that section before opening a release PR.

Key points not in README:
- CI publishes automatically after merge; never run `npm publish` manually.
- A prerelease of any branch can be published by manually triggering the main workflow via the GitHub Actions UI and checking "Publish prerelease version of the selected branch".
- Hotfixes against `main` branch directly off `main`; they auto-merge back into `next` and `development` via CI.

### Adding new functionality

When adding a new built-in component, follow the pattern of existing components in `packages/components/src/`. Any consumer-facing component or hook must include the `'use client'` directive (required for Next.js RSC compatibility) — see `packages/experience-builder-sdk/src/ExperienceRoot.tsx` as the canonical example. New exports must be added to `packages/experience-builder-sdk/src/index.ts`; additions to the public API surface trigger a semver-minor bump, and removals are breaking changes.

### Dependency cruiser

Module boundary rules are enforced per package by `dependency-cruiser`. Run `npm run depcruise` to validate inter-package imports. Config files live at `packages/*/.dependency-cruiser.cjs`. Violations fail CI.

When adding a new cross-package import, update the relevant `.dependency-cruiser.cjs` before opening a PR.

## File-Level Guidance

| Path | Why restricted |
| --- | --- |
| `packages/*/dist/` | Build output — overwritten by `npm run build`; never hand-edit |
| `packages/*/build/` | Build output — same as above |
| `packages/experience-builder-sdk/src/index.ts` | Public API surface — additions require a semver-minor bump; removals are a breaking change |
| `.github/workflows/publish.yaml` | Controls npm releases and downstream branch merges; changes affect all published packages |
