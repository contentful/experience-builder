# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/contentful/experience-builder/compare/v2.0.0...v2.0.1) (2025-07-11)

### Bug Fixes

- remove unnecessary node removal check in getTreeDiff function ([df67176](https://github.com/contentful/experience-builder/commit/df67176ff0313ff8ab180274c0f8e340d73cad97))

## [2.0.0](https://github.com/contentful/experience-builder/compare/v1.42.3...v2.0.0) (2025-07-07)

### ⚠ BREAKING CHANGES

- manually resolving links [SPA-2754] PR to merge into v2-prerelease branch (#1139)
- merge breakpoint defaults for visual editor and SSR [SPA-2602] (#1125)

### Features

- manually resolving links [SPA-2754] PR to merge into v2-prerelease branch ([#1139](https://github.com/contentful/experience-builder/issues/1139)) ([7e472c3](https://github.com/contentful/experience-builder/commit/7e472c3ff5c61778e6dd1b256b5a8d05bc5df6ec)), closes [#1109](https://github.com/contentful/experience-builder/issues/1109)

### Bug Fixes

- handle undefined defaultvalue in merge functionality ([#1211](https://github.com/contentful/experience-builder/issues/1211)) ([709c21e](https://github.com/contentful/experience-builder/commit/709c21e1ba093af3034757854cb47b5fb85dc831))
- merge breakpoint defaults for visual editor and SSR [SPA-2602] ([#1125](https://github.com/contentful/experience-builder/issues/1125)) ([d60171d](https://github.com/contentful/experience-builder/commit/d60171d26923a38673cb5f062c04024ffd9fe588))

## [1.42.3](https://github.com/contentful/experience-builder/compare/v1.42.2...v1.42.3) (2025-07-02)

### Bug Fixes

- ship CSS-in-JS instead of importing CSS for Nextjs support [SPA-2865] ([#1205](https://github.com/contentful/experience-builder/issues/1205)) ([c516f4d](https://github.com/contentful/experience-builder/commit/c516f4dbb582a33cf02bd26d699a92941e94de8e))

## [1.42.2](https://github.com/contentful/experience-builder/compare/v1.42.1...v1.42.2) (2025-06-30)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.42.1](https://github.com/contentful/experience-builder/compare/v1.42.0...v1.42.1) (2025-06-30)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.42.0](https://github.com/contentful/experience-builder/compare/v1.41.0...v1.42.0) (2025-06-27)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.41.0](https://github.com/contentful/experience-builder/compare/v1.40.2...v1.41.0) (2025-06-13)

### Features

- remove explicit border box [SPA-2792] ([#1173](https://github.com/contentful/experience-builder/issues/1173)) ([85aabd5](https://github.com/contentful/experience-builder/commit/85aabd525a5f0bd961fc011bb02409eff1b0a227))

### Bug Fixes

- handle unexpected scenarios gracefully or render better error message ([#1170](https://github.com/contentful/experience-builder/issues/1170)) ([618fdd9](https://github.com/contentful/experience-builder/commit/618fdd9681a62eb8dd4f57c9bc6947d2c61dac74))

## [1.40.2](https://github.com/contentful/experience-builder/compare/v1.40.1...v1.40.2) (2025-06-10)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.40.1](https://github.com/contentful/experience-builder/compare/v1.40.0...v1.40.1) (2025-06-06)

### Bug Fixes

- **delivery:** use disjunct media queries to only hide for explicit breakpoints [SPA-2782[ ([#1158](https://github.com/contentful/experience-builder/issues/1158)) ([83179af](https://github.com/contentful/experience-builder/commit/83179af1e99d7d4718f725a8d45b1244bc538892))

## [1.40.0](https://github.com/contentful/experience-builder/compare/v1.39.0...v1.40.0) (2025-06-04)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.39.0](https://github.com/contentful/experience-builder/compare/v1.38.0...v1.39.0) (2025-06-03)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.38.0](https://github.com/contentful/experience-builder/compare/v1.37.2...v1.38.0) (2025-05-23)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.37.2](https://github.com/contentful/experience-builder/compare/v1.37.1...v1.37.2) (2025-05-15)

### Bug Fixes

- [SPA-2694] consider iframe horizontal scroll when sending mouse move position ([#1118](https://github.com/contentful/experience-builder/issues/1118)) ([0515759](https://github.com/contentful/experience-builder/commit/0515759b2e46e485fc85f00dc305864dae8ee453))
- remove unused variable from useSingleColumn hook ([#1106](https://github.com/contentful/experience-builder/issues/1106)) ([cfcf3a2](https://github.com/contentful/experience-builder/commit/cfcf3a2cbb5f7e2b881f6a2b5d7da8ff408f9bba))

## [1.37.1](https://github.com/contentful/experience-builder/compare/v1.37.0...v1.37.1) (2025-04-24)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.37.0](https://github.com/contentful/experience-builder/compare/v1.36.0...v1.37.0) (2025-04-23)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.36.0](https://github.com/contentful/experience-builder/compare/v1.35.1...v1.36.0) (2025-04-17)

### Bug Fixes

- add debug log for REQUESTED_ENTITIES as well ([#1079](https://github.com/contentful/experience-builder/issues/1079)) ([fbd5fc1](https://github.com/contentful/experience-builder/commit/fbd5fc1bad21a48409b8bbc205b9b882cf67c5fe))
- hiding nodes bug [SPA-2656] ([#1071](https://github.com/contentful/experience-builder/issues/1071)) ([7860e70](https://github.com/contentful/experience-builder/commit/7860e702eeb604777dc684ba72233e651735ae59))
- pattern only has width 100% if its first top level node has ([fed746d](https://github.com/contentful/experience-builder/commit/fed746dcc5c6d771f1a77944a37ab6262bd2676b))
- set pattern wrapper height to 100% only when the main component has 100% height ([#1080](https://github.com/contentful/experience-builder/issues/1080)) ([a3614ea](https://github.com/contentful/experience-builder/commit/a3614ea792095c61ccdde1232035c1da187abbac))

## [1.35.1](https://github.com/contentful/experience-builder/compare/v1.35.0...v1.35.1) (2025-03-26)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.35.0](https://github.com/contentful/experience-builder/compare/v1.35.0-beta.0...v1.35.0) (2025-03-24)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.34.1](https://github.com/contentful/experience-builder/compare/v1.34.1-beta.0...v1.34.1) (2025-03-05)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.34.0](https://github.com/contentful/experience-builder/compare/v1.34.0-beta.0...v1.34.0) (2025-03-03)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.33.3](https://github.com/contentful/experience-builder/compare/v1.33.3-beta.0...v1.33.3) (2025-02-28)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.33.2](https://github.com/contentful/experience-builder/compare/v1.33.2-beta.0...v1.33.2) (2025-02-26)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.33.1](https://github.com/contentful/experience-builder/compare/v1.33.1-beta.0...v1.33.1) (2025-02-24)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.33.0](https://github.com/contentful/experience-builder/compare/v1.33.0-beta.0...v1.33.0) (2025-02-20)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.32.0](https://github.com/contentful/experience-builder/compare/v1.32.0-beta.0...v1.32.0) (2025-02-20)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.31.1](https://github.com/contentful/experience-builder/compare/v1.31.1-beta.0...v1.31.1) (2025-02-19)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.31.0](https://github.com/contentful/experience-builder/compare/v1.31.0-beta.0...v1.31.0) (2025-02-18)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.30.5](https://github.com/contentful/experience-builder/compare/v1.30.5-beta.0...v1.30.5) (2025-02-10)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.30.4](https://github.com/contentful/experience-builder/compare/v1.30.4-beta.0...v1.30.4) (2025-02-06)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.30.3](https://github.com/contentful/experience-builder/compare/v1.30.3-beta.0...v1.30.3) (2025-02-04)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.30.2](https://github.com/contentful/experience-builder/compare/v1.30.2-beta.0...v1.30.2) (2025-02-01)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.30.1](https://github.com/contentful/experience-builder/compare/v1.30.1-beta.0...v1.30.1) (2025-01-31)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.30.0](https://github.com/contentful/experience-builder/compare/v1.30.0-beta.0...v1.30.0) (2025-01-29)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.29.0](https://github.com/contentful/experience-builder/compare/v1.29.0-beta.0...v1.29.0) (2025-01-23)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.28.3](https://github.com/contentful/experience-builder/compare/v1.28.3-beta.0...v1.28.3) (2025-01-22)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.28.2](https://github.com/contentful/experience-builder/compare/v1.28.2-beta.0...v1.28.2) (2025-01-20)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.28.1](https://github.com/contentful/experience-builder/compare/v1.28.1-beta.0...v1.28.1) (2025-01-13)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.28.0](https://github.com/contentful/experience-builder/compare/v1.28.0-beta.0...v1.28.0) (2025-01-09)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.27.1](https://github.com/contentful/experience-builder/compare/v1.27.0...v1.27.1) (2024-12-19)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.27.0](https://github.com/contentful/experience-builder/compare/v1.27.0-beta.0...v1.27.0) (2024-12-17)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.26.0](https://github.com/contentful/experience-builder/compare/v1.26.0-beta.0...v1.26.0) (2024-12-10)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.25.1](https://github.com/contentful/experience-builder/compare/v1.25.1-beta.0...v1.25.1) (2024-12-09)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.25.0](https://github.com/contentful/experience-builder/compare/v1.25.0-beta.0...v1.25.0) (2024-12-06)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.24.0](https://github.com/contentful/experience-builder/compare/v1.24.0-beta.0...v1.24.0) (2024-12-04)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.23.0](https://github.com/contentful/experience-builder/compare/v1.23.0-beta.0...v1.23.0) (2024-12-03)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.22.0](https://github.com/contentful/experience-builder/compare/v1.22.0-beta.0...v1.22.0) (2024-11-08)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.21.0](https://github.com/contentful/experience-builder/compare/v1.21.0-beta.0...v1.21.0) (2024-11-06)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.20.1](https://github.com/contentful/experience-builder/compare/v1.20.1-beta.0...v1.20.1) (2024-11-04)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.20.0](https://github.com/contentful/experience-builder/compare/v1.20.0-beta.0...v1.20.0) (2024-10-23)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.19.0](https://github.com/contentful/experience-builder/compare/v1.19.0-beta.0...v1.19.0) (2024-10-14)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.18.0](https://github.com/contentful/experience-builder/compare/v1.18.0-beta.0...v1.18.0) (2024-10-10)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.17.1](https://github.com/contentful/experience-builder/compare/v1.17.1-beta.0...v1.17.1) (2024-10-03)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.17.0](https://github.com/contentful/experience-builder/compare/v1.17.0-beta.1...v1.17.0) (2024-09-30)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.16.1](https://github.com/contentful/experience-builder/compare/v1.16.1-beta.1...v1.16.1) (2024-09-25)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.16.0](https://github.com/contentful/experience-builder/compare/v1.16.0-beta.0...v1.16.0) (2024-09-17)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.15.1](https://github.com/contentful/experience-builder/compare/v1.15.0...v1.15.1) (2024-09-12)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.15.0](https://github.com/contentful/experience-builder/compare/v1.14.0...v1.15.0) (2024-09-11)

### Features

- introduce rendering cfVisibility in SDK ([d53a8d2](https://github.com/contentful/experience-builder/commit/d53a8d2cf1f810cc0e5587d28abe1c19636fcad5))

### Bug Fixes

- assemblies incorrectly rendered on initial drop [ALT-1220] ([#742](https://github.com/contentful/experience-builder/issues/742)) ([fbf3d88](https://github.com/contentful/experience-builder/commit/fbf3d889e0a57b2f654bf45d78c2acbfd05af7e1))
- dont suppress errors in SDK code but only custom code ([5f3fa19](https://github.com/contentful/experience-builder/commit/5f3fa1994bba392c6f39ea4ade411dc4c6352660))

## [1.14.0](https://github.com/contentful/experience-builder/compare/v1.14.0-beta.0...v1.14.0) (2024-09-10)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.13.0](https://github.com/contentful/experience-builder/compare/v1.13.0-beta.0...v1.13.0) (2024-09-05)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.12.0](https://github.com/contentful/experience-builder/compare/v1.12.0-beta.0...v1.12.0) (2024-08-21)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.11.2](https://github.com/contentful/experience-builder/compare/v1.11.2-beta.0...v1.11.2) (2024-07-31)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.11.1](https://github.com/contentful/experience-builder/compare/v1.11.1-beta.0...v1.11.1) (2024-07-19)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.11.0](https://github.com/contentful/experience-builder/compare/v1.11.0-beta.0...v1.11.0) (2024-07-19)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.10.0](https://github.com/contentful/experience-builder/compare/v1.10.0-beta.0...v1.10.0) (2024-07-11)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.9.0](https://github.com/contentful/experience-builder/compare/v1.9.0-beta.0...v1.9.0) (2024-06-28)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.8.2](https://github.com/contentful/experience-builder/compare/v1.8.2-beta.0...v1.8.2) (2024-06-27)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.8.1](https://github.com/contentful/experience-builder/compare/v1.8.1-beta.0...v1.8.1) (2024-06-24)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.8.0](https://github.com/contentful/experience-builder/compare/v1.8.0-beta.0...v1.8.0) (2024-06-17)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.7.1](https://github.com/contentful/experience-builder/compare/v1.7.1-beta.0...v1.7.1) (2024-06-11)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.7.0](https://github.com/contentful/experience-builder/compare/v1.7.0-beta.0...v1.7.0) (2024-06-07)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.6.0](https://github.com/contentful/experience-builder/compare/v1.6.0-beta.0...v1.6.0) (2024-06-03)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.5.2](https://github.com/contentful/experience-builder/compare/v1.5.2-beta.0...v1.5.2) (2024-05-30)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.5.1](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.2...v1.5.1) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.5.1-beta.2](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.1...v1.5.1-beta.2) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.5.1-beta.1](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.0...v1.5.1-beta.1) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.5.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.5.0...v1.5.1-beta.0) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.5.0](https://github.com/contentful/experience-builder/compare/v1.5.0-beta.0...v1.5.0) (2024-05-16)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.5.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.4.0...v1.5.0-beta.0) (2024-05-16)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.4.0](https://github.com/contentful/experience-builder/compare/v1.4.0-beta.0...v1.4.0) (2024-05-15)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.4.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.3.0...v1.4.0-beta.0) (2024-05-15)

### Bug Fixes

- not generate styles on csr if generated on ssr [SPA-2049] ([#600](https://github.com/contentful/experience-builder/issues/600)) ([149a569](https://github.com/contentful/experience-builder/commit/149a56978043fd799fce5d09b47626f2d414cf93))

# [1.3.0](https://github.com/contentful/experience-builder/compare/v1.3.0-beta.0...v1.3.0) (2024-05-06)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.3.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.2.0...v1.3.0-beta.0) (2024-05-06)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.2.0](https://github.com/contentful/experience-builder/compare/v1.2.0-beta.0...v1.2.0) (2024-04-30)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.2.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.1.0...v1.2.0-beta.0) (2024-04-30)

### Features

- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))

# [1.1.0](https://github.com/contentful/experience-builder/compare/v1.1.0-beta.0...v1.1.0) (2024-04-29)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.1.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.9-beta.0...v1.1.0-beta.0) (2024-04-29)

### Bug Fixes

- **visual-editor:** show canvas hover state in layers tab [ALT-787] ([#587](https://github.com/contentful/experience-builder/issues/587)) ([8541e97](https://github.com/contentful/experience-builder/commit/8541e974b675e5645be6a457ba4d2b6541c372a0))

## [1.0.9-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.8...v1.0.9-beta.0) (2024-04-26)

### Bug Fixes

- **visual-editor:** show hovered component outlines when hovering the layers tab [ALT-673] ([#584](https://github.com/contentful/experience-builder/issues/584)) ([34f0dee](https://github.com/contentful/experience-builder/commit/34f0dee341ac411730885ba060bebbeff2408f52))

## [1.0.8](https://github.com/contentful/experience-builder/compare/v1.0.8-beta.0...v1.0.8) (2024-04-26)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.8-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.7...v1.0.8-beta.0) (2024-04-26)

### Bug Fixes

- use default values for componentValue properties ([53d9f79](https://github.com/contentful/experience-builder/commit/53d9f79f5481fb395acf62ff65bbdce9f9226fc5))

## [1.0.7](https://github.com/contentful/experience-builder/compare/v1.0.7-beta.0...v1.0.7) (2024-04-25)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.7-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.6...v1.0.7-beta.0) (2024-04-25)

### Bug Fixes

- activate original dropzone when moving root-level components [ALT-746] ([#572](https://github.com/contentful/experience-builder/issues/572)) ([7d0a2d8](https://github.com/contentful/experience-builder/commit/7d0a2d859461f3fbbc1b9ba48b6256da2eb691b0))
- **visual-editor:** extra dropzone padding when dragging [ALT-746] ([#575](https://github.com/contentful/experience-builder/issues/575)) ([2bbc88c](https://github.com/contentful/experience-builder/commit/2bbc88c8a7b540763e6f7727463305e574ffaded))

## [1.0.6](https://github.com/contentful/experience-builder/compare/v1.0.6-beta.0...v1.0.6) (2024-04-18)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.6-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.5...v1.0.6-beta.0) (2024-04-18)

### Bug Fixes

- don't track errors thrown from imported components ([070360f](https://github.com/contentful/experience-builder/commit/070360f1910c73ba0c81e2d24b9c64fb812cdf32))
- **visual-editor:** allow first and last root dropzones to activate when moving components [ALT-746] ([#571](https://github.com/contentful/experience-builder/issues/571)) ([090181e](https://github.com/contentful/experience-builder/commit/090181e7f923a7146b1dc4af181c2f3c4fb3e02e))

## [1.0.5](https://github.com/contentful/experience-builder/compare/v1.0.5-beta.0...v1.0.5) (2024-04-16)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.5-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.4...v1.0.5-beta.0) (2024-04-16)

### Bug Fixes

- clean up the wrong entry ([cfe24a1](https://github.com/contentful/experience-builder/commit/cfe24a196c65f64d7593dfbc2c74de9bc8e6f12b))
- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))

### Features

- first draft ([5c9f00d](https://github.com/contentful/experience-builder/commit/5c9f00d744d6499aa83140d60fda780717e60c25))
- make delivery and preview work ([65c45dd](https://github.com/contentful/experience-builder/commit/65c45dd52fd9226c6af356303089391fda59f38e))
- make local override possbible ([b80703d](https://github.com/contentful/experience-builder/commit/b80703dddde977438e2911cfb8270d6440ab27f9))

## [1.0.4](https://github.com/contentful/experience-builder/compare/v1.0.4-beta.0...v1.0.4) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.4-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.3...v1.0.4-beta.0) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.3](https://github.com/contentful/experience-builder/compare/v1.0.3-beta.0...v1.0.3) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.3-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.2...v1.0.3-beta.0) (2024-04-12)

### Bug Fixes

- allow root-level structure components to be reparented into siblings [ALT-561] ([#555](https://github.com/contentful/experience-builder/issues/555)) ([43cc1cb](https://github.com/contentful/experience-builder/commit/43cc1cbb58dcd3a0471925f2abc1bd554e8be981))

## [1.0.2](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.1...v1.0.2) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.2-beta.1](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.0...v1.0.2-beta.1) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.2-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.1...v1.0.2-beta.0) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.1](https://github.com/contentful/experience-builder/compare/v1.0.1-beta.0...v1.0.1) (2024-03-29)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [1.0.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.0...v1.0.1-beta.0) (2024-03-29)

### Features

- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [0.0.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.1...v0.0.1) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [0.0.1-beta.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## 0.0.1-beta.0 (2024-03-26)

### Bug Fixes

- add dnd cypress stub [SPA-1712] ([#270](https://github.com/contentful/experience-builder/issues/270)) ([cb88716](https://github.com/contentful/experience-builder/commit/cb887160ae9a37c8be4cb38d12419e914c6f1be1))
- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))
- add purple hover outline for assemblies [ALT-260] ([9d65eef](https://github.com/contentful/experience-builder/commit/9d65eef2ae81c3e8f191eab9aceb056a45f282b1))
- adjsut type for not defined coords ([1a34169](https://github.com/contentful/experience-builder/commit/1a341691caa65f27ec45861638620d31664bc9e0))
- adjust where the hover label goes for components and containers in xb ([5fbbe65](https://github.com/contentful/experience-builder/commit/5fbbe656be7f0f5b5fa0bfd4bbebf06a4e56b2e4))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- allows re-parenting of components, however does not allow for new containers to be created ([0614fd7](https://github.com/contentful/experience-builder/commit/0614fd77c41c63790649a8de3bc5618357d51ce9))
- assume not matching breakpoints and initialise correctly in the effect ([96c734a](https://github.com/contentful/experience-builder/commit/96c734a4b73630e2fd6a45fc9c0ae7b0778edd2b))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- **canvas-interactions:** disable dropzones that are assemblies [ALT-552] ([#465](https://github.com/contentful/experience-builder/issues/465)) ([ad87950](https://github.com/contentful/experience-builder/commit/ad87950ab27457e585839a171a157816cd43bac3))
- **canvas-interactions:** do not render hitboxes for single column ([#488](https://github.com/contentful/experience-builder/issues/488)) ([a26b0c6](https://github.com/contentful/experience-builder/commit/a26b0c602515c09378f02f175b0dd1760ab56b00))
- **canvas-interactions:** more precise coordinates while dragging [ALT-506] ([#463](https://github.com/contentful/experience-builder/issues/463)) ([f312e05](https://github.com/contentful/experience-builder/commit/f312e05e3ce8e13fc747f4e82d5718c283a75242))
- **canvas-interactions:** prevent draggables from flying off mouse cursor ([#434](https://github.com/contentful/experience-builder/issues/434)) ([9fe8e6d](https://github.com/contentful/experience-builder/commit/9fe8e6d181181d84dd73922fced233e47232923f))
- **canvas-interactions:** proper placeholders based on padding and flex direction [ALT-505] ([#485](https://github.com/contentful/experience-builder/issues/485)) ([32345e6](https://github.com/contentful/experience-builder/commit/32345e6f8e92e61af6deba939ba623145a7219ea))
- **canvas-interactions:** properly clear deselected component on canvas [] ([#484](https://github.com/contentful/experience-builder/issues/484)) ([10798c8](https://github.com/contentful/experience-builder/commit/10798c8a6ebbbeaa032c76240bf2f6e0b44bf069))
- **canvas-interactions:** selecting a component not working in nextjs app-router ([#481](https://github.com/contentful/experience-builder/issues/481)) ([a44a6ae](https://github.com/contentful/experience-builder/commit/a44a6ae44efc956f5df03247240ab1b63f5a8aa7))
- **canvas-interactions:** update dropzone indicator colors ([#472](https://github.com/contentful/experience-builder/issues/472)) ([aadea9e](https://github.com/contentful/experience-builder/commit/aadea9e47d52739d41ac9508e3110f2698501065))
- cleanup remanining new imports under experience-builder since the pr was up ([4fe1b43](https://github.com/contentful/experience-builder/commit/4fe1b436d5ac40d0a90595bb37acaa91fa4ad99f))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- empty state canvas now says add components to begin ([14a39d8](https://github.com/contentful/experience-builder/commit/14a39d82b20c19b8a4bc5466dd74675968930288))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder/commit/3e37f1518112c993456e08f74013c8a065b370fd))
- **experiences:** proper handling of reparenting off canvas ([#460](https://github.com/contentful/experience-builder/issues/460)) ([9808cfc](https://github.com/contentful/experience-builder/commit/9808cfcdae03ad6c3fee7e3bb9278db06e179467))
- fix for locale switcher ([#491](https://github.com/contentful/experience-builder/issues/491)) ([c9e9c82](https://github.com/contentful/experience-builder/commit/c9e9c821df8070e03a4493ce5c6ab4fd2576da58))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- handle missing linkType property ([#237](https://github.com/contentful/experience-builder/issues/237)) ([1827d96](https://github.com/contentful/experience-builder/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))
- hide overflow on draggable component to fix scrolling ([5c3b9f4](https://github.com/contentful/experience-builder/commit/5c3b9f48fef58cc8668972be2325a513a21287d6))
- hover outlines and default border style [ALT-323] ([#476](https://github.com/contentful/experience-builder/issues/476)) ([0378c6d](https://github.com/contentful/experience-builder/commit/0378c6d7499e9bdea6bedd632a9444dcde712984))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))
- properly remove event listener on scroll ([#345](https://github.com/contentful/experience-builder/issues/345)) ([da2514c](https://github.com/contentful/experience-builder/commit/da2514c29c3b45419d19aa00892ab39b97e979fa))
- re-fetch entity store on locale change ([#300](https://github.com/contentful/experience-builder/issues/300)) ([2da61b6](https://github.com/contentful/experience-builder/commit/2da61b686d7059864e849d71b011cb53ac7a3281))
- recognize replacement by detaching assembly node with current child cound ([41d3be5](https://github.com/contentful/experience-builder/commit/41d3be5f1ca1d29bcc2b9377932467ce873dac05))
- remove circular dep and bring related code in one place ([c6dc913](https://github.com/contentful/experience-builder/commit/c6dc913ab78cd68a8cf9cc74f9814f1fcec43eeb))
- remove error regarding any type ([222e82c](https://github.com/contentful/experience-builder/commit/222e82cce6c25ad2c819c3aeb8f83a2a39e86efb))
- remove the previous hotfix ([157dc57](https://github.com/contentful/experience-builder/commit/157dc57adfe85c42e725b62da8d0cb3a5a5a18ec))
- remove unused import ([8b48cbb](https://github.com/contentful/experience-builder/commit/8b48cbb3187f1848fb8b9831fa7c962e2af2cc82))
- replace original node with assembly node completely ([cfc55d3](https://github.com/contentful/experience-builder/commit/cfc55d305affd361ac82882c3c13350afae4c912))
- show outline when hovering over readonly blocks in an assembly [ALT-260] ([d2331ea](https://github.com/contentful/experience-builder/commit/d2331ea0ec707a189d850c752b87297d92c192af))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([21de9ae](https://github.com/contentful/experience-builder/commit/21de9aea921c97190e9115a8d0afb33b4a244937))
- update dropzone to consider children margins[ALT-282] ([5df13cc](https://github.com/contentful/experience-builder/commit/5df13cc9e24a7d38406617ab2c3bd4070a6c3103))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update hover labels to be more like onclick labels ([6ba51c1](https://github.com/contentful/experience-builder/commit/6ba51c131887cec9681da36ad385680d7c03e8d3))
- use casting to overcome type clash ([8dcc651](https://github.com/contentful/experience-builder/commit/8dcc65112fc3e068506c97216cac558657c68cb1))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- **visual-editor:** canvas interactions flickering on changes [ALT-241] ([#240](https://github.com/contentful/experience-builder/issues/240)) ([6ccea0f](https://github.com/contentful/experience-builder/commit/6ccea0f6e2b3e58852ee4e137ead35678831f84d)), closes [#243](https://github.com/contentful/experience-builder/issues/243) [#242](https://github.com/contentful/experience-builder/issues/242) [#244](https://github.com/contentful/experience-builder/issues/244) [#249](https://github.com/contentful/experience-builder/issues/249)
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- **visual-editor:** change component outlines and dropzone backgrounds [ALT-273] [ALT-275] ([#257](https://github.com/contentful/experience-builder/issues/257)) ([1e47be7](https://github.com/contentful/experience-builder/commit/1e47be7051e53b49d219da73851705bf476592c1))
- **visual-editor:** component re-select on breakpoint change ([#473](https://github.com/contentful/experience-builder/issues/473)) ([14d60f5](https://github.com/contentful/experience-builder/commit/14d60f580bfa1f64c0bdee7d007b9ed8bee8f3b8))
- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))
- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))
- **visual-editor:** remove error around passing editor props to normal elements ([#231](https://github.com/contentful/experience-builder/issues/231)) ([4024a68](https://github.com/contentful/experience-builder/commit/4024a68b3da06919ae777c15e7d25a8a40d6c263))
- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))
- **visual-editor:** request components after DC is dropped to display them ([#258](https://github.com/contentful/experience-builder/issues/258)) ([94f630e](https://github.com/contentful/experience-builder/commit/94f630e275ea4d691975131a7baed24292cb34d3))
- **visual-editor:** reselect component after scroll ([#276](https://github.com/contentful/experience-builder/issues/276)) ([7fa6446](https://github.com/contentful/experience-builder/commit/7fa6446eed801dd2fe03c5627223bd815425be80))
- **visual-editor:** throw error when component registration not found in useComponent hook [ALT-515] ([#517](https://github.com/contentful/experience-builder/issues/517)) ([147f5aa](https://github.com/contentful/experience-builder/commit/147f5aac5870f663cafcd91e820af39a9f89c2b5))
- **visual-editor:** update dropzone and selected component logic [ALT-317] ([#283](https://github.com/contentful/experience-builder/issues/283)) ([edb4349](https://github.com/contentful/experience-builder/commit/edb434928ac79523cc5aede61ae6cdca3e44f04b))
- **visual-sdk:** only show bg color of dropzone for components being dragged in ([#278](https://github.com/contentful/experience-builder/issues/278)) ([2895c16](https://github.com/contentful/experience-builder/commit/2895c16935ba9ac6ecc8638b0601f2d3eb48718e))
- wrap assembly with correct container styles ([222cd37](https://github.com/contentful/experience-builder/commit/222cd3721e47135e16d2ef52e16baedb982135a4))

- feat(experiences-sdk-react)!: update basic component IDs with contentful prefix (#508) ([0e28c45](https://github.com/contentful/experience-builder/commit/0e28c45e589422574caab08c44bc6099a5cbdb42)), closes [#508](https://github.com/contentful/experience-builder/issues/508)
- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))

### Features

- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- clicking outside of the edited canvas sends post message to user interface ([6e35c29](https://github.com/contentful/experience-builder/commit/6e35c2904b33027302e83b1d90b8c674e2380527))
- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- **components:** column gaps [ALT-279] ([#324](https://github.com/contentful/experience-builder/issues/324)) ([465bd53](https://github.com/contentful/experience-builder/commit/465bd539b2dadc831096c9fba9f89c98e3687a04))
- Container default margin auto [ALT-326] ([#286](https://github.com/contentful/experience-builder/issues/286)) ([16c1acf](https://github.com/contentful/experience-builder/commit/16c1acf05a5553dd31a5ebb04ead6c0a7724de54))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))

### Reverts

- dont overwrite assembly block height manually ([117d59c](https://github.com/contentful/experience-builder/commit/117d59c76ec9c6664fb416c1f6a5f8a46562664e))

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

- Any existing experiences that have a background image with a structural component will need to reset their image positioning values.

## [0.0.1-alpha.13](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.12...@contentful/experiences-visual-editor-react@0.0.1-alpha.13) (2024-03-22)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [0.0.1-alpha.12](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.11...@contentful/experiences-visual-editor-react@0.0.1-alpha.12) (2024-03-22)

- feat(experiences-sdk-react)!: update basic component IDs with contentful prefix (#508) ([0e28c45](https://github.com/contentful/experience-builder/commit/0e28c45e589422574caab08c44bc6099a5cbdb42)), closes [#508](https://github.com/contentful/experience-builder/issues/508)

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

## [0.0.1-alpha.11](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.10...@contentful/experiences-visual-editor-react@0.0.1-alpha.11) (2024-03-21)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [0.0.1-alpha.10](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.9...@contentful/experiences-visual-editor-react@0.0.1-alpha.10) (2024-03-20)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [0.0.1-alpha.9](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.8...@contentful/experiences-visual-editor-react@0.0.1-alpha.9) (2024-03-19)

**Note:** Version bump only for package @contentful/experiences-visual-editor-react

## [0.0.1-alpha.8](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.7...@contentful/experiences-visual-editor-react@0.0.1-alpha.8) (2024-03-18)

- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))

### BREAKING CHANGES

- Any existing experiences that have a background image with a structural component will need to reset their image positioning values.

## [0.0.1-alpha.7](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.6...@contentful/experiences-visual-editor-react@0.0.1-alpha.7) (2024-03-15)

### Bug Fixes

- **canvas-interactions:** do not render hitboxes for single column ([#488](https://github.com/contentful/experience-builder/issues/488)) ([a26b0c6](https://github.com/contentful/experience-builder/commit/a26b0c602515c09378f02f175b0dd1760ab56b00))
- fix for locale switcher ([#491](https://github.com/contentful/experience-builder/issues/491)) ([c9e9c82](https://github.com/contentful/experience-builder/commit/c9e9c821df8070e03a4493ce5c6ab4fd2576da58))

## [0.0.1-alpha.6](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.5...@contentful/experiences-visual-editor-react@0.0.1-alpha.6) (2024-03-14)

### Bug Fixes

- **canvas-interactions:** proper placeholders based on padding and flex direction [ALT-505] ([#485](https://github.com/contentful/experience-builder/issues/485)) ([32345e6](https://github.com/contentful/experience-builder/commit/32345e6f8e92e61af6deba939ba623145a7219ea))
- **canvas-interactions:** properly clear deselected component on canvas [] ([#484](https://github.com/contentful/experience-builder/issues/484)) ([10798c8](https://github.com/contentful/experience-builder/commit/10798c8a6ebbbeaa032c76240bf2f6e0b44bf069))

## [0.0.1-alpha.5](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.4...@contentful/experiences-visual-editor-react@0.0.1-alpha.5) (2024-03-13)

### Bug Fixes

- **canvas-interactions:** selecting a component not working in nextjs app-router ([#481](https://github.com/contentful/experience-builder/issues/481)) ([a44a6ae](https://github.com/contentful/experience-builder/commit/a44a6ae44efc956f5df03247240ab1b63f5a8aa7))
- hover outlines and default border style [ALT-323] ([#476](https://github.com/contentful/experience-builder/issues/476)) ([0378c6d](https://github.com/contentful/experience-builder/commit/0378c6d7499e9bdea6bedd632a9444dcde712984))

## [0.0.1-alpha.4](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.3...@contentful/experiences-visual-editor-react@0.0.1-alpha.4) (2024-03-12)

### Bug Fixes

- empty state canvas now says add components to begin ([14a39d8](https://github.com/contentful/experience-builder/commit/14a39d82b20c19b8a4bc5466dd74675968930288))

## [0.0.1-alpha.3](https://github.com/contentful/experience-builder/compare/@contentful/experiences-visual-editor-react@0.0.1-alpha.2...@contentful/experiences-visual-editor-react@0.0.1-alpha.3) (2024-03-08)

### Bug Fixes

- **canvas-interactions:** disable dropzones that are assemblies [ALT-552] ([#465](https://github.com/contentful/experience-builder/issues/465)) ([ad87950](https://github.com/contentful/experience-builder/commit/ad87950ab27457e585839a171a157816cd43bac3))
- **canvas-interactions:** more precise coordinates while dragging [ALT-506] ([#463](https://github.com/contentful/experience-builder/issues/463)) ([f312e05](https://github.com/contentful/experience-builder/commit/f312e05e3ce8e13fc747f4e82d5718c283a75242))
- **canvas-interactions:** update dropzone indicator colors ([#472](https://github.com/contentful/experience-builder/issues/472)) ([aadea9e](https://github.com/contentful/experience-builder/commit/aadea9e47d52739d41ac9508e3110f2698501065))
- **experiences:** proper handling of reparenting off canvas ([#460](https://github.com/contentful/experience-builder/issues/460)) ([9808cfc](https://github.com/contentful/experience-builder/commit/9808cfcdae03ad6c3fee7e3bb9278db06e179467))
- **visual-editor:** component re-select on breakpoint change ([#473](https://github.com/contentful/experience-builder/issues/473)) ([14d60f5](https://github.com/contentful/experience-builder/commit/14d60f580bfa1f64c0bdee7d007b9ed8bee8f3b8))

## 0.0.1-alpha.2 (2024-03-04)

### Bug Fixes

- add dnd cypress stub [SPA-1712] ([#270](https://github.com/contentful/experience-builder/issues/270)) ([cb88716](https://github.com/contentful/experience-builder/commit/cb887160ae9a37c8be4cb38d12419e914c6f1be1))
- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))
- add purple hover outline for assemblies [ALT-260] ([9d65eef](https://github.com/contentful/experience-builder/commit/9d65eef2ae81c3e8f191eab9aceb056a45f282b1))
- adjsut type for not defined coords ([1a34169](https://github.com/contentful/experience-builder/commit/1a341691caa65f27ec45861638620d31664bc9e0))
- adjust where the hover label goes for components and containers in xb ([5fbbe65](https://github.com/contentful/experience-builder/commit/5fbbe656be7f0f5b5fa0bfd4bbebf06a4e56b2e4))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- allows re-parenting of components, however does not allow for new containers to be created ([0614fd7](https://github.com/contentful/experience-builder/commit/0614fd77c41c63790649a8de3bc5618357d51ce9))
- assume not matching breakpoints and initialise correctly in the effect ([96c734a](https://github.com/contentful/experience-builder/commit/96c734a4b73630e2fd6a45fc9c0ae7b0778edd2b))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- **canvas-interactions:** prevent draggables from flying off mouse cursor ([#434](https://github.com/contentful/experience-builder/issues/434)) ([9fe8e6d](https://github.com/contentful/experience-builder/commit/9fe8e6d181181d84dd73922fced233e47232923f))
- cleanup remanining new imports under experience-builder since the pr was up ([4fe1b43](https://github.com/contentful/experience-builder/commit/4fe1b436d5ac40d0a90595bb37acaa91fa4ad99f))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder/commit/3e37f1518112c993456e08f74013c8a065b370fd))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- handle missing linkType property ([#237](https://github.com/contentful/experience-builder/issues/237)) ([1827d96](https://github.com/contentful/experience-builder/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))
- hide overflow on draggable component to fix scrolling ([5c3b9f4](https://github.com/contentful/experience-builder/commit/5c3b9f48fef58cc8668972be2325a513a21287d6))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))
- properly remove event listener on scroll ([#345](https://github.com/contentful/experience-builder/issues/345)) ([da2514c](https://github.com/contentful/experience-builder/commit/da2514c29c3b45419d19aa00892ab39b97e979fa))
- re-fetch entity store on locale change ([#300](https://github.com/contentful/experience-builder/issues/300)) ([2da61b6](https://github.com/contentful/experience-builder/commit/2da61b686d7059864e849d71b011cb53ac7a3281))
- recognize replacement by detaching assembly node with current child cound ([41d3be5](https://github.com/contentful/experience-builder/commit/41d3be5f1ca1d29bcc2b9377932467ce873dac05))
- remove circular dep and bring related code in one place ([c6dc913](https://github.com/contentful/experience-builder/commit/c6dc913ab78cd68a8cf9cc74f9814f1fcec43eeb))
- remove error regarding any type ([222e82c](https://github.com/contentful/experience-builder/commit/222e82cce6c25ad2c819c3aeb8f83a2a39e86efb))
- remove the previous hotfix ([157dc57](https://github.com/contentful/experience-builder/commit/157dc57adfe85c42e725b62da8d0cb3a5a5a18ec))
- remove unused import ([8b48cbb](https://github.com/contentful/experience-builder/commit/8b48cbb3187f1848fb8b9831fa7c962e2af2cc82))
- replace original node with assembly node completely ([cfc55d3](https://github.com/contentful/experience-builder/commit/cfc55d305affd361ac82882c3c13350afae4c912))
- show outline when hovering over readonly blocks in an assembly [ALT-260] ([d2331ea](https://github.com/contentful/experience-builder/commit/d2331ea0ec707a189d850c752b87297d92c192af))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([21de9ae](https://github.com/contentful/experience-builder/commit/21de9aea921c97190e9115a8d0afb33b4a244937))
- update dropzone to consider children margins[ALT-282] ([5df13cc](https://github.com/contentful/experience-builder/commit/5df13cc9e24a7d38406617ab2c3bd4070a6c3103))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update hover labels to be more like onclick labels ([6ba51c1](https://github.com/contentful/experience-builder/commit/6ba51c131887cec9681da36ad385680d7c03e8d3))
- use casting to overcome type clash ([8dcc651](https://github.com/contentful/experience-builder/commit/8dcc65112fc3e068506c97216cac558657c68cb1))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- **visual-editor:** canvas interactions flickering on changes [ALT-241] ([#240](https://github.com/contentful/experience-builder/issues/240)) ([6ccea0f](https://github.com/contentful/experience-builder/commit/6ccea0f6e2b3e58852ee4e137ead35678831f84d)), closes [#243](https://github.com/contentful/experience-builder/issues/243) [#242](https://github.com/contentful/experience-builder/issues/242) [#244](https://github.com/contentful/experience-builder/issues/244) [#249](https://github.com/contentful/experience-builder/issues/249)
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- **visual-editor:** change component outlines and dropzone backgrounds [ALT-273] [ALT-275] ([#257](https://github.com/contentful/experience-builder/issues/257)) ([1e47be7](https://github.com/contentful/experience-builder/commit/1e47be7051e53b49d219da73851705bf476592c1))
- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))
- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))
- **visual-editor:** remove error around passing editor props to normal elements ([#231](https://github.com/contentful/experience-builder/issues/231)) ([4024a68](https://github.com/contentful/experience-builder/commit/4024a68b3da06919ae777c15e7d25a8a40d6c263))
- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))
- **visual-editor:** request components after DC is dropped to display them ([#258](https://github.com/contentful/experience-builder/issues/258)) ([94f630e](https://github.com/contentful/experience-builder/commit/94f630e275ea4d691975131a7baed24292cb34d3))
- **visual-editor:** reselect component after scroll ([#276](https://github.com/contentful/experience-builder/issues/276)) ([7fa6446](https://github.com/contentful/experience-builder/commit/7fa6446eed801dd2fe03c5627223bd815425be80))
- **visual-editor:** update dropzone and selected component logic [ALT-317] ([#283](https://github.com/contentful/experience-builder/issues/283)) ([edb4349](https://github.com/contentful/experience-builder/commit/edb434928ac79523cc5aede61ae6cdca3e44f04b))
- **visual-sdk:** only show bg color of dropzone for components being dragged in ([#278](https://github.com/contentful/experience-builder/issues/278)) ([2895c16](https://github.com/contentful/experience-builder/commit/2895c16935ba9ac6ecc8638b0601f2d3eb48718e))
- wrap assembly with correct container styles ([222cd37](https://github.com/contentful/experience-builder/commit/222cd3721e47135e16d2ef52e16baedb982135a4))

### Features

- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- clicking outside of the edited canvas sends post message to user interface ([6e35c29](https://github.com/contentful/experience-builder/commit/6e35c2904b33027302e83b1d90b8c674e2380527))
- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- **components:** column gaps [ALT-279] ([#324](https://github.com/contentful/experience-builder/issues/324)) ([465bd53](https://github.com/contentful/experience-builder/commit/465bd539b2dadc831096c9fba9f89c98e3687a04))
- Container default margin auto [ALT-326] ([#286](https://github.com/contentful/experience-builder/issues/286)) ([16c1acf](https://github.com/contentful/experience-builder/commit/16c1acf05a5553dd31a5ebb04ead6c0a7724de54))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))

### Reverts

- dont overwrite assembly block height manually ([117d59c](https://github.com/contentful/experience-builder/commit/117d59c76ec9c6664fb416c1f6a5f8a46562664e))

## [0.0.2-alpha.33](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.32...@contentful/experience-builder-visual-editor@0.0.2-alpha.33) (2024-03-01)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.32](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.31...@contentful/experience-builder-visual-editor@0.0.2-alpha.32) (2024-02-29)

### Bug Fixes

- **canvas-interactions:** prevent draggables from flying off mouse cursor ([#434](https://github.com/contentful/experience-builder/issues/434)) ([9fe8e6d](https://github.com/contentful/experience-builder/commit/9fe8e6d181181d84dd73922fced233e47232923f))
- hide overflow on draggable component to fix scrolling ([5c3b9f4](https://github.com/contentful/experience-builder/commit/5c3b9f48fef58cc8668972be2325a513a21287d6))

## [0.0.2-alpha.31](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.30...@contentful/experience-builder-visual-editor@0.0.2-alpha.31) (2024-02-28)

### Bug Fixes

- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- wrap assembly with correct container styles ([222cd37](https://github.com/contentful/experience-builder/commit/222cd3721e47135e16d2ef52e16baedb982135a4))

### Reverts

- dont overwrite assembly block height manually ([117d59c](https://github.com/contentful/experience-builder/commit/117d59c76ec9c6664fb416c1f6a5f8a46562664e))

## [0.0.2-alpha.30](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.29...@contentful/experience-builder-visual-editor@0.0.2-alpha.30) (2024-02-26)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.29](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.28...@contentful/experience-builder-visual-editor@0.0.2-alpha.29) (2024-02-22)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.28](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.27...@contentful/experience-builder-visual-editor@0.0.2-alpha.28) (2024-02-21)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.27](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.26...@contentful/experience-builder-visual-editor@0.0.2-alpha.27) (2024-02-16)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.26](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.25...@contentful/experience-builder-visual-editor@0.0.2-alpha.26) (2024-02-15)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.25](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.24...@contentful/experience-builder-visual-editor@0.0.2-alpha.25) (2024-02-14)

### Features

- clicking outside of the edited canvas sends post message to user interface ([6e35c29](https://github.com/contentful/experience-builder/commit/6e35c2904b33027302e83b1d90b8c674e2380527))

## [0.0.2-alpha.24](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.23...@contentful/experience-builder-visual-editor@0.0.2-alpha.24) (2024-02-09)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.23](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.22...@contentful/experience-builder-visual-editor@0.0.2-alpha.23) (2024-02-08)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.22](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.21...@contentful/experience-builder-visual-editor@0.0.2-alpha.22) (2024-02-07)

### Bug Fixes

- assume not matching breakpoints and initialise correctly in the effect ([96c734a](https://github.com/contentful/experience-builder/commit/96c734a4b73630e2fd6a45fc9c0ae7b0778edd2b))
- properly remove event listener on scroll ([#345](https://github.com/contentful/experience-builder/issues/345)) ([da2514c](https://github.com/contentful/experience-builder/commit/da2514c29c3b45419d19aa00892ab39b97e979fa))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))

### Features

- **components:** column gaps [ALT-279] ([#324](https://github.com/contentful/experience-builder/issues/324)) ([465bd53](https://github.com/contentful/experience-builder/commit/465bd539b2dadc831096c9fba9f89c98e3687a04))

## [0.0.2-alpha.21](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.20...@contentful/experience-builder-visual-editor@0.0.2-alpha.21) (2024-02-06)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.20](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.18...@contentful/experience-builder-visual-editor@0.0.2-alpha.20) (2024-02-01)

### Bug Fixes

- adjsut type for not defined coords ([1a34169](https://github.com/contentful/experience-builder/commit/1a341691caa65f27ec45861638620d31664bc9e0))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))
- re-fetch entity store on locale change ([#300](https://github.com/contentful/experience-builder/issues/300)) ([2da61b6](https://github.com/contentful/experience-builder/commit/2da61b686d7059864e849d71b011cb53ac7a3281))
- remove circular dep and bring related code in one place ([c6dc913](https://github.com/contentful/experience-builder/commit/c6dc913ab78cd68a8cf9cc74f9814f1fcec43eeb))
- remove unused import ([8b48cbb](https://github.com/contentful/experience-builder/commit/8b48cbb3187f1848fb8b9831fa7c962e2af2cc82))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([21de9ae](https://github.com/contentful/experience-builder/commit/21de9aea921c97190e9115a8d0afb33b4a244937))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update hover labels to be more like onclick labels ([6ba51c1](https://github.com/contentful/experience-builder/commit/6ba51c131887cec9681da36ad385680d7c03e8d3))
- use casting to overcome type clash ([8dcc651](https://github.com/contentful/experience-builder/commit/8dcc65112fc3e068506c97216cac558657c68cb1))

### Features

- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))

## [0.0.2-alpha.18](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.17...@contentful/experience-builder-visual-editor@0.0.2-alpha.18) (2024-01-25)

### Bug Fixes

- allows re-parenting of components, however does not allow for new containers to be created ([0614fd7](https://github.com/contentful/experience-builder/commit/0614fd77c41c63790649a8de3bc5618357d51ce9))
- recognize replacement by detaching assembly node with current child cound ([41d3be5](https://github.com/contentful/experience-builder/commit/41d3be5f1ca1d29bcc2b9377932467ce873dac05))
- **visual-editor:** update dropzone and selected component logic [ALT-317] ([#283](https://github.com/contentful/experience-builder/issues/283)) ([edb4349](https://github.com/contentful/experience-builder/commit/edb434928ac79523cc5aede61ae6cdca3e44f04b))
- **visual-sdk:** only show bg color of dropzone for components being dragged in ([#278](https://github.com/contentful/experience-builder/issues/278)) ([2895c16](https://github.com/contentful/experience-builder/commit/2895c16935ba9ac6ecc8638b0601f2d3eb48718e))

### Features

- Container default margin auto [ALT-326] ([#286](https://github.com/contentful/experience-builder/issues/286)) ([16c1acf](https://github.com/contentful/experience-builder/commit/16c1acf05a5553dd31a5ebb04ead6c0a7724de54))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))

## [0.0.2-alpha.17](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.16...@contentful/experience-builder-visual-editor@0.0.2-alpha.17) (2024-01-23)

### Bug Fixes

- add dnd cypress stub [SPA-1712] ([#270](https://github.com/contentful/experience-builder/issues/270)) ([cb88716](https://github.com/contentful/experience-builder/commit/cb887160ae9a37c8be4cb38d12419e914c6f1be1))
- add purple hover outline for assemblies [ALT-260] ([9d65eef](https://github.com/contentful/experience-builder/commit/9d65eef2ae81c3e8f191eab9aceb056a45f282b1))
- adjust where the hover label goes for components and containers in xb ([5fbbe65](https://github.com/contentful/experience-builder/commit/5fbbe656be7f0f5b5fa0bfd4bbebf06a4e56b2e4))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- show outline when hovering over readonly blocks in an assembly [ALT-260] ([d2331ea](https://github.com/contentful/experience-builder/commit/d2331ea0ec707a189d850c752b87297d92c192af))
- **visual-editor:** reselect component after scroll ([#276](https://github.com/contentful/experience-builder/issues/276)) ([7fa6446](https://github.com/contentful/experience-builder/commit/7fa6446eed801dd2fe03c5627223bd815425be80))

## [0.0.2-alpha.16](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.15...@contentful/experience-builder-visual-editor@0.0.2-alpha.16) (2024-01-17)

### Bug Fixes

- remove error regarding any type ([222e82c](https://github.com/contentful/experience-builder/commit/222e82cce6c25ad2c819c3aeb8f83a2a39e86efb))
- remove the previous hotfix ([157dc57](https://github.com/contentful/experience-builder/commit/157dc57adfe85c42e725b62da8d0cb3a5a5a18ec))
- replace original node with assembly node completely ([cfc55d3](https://github.com/contentful/experience-builder/commit/cfc55d305affd361ac82882c3c13350afae4c912))
- update dropzone to consider children margins[ALT-282] ([5df13cc](https://github.com/contentful/experience-builder/commit/5df13cc9e24a7d38406617ab2c3bd4070a6c3103))

## [0.0.2-alpha.15](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.14...@contentful/experience-builder-visual-editor@0.0.2-alpha.15) (2024-01-16)

### Bug Fixes

- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder/commit/3e37f1518112c993456e08f74013c8a065b370fd))
- **visual-editor:** change component outlines and dropzone backgrounds [ALT-273] [ALT-275] ([#257](https://github.com/contentful/experience-builder/issues/257)) ([1e47be7](https://github.com/contentful/experience-builder/commit/1e47be7051e53b49d219da73851705bf476592c1))
- **visual-editor:** request components after DC is dropped to display them ([#258](https://github.com/contentful/experience-builder/issues/258)) ([94f630e](https://github.com/contentful/experience-builder/commit/94f630e275ea4d691975131a7baed24292cb34d3))

## [0.0.2-alpha.14](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.13...@contentful/experience-builder-visual-editor@0.0.2-alpha.14) (2024-01-16)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.13](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.12...@contentful/experience-builder-visual-editor@0.0.2-alpha.13) (2024-01-15)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.12](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.11...@contentful/experience-builder-visual-editor@0.0.2-alpha.12) (2024-01-12)

### Bug Fixes

- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))

## [0.0.2-alpha.11](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.10...@contentful/experience-builder-visual-editor@0.0.2-alpha.11) (2024-01-11)

### Bug Fixes

- **visual-editor:** canvas interactions flickering on changes [ALT-241] ([#240](https://github.com/contentful/experience-builder/issues/240)) ([6ccea0f](https://github.com/contentful/experience-builder/commit/6ccea0f6e2b3e58852ee4e137ead35678831f84d)), closes [#243](https://github.com/contentful/experience-builder/issues/243) [#242](https://github.com/contentful/experience-builder/issues/242) [#244](https://github.com/contentful/experience-builder/issues/244) [#249](https://github.com/contentful/experience-builder/issues/249)

## [0.0.2-alpha.10](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.9...@contentful/experience-builder-visual-editor@0.0.2-alpha.10) (2024-01-11)

### Bug Fixes

- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))

## [0.0.2-alpha.9](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.8...@contentful/experience-builder-visual-editor@0.0.2-alpha.9) (2024-01-11)

### Bug Fixes

- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))

## [0.0.2-alpha.8](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.7...@contentful/experience-builder-visual-editor@0.0.2-alpha.8) (2024-01-10)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.7](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.6...@contentful/experience-builder-visual-editor@0.0.2-alpha.7) (2024-01-10)

### Bug Fixes

- handle missing linkType property ([#237](https://github.com/contentful/experience-builder/issues/237)) ([1827d96](https://github.com/contentful/experience-builder/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))

## [0.0.2-alpha.6](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.5...@contentful/experience-builder-visual-editor@0.0.2-alpha.6) (2024-01-09)

### Bug Fixes

- **visual-editor:** remove error around passing editor props to normal elements ([#231](https://github.com/contentful/experience-builder/issues/231)) ([4024a68](https://github.com/contentful/experience-builder/commit/4024a68b3da06919ae777c15e7d25a8a40d6c263))

## [0.0.2-alpha.5](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.4...@contentful/experience-builder-visual-editor@0.0.2-alpha.5) (2024-01-09)

**Note:** Version bump only for package @contentful/experience-builder-visual-editor

## [0.0.2-alpha.4](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.3...@contentful/experience-builder-visual-editor@0.0.2-alpha.4) (2024-01-09)

### Bug Fixes

- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))

## [0.0.2-alpha.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-visual-editor@0.0.2-alpha.2...@contentful/experience-builder-visual-editor@0.0.2-alpha.3) (2024-01-08)

### Bug Fixes

- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))

## 0.0.2-alpha.2 (2024-01-08)

### Bug Fixes

- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))

### Features

- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
