# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/contentful/experience-builder/compare/v2.0.0...v2.0.1) (2025-07-11)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [2.0.0](https://github.com/contentful/experience-builder/compare/v1.42.3...v2.0.0) (2025-07-07)

### ⚠ BREAKING CHANGES

- manually resolving links [SPA-2754] PR to merge into v2-prerelease branch (#1139)
- merge breakpoint defaults for visual editor and SSR [SPA-2602] (#1125)

### Features

- early preload [SPA-2755] ([#1141](https://github.com/contentful/experience-builder/issues/1141)) ([9101809](https://github.com/contentful/experience-builder/commit/91018091940ac0fe442d6fd7c0a4977aa5048ce9))
- manually resolving links [SPA-2754] PR to merge into v2-prerelease branch ([#1139](https://github.com/contentful/experience-builder/issues/1139)) ([7e472c3](https://github.com/contentful/experience-builder/commit/7e472c3ff5c61778e6dd1b256b5a8d05bc5df6ec)), closes [#1109](https://github.com/contentful/experience-builder/issues/1109)

### Bug Fixes

- handle undefined defaultvalue in merge functionality ([#1211](https://github.com/contentful/experience-builder/issues/1211)) ([709c21e](https://github.com/contentful/experience-builder/commit/709c21e1ba093af3034757854cb47b5fb85dc831))
- makes isLoading dependent on the mode; adds tests ([#1163](https://github.com/contentful/experience-builder/issues/1163)) ([850580f](https://github.com/contentful/experience-builder/commit/850580f10e191b14f4c118d7acad40ef499cb420))
- merge breakpoint defaults for visual editor and SSR [SPA-2602] ([#1125](https://github.com/contentful/experience-builder/issues/1125)) ([d60171d](https://github.com/contentful/experience-builder/commit/d60171d26923a38673cb5f062c04024ffd9fe588))
- merge override and default styles in CSR preview mode ([4ca87d3](https://github.com/contentful/experience-builder/commit/4ca87d3bb315c76d0b97af7b0a9651eb54cb3e85))
- only enriching experience with hyperlinkPattern for when experience is loaded ([#1164](https://github.com/contentful/experience-builder/issues/1164)) ([7242394](https://github.com/contentful/experience-builder/commit/7242394f58cc7e266cc542f20aff5241d3e1b2ec))

## [1.42.3](https://github.com/contentful/experience-builder/compare/v1.42.2...v1.42.3) (2025-07-02)

### Bug Fixes

- makes in Preview+Delivery mode default value for nested pattern's prebinding work (scope applies to when pattern nests pattern, not experience embeds pattern) [SPA-2853] ([#1202](https://github.com/contentful/experience-builder/issues/1202)) ([7e94407](https://github.com/contentful/experience-builder/commit/7e944074b49a3ec83a7d8ef5836cc0150ddfbd99))
- ship CSS-in-JS instead of importing CSS for Nextjs support [SPA-2865] ([#1205](https://github.com/contentful/experience-builder/issues/1205)) ([c516f4d](https://github.com/contentful/experience-builder/commit/c516f4dbb582a33cf02bd26d699a92941e94de8e))

## [1.42.2](https://github.com/contentful/experience-builder/compare/v1.42.1...v1.42.2) (2025-06-30)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.42.1](https://github.com/contentful/experience-builder/compare/v1.42.0...v1.42.1) (2025-06-30)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.42.0](https://github.com/contentful/experience-builder/compare/v1.41.0...v1.42.0) (2025-06-27)

### Features

- resolves pre bound field mappings in preview mode [SPA-2852] ([#1184](https://github.com/contentful/experience-builder/issues/1184)) ([3f313ab](https://github.com/contentful/experience-builder/commit/3f313ab8774b5bd829c264d09b00586e82ba8725))

### Bug Fixes

- bundle CSS and add it directly to the HTML [SPA-2865] ([#1182](https://github.com/contentful/experience-builder/issues/1182)) ([2ccc3ab](https://github.com/contentful/experience-builder/commit/2ccc3abaa5da0ec7c33c560c7ff73c287e6aa6bf))

## [1.41.0](https://github.com/contentful/experience-builder/compare/v1.40.2...v1.41.0) (2025-06-13)

### Features

- remove explicit border box [SPA-2792] ([#1173](https://github.com/contentful/experience-builder/issues/1173)) ([85aabd5](https://github.com/contentful/experience-builder/commit/85aabd525a5f0bd961fc011bb02409eff1b0a227))

### Bug Fixes

- remove contentType attribute from PatternProperty schema ([#1172](https://github.com/contentful/experience-builder/issues/1172)) ([ddef0ff](https://github.com/contentful/experience-builder/commit/ddef0ffa0c12afd9133a4392b45b67962b1b7fbd))

## [1.40.2](https://github.com/contentful/experience-builder/compare/v1.40.1...v1.40.2) (2025-06-10)

### Bug Fixes

- **core:** consolidate CSS generation for cfVisibility in SSR and CSR [SPA-2782] ([#1166](https://github.com/contentful/experience-builder/issues/1166)) ([ebbee81](https://github.com/contentful/experience-builder/commit/ebbee812dc1766c0a173e5c71c8bfdb28c7cd6ea))

## [1.40.1](https://github.com/contentful/experience-builder/compare/v1.40.0...v1.40.1) (2025-06-06)

### Bug Fixes

- **delivery:** use disjunct media queries to only hide for explicit breakpoints [SPA-2782[ ([#1158](https://github.com/contentful/experience-builder/issues/1158)) ([83179af](https://github.com/contentful/experience-builder/commit/83179af1e99d7d4718f725a8d45b1244bc538892))

## [1.40.0](https://github.com/contentful/experience-builder/compare/v1.39.0...v1.40.0) (2025-06-04)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.39.0](https://github.com/contentful/experience-builder/compare/v1.38.0...v1.39.0) (2025-06-03)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.38.0](https://github.com/contentful/experience-builder/compare/v1.37.2...v1.38.0) (2025-05-23)

### Bug Fixes

- dont chain every node in the IDs chain ([bcc5916](https://github.com/contentful/experience-builder/commit/bcc59160d04b8adc51d77dd04569bcf71e4e4b54))
- match ID chain for prebinding and SSR class lookup ([4c1d7f3](https://github.com/contentful/experience-builder/commit/4c1d7f3c7c809c2b0a13ea631a36b9c05d300c6a))
- only consider pattern node ids for the so called chain ([96e8f2a](https://github.com/contentful/experience-builder/commit/96e8f2a30b0b8ff027f9c0417f4a717b6d3849e8))

## [1.37.2](https://github.com/contentful/experience-builder/compare/v1.37.1...v1.37.2) (2025-05-15)

### Bug Fixes

- remove style nodes from the DOM in the cleanup function of the injection hook [SPA-2765] ([#1122](https://github.com/contentful/experience-builder/issues/1122)) ([f8869f4](https://github.com/contentful/experience-builder/commit/f8869f45d16d0288687a62d81a8e5a1409ae13a7))
- unique nested classnames [SPA-2766] ([#1121](https://github.com/contentful/experience-builder/issues/1121)) ([4c9ed48](https://github.com/contentful/experience-builder/commit/4c9ed48370746c54a9386373dc73ae372afd3c56))

## [1.37.1](https://github.com/contentful/experience-builder/compare/v1.37.0...v1.37.1) (2025-04-24)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.37.0](https://github.com/contentful/experience-builder/compare/v1.36.0...v1.37.0) (2025-04-23)

### Features

- add localizeEntity and update docs ([060cda2](https://github.com/contentful/experience-builder/commit/060cda2179e7768d02102ee4d4af2bcdab155255))
- add new fetcher hook useCustomFetch that enables caching ([914551c](https://github.com/contentful/experience-builder/commit/914551cd1288cac292a880148470f32da3d54503))

### Bug Fixes

- add locale in fixtures ([66fc810](https://github.com/contentful/experience-builder/commit/66fc81095a0ac2b3a775c3a057583c6c519059c4))
- adjust error checks for tests and export functions correctly ([78d1ccd](https://github.com/contentful/experience-builder/commit/78d1ccdb84571f2d94b8d358208290f7572c2157))
- resolve background image optimization in SSR [SPA-2698] ([#1093](https://github.com/contentful/experience-builder/issues/1093)) ([f9ffd36](https://github.com/contentful/experience-builder/commit/f9ffd36fdc00c23a5bf40b05a991cb4bcd031521))

## [1.36.0](https://github.com/contentful/experience-builder/compare/v1.35.1...v1.36.0) (2025-04-17)

### Features

- **prebinding:** prebindings with multiple pattern instances in a pattern [LUMOS-610] ([bb7d4c2](https://github.com/contentful/experience-builder/commit/bb7d4c2c0970c1d706e6e64c0a61d34174e9d4f3))

### Bug Fixes

- add debug log for REQUESTED_ENTITIES as well ([#1079](https://github.com/contentful/experience-builder/issues/1079)) ([fbd5fc1](https://github.com/contentful/experience-builder/commit/fbd5fc1bad21a48409b8bbc205b9b882cf67c5fe))

## [1.35.1](https://github.com/contentful/experience-builder/compare/v1.35.0...v1.35.1) (2025-03-26)

### Bug Fixes

- trivial typo fix to test release process ([bbca38a](https://github.com/contentful/experience-builder/commit/bbca38aa512d40cc0f9bd6cd4ec207736e6a4b5f))

## [1.35.0](https://github.com/contentful/experience-builder/compare/v1.35.0-beta.0...v1.35.0) (2025-03-24)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.34.1](https://github.com/contentful/experience-builder/compare/v1.34.1-beta.0...v1.34.1) (2025-03-05)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.34.0](https://github.com/contentful/experience-builder/compare/v1.34.0-beta.0...v1.34.0) (2025-03-03)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.33.3](https://github.com/contentful/experience-builder/compare/v1.33.3-beta.0...v1.33.3) (2025-02-28)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.33.2](https://github.com/contentful/experience-builder/compare/v1.33.2-beta.0...v1.33.2) (2025-02-26)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.33.1](https://github.com/contentful/experience-builder/compare/v1.33.1-beta.0...v1.33.1) (2025-02-24)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.33.0](https://github.com/contentful/experience-builder/compare/v1.33.0-beta.0...v1.33.0) (2025-02-20)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.32.0](https://github.com/contentful/experience-builder/compare/v1.32.0-beta.0...v1.32.0) (2025-02-20)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.31.1](https://github.com/contentful/experience-builder/compare/v1.31.1-beta.0...v1.31.1) (2025-02-19)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.31.0](https://github.com/contentful/experience-builder/compare/v1.31.0-beta.0...v1.31.0) (2025-02-18)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.30.5](https://github.com/contentful/experience-builder/compare/v1.30.5-beta.0...v1.30.5) (2025-02-10)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.30.4](https://github.com/contentful/experience-builder/compare/v1.30.4-beta.0...v1.30.4) (2025-02-06)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.30.3](https://github.com/contentful/experience-builder/compare/v1.30.3-beta.0...v1.30.3) (2025-02-04)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.30.2](https://github.com/contentful/experience-builder/compare/v1.30.2-beta.0...v1.30.2) (2025-02-01)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.30.1](https://github.com/contentful/experience-builder/compare/v1.30.1-beta.0...v1.30.1) (2025-01-31)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.30.0](https://github.com/contentful/experience-builder/compare/v1.30.0-beta.0...v1.30.0) (2025-01-29)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.29.0](https://github.com/contentful/experience-builder/compare/v1.29.0-beta.0...v1.29.0) (2025-01-23)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.28.3](https://github.com/contentful/experience-builder/compare/v1.28.3-beta.0...v1.28.3) (2025-01-22)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.28.2](https://github.com/contentful/experience-builder/compare/v1.28.2-beta.0...v1.28.2) (2025-01-20)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.28.1](https://github.com/contentful/experience-builder/compare/v1.28.1-beta.0...v1.28.1) (2025-01-13)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.28.0](https://github.com/contentful/experience-builder/compare/v1.28.0-beta.0...v1.28.0) (2025-01-09)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.27.1](https://github.com/contentful/experience-builder/compare/v1.27.0...v1.27.1) (2024-12-19)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.27.0](https://github.com/contentful/experience-builder/compare/v1.27.0-beta.0...v1.27.0) (2024-12-17)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.26.0](https://github.com/contentful/experience-builder/compare/v1.26.0-beta.0...v1.26.0) (2024-12-10)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.25.1](https://github.com/contentful/experience-builder/compare/v1.25.1-beta.0...v1.25.1) (2024-12-09)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.25.0](https://github.com/contentful/experience-builder/compare/v1.25.0-beta.0...v1.25.0) (2024-12-06)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.24.0](https://github.com/contentful/experience-builder/compare/v1.24.0-beta.0...v1.24.0) (2024-12-04)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.23.0](https://github.com/contentful/experience-builder/compare/v1.23.0-beta.0...v1.23.0) (2024-12-03)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.22.0](https://github.com/contentful/experience-builder/compare/v1.22.0-beta.0...v1.22.0) (2024-11-08)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.21.0](https://github.com/contentful/experience-builder/compare/v1.21.0-beta.0...v1.21.0) (2024-11-06)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.20.1](https://github.com/contentful/experience-builder/compare/v1.20.1-beta.0...v1.20.1) (2024-11-04)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.20.0](https://github.com/contentful/experience-builder/compare/v1.20.0-beta.0...v1.20.0) (2024-10-23)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.19.0](https://github.com/contentful/experience-builder/compare/v1.19.0-beta.0...v1.19.0) (2024-10-14)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.18.0](https://github.com/contentful/experience-builder/compare/v1.18.0-beta.0...v1.18.0) (2024-10-10)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.17.1](https://github.com/contentful/experience-builder/compare/v1.17.1-beta.0...v1.17.1) (2024-10-03)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.17.0](https://github.com/contentful/experience-builder/compare/v1.17.0-beta.1...v1.17.0) (2024-09-30)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.16.1](https://github.com/contentful/experience-builder/compare/v1.16.1-beta.1...v1.16.1) (2024-09-25)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.16.0](https://github.com/contentful/experience-builder/compare/v1.16.0-beta.0...v1.16.0) (2024-09-17)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.15.1](https://github.com/contentful/experience-builder/compare/v1.15.0...v1.15.1) (2024-09-12)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.15.0](https://github.com/contentful/experience-builder/compare/v1.14.0...v1.15.0) (2024-09-11)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.14.0](https://github.com/contentful/experience-builder/compare/v1.14.0-beta.0...v1.14.0) (2024-09-10)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.13.0](https://github.com/contentful/experience-builder/compare/v1.13.0-beta.0...v1.13.0) (2024-09-05)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.12.0](https://github.com/contentful/experience-builder/compare/v1.12.0-beta.0...v1.12.0) (2024-08-21)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.11.2](https://github.com/contentful/experience-builder/compare/v1.11.2-beta.0...v1.11.2) (2024-07-31)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.11.1](https://github.com/contentful/experience-builder/compare/v1.11.1-beta.0...v1.11.1) (2024-07-19)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.11.0](https://github.com/contentful/experience-builder/compare/v1.11.0-beta.0...v1.11.0) (2024-07-19)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.10.0](https://github.com/contentful/experience-builder/compare/v1.10.0-beta.0...v1.10.0) (2024-07-11)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.9.0](https://github.com/contentful/experience-builder/compare/v1.9.0-beta.0...v1.9.0) (2024-06-28)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.8.2](https://github.com/contentful/experience-builder/compare/v1.8.2-beta.0...v1.8.2) (2024-06-27)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.8.1](https://github.com/contentful/experience-builder/compare/v1.8.1-beta.0...v1.8.1) (2024-06-24)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.8.0](https://github.com/contentful/experience-builder/compare/v1.8.0-beta.0...v1.8.0) (2024-06-17)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.7.1](https://github.com/contentful/experience-builder/compare/v1.7.1-beta.0...v1.7.1) (2024-06-11)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.7.0](https://github.com/contentful/experience-builder/compare/v1.7.0-beta.0...v1.7.0) (2024-06-07)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.6.0](https://github.com/contentful/experience-builder/compare/v1.6.0-beta.0...v1.6.0) (2024-06-03)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.5.2](https://github.com/contentful/experience-builder/compare/v1.5.2-beta.0...v1.5.2) (2024-05-30)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.5.1](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.2...v1.5.1) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.5.1-beta.2](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.1...v1.5.1-beta.2) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.5.1-beta.1](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.0...v1.5.1-beta.1) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.5.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.5.0...v1.5.1-beta.0) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.5.0](https://github.com/contentful/experience-builder/compare/v1.5.0-beta.0...v1.5.0) (2024-05-16)

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.5.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.4.0...v1.5.0-beta.0) (2024-05-16)

### Bug Fixes

- cleanup code ([53f68e0](https://github.com/contentful/experience-builder/commit/53f68e06f71fe3315312e1f2721274cc0fb1a6ae))

### Features

- resolve css variables in experiences ([9180d23](https://github.com/contentful/experience-builder/commit/9180d238a890870dffffb364b6ab88bab70b09e7))

# [1.4.0](https://github.com/contentful/experience-builder/compare/v1.4.0-beta.0...v1.4.0) (2024-05-15)

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.4.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.3.0...v1.4.0-beta.0) (2024-05-15)

### Bug Fixes

- not generate styles on csr if generated on ssr [SPA-2049] ([#600](https://github.com/contentful/experience-builder/issues/600)) ([149a569](https://github.com/contentful/experience-builder/commit/149a56978043fd799fce5d09b47626f2d414cf93))

# [1.3.0](https://github.com/contentful/experience-builder/compare/v1.3.0-beta.0...v1.3.0) (2024-05-06)

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.3.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.2.0...v1.3.0-beta.0) (2024-05-06)

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.2.0](https://github.com/contentful/experience-builder/compare/v1.2.0-beta.0...v1.2.0) (2024-04-30)

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.2.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.1.0...v1.2.0-beta.0) (2024-04-30)

### Features

- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))

# [1.1.0](https://github.com/contentful/experience-builder/compare/v1.1.0-beta.0...v1.1.0) (2024-04-29)

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.1.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.9-beta.0...v1.1.0-beta.0) (2024-04-29)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.9-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.8...v1.0.9-beta.0) (2024-04-26)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.8](https://github.com/contentful/experience-builder/compare/v1.0.8-beta.0...v1.0.8) (2024-04-26)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.8-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.7...v1.0.8-beta.0) (2024-04-26)

### Bug Fixes

- fix for preview/delivery mode ([30e0746](https://github.com/contentful/experience-builder/commit/30e07465b0a5f176b68846ad434857d214e1befe))

## [1.0.7](https://github.com/contentful/experience-builder/compare/v1.0.7-beta.0...v1.0.7) (2024-04-25)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.7-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.6...v1.0.7-beta.0) (2024-04-25)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.6](https://github.com/contentful/experience-builder/compare/v1.0.6-beta.0...v1.0.6) (2024-04-18)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.6-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.5...v1.0.6-beta.0) (2024-04-18)

### Bug Fixes

- don't track errors thrown from imported components ([070360f](https://github.com/contentful/experience-builder/commit/070360f1910c73ba0c81e2d24b9c64fb812cdf32))

## [1.0.5](https://github.com/contentful/experience-builder/compare/v1.0.5-beta.0...v1.0.5) (2024-04-16)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.5-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.4...v1.0.5-beta.0) (2024-04-16)

### Bug Fixes

- clean up the wrong entry ([cfe24a1](https://github.com/contentful/experience-builder/commit/cfe24a196c65f64d7593dfbc2c74de9bc8e6f12b))
- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))
- unit tests ([7e6fa8a](https://github.com/contentful/experience-builder/commit/7e6fa8a31a9b5bf0354aa1ee59ddaa4c4170c63c))

### Features

- first draft ([5c9f00d](https://github.com/contentful/experience-builder/commit/5c9f00d744d6499aa83140d60fda780717e60c25))
- make delivery and preview work ([65c45dd](https://github.com/contentful/experience-builder/commit/65c45dd52fd9226c6af356303089391fda59f38e))

## [1.0.4](https://github.com/contentful/experience-builder/compare/v1.0.4-beta.0...v1.0.4) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.4-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.3...v1.0.4-beta.0) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.3](https://github.com/contentful/experience-builder/compare/v1.0.3-beta.0...v1.0.3) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.3-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.2...v1.0.3-beta.0) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.2](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.1...v1.0.2) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.2-beta.1](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.0...v1.0.2-beta.1) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.2-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.1...v1.0.2-beta.0) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.1](https://github.com/contentful/experience-builder/compare/v1.0.1-beta.0...v1.0.1) (2024-03-29)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [1.0.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.0...v1.0.1-beta.0) (2024-03-29)

### Features

- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-sdk-react

**Note:** Version bump only for package @contentful/experiences-sdk-react

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [0.0.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.1...v0.0.1) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [0.0.1-beta.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## 0.0.1-beta.0 (2024-03-26)

### Bug Fixes

- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))
- address pr comments ([5d91d47](https://github.com/contentful/experience-builder/commit/5d91d47e45130bb56070412b704236bdd5c80a59))
- adjust code to latest prettier config ([94c546a](https://github.com/contentful/experience-builder/commit/94c546a3433b95828e7c1540722dcb092b0979e5))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow children variable on components with no children nodes [ALT-636] ([#509](https://github.com/contentful/experience-builder/issues/509)) ([bf8aea4](https://github.com/contentful/experience-builder/commit/bf8aea487f4f700ff0915b49667bb026986f4f4d))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- allow ExperienceRoot to render editor mode when entry first created [ALT-104] ([d69d5da](https://github.com/contentful/experience-builder/commit/d69d5dabd448929164ab37a93bdab8122fbfe899))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- calculate component client rect via children ([#196](https://github.com/contentful/experience-builder/issues/196)) ([e7d537e](https://github.com/contentful/experience-builder/commit/e7d537eea09b5d7e6442699a70bc27d52f3e2a8d))
- change types reference to core ([51b3ec7](https://github.com/contentful/experience-builder/commit/51b3ec7230acd4da74df33350d9cd82e3aa6dbb9))
- container default sizing height to fit all children [] ([#146](https://github.com/contentful/experience-builder/issues/146)) ([d301fe8](https://github.com/contentful/experience-builder/commit/d301fe827f2d895c10ca94370b80895d311c3dc1))
- correctly retrieve the url from the bound asset in preview/delivery ([#152](https://github.com/contentful/experience-builder/issues/152)) ([cb36d40](https://github.com/contentful/experience-builder/commit/cb36d40ee87d5d6cc11e2b099cb5490429567523))
- design token logic breaks auto height for empty containers ([#210](https://github.com/contentful/experience-builder/issues/210)) ([901bf67](https://github.com/contentful/experience-builder/commit/901bf67c6f7e3fb1a6b968b7fbb26b27d302f13b))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- do not attempt to send components via postMessage ([#510](https://github.com/contentful/experience-builder/issues/510)) ([f0b1498](https://github.com/contentful/experience-builder/commit/f0b1498b56d6c0be5aaeefbbf18ee5e7919e704a))
- dont initialise entity store on every render by using state [SPA-1711] ([#208](https://github.com/contentful/experience-builder/issues/208)) ([b04f44b](https://github.com/contentful/experience-builder/commit/b04f44bae930df18ee53c74754f40ddb2bca2fbe))
- dont show warning about alien message, don't render invalid attributes [] ([#170](https://github.com/contentful/experience-builder/issues/170)) ([e52ab8d](https://github.com/contentful/experience-builder/commit/e52ab8d0861f1d9c751922d018f17980d002a37a))
- ease exp entry validation [] ([#147](https://github.com/contentful/experience-builder/issues/147)) ([cbe3cd9](https://github.com/contentful/experience-builder/commit/cbe3cd9d27d87e2ce2b5439fbc7dd58bb1ff9383))
- empty container highlight on hover ([4501be2](https://github.com/contentful/experience-builder/commit/4501be237704ea53cd7ea4bea3ccab92dc69668f))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- exclude any node_modules from being included in the bundle ([1bf2682](https://github.com/contentful/experience-builder/commit/1bf26820b7d6205331dc1dd72a127017743561b3))
- **experience-builder-sdk:** export ComponentDefintion ([#243](https://github.com/contentful/experience-builder/issues/243)) ([b74d292](https://github.com/contentful/experience-builder/commit/b74d2927575cc10dcd4bb7e4800c47b979d7e15b))
- **experience-builder-sdk:** export ExternalSDKMode and EntityStore types [] ([#156](https://github.com/contentful/experience-builder/issues/156)) ([32a50a8](https://github.com/contentful/experience-builder/commit/32a50a81d669506837caef3e653332ae84a35f76))
- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))
- **experience-builder-sdk:** update rollup config to not include react in build ([#155](https://github.com/contentful/experience-builder/issues/155)) ([7e0f5ca](https://github.com/contentful/experience-builder/commit/7e0f5ca8b731586fc43a26dd9d562013cb4b1250))
- extend validators to validate component registration on editor mode ([f0dda61](https://github.com/contentful/experience-builder/commit/f0dda6178e3b81ecdcd2b1d530b854117fdd6df0))
- fetch all referenced entities ([#507](https://github.com/contentful/experience-builder/issues/507)) ([099dcd6](https://github.com/contentful/experience-builder/commit/099dcd66884ea43edc5ff954dfe5a1f82b11df42))
- fetch all references with includes ([#519](https://github.com/contentful/experience-builder/issues/519)) ([962f70b](https://github.com/contentful/experience-builder/commit/962f70bc129408ba93a1d5550a3a9601a3dd63ea))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- fixing tests and EntityStore getValue fetch ([63eec38](https://github.com/contentful/experience-builder/commit/63eec3847bae76776ca89e6ce4f241592b996b5f))
- incorporate reviewer feedback ([ea236c9](https://github.com/contentful/experience-builder/commit/ea236c93eab52b51135169dfa43f1c73948f32b6))
- initial setup for experience-builder-types [SPA-1395] ([#145](https://github.com/contentful/experience-builder/issues/145)) ([7b138ab](https://github.com/contentful/experience-builder/commit/7b138ab68ff2e1d685c95d665de5f7930d897916))
- inject script for Visual Editor [ALT-169] ([#193](https://github.com/contentful/experience-builder/issues/193)) ([2125f70](https://github.com/contentful/experience-builder/commit/2125f70fd8bac95c7490e25ffac4cdbef8f6ee31))
- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))
- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))
- linter ([52dfbba](https://github.com/contentful/experience-builder/commit/52dfbbaa63f83a8cc2adc22905d591f9d62987d9))
- minor change to empty container font color [ALT-59] ([3a08275](https://github.com/contentful/experience-builder/commit/3a082759b97e03f9dc7a218001e255fe458b58a0))
- putting peerdeps back in temporarily to fix runtime issue ([48197d8](https://github.com/contentful/experience-builder/commit/48197d8da7eb19d33dcea0650ce623a2cd0695b0))
- refactoring and update contentful cli to latest [ALT-106] ([7b290a2](https://github.com/contentful/experience-builder/commit/7b290a23e000cd1ad4704da5dbaaa04c735f8bfb))
- remove unecessary exports from experience-builder-sdk ([175a3fe](https://github.com/contentful/experience-builder/commit/175a3fe5e399869d0d1819275711ed8c0230d4a8))
- render component values in preview and resolve links properly [] ([#194](https://github.com/contentful/experience-builder/issues/194)) ([7183fbd](https://github.com/contentful/experience-builder/commit/7183fbdc16e27c1cef3b2cab8a556d7a54f54770))
- replace component values with actual onces before rendering [] ([#192](https://github.com/contentful/experience-builder/issues/192)) ([2eb2b66](https://github.com/contentful/experience-builder/commit/2eb2b666bb524c7bd0e1251a0119dad1187e2966))
- resolve breakpoint values correctly so that the ui doesn't crash ([91cc76a](https://github.com/contentful/experience-builder/commit/91cc76a65e45e621f90665118410d7089e6f5a94))
- small fix to design token registry resolving design token values ([9dadf38](https://github.com/contentful/experience-builder/commit/9dadf389dec6dfa8c1ee2e1ea93dfc9ba042a17d))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- strictly check for asset link type [SPA-1673] ([#187](https://github.com/contentful/experience-builder/issues/187)) ([c5f1c18](https://github.com/contentful/experience-builder/commit/c5f1c1802bde6373237f49de45b84a6bd110921d))
- switching locale makes design components disappear [SPA-1711] ([#209](https://github.com/contentful/experience-builder/issues/209)) ([84ca724](https://github.com/contentful/experience-builder/commit/84ca7248cbfcbd835a58c979d26ec9d375a02931))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([d71c898](https://github.com/contentful/experience-builder/commit/d71c898e2fe32b45f0003c829171e18b555a347e))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update Text component built in styles and add hyperlink options [ALT-358] ([#319](https://github.com/contentful/experience-builder/issues/319)) ([441e11e](https://github.com/contentful/experience-builder/commit/441e11ee04038a701220535d78cab621433ad483))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))
- use entryMap instead of entitiesMap in the EntityStore ([3b10b89](https://github.com/contentful/experience-builder/commit/3b10b8989b005337e8efbe6cd4c52a8458c13280))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))

- feat(experiences-sdk-react)!: update basic component IDs with contentful prefix (#508) ([0e28c45](https://github.com/contentful/experience-builder/commit/0e28c45e589422574caab08c44bc6099a5cbdb42)), closes [#508](https://github.com/contentful/experience-builder/issues/508)
- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))
- feat!: register toolkit components and include wrap container by default [ALT-115] (#175) ([1097764](https://github.com/contentful/experience-builder/commit/1097764e33fa0a5a5b89007b04d0cf5f18d6d71e)), closes [#175](https://github.com/contentful/experience-builder/issues/175)

### Features

- [SPA-1522] send also the margins with the coordinates ([#149](https://github.com/contentful/experience-builder/issues/149)) ([4ef60ba](https://github.com/contentful/experience-builder/commit/4ef60baf75ce5ed0ad84bb1d260714233afe14eb))
- [SPA-1574] add media type and handle it ([#168](https://github.com/contentful/experience-builder/issues/168)) ([7fe96c3](https://github.com/contentful/experience-builder/commit/7fe96c3f3e89db1208e787d06c7291765ee18c19))
- add new constant and remove unused variables [SPA-1605] ([#163](https://github.com/contentful/experience-builder/issues/163)) ([bdd6a08](https://github.com/contentful/experience-builder/commit/bdd6a086d0f107eae55b3bc519a7ed8f70b489b0))
- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- add watch command to npm build command for hot reload development ([0e3de5e](https://github.com/contentful/experience-builder/commit/0e3de5ef9ea4e0db7e311a73e48c854f93e36e8b))
- adds design token resultion for cfGap, cfWidth, cfHeight, and cfBackgroundColor ([ab747e5](https://github.com/contentful/experience-builder/commit/ab747e5eba2c4ad98290f551105a41c49e3c4395))
- allow users to drop new components onto canvas ([6c24fc3](https://github.com/contentful/experience-builder/commit/6c24fc35a828a07bb1c3e330d1edbcc3d1f5f6cd))
- change container defaults ([9a9afeb](https://github.com/contentful/experience-builder/commit/9a9afeba07a1f3b6d400023eec5ceca724a68837))
- Experience builder monorepo setup [SPA-1395] ([#141](https://github.com/contentful/experience-builder/issues/141)) ([a183719](https://github.com/contentful/experience-builder/commit/a1837192f366f09a09538c4bbfb992fffcc5a916))
- experience validator [SPA-1700] ([#348](https://github.com/contentful/experience-builder/issues/348)) ([3c856d0](https://github.com/contentful/experience-builder/commit/3c856d019213a1d8e86489028b18edec80830a20))
- **experience-builder-sdk:** allow delivery mode in editor ([#341](https://github.com/contentful/experience-builder/issues/341)) ([2a3551a](https://github.com/contentful/experience-builder/commit/2a3551ac20cabd8538c6bba198e580852f07059e))
- **experience-builder-sdk:** use visual editor package ([#169](https://github.com/contentful/experience-builder/issues/169)) ([7477225](https://github.com/contentful/experience-builder/commit/74772256690b031cb3d8a57b34b23ce6935422fe))
- handle bindings for design components [SPA-1606] ([#167](https://github.com/contentful/experience-builder/issues/167)) ([3eb7bb5](https://github.com/contentful/experience-builder/commit/3eb7bb5b05ccb6057d8834c9a0bc9718b90faf50))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- improve logs for example using a consistent prefix ([#207](https://github.com/contentful/experience-builder/issues/207)) ([96c306d](https://github.com/contentful/experience-builder/commit/96c306d23ac546c6b7bf6f425b434a9517f99b6f))
- increase the timeout for editor entity store to avoid data loss ([#212](https://github.com/contentful/experience-builder/issues/212)) ([844a1ad](https://github.com/contentful/experience-builder/commit/844a1adf9c0ed33d91c76bd3c9a01680adea906b))
- initialization code for injectable editor ([6f49c40](https://github.com/contentful/experience-builder/commit/6f49c40ce9345dc1f6e41f64f36af8f6266f8066))
- initialize sustainable entity store ([#200](https://github.com/contentful/experience-builder/issues/200)) ([b136abf](https://github.com/contentful/experience-builder/commit/b136abf860a7c90de072e18d69652e2b4fc65956))
- inject user defined layout styling through component definition ([9d18ed6](https://github.com/contentful/experience-builder/commit/9d18ed68a82c6ece4c162ed764313837a178f1b7))
- render design component within an experience [SPA-1583] ([#151](https://github.com/contentful/experience-builder/issues/151)) ([cb4a38a](https://github.com/contentful/experience-builder/commit/cb4a38a3fbf75f8c4773ff95b203a11ae12220bc))
- resolve design tokens for row and column gap ([0b5d122](https://github.com/contentful/experience-builder/commit/0b5d122a10b01438bd014038665597b97f0cb807))
- resolves the design token values ([2b2936a](https://github.com/contentful/experience-builder/commit/2b2936aae773859bbed4f6c265f51e6e2c48393e))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- support ssr [SPA-1435] ([#136](https://github.com/contentful/experience-builder/issues/136)) ([6cec574](https://github.com/contentful/experience-builder/commit/6cec574d82bd2c9471f0caef7179979fdcee3236))
- updates rich text component definition to hold default stylings rather than using css modules ([7ddf6ed](https://github.com/contentful/experience-builder/commit/7ddf6ed7748f383cdc6776ec68200c15500d16bf))

### Reverts

- Revert "fix: fetch all referenced entities (#507)" (#515) ([2b376f6](https://github.com/contentful/experience-builder/commit/2b376f6f1b6ab63e46c3f62affea0621af33e698)), closes [#507](https://github.com/contentful/experience-builder/issues/507) [#515](https://github.com/contentful/experience-builder/issues/515)

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
- Registered components will be wrapped with a div container by default. The `wrapComponent` option can be used when registering components to opt-out of this behavior if necessary.

## [0.0.1-alpha.13](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.12...@contentful/experiences-sdk-react@0.0.1-alpha.13) (2024-03-22)

### Bug Fixes

- do not attempt to send components via postMessage ([#510](https://github.com/contentful/experience-builder/issues/510)) ([f0b1498](https://github.com/contentful/experience-builder/commit/f0b1498b56d6c0be5aaeefbbf18ee5e7919e704a))

### Reverts

- Revert "fix: fetch all referenced entities (#507)" (#515) ([2b376f6](https://github.com/contentful/experience-builder/commit/2b376f6f1b6ab63e46c3f62affea0621af33e698)), closes [#507](https://github.com/contentful/experience-builder/issues/507) [#515](https://github.com/contentful/experience-builder/issues/515)

## [0.0.1-alpha.12](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.11...@contentful/experiences-sdk-react@0.0.1-alpha.12) (2024-03-22)

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

## [0.0.1-alpha.11](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.10...@contentful/experiences-sdk-react@0.0.1-alpha.11) (2024-03-21)

### Bug Fixes

- allow children variable on components with no children nodes [ALT-636] ([#509](https://github.com/contentful/experience-builder/issues/509)) ([bf8aea4](https://github.com/contentful/experience-builder/commit/bf8aea487f4f700ff0915b49667bb026986f4f4d))
- fetch all referenced entities ([#507](https://github.com/contentful/experience-builder/issues/507)) ([099dcd6](https://github.com/contentful/experience-builder/commit/099dcd66884ea43edc5ff954dfe5a1f82b11df42))

## [0.0.1-alpha.10](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.9...@contentful/experiences-sdk-react@0.0.1-alpha.10) (2024-03-20)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [0.0.1-alpha.9](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.8...@contentful/experiences-sdk-react@0.0.1-alpha.9) (2024-03-19)

### Bug Fixes

- extend validators to validate component registration on editor mode ([f0dda61](https://github.com/contentful/experience-builder/commit/f0dda6178e3b81ecdcd2b1d530b854117fdd6df0))

## [0.0.1-alpha.8](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.7...@contentful/experiences-sdk-react@0.0.1-alpha.8) (2024-03-18)

- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))

### BREAKING CHANGES

- Any existing experiences that have a background image with a structural component will need to reset their image positioning values.

## [0.0.1-alpha.7](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.6...@contentful/experiences-sdk-react@0.0.1-alpha.7) (2024-03-15)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [0.0.1-alpha.6](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.5...@contentful/experiences-sdk-react@0.0.1-alpha.6) (2024-03-14)

### Bug Fixes

- remove unecessary exports from experience-builder-sdk ([175a3fe](https://github.com/contentful/experience-builder/commit/175a3fe5e399869d0d1819275711ed8c0230d4a8))

## [0.0.1-alpha.5](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.4...@contentful/experiences-sdk-react@0.0.1-alpha.5) (2024-03-13)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [0.0.1-alpha.4](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.3...@contentful/experiences-sdk-react@0.0.1-alpha.4) (2024-03-12)

**Note:** Version bump only for package @contentful/experiences-sdk-react

## [0.0.1-alpha.3](https://github.com/contentful/experience-builder/compare/@contentful/experiences-sdk-react@0.0.1-alpha.2...@contentful/experiences-sdk-react@0.0.1-alpha.3) (2024-03-08)

### Bug Fixes

- address pr comments ([5d91d47](https://github.com/contentful/experience-builder/commit/5d91d47e45130bb56070412b704236bdd5c80a59))

## 0.0.1-alpha.2 (2024-03-04)

### Bug Fixes

- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))
- adjust code to latest prettier config ([94c546a](https://github.com/contentful/experience-builder/commit/94c546a3433b95828e7c1540722dcb092b0979e5))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- allow ExperienceRoot to render editor mode when entry first created [ALT-104] ([d69d5da](https://github.com/contentful/experience-builder/commit/d69d5dabd448929164ab37a93bdab8122fbfe899))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- calculate component client rect via children ([#196](https://github.com/contentful/experience-builder/issues/196)) ([e7d537e](https://github.com/contentful/experience-builder/commit/e7d537eea09b5d7e6442699a70bc27d52f3e2a8d))
- change types reference to core ([51b3ec7](https://github.com/contentful/experience-builder/commit/51b3ec7230acd4da74df33350d9cd82e3aa6dbb9))
- container default sizing height to fit all children [] ([#146](https://github.com/contentful/experience-builder/issues/146)) ([d301fe8](https://github.com/contentful/experience-builder/commit/d301fe827f2d895c10ca94370b80895d311c3dc1))
- correctly retrieve the url from the bound asset in preview/delivery ([#152](https://github.com/contentful/experience-builder/issues/152)) ([cb36d40](https://github.com/contentful/experience-builder/commit/cb36d40ee87d5d6cc11e2b099cb5490429567523))
- design token logic breaks auto height for empty containers ([#210](https://github.com/contentful/experience-builder/issues/210)) ([901bf67](https://github.com/contentful/experience-builder/commit/901bf67c6f7e3fb1a6b968b7fbb26b27d302f13b))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- dont initialise entity store on every render by using state [SPA-1711] ([#208](https://github.com/contentful/experience-builder/issues/208)) ([b04f44b](https://github.com/contentful/experience-builder/commit/b04f44bae930df18ee53c74754f40ddb2bca2fbe))
- dont show warning about alien message, don't render invalid attributes [] ([#170](https://github.com/contentful/experience-builder/issues/170)) ([e52ab8d](https://github.com/contentful/experience-builder/commit/e52ab8d0861f1d9c751922d018f17980d002a37a))
- ease exp entry validation [] ([#147](https://github.com/contentful/experience-builder/issues/147)) ([cbe3cd9](https://github.com/contentful/experience-builder/commit/cbe3cd9d27d87e2ce2b5439fbc7dd58bb1ff9383))
- empty container highlight on hover ([4501be2](https://github.com/contentful/experience-builder/commit/4501be237704ea53cd7ea4bea3ccab92dc69668f))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- exclude any node_modules from being included in the bundle ([1bf2682](https://github.com/contentful/experience-builder/commit/1bf26820b7d6205331dc1dd72a127017743561b3))
- **experience-builder-sdk:** export ComponentDefintion ([#243](https://github.com/contentful/experience-builder/issues/243)) ([b74d292](https://github.com/contentful/experience-builder/commit/b74d2927575cc10dcd4bb7e4800c47b979d7e15b))
- **experience-builder-sdk:** export ExternalSDKMode and EntityStore types [] ([#156](https://github.com/contentful/experience-builder/issues/156)) ([32a50a8](https://github.com/contentful/experience-builder/commit/32a50a81d669506837caef3e653332ae84a35f76))
- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))
- **experience-builder-sdk:** update rollup config to not include react in build ([#155](https://github.com/contentful/experience-builder/issues/155)) ([7e0f5ca](https://github.com/contentful/experience-builder/commit/7e0f5ca8b731586fc43a26dd9d562013cb4b1250))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- fixing tests and EntityStore getValue fetch ([63eec38](https://github.com/contentful/experience-builder/commit/63eec3847bae76776ca89e6ce4f241592b996b5f))
- incorporate reviewer feedback ([ea236c9](https://github.com/contentful/experience-builder/commit/ea236c93eab52b51135169dfa43f1c73948f32b6))
- initial setup for experience-builder-types [SPA-1395] ([#145](https://github.com/contentful/experience-builder/issues/145)) ([7b138ab](https://github.com/contentful/experience-builder/commit/7b138ab68ff2e1d685c95d665de5f7930d897916))
- inject script for Visual Editor [ALT-169] ([#193](https://github.com/contentful/experience-builder/issues/193)) ([2125f70](https://github.com/contentful/experience-builder/commit/2125f70fd8bac95c7490e25ffac4cdbef8f6ee31))
- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))
- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))
- linter ([52dfbba](https://github.com/contentful/experience-builder/commit/52dfbbaa63f83a8cc2adc22905d591f9d62987d9))
- minor change to empty container font color [ALT-59] ([3a08275](https://github.com/contentful/experience-builder/commit/3a082759b97e03f9dc7a218001e255fe458b58a0))
- putting peerdeps back in temporarily to fix runtime issue ([48197d8](https://github.com/contentful/experience-builder/commit/48197d8da7eb19d33dcea0650ce623a2cd0695b0))
- refactoring and update contentful cli to latest [ALT-106] ([7b290a2](https://github.com/contentful/experience-builder/commit/7b290a23e000cd1ad4704da5dbaaa04c735f8bfb))
- render component values in preview and resolve links properly [] ([#194](https://github.com/contentful/experience-builder/issues/194)) ([7183fbd](https://github.com/contentful/experience-builder/commit/7183fbdc16e27c1cef3b2cab8a556d7a54f54770))
- replace component values with actual onces before rendering [] ([#192](https://github.com/contentful/experience-builder/issues/192)) ([2eb2b66](https://github.com/contentful/experience-builder/commit/2eb2b666bb524c7bd0e1251a0119dad1187e2966))
- resolve breakpoint values correctly so that the ui doesn't crash ([91cc76a](https://github.com/contentful/experience-builder/commit/91cc76a65e45e621f90665118410d7089e6f5a94))
- small fix to design token registry resolving design token values ([9dadf38](https://github.com/contentful/experience-builder/commit/9dadf389dec6dfa8c1ee2e1ea93dfc9ba042a17d))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- strictly check for asset link type [SPA-1673] ([#187](https://github.com/contentful/experience-builder/issues/187)) ([c5f1c18](https://github.com/contentful/experience-builder/commit/c5f1c1802bde6373237f49de45b84a6bd110921d))
- switching locale makes design components disappear [SPA-1711] ([#209](https://github.com/contentful/experience-builder/issues/209)) ([84ca724](https://github.com/contentful/experience-builder/commit/84ca7248cbfcbd835a58c979d26ec9d375a02931))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([d71c898](https://github.com/contentful/experience-builder/commit/d71c898e2fe32b45f0003c829171e18b555a347e))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update Text component built in styles and add hyperlink options [ALT-358] ([#319](https://github.com/contentful/experience-builder/issues/319)) ([441e11e](https://github.com/contentful/experience-builder/commit/441e11ee04038a701220535d78cab621433ad483))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))
- use entryMap instead of entitiesMap in the EntityStore ([3b10b89](https://github.com/contentful/experience-builder/commit/3b10b8989b005337e8efbe6cd4c52a8458c13280))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))

- feat!: register toolkit components and include wrap container by default [ALT-115] (#175) ([1097764](https://github.com/contentful/experience-builder/commit/1097764e33fa0a5a5b89007b04d0cf5f18d6d71e)), closes [#175](https://github.com/contentful/experience-builder/issues/175)

### Features

- [SPA-1522] send also the margins with the coordinates ([#149](https://github.com/contentful/experience-builder/issues/149)) ([4ef60ba](https://github.com/contentful/experience-builder/commit/4ef60baf75ce5ed0ad84bb1d260714233afe14eb))
- [SPA-1574] add media type and handle it ([#168](https://github.com/contentful/experience-builder/issues/168)) ([7fe96c3](https://github.com/contentful/experience-builder/commit/7fe96c3f3e89db1208e787d06c7291765ee18c19))
- add new constant and remove unused variables [SPA-1605] ([#163](https://github.com/contentful/experience-builder/issues/163)) ([bdd6a08](https://github.com/contentful/experience-builder/commit/bdd6a086d0f107eae55b3bc519a7ed8f70b489b0))
- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- add watch command to npm build command for hot reload development ([0e3de5e](https://github.com/contentful/experience-builder/commit/0e3de5ef9ea4e0db7e311a73e48c854f93e36e8b))
- adds design token resultion for cfGap, cfWidth, cfHeight, and cfBackgroundColor ([ab747e5](https://github.com/contentful/experience-builder/commit/ab747e5eba2c4ad98290f551105a41c49e3c4395))
- allow users to drop new components onto canvas ([6c24fc3](https://github.com/contentful/experience-builder/commit/6c24fc35a828a07bb1c3e330d1edbcc3d1f5f6cd))
- change container defaults ([9a9afeb](https://github.com/contentful/experience-builder/commit/9a9afeba07a1f3b6d400023eec5ceca724a68837))
- Experience builder monorepo setup [SPA-1395] ([#141](https://github.com/contentful/experience-builder/issues/141)) ([a183719](https://github.com/contentful/experience-builder/commit/a1837192f366f09a09538c4bbfb992fffcc5a916))
- experience validator [SPA-1700] ([#348](https://github.com/contentful/experience-builder/issues/348)) ([3c856d0](https://github.com/contentful/experience-builder/commit/3c856d019213a1d8e86489028b18edec80830a20))
- **experience-builder-sdk:** allow delivery mode in editor ([#341](https://github.com/contentful/experience-builder/issues/341)) ([2a3551a](https://github.com/contentful/experience-builder/commit/2a3551ac20cabd8538c6bba198e580852f07059e))
- **experience-builder-sdk:** use visual editor package ([#169](https://github.com/contentful/experience-builder/issues/169)) ([7477225](https://github.com/contentful/experience-builder/commit/74772256690b031cb3d8a57b34b23ce6935422fe))
- handle bindings for design components [SPA-1606] ([#167](https://github.com/contentful/experience-builder/issues/167)) ([3eb7bb5](https://github.com/contentful/experience-builder/commit/3eb7bb5b05ccb6057d8834c9a0bc9718b90faf50))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- improve logs for example using a consistent prefix ([#207](https://github.com/contentful/experience-builder/issues/207)) ([96c306d](https://github.com/contentful/experience-builder/commit/96c306d23ac546c6b7bf6f425b434a9517f99b6f))
- increase the timeout for editor entity store to avoid data loss ([#212](https://github.com/contentful/experience-builder/issues/212)) ([844a1ad](https://github.com/contentful/experience-builder/commit/844a1adf9c0ed33d91c76bd3c9a01680adea906b))
- initialization code for injectable editor ([6f49c40](https://github.com/contentful/experience-builder/commit/6f49c40ce9345dc1f6e41f64f36af8f6266f8066))
- initialize sustainable entity store ([#200](https://github.com/contentful/experience-builder/issues/200)) ([b136abf](https://github.com/contentful/experience-builder/commit/b136abf860a7c90de072e18d69652e2b4fc65956))
- inject user defined layout styling through component definition ([9d18ed6](https://github.com/contentful/experience-builder/commit/9d18ed68a82c6ece4c162ed764313837a178f1b7))
- render design component within an experience [SPA-1583] ([#151](https://github.com/contentful/experience-builder/issues/151)) ([cb4a38a](https://github.com/contentful/experience-builder/commit/cb4a38a3fbf75f8c4773ff95b203a11ae12220bc))
- resolve design tokens for row and column gap ([0b5d122](https://github.com/contentful/experience-builder/commit/0b5d122a10b01438bd014038665597b97f0cb807))
- resolves the design token values ([2b2936a](https://github.com/contentful/experience-builder/commit/2b2936aae773859bbed4f6c265f51e6e2c48393e))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- support ssr [SPA-1435] ([#136](https://github.com/contentful/experience-builder/issues/136)) ([6cec574](https://github.com/contentful/experience-builder/commit/6cec574d82bd2c9471f0caef7179979fdcee3236))
- updates rich text component definition to hold default stylings rather than using css modules ([7ddf6ed](https://github.com/contentful/experience-builder/commit/7ddf6ed7748f383cdc6776ec68200c15500d16bf))

### BREAKING CHANGES

- Registered components will be wrapped with a div container by default. The `wrapComponent` option can be used when registering components to opt-out of this behavior if necessary.

# [4.0.0-alpha.32](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.31...@contentful/experience-builder@4.0.0-alpha.32) (2024-03-01)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.31](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.30...@contentful/experience-builder@4.0.0-alpha.31) (2024-02-29)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.30](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.29...@contentful/experience-builder@4.0.0-alpha.30) (2024-02-28)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.29](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.28...@contentful/experience-builder@4.0.0-alpha.29) (2024-02-26)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.28](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.27...@contentful/experience-builder@4.0.0-alpha.28) (2024-02-22)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.27](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.26...@contentful/experience-builder@4.0.0-alpha.27) (2024-02-21)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.26](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.25...@contentful/experience-builder@4.0.0-alpha.26) (2024-02-16)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.25](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.24...@contentful/experience-builder@4.0.0-alpha.25) (2024-02-15)

### Bug Fixes

- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))

### Features

- experience validator [SPA-1700] ([#348](https://github.com/contentful/experience-builder/issues/348)) ([3c856d0](https://github.com/contentful/experience-builder/commit/3c856d019213a1d8e86489028b18edec80830a20))

# [4.0.0-alpha.24](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.23...@contentful/experience-builder@4.0.0-alpha.24) (2024-02-14)

### Bug Fixes

- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))

### Features

- **experience-builder-sdk:** allow delivery mode in editor ([#341](https://github.com/contentful/experience-builder/issues/341)) ([2a3551a](https://github.com/contentful/experience-builder/commit/2a3551ac20cabd8538c6bba198e580852f07059e))

# [4.0.0-alpha.23](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.22...@contentful/experience-builder@4.0.0-alpha.23) (2024-02-09)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.22](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.21...@contentful/experience-builder@4.0.0-alpha.22) (2024-02-08)

### Bug Fixes

- adjust code to latest prettier config ([94c546a](https://github.com/contentful/experience-builder/commit/94c546a3433b95828e7c1540722dcb092b0979e5))

# [4.0.0-alpha.21](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.20...@contentful/experience-builder@4.0.0-alpha.21) (2024-02-07)

### Bug Fixes

- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- update Text component built in styles and add hyperlink options [ALT-358] ([#319](https://github.com/contentful/experience-builder/issues/319)) ([441e11e](https://github.com/contentful/experience-builder/commit/441e11ee04038a701220535d78cab621433ad483))

# [4.0.0-alpha.20](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.19...@contentful/experience-builder@4.0.0-alpha.20) (2024-02-06)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.19](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.17...@contentful/experience-builder@4.0.0-alpha.19) (2024-02-01)

### Bug Fixes

- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([d71c898](https://github.com/contentful/experience-builder/commit/d71c898e2fe32b45f0003c829171e18b555a347e))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))

### Features

- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- updates rich text component definition to hold default stylings rather than using css modules ([7ddf6ed](https://github.com/contentful/experience-builder/commit/7ddf6ed7748f383cdc6776ec68200c15500d16bf))

# [4.0.0-alpha.17](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.16...@contentful/experience-builder@4.0.0-alpha.17) (2024-01-25)

### Features

- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))

# [4.0.0-alpha.16](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.15...@contentful/experience-builder@4.0.0-alpha.16) (2024-01-23)

### Bug Fixes

- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))

# [4.0.0-alpha.15](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.14...@contentful/experience-builder@4.0.0-alpha.15) (2024-01-17)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.14](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.13...@contentful/experience-builder@4.0.0-alpha.14) (2024-01-16)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.13](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.12...@contentful/experience-builder@4.0.0-alpha.13) (2024-01-16)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.12](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.11...@contentful/experience-builder@4.0.0-alpha.12) (2024-01-15)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.11](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.10...@contentful/experience-builder@4.0.0-alpha.11) (2024-01-12)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.10](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.9...@contentful/experience-builder@4.0.0-alpha.10) (2024-01-11)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.9](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.8...@contentful/experience-builder@4.0.0-alpha.9) (2024-01-11)

### Bug Fixes

- **experience-builder-sdk:** export ComponentDefintion ([#243](https://github.com/contentful/experience-builder/issues/243)) ([b74d292](https://github.com/contentful/experience-builder/commit/b74d2927575cc10dcd4bb7e4800c47b979d7e15b))

# [4.0.0-alpha.8](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.7...@contentful/experience-builder@4.0.0-alpha.8) (2024-01-11)

### Bug Fixes

- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))
- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))

# [4.0.0-alpha.7](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.6...@contentful/experience-builder@4.0.0-alpha.7) (2024-01-10)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.6](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.5...@contentful/experience-builder@4.0.0-alpha.6) (2024-01-10)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.5](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.4...@contentful/experience-builder@4.0.0-alpha.5) (2024-01-09)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.4](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.3...@contentful/experience-builder@4.0.0-alpha.4) (2024-01-09)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-alpha.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.2...@contentful/experience-builder@4.0.0-alpha.3) (2024-01-09)

### Bug Fixes

- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))

# [4.0.0-alpha.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-alpha.1...@contentful/experience-builder@4.0.0-alpha.2) (2024-01-08)

### Bug Fixes

- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))

# [4.0.0-alpha.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.5.0...@contentful/experience-builder@4.0.0-alpha.1) (2024-01-08)

### Bug Fixes

- change types reference to core ([51b3ec7](https://github.com/contentful/experience-builder/commit/51b3ec7230acd4da74df33350d9cd82e3aa6dbb9))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- exclude any node_modules from being included in the bundle ([1bf2682](https://github.com/contentful/experience-builder/commit/1bf26820b7d6205331dc1dd72a127017743561b3))
- fixing tests and EntityStore getValue fetch ([63eec38](https://github.com/contentful/experience-builder/commit/63eec3847bae76776ca89e6ce4f241592b996b5f))
- inject script for Visual Editor [ALT-169] ([#193](https://github.com/contentful/experience-builder/issues/193)) ([2125f70](https://github.com/contentful/experience-builder/commit/2125f70fd8bac95c7490e25ffac4cdbef8f6ee31))
- linter ([52dfbba](https://github.com/contentful/experience-builder/commit/52dfbbaa63f83a8cc2adc22905d591f9d62987d9))
- putting peerdeps back in temporarily to fix runtime issue ([48197d8](https://github.com/contentful/experience-builder/commit/48197d8da7eb19d33dcea0650ce623a2cd0695b0))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))
- use entryMap instead of entitiesMap in the EntityStore ([3b10b89](https://github.com/contentful/experience-builder/commit/3b10b8989b005337e8efbe6cd4c52a8458c13280))

### Features

- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- allow users to drop new components onto canvas ([6c24fc3](https://github.com/contentful/experience-builder/commit/6c24fc35a828a07bb1c3e330d1edbcc3d1f5f6cd))
- change container defaults ([9a9afeb](https://github.com/contentful/experience-builder/commit/9a9afeba07a1f3b6d400023eec5ceca724a68837))
- **experience-builder-sdk:** use visual editor package ([#169](https://github.com/contentful/experience-builder/issues/169)) ([7477225](https://github.com/contentful/experience-builder/commit/74772256690b031cb3d8a57b34b23ce6935422fe))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- initialization code for injectable editor ([6f49c40](https://github.com/contentful/experience-builder/commit/6f49c40ce9345dc1f6e41f64f36af8f6266f8066))

# [4.0.0-next.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-next.1...@contentful/experience-builder@4.0.0-next.2) (2023-12-08)

**Note:** Version bump only for package @contentful/experience-builder

# [4.0.0-next.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@4.0.0-next.0...@contentful/experience-builder@4.0.0-next.1) (2023-12-08)

- feat!: testing the breaking change (#181) ([ac2f4b0](https://github.com/contentful/experience-builder/commit/ac2f4b07001fe022e7c56e83fa2b8dac08125095)), closes [#181](https://github.com/contentful/experience-builder/issues/181)

### BREAKING CHANGES

- for science

# [4.0.0-next.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.13.0...@contentful/experience-builder@4.0.0-next.0) (2023-12-08)

### chore

- circleci setup to allow pre-release on next branch [SPA-1634] ([#176](https://github.com/contentful/experience-builder/issues/176)) ([9b6b5b3](https://github.com/contentful/experience-builder/commit/9b6b5b38ba6506393008a5ca024682e70986ee29)), closes [#175](https://github.com/contentful/experience-builder/issues/175) [#178](https://github.com/contentful/experience-builder/issues/178)

### BREAKING CHANGES

- Registered components will be wrapped with a div container by default. The `wrapComponent` option can be used when registering components to opt-out of this behavior if necessary.

- chore(release): updated release notes and package versions [ci skip]

* @contentful/experience-builder@3.0.0
* @contentful/experience-builder-types@2.0.0

## [3.5.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.5.1...@contentful/experience-builder@3.5.2) (2023-12-27)

### Bug Fixes

- refetch when dataSource or design components changed [SPA-1711] ([#218](https://github.com/contentful/experience-builder/issues/218)) ([50814d5](https://github.com/contentful/experience-builder/commit/50814d5893c030d061fc3461009707213d98556f))

## [3.5.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.5.0...@contentful/experience-builder@3.5.1) (2023-12-22)

### Bug Fixes

- improve initial fetching mechanism [SPA-1711] ([#217](https://github.com/contentful/experience-builder/issues/217)) ([f160913](https://github.com/contentful/experience-builder/commit/f160913219e4f02cea3fe9db0060e5338fbe2f20))

# [3.5.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.4.4...@contentful/experience-builder@3.5.0) (2023-12-20)

### Features

- increase the timeout for editor entity store to avoid data loss ([#212](https://github.com/contentful/experience-builder/issues/212)) ([844a1ad](https://github.com/contentful/experience-builder/commit/844a1adf9c0ed33d91c76bd3c9a01680adea906b))

## [3.4.4](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.4.3...@contentful/experience-builder@3.4.4) (2023-12-20)

**Note:** Version bump only for package @contentful/experience-builder

## [3.4.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.4.2...@contentful/experience-builder@3.4.3) (2023-12-20)

### Bug Fixes

- switching locale makes design components disappear [SPA-1711] ([#209](https://github.com/contentful/experience-builder/issues/209)) ([84ca724](https://github.com/contentful/experience-builder/commit/84ca7248cbfcbd835a58c979d26ec9d375a02931))

## [3.4.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.4.1...@contentful/experience-builder@3.4.2) (2023-12-20)

### Bug Fixes

- design token logic breaks auto height for empty containers ([#210](https://github.com/contentful/experience-builder/issues/210)) ([901bf67](https://github.com/contentful/experience-builder/commit/901bf67c6f7e3fb1a6b968b7fbb26b27d302f13b))

## [3.4.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.4.0...@contentful/experience-builder@3.4.1) (2023-12-20)

### Bug Fixes

- dont initialise entity store on every render by using state [SPA-1711] ([#208](https://github.com/contentful/experience-builder/issues/208)) ([b04f44b](https://github.com/contentful/experience-builder/commit/b04f44bae930df18ee53c74754f40ddb2bca2fbe))

# [3.4.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.3.1...@contentful/experience-builder@3.4.0) (2023-12-20)

### Features

- improve logs for example using a consistent prefix ([#207](https://github.com/contentful/experience-builder/issues/207)) ([96c306d](https://github.com/contentful/experience-builder/commit/96c306d23ac546c6b7bf6f425b434a9517f99b6f))

## [3.3.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.3.0...@contentful/experience-builder@3.3.1) (2023-12-19)

### Bug Fixes

- resolve breakpoint values correctly so that the ui doesn't crash ([91cc76a](https://github.com/contentful/experience-builder/commit/91cc76a65e45e621f90665118410d7089e6f5a94))

# [3.3.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.2.0...@contentful/experience-builder@3.3.0) (2023-12-18)

### Features

- adds design token resultion for cfGap, cfWidth, cfHeight, and cfBackgroundColor ([ab747e5](https://github.com/contentful/experience-builder/commit/ab747e5eba2c4ad98290f551105a41c49e3c4395))
- resolve design tokens for row and column gap ([0b5d122](https://github.com/contentful/experience-builder/commit/0b5d122a10b01438bd014038665597b97f0cb807))

# [3.2.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.1.3...@contentful/experience-builder@3.2.0) (2023-12-18)

### Features

- initialize sustainable entity store ([#200](https://github.com/contentful/experience-builder/issues/200)) ([b136abf](https://github.com/contentful/experience-builder/commit/b136abf860a7c90de072e18d69652e2b4fc65956))

## [3.1.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.1.2...@contentful/experience-builder@3.1.3) (2023-12-18)

### Bug Fixes

- calculate component client rect via children ([#196](https://github.com/contentful/experience-builder/issues/196)) ([e7d537e](https://github.com/contentful/experience-builder/commit/e7d537eea09b5d7e6442699a70bc27d52f3e2a8d))

## [3.1.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.1.1...@contentful/experience-builder@3.1.2) (2023-12-15)

### Bug Fixes

- small fix to design token registry resolving design token values ([9dadf38](https://github.com/contentful/experience-builder/commit/9dadf389dec6dfa8c1ee2e1ea93dfc9ba042a17d))

## [3.1.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.1.0...@contentful/experience-builder@3.1.1) (2023-12-15)

### Bug Fixes

- render component values in preview and resolve links properly [] ([#194](https://github.com/contentful/experience-builder/issues/194)) ([7183fbd](https://github.com/contentful/experience-builder/commit/7183fbdc16e27c1cef3b2cab8a556d7a54f54770))

# [3.1.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.0.4...@contentful/experience-builder@3.1.0) (2023-12-14)

### Features

- resolves the design token values ([2b2936a](https://github.com/contentful/experience-builder/commit/2b2936aae773859bbed4f6c265f51e6e2c48393e))

## [3.0.4](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.0.3...@contentful/experience-builder@3.0.4) (2023-12-14)

### Bug Fixes

- replace component values with actual onces before rendering [] ([#192](https://github.com/contentful/experience-builder/issues/192)) ([2eb2b66](https://github.com/contentful/experience-builder/commit/2eb2b666bb524c7bd0e1251a0119dad1187e2966))

## [3.0.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.0.2...@contentful/experience-builder@3.0.3) (2023-12-13)

### Bug Fixes

- strictly check for asset link type [SPA-1673] ([#187](https://github.com/contentful/experience-builder/issues/187)) ([c5f1c18](https://github.com/contentful/experience-builder/commit/c5f1c1802bde6373237f49de45b84a6bd110921d))

## [3.0.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.0.1...@contentful/experience-builder@3.0.2) (2023-12-12)

**Note:** Version bump only for package @contentful/experience-builder

## [3.0.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@3.0.0...@contentful/experience-builder@3.0.1) (2023-12-07)

**Note:** Version bump only for package @contentful/experience-builder

# [3.0.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.13.0...@contentful/experience-builder@3.0.0) (2023-12-06)

- feat!: register toolkit components and include wrap container by default [ALT-115] (#175) ([1097764](https://github.com/contentful/experience-builder/commit/1097764e33fa0a5a5b89007b04d0cf5f18d6d71e)), closes [#175](https://github.com/contentful/experience-builder/issues/175)

### BREAKING CHANGES

- Registered components will be wrapped with a div container by default. The `wrapComponent` option can be used when registering components to opt-out of this behavior if necessary.

# [2.13.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.12.0...@contentful/experience-builder@2.13.0) (2023-12-05)

### Features

- inject user defined layout styling through component definition ([9d18ed6](https://github.com/contentful/experience-builder/commit/9d18ed68a82c6ece4c162ed764313837a178f1b7))

# [2.12.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.11.1...@contentful/experience-builder@2.12.0) (2023-11-30)

### Features

- [SPA-1574] add media type and handle it ([#168](https://github.com/contentful/experience-builder/issues/168)) ([7fe96c3](https://github.com/contentful/experience-builder/commit/7fe96c3f3e89db1208e787d06c7291765ee18c19))

## [2.11.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.11.0...@contentful/experience-builder@2.11.1) (2023-11-29)

### Bug Fixes

- dont show warning about alien message, don't render invalid attributes [] ([#170](https://github.com/contentful/experience-builder/issues/170)) ([e52ab8d](https://github.com/contentful/experience-builder/commit/e52ab8d0861f1d9c751922d018f17980d002a37a))

# [2.11.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.10.1...@contentful/experience-builder@2.11.0) (2023-11-27)

### Features

- handle bindings for design components [SPA-1606] ([#167](https://github.com/contentful/experience-builder/issues/167)) ([3eb7bb5](https://github.com/contentful/experience-builder/commit/3eb7bb5b05ccb6057d8834c9a0bc9718b90faf50))

## [2.10.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.10.0...@contentful/experience-builder@2.10.1) (2023-11-21)

### Bug Fixes

- allow ExperienceRoot to render editor mode when entry first created [ALT-104] ([d69d5da](https://github.com/contentful/experience-builder/commit/d69d5dabd448929164ab37a93bdab8122fbfe899))
- incorporate reviewer feedback ([ea236c9](https://github.com/contentful/experience-builder/commit/ea236c93eab52b51135169dfa43f1c73948f32b6))
- refactoring and update contentful cli to latest [ALT-106] ([7b290a2](https://github.com/contentful/experience-builder/commit/7b290a23e000cd1ad4704da5dbaaa04c735f8bfb))

# [2.10.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.9.0...@contentful/experience-builder@2.10.0) (2023-11-21)

### Features

- add new constant and remove unused variables [SPA-1605] ([#163](https://github.com/contentful/experience-builder/issues/163)) ([bdd6a08](https://github.com/contentful/experience-builder/commit/bdd6a086d0f107eae55b3bc519a7ed8f70b489b0))

# [2.9.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.8.5...@contentful/experience-builder@2.9.0) (2023-11-20)

### Features

- add watch command to npm build command for hot reload development ([0e3de5e](https://github.com/contentful/experience-builder/commit/0e3de5ef9ea4e0db7e311a73e48c854f93e36e8b))

## [2.8.5](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.8.4...@contentful/experience-builder@2.8.5) (2023-11-16)

**Note:** Version bump only for package @contentful/experience-builder

## [2.8.4](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.8.3...@contentful/experience-builder@2.8.4) (2023-11-13)

**Note:** Version bump only for package @contentful/experience-builder

## [2.8.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.8.2...@contentful/experience-builder@2.8.3) (2023-11-10)

### Bug Fixes

- **experience-builder-sdk:** export ExternalSDKMode and EntityStore types [] ([#156](https://github.com/contentful/experience-builder/issues/156)) ([32a50a8](https://github.com/contentful/experience-builder/commit/32a50a81d669506837caef3e653332ae84a35f76))

## [2.8.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.8.1...@contentful/experience-builder@2.8.2) (2023-11-10)

### Bug Fixes

- **experience-builder-sdk:** update rollup config to not include react in build ([#155](https://github.com/contentful/experience-builder/issues/155)) ([7e0f5ca](https://github.com/contentful/experience-builder/commit/7e0f5ca8b731586fc43a26dd9d562013cb4b1250))

## [2.8.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.8.0...@contentful/experience-builder@2.8.1) (2023-11-09)

**Note:** Version bump only for package @contentful/experience-builder

# [2.8.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.7.3...@contentful/experience-builder@2.8.0) (2023-11-08)

### Features

- render design component within an experience [SPA-1583] ([#151](https://github.com/contentful/experience-builder/issues/151)) ([cb4a38a](https://github.com/contentful/experience-builder/commit/cb4a38a3fbf75f8c4773ff95b203a11ae12220bc))

## [2.7.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.7.2...@contentful/experience-builder@2.7.3) (2023-11-07)

### Bug Fixes

- empty container highlight on hover ([4501be2](https://github.com/contentful/experience-builder/commit/4501be237704ea53cd7ea4bea3ccab92dc69668f))

## [2.7.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.7.1...@contentful/experience-builder@2.7.2) (2023-11-06)

### Bug Fixes

- minor change to empty container font color [ALT-59] ([3a08275](https://github.com/contentful/experience-builder/commit/3a082759b97e03f9dc7a218001e255fe458b58a0))

## [2.7.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.7.0...@contentful/experience-builder@2.7.1) (2023-11-06)

### Bug Fixes

- correctly retrieve the url from the bound asset in preview/delivery ([#152](https://github.com/contentful/experience-builder/issues/152)) ([cb36d40](https://github.com/contentful/experience-builder/commit/cb36d40ee87d5d6cc11e2b099cb5490429567523))

# [2.7.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.6.3...@contentful/experience-builder@2.7.0) (2023-11-06)

### Features

- [SPA-1522] send also the margins with the coordinates ([#149](https://github.com/contentful/experience-builder/issues/149)) ([4ef60ba](https://github.com/contentful/experience-builder/commit/4ef60baf75ce5ed0ad84bb1d260714233afe14eb))

## [2.6.3](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.6.2...@contentful/experience-builder@2.6.3) (2023-11-06)

**Note:** Version bump only for package @contentful/experience-builder

## [2.6.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.6.1...@contentful/experience-builder@2.6.2) (2023-10-30)

### Bug Fixes

- initial setup for experience-builder-types [SPA-1395] ([#145](https://github.com/contentful/experience-builder/issues/145)) ([7b138ab](https://github.com/contentful/experience-builder/commit/7b138ab68ff2e1d685c95d665de5f7930d897916))

## [2.6.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.6.0...@contentful/experience-builder@2.6.1) (2023-10-27)

### Bug Fixes

- ease exp entry validation [] ([#147](https://github.com/contentful/experience-builder/issues/147)) ([cbe3cd9](https://github.com/contentful/experience-builder/commit/cbe3cd9d27d87e2ce2b5439fbc7dd58bb1ff9383))

# [2.6.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.5.1...@contentful/experience-builder@2.6.0) (2023-10-26)

### Features

- support ssr [SPA-1435] ([#136](https://github.com/contentful/experience-builder/issues/136)) ([6cec574](https://github.com/contentful/experience-builder/commit/6cec574d82bd2c9471f0caef7179979fdcee3236))

## [2.5.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder@2.5.0...@contentful/experience-builder@2.5.1) (2023-10-26)

### Bug Fixes

- container default sizing height to fit all children [] ([#146](https://github.com/contentful/experience-builder/issues/146)) ([d301fe8](https://github.com/contentful/experience-builder/commit/d301fe827f2d895c10ca94370b80895d311c3dc1))

# 2.5.0 (2023-10-25)

### Features

- Experience builder monorepo setup [SPA-1395] ([#141](https://github.com/contentful/experience-builder/issues/141)) ([a183719](https://github.com/contentful/experience-builder/commit/a1837192f366f09a09538c4bbfb992fffcc5a916))
