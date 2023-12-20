# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
