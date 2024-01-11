# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.2-alpha.9](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.8...@contentful/experience-builder-core@0.0.2-alpha.9) (2024-01-11)

### Bug Fixes

- **core:** enable design tokens for text color style [ALT-249] ([#244](https://github.com/contentful/experience-builder-toolkit/issues/244)) ([81f5a27](https://github.com/contentful/experience-builder-toolkit/commit/81f5a27acaa3815b381b2d114766f892bc1c764b))
- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder-toolkit/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder-toolkit/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))

## [0.0.2-alpha.8](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.7...@contentful/experience-builder-core@0.0.2-alpha.8) (2024-01-11)

### Bug Fixes

- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder-toolkit/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))

## [0.0.2-alpha.7](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.6...@contentful/experience-builder-core@0.0.2-alpha.7) (2024-01-10)

### Bug Fixes

- change default border style color to 0px width ([#238](https://github.com/contentful/experience-builder-toolkit/issues/238)) ([f067000](https://github.com/contentful/experience-builder-toolkit/commit/f0670000b73a562127d26eae0ee3f13e27b7781f))

## [0.0.2-alpha.6](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.5...@contentful/experience-builder-core@0.0.2-alpha.6) (2024-01-10)

### Bug Fixes

- handle missing linkType property ([#237](https://github.com/contentful/experience-builder-toolkit/issues/237)) ([1827d96](https://github.com/contentful/experience-builder-toolkit/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))

### Features

- add cfBorder designTokens resolver ([e5de5e5](https://github.com/contentful/experience-builder-toolkit/commit/e5de5e5d1023e58c6ab9ae3b1b42581b04e128c6))

## [0.0.2-alpha.5](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.4...@contentful/experience-builder-core@0.0.2-alpha.5) (2024-01-09)

### Bug Fixes

- **core:** add design token fallback values besed on default values in builtInStyles [ALT-200] ([#232](https://github.com/contentful/experience-builder-toolkit/issues/232)) ([37e8feb](https://github.com/contentful/experience-builder-toolkit/commit/37e8feb5361a7c1074da7bbc4e59736d21220d2b))
- **core:** add line height and letter spacing to DesignTokensDefinition [ALT-248] ([#233](https://github.com/contentful/experience-builder-toolkit/issues/233)) ([1a44c44](https://github.com/contentful/experience-builder-toolkit/commit/1a44c447e2b102feb147645b8bc1796acd60793d))

## [0.0.2-alpha.4](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.3...@contentful/experience-builder-core@0.0.2-alpha.4) (2024-01-09)

### Bug Fixes

- **core:** enabling design tokens for font size [ALT-245] ([#227](https://github.com/contentful/experience-builder-toolkit/issues/227)) ([d4d8e15](https://github.com/contentful/experience-builder-toolkit/commit/d4d8e15231230d89a1c139976c4ea66ea020db34))

## [0.0.2-alpha.3](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.2...@contentful/experience-builder-core@0.0.2-alpha.3) (2024-01-09)

### Bug Fixes

- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder-toolkit/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- change visual-sdk to build tooling of monorepo ([edf0991](https://github.com/contentful/experience-builder-toolkit/commit/edf0991cc44f07429047a86a71baa950d7255ef8))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder-toolkit/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder-toolkit/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder-toolkit/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder-toolkit/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))

## 0.0.2-alpha.2 (2024-01-08)

### Bug Fixes

- case name of typing ([3b238c1](https://github.com/contentful/experience-builder-toolkit/commit/3b238c121e3bc27f5641996da45f87706d533b09))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder-toolkit/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder-toolkit/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder-toolkit/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder-toolkit/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- update font weight validations ([#213](https://github.com/contentful/experience-builder-toolkit/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder-toolkit/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder-toolkit/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder-toolkit/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))

### Features

- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder-toolkit/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder-toolkit/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder-toolkit/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))

### Reverts

- Revert "chore: Update packages/core/src/fetchers/fetchBySlug.ts" ([d937add](https://github.com/contentful/experience-builder-toolkit/commit/d937add2cbf4a40d38ae0b92f82127f94aefebf6))
- Revert "fix: typing errors" ([4a333e0](https://github.com/contentful/experience-builder-toolkit/commit/4a333e00689f75f11fb26a200bb9a9ff78289e4d))

# [3.0.0-next.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.5.0...@contentful/experience-builder-types@3.0.0-next.0) (2023-12-08)

### chore

- circleci setup to allow pre-release on next branch [SPA-1634] ([#176](https://github.com/contentful/experience-builder/issues/176)) ([9b6b5b3](https://github.com/contentful/experience-builder/commit/9b6b5b38ba6506393008a5ca024682e70986ee29)), closes [#175](https://github.com/contentful/experience-builder/issues/175) [#178](https://github.com/contentful/experience-builder/issues/178)

### BREAKING CHANGES

- Registered components will be wrapped with a div container by default. The `wrapComponent` option can be used when registering components to opt-out of this behavior if necessary.

- chore(release): updated release notes and package versions [ci skip]

* @contentful/experience-builder@3.0.0
* @contentful/experience-builder-types@2.0.0

## [2.0.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@2.0.0...@contentful/experience-builder-types@2.0.1) (2023-12-07)

### Bug Fixes

- **experience-builder-types:** extend variables type on component definition [ALT-57] ([#178](https://github.com/contentful/experience-builder/issues/178)) ([af996dc](https://github.com/contentful/experience-builder/commit/af996dc343543f9b20d3367c6b7e46176f3e3d82))

# [2.0.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.5.0...@contentful/experience-builder-types@2.0.0) (2023-12-06)

- feat!: register toolkit components and include wrap container by default [ALT-115] (#175) ([1097764](https://github.com/contentful/experience-builder/commit/1097764e33fa0a5a5b89007b04d0cf5f18d6d71e)), closes [#175](https://github.com/contentful/experience-builder/issues/175)

### BREAKING CHANGES

- Registered components will be wrapped with a div container by default. The `wrapComponent` option can be used when registering components to opt-out of this behavior if necessary.

# [1.5.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.4.0...@contentful/experience-builder-types@1.5.0) (2023-12-05)

### Features

- inject user defined layout styling through component definition ([9d18ed6](https://github.com/contentful/experience-builder/commit/9d18ed68a82c6ece4c162ed764313837a178f1b7))

# [1.4.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.3.1...@contentful/experience-builder-types@1.4.0) (2023-11-30)

### Features

- [SPA-1574] add media type and handle it ([#168](https://github.com/contentful/experience-builder/issues/168)) ([7fe96c3](https://github.com/contentful/experience-builder/commit/7fe96c3f3e89db1208e787d06c7291765ee18c19))

## [1.3.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.3.0...@contentful/experience-builder-types@1.3.1) (2023-11-21)

### Bug Fixes

- incorporate reviewer feedback ([ea236c9](https://github.com/contentful/experience-builder/commit/ea236c93eab52b51135169dfa43f1c73948f32b6))

# [1.3.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.2.2...@contentful/experience-builder-types@1.3.0) (2023-11-21)

### Features

- add new constant and remove unused variables [SPA-1605] ([#163](https://github.com/contentful/experience-builder/issues/163)) ([bdd6a08](https://github.com/contentful/experience-builder/commit/bdd6a086d0f107eae55b3bc519a7ed8f70b489b0))

## [1.2.2](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.2.1...@contentful/experience-builder-types@1.2.2) (2023-11-16)

**Note:** Version bump only for package @contentful/experience-builder-types

## [1.2.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.2.0...@contentful/experience-builder-types@1.2.1) (2023-11-09)

**Note:** Version bump only for package @contentful/experience-builder-types

# [1.2.0](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.1.1...@contentful/experience-builder-types@1.2.0) (2023-11-08)

### Features

- render design component within an experience [SPA-1583] ([#151](https://github.com/contentful/experience-builder/issues/151)) ([cb4a38a](https://github.com/contentful/experience-builder/commit/cb4a38a3fbf75f8c4773ff95b203a11ae12220bc))

## [1.1.1](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-types@1.1.0...@contentful/experience-builder-types@1.1.1) (2023-11-06)

**Note:** Version bump only for package @contentful/experience-builder-types

# 1.1.0 (2023-10-30)

### Bug Fixes

- initial setup for experience-builder-types [SPA-1395] ([#145](https://github.com/contentful/experience-builder/issues/145)) ([7b138ab](https://github.com/contentful/experience-builder/commit/7b138ab68ff2e1d685c95d665de5f7930d897916))

### Features

- Experience builder monorepo setup [SPA-1395] ([#141](https://github.com/contentful/experience-builder/issues/141)) ([a183719](https://github.com/contentful/experience-builder/commit/a1837192f366f09a09538c4bbfb992fffcc5a916))
- support ssr [SPA-1435] ([#136](https://github.com/contentful/experience-builder/issues/136)) ([6cec574](https://github.com/contentful/experience-builder/commit/6cec574d82bd2c9471f0caef7179979fdcee3236))
