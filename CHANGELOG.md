# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.3.0...v1.4.0-beta.0) (2024-05-15)

### Bug Fixes

- not generate styles on csr if generated on ssr [SPA-2049] ([#600](https://github.com/contentful/experience-builder/issues/600)) ([149a569](https://github.com/contentful/experience-builder/commit/149a56978043fd799fce5d09b47626f2d414cf93))

### Features

- **validators:** add optional slotId to component tree node ([6abf9b3](https://github.com/contentful/experience-builder/commit/6abf9b34f7323125bbc02e64f3dbdcc68429f078))

# [1.3.0](https://github.com/contentful/experience-builder/compare/v1.3.0-beta.0...v1.3.0) (2024-05-06)

**Note:** Version bump only for package @contentful/experience

# [1.3.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.2.0...v1.3.0-beta.0) (2024-05-06)

### Bug Fixes

- remove check if no margin ([aa1421e](https://github.com/contentful/experience-builder/commit/aa1421edb0ebb03d31f428727239dcab348bbaac))

### Features

- **experiences:** implement layer renaming ([#597](https://github.com/contentful/experience-builder/issues/597)) ([6cde60e](https://github.com/contentful/experience-builder/commit/6cde60e0973e9038ef998f0209223667b4da211d))

# [1.2.0](https://github.com/contentful/experience-builder/compare/v1.2.0-beta.0...v1.2.0) (2024-04-30)

**Note:** Version bump only for package @contentful/experience

# [1.2.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.1.0...v1.2.0-beta.0) (2024-04-30)

### Features

- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))

# [1.1.0](https://github.com/contentful/experience-builder/compare/v1.1.0-beta.0...v1.1.0) (2024-04-29)

**Note:** Version bump only for package @contentful/experience

# [1.1.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.9-beta.0...v1.1.0-beta.0) (2024-04-29)

### Bug Fixes

- **visual-editor:** show canvas hover state in layers tab [ALT-787] ([#587](https://github.com/contentful/experience-builder/issues/587)) ([8541e97](https://github.com/contentful/experience-builder/commit/8541e974b675e5645be6a457ba4d2b6541c372a0))

### Features

- **validators:** add optional displayName to ComponentTreeNode [ALT-780] ([#590](https://github.com/contentful/experience-builder/issues/590)) ([44f51b0](https://github.com/contentful/experience-builder/commit/44f51b01dbd7ee97fc48ae5950812f9e65c263c2))

## [1.0.9-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.8...v1.0.9-beta.0) (2024-04-26)

### Bug Fixes

- **visual-editor:** show hovered component outlines when hovering the layers tab [ALT-673] ([#584](https://github.com/contentful/experience-builder/issues/584)) ([34f0dee](https://github.com/contentful/experience-builder/commit/34f0dee341ac411730885ba060bebbeff2408f52))

## [1.0.8](https://github.com/contentful/experience-builder/compare/v1.0.8-beta.0...v1.0.8) (2024-04-26)

**Note:** Version bump only for package @contentful/experience

## [1.0.8-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.7...v1.0.8-beta.0) (2024-04-26)

### Bug Fixes

- fix for preview/delivery mode ([30e0746](https://github.com/contentful/experience-builder/commit/30e07465b0a5f176b68846ad434857d214e1befe))
- use default values for componentValue properties ([53d9f79](https://github.com/contentful/experience-builder/commit/53d9f79f5481fb395acf62ff65bbdce9f9226fc5))

## [1.0.7](https://github.com/contentful/experience-builder/compare/v1.0.7-beta.0...v1.0.7) (2024-04-25)

**Note:** Version bump only for package @contentful/experience

## [1.0.7-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.6...v1.0.7-beta.0) (2024-04-25)

### Bug Fixes

- activate original dropzone when moving root-level components [ALT-746] ([#572](https://github.com/contentful/experience-builder/issues/572)) ([7d0a2d8](https://github.com/contentful/experience-builder/commit/7d0a2d859461f3fbbc1b9ba48b6256da2eb691b0))
- **visual-editor:** extra dropzone padding when dragging [ALT-746] ([#575](https://github.com/contentful/experience-builder/issues/575)) ([2bbc88c](https://github.com/contentful/experience-builder/commit/2bbc88c8a7b540763e6f7727463305e574ffaded))

### Features

- **components:** add loading attribute to image component ([#577](https://github.com/contentful/experience-builder/issues/577)) ([8115c53](https://github.com/contentful/experience-builder/commit/8115c53a0a7d045f514a5681a24049487f7d1dc6))
- update definitions of fill to use 100% for components ([e29c08e](https://github.com/contentful/experience-builder/commit/e29c08e3a46782b75cc4a85a1541fc1120247089))

## [1.0.6](https://github.com/contentful/experience-builder/compare/v1.0.6-beta.0...v1.0.6) (2024-04-18)

**Note:** Version bump only for package @contentful/experience

## [1.0.6-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.5...v1.0.6-beta.0) (2024-04-18)

### Bug Fixes

- don't track errors thrown from imported components ([070360f](https://github.com/contentful/experience-builder/commit/070360f1910c73ba0c81e2d24b9c64fb812cdf32))
- **visual-editor:** allow first and last root dropzones to activate when moving components [ALT-746] ([#571](https://github.com/contentful/experience-builder/issues/571)) ([090181e](https://github.com/contentful/experience-builder/commit/090181e7f923a7146b1dc4af181c2f3c4fb3e02e))

## [1.0.5](https://github.com/contentful/experience-builder/compare/v1.0.5-beta.0...v1.0.5) (2024-04-16)

**Note:** Version bump only for package @contentful/experience

## [1.0.5-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.4...v1.0.5-beta.0) (2024-04-16)

### Bug Fixes

- clean up the wrong entry ([cfe24a1](https://github.com/contentful/experience-builder/commit/cfe24a196c65f64d7593dfbc2c74de9bc8e6f12b))
- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))
- unit tests ([7e6fa8a](https://github.com/contentful/experience-builder/commit/7e6fa8a31a9b5bf0354aa1ee59ddaa4c4170c63c))

### Features

- first draft ([5c9f00d](https://github.com/contentful/experience-builder/commit/5c9f00d744d6499aa83140d60fda780717e60c25))
- make delivery and preview work ([65c45dd](https://github.com/contentful/experience-builder/commit/65c45dd52fd9226c6af356303089391fda59f38e))
- make local override possbible ([b80703d](https://github.com/contentful/experience-builder/commit/b80703dddde977438e2911cfb8270d6440ab27f9))
- test app stuff ([70a582b](https://github.com/contentful/experience-builder/commit/70a582b430e1e7d5f522b0c1c90757cfcbca512f))

## [1.0.4](https://github.com/contentful/experience-builder/compare/v1.0.4-beta.0...v1.0.4) (2024-04-12)

**Note:** Version bump only for package @contentful/experience

## [1.0.4-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.3...v1.0.4-beta.0) (2024-04-12)

### Bug Fixes

- cleanup ([6f418e1](https://github.com/contentful/experience-builder/commit/6f418e103f141e1345fcf58d453ff2199e07793e))
- linting ([c41896b](https://github.com/contentful/experience-builder/commit/c41896b3d9d8df0093aad7bacce2e02b4832a90f))
- make all fields work for media ([6e2ca86](https://github.com/contentful/experience-builder/commit/6e2ca866bb0f39f80ddf85e48acdb3e360f330c2))
- make deep binding for images work for custom components ([c7577da](https://github.com/contentful/experience-builder/commit/c7577dad9b74404365a420dbb9463d6ae0ac289b))
- remove testing component ([b60a4d2](https://github.com/contentful/experience-builder/commit/b60a4d20a9eb04496b19aa00c5ac735fec619eae))
- review follow up ([97a6a78](https://github.com/contentful/experience-builder/commit/97a6a78a82fbe2646dd0456fa2d9a2c44ee13136))

## [1.0.3](https://github.com/contentful/experience-builder/compare/v1.0.3-beta.0...v1.0.3) (2024-04-12)

**Note:** Version bump only for package @contentful/experience

## [1.0.3-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.2...v1.0.3-beta.0) (2024-04-12)

### Bug Fixes

- allow root-level structure components to be reparented into siblings [ALT-561] ([#555](https://github.com/contentful/experience-builder/issues/555)) ([43cc1cb](https://github.com/contentful/experience-builder/commit/43cc1cbb58dcd3a0471925f2abc1bd554e8be981))
- test ([f9f80e9](https://github.com/contentful/experience-builder/commit/f9f80e9f18687da17d4fc3a36d78af63e679e105))

### Features

- add hyperlink to component definition ([6ced4ba](https://github.com/contentful/experience-builder/commit/6ced4ba433cd2c20f481bc890ced665719f70287))

## [1.0.2](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.1...v1.0.2) (2024-04-04)

**Note:** Version bump only for package @contentful/experience

## [1.0.2-beta.1](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.0...v1.0.2-beta.1) (2024-04-04)

### Bug Fixes

- **components:** rich text formatting [ALT-585] ([#533](https://github.com/contentful/experience-builder/issues/533)) ([865608d](https://github.com/contentful/experience-builder/commit/865608d26d3a7f63c188c71f81d86ecabea12cbc))
- **visual-editor:** select component when image loads [ALT-646] ([#537](https://github.com/contentful/experience-builder/issues/537)) ([95a9c92](https://github.com/contentful/experience-builder/commit/95a9c9200035f06a943e9c1688757cafccbcb400))

### Features

- [SPA-1774] add hyperlink value to schema ([#540](https://github.com/contentful/experience-builder/issues/540)) ([5ce6203](https://github.com/contentful/experience-builder/commit/5ce6203f013fe5dde25d98ba64fa3714cc0565c0))

## [1.0.2-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.1...v1.0.2-beta.0) (2024-04-04)

**Note:** Version bump only for package @contentful/experience

## [1.0.1](https://github.com/contentful/experience-builder/compare/v1.0.1-beta.0...v1.0.1) (2024-03-29)

**Note:** Version bump only for package @contentful/experience

## [1.0.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.0...v1.0.1-beta.0) (2024-03-29)

### Bug Fixes

- **storybook-plugin:** working with the latest SDK on storybook v7 ([#531](https://github.com/contentful/experience-builder/issues/531)) ([8bbe30f](https://github.com/contentful/experience-builder/commit/8bbe30f0ff17c62bbfee7776e330dd7065d2f497))

### Features

- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experience

## [0.0.1-beta.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2024-03-26)

- fix(components)!: removing styles.css file from components (#526) ([5113a1a](https://github.com/contentful/experience-builder/commit/5113a1a24e0cced9df49563595f6f4ac74452c49)), closes [#526](https://github.com/contentful/experience-builder/issues/526)

### BREAKING CHANGES

- If you were previously importing styles.css from '@contentful/experiences-components-react' you no longer need to do so. This file is no longer built and can be removed safely from any apps that were importing it.

## 0.0.1-beta.0 (2024-03-26)

### BREAKING CHANGES

- Any existing experiences using the basic components will need to be updated. To
  do so, import and run the `maintainBasicComponentIdsWithoutPrefix` method and
  run it early on in your application (before the first `ExperienceRoot` is
  rendered) like so:

```tsx
import { maintainBasicComponentIdsWithoutPrefix } from '@contentful/experiences-sdk-react';
maintainBasicComponentIdsWithoutPrefix();
```

This will register a set of the basic components with the older ids and allow
your experiences to continue to work. To migrate to the new components, replace
any of the components marked with "[OLD]" in the editor with their newer
counterparts (without the '[OLD]').

The `maintainBasicComponentIdsWithoutPrefix` is meant to help older experiences
built on a early alpha release to migrate and will be removed in the next major
release.
