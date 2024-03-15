# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.1-alpha.5](https://github.com/contentful/experience-builder/compare/@contentful/experiences-components-react@0.0.1-alpha.4...@contentful/experiences-components-react@0.0.1-alpha.5) (2024-03-13)

**Note:** Version bump only for package @contentful/experiences-components-react

## [0.0.1-alpha.4](https://github.com/contentful/experience-builder/compare/@contentful/experiences-components-react@0.0.1-alpha.3...@contentful/experiences-components-react@0.0.1-alpha.4) (2024-03-12)

**Note:** Version bump only for package @contentful/experiences-components-react

## [0.0.1-alpha.3](https://github.com/contentful/experience-builder/compare/@contentful/experiences-components-react@0.0.1-alpha.2...@contentful/experiences-components-react@0.0.1-alpha.3) (2024-03-08)

### Bug Fixes

- address pr comments ([5d91d47](https://github.com/contentful/experience-builder/commit/5d91d47e45130bb56070412b704236bdd5c80a59))
- update component tooltips to use component term instead of elements ([25db0e2](https://github.com/contentful/experience-builder/commit/25db0e2936eba1ea00a8ab0d5ae4318488243558))

## 0.0.1-alpha.2 (2024-03-04)

### Bug Fixes

- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- change visual-sdk to build tooling of monorepo ([edf0991](https://github.com/contentful/experience-builder/commit/edf0991cc44f07429047a86a71baa950d7255ef8))
- **components:** fix button target label for eb props ([#251](https://github.com/contentful/experience-builder/issues/251)) ([a051360](https://github.com/contentful/experience-builder/commit/a05136011f1136ef9a988fd04a01dd5ef4793c88))
- **components:** line breaks for text built-ins [ALT-307] ([#372](https://github.com/contentful/experience-builder/issues/372)) ([068a105](https://github.com/contentful/experience-builder/commit/068a105a38370c350c846ece151ab5f426e8d22a))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- remove [data-cf-node-*] attributes from components ([#315](https://github.com/contentful/experience-builder/issues/315)) ([cc0833e](https://github.com/contentful/experience-builder/commit/cc0833eb07f5d27c0ed696bef5c24cf0d258cbe0))
- revise built-in component thumbnail urls [ALT-459] ([#413](https://github.com/contentful/experience-builder/issues/413)) ([56ab7cd](https://github.com/contentful/experience-builder/commit/56ab7cd7add426526a5ed650c3aa27b34316b466))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([d71c898](https://github.com/contentful/experience-builder/commit/d71c898e2fe32b45f0003c829171e18b555a347e))
- update background related fields to have display names of Background image and Background color ([84aecb4](https://github.com/contentful/experience-builder/commit/84aecb4cfcd4a51a29c9444d02686fa35254f30a))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update Text component built in styles and add hyperlink options [ALT-358] ([#319](https://github.com/contentful/experience-builder/issues/319)) ([441e11e](https://github.com/contentful/experience-builder/commit/441e11ee04038a701220535d78cab621433ad483))
- use https protocol for component thumnails ([217a108](https://github.com/contentful/experience-builder/commit/217a108f86a3f66ccbce1ca3162403530bf18c06))
- use proper exported tyye in ContentfulContainer ([50d09ef](https://github.com/contentful/experience-builder/commit/50d09ef81037d7a264fbed5f8fa4078cd2485340))
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- **visual-editor:** remove error around passing editor props to normal elements ([#231](https://github.com/contentful/experience-builder/issues/231)) ([4024a68](https://github.com/contentful/experience-builder/commit/4024a68b3da06919ae777c15e7d25a8a40d6c263))

### Features

- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- adds background label for empty containers ([11d3f7c](https://github.com/contentful/experience-builder/commit/11d3f7cf6de6b862e0c6780e20ed0e83869bc348))
- adds tooltip defn for heading, text, richtext, button, and image ([887b753](https://github.com/contentful/experience-builder/commit/887b753415d0e6450545e541d8ddfef81fd71e6d))
- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- updates rich text component definition to hold default stylings rather than using css modules ([7ddf6ed](https://github.com/contentful/experience-builder/commit/7ddf6ed7748f383cdc6776ec68200c15500d16bf))

## [0.0.2-alpha.33](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.32...@contentful/experience-builder-components@0.0.2-alpha.33) (2024-03-01)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.32](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.31...@contentful/experience-builder-components@0.0.2-alpha.32) (2024-02-29)

### Features

- adds tooltip defn for heading, text, richtext, button, and image ([887b753](https://github.com/contentful/experience-builder/commit/887b753415d0e6450545e541d8ddfef81fd71e6d))

## [0.0.2-alpha.31](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.30...@contentful/experience-builder-components@0.0.2-alpha.31) (2024-02-28)

### Bug Fixes

- revise built-in component thumbnail urls [ALT-459] ([#413](https://github.com/contentful/experience-builder/issues/413)) ([56ab7cd](https://github.com/contentful/experience-builder/commit/56ab7cd7add426526a5ed650c3aa27b34316b466))
- update background related fields to have display names of Background image and Background color ([84aecb4](https://github.com/contentful/experience-builder/commit/84aecb4cfcd4a51a29c9444d02686fa35254f30a))
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))

## [0.0.2-alpha.30](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.29...@contentful/experience-builder-components@0.0.2-alpha.30) (2024-02-26)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.29](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.28...@contentful/experience-builder-components@0.0.2-alpha.29) (2024-02-22)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.28](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.27...@contentful/experience-builder-components@0.0.2-alpha.28) (2024-02-21)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.27](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.26...@contentful/experience-builder-components@0.0.2-alpha.27) (2024-02-16)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.26](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.25...@contentful/experience-builder-components@0.0.2-alpha.26) (2024-02-15)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.25](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.24...@contentful/experience-builder-components@0.0.2-alpha.25) (2024-02-14)

### Bug Fixes

- **components:** line breaks for text built-ins [ALT-307] ([#372](https://github.com/contentful/experience-builder/issues/372)) ([068a105](https://github.com/contentful/experience-builder/commit/068a105a38370c350c846ece151ab5f426e8d22a))

## [0.0.2-alpha.24](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-components@0.0.2-alpha.23...@contentful/experience-builder-components@0.0.2-alpha.24) (2024-02-09)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.23](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.22...@contentful/experience-builder-components@0.0.2-alpha.23) (2024-02-08)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.22](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.21...@contentful/experience-builder-components@0.0.2-alpha.22) (2024-02-07)

### Bug Fixes

- update Text component built in styles and add hyperlink options [ALT-358] ([#319](https://github.com/contentful/experience-builder-toolkit/issues/319)) ([441e11e](https://github.com/contentful/experience-builder-toolkit/commit/441e11ee04038a701220535d78cab621433ad483))

### Features

- adds background label for empty containers ([11d3f7c](https://github.com/contentful/experience-builder-toolkit/commit/11d3f7cf6de6b862e0c6780e20ed0e83869bc348))

## [0.0.2-alpha.21](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.20...@contentful/experience-builder-components@0.0.2-alpha.21) (2024-02-06)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.20](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.18...@contentful/experience-builder-components@0.0.2-alpha.20) (2024-02-01)

### Bug Fixes

- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder-toolkit/issues/321)) ([453225c](https://github.com/contentful/experience-builder-toolkit/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- remove [data-cf-node-*] attributes from components ([#315](https://github.com/contentful/experience-builder-toolkit/issues/315)) ([cc0833e](https://github.com/contentful/experience-builder-toolkit/commit/cc0833eb07f5d27c0ed696bef5c24cf0d258cbe0))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder-toolkit/issues/313)) ([d71c898](https://github.com/contentful/experience-builder-toolkit/commit/d71c898e2fe32b45f0003c829171e18b555a347e))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder-toolkit/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder-toolkit/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- use https protocol for component thumnails ([217a108](https://github.com/contentful/experience-builder-toolkit/commit/217a108f86a3f66ccbce1ca3162403530bf18c06))

### Features

- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder-toolkit/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder-toolkit/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder-toolkit/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder-toolkit/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- updates rich text component definition to hold default stylings rather than using css modules ([7ddf6ed](https://github.com/contentful/experience-builder-toolkit/commit/7ddf6ed7748f383cdc6776ec68200c15500d16bf))

## [0.0.2-alpha.18](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.17...@contentful/experience-builder-components@0.0.2-alpha.18) (2024-01-25)

### Features

- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder-toolkit/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder-toolkit/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))

## [0.0.2-alpha.17](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.16...@contentful/experience-builder-components@0.0.2-alpha.17) (2024-01-23)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.16](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.15...@contentful/experience-builder-components@0.0.2-alpha.16) (2024-01-17)

### Bug Fixes

- use proper exported tyye in ContentfulContainer ([50d09ef](https://github.com/contentful/experience-builder-toolkit/commit/50d09ef81037d7a264fbed5f8fa4078cd2485340))

## [0.0.2-alpha.15](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.14...@contentful/experience-builder-components@0.0.2-alpha.15) (2024-01-16)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.14](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.13...@contentful/experience-builder-components@0.0.2-alpha.14) (2024-01-16)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.13](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.12...@contentful/experience-builder-components@0.0.2-alpha.13) (2024-01-15)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.12](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.11...@contentful/experience-builder-components@0.0.2-alpha.12) (2024-01-12)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.11](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.10...@contentful/experience-builder-components@0.0.2-alpha.11) (2024-01-11)

### Bug Fixes

- **components:** fix button target label for eb props ([#251](https://github.com/contentful/experience-builder-toolkit/issues/251)) ([a051360](https://github.com/contentful/experience-builder-toolkit/commit/a05136011f1136ef9a988fd04a01dd5ef4793c88))

## [0.0.2-alpha.10](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.9...@contentful/experience-builder-components@0.0.2-alpha.10) (2024-01-11)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.9](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.8...@contentful/experience-builder-components@0.0.2-alpha.9) (2024-01-11)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.8](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.7...@contentful/experience-builder-components@0.0.2-alpha.8) (2024-01-10)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.7](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.6...@contentful/experience-builder-components@0.0.2-alpha.7) (2024-01-10)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.6](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.5...@contentful/experience-builder-components@0.0.2-alpha.6) (2024-01-09)

### Bug Fixes

- **visual-editor:** remove error around passing editor props to normal elements ([#231](https://github.com/contentful/experience-builder-toolkit/issues/231)) ([4024a68](https://github.com/contentful/experience-builder-toolkit/commit/4024a68b3da06919ae777c15e7d25a8a40d6c263))

## [0.0.2-alpha.5](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.4...@contentful/experience-builder-components@0.0.2-alpha.5) (2024-01-09)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.2-alpha.4](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.3...@contentful/experience-builder-components@0.0.2-alpha.4) (2024-01-09)

### Bug Fixes

- change visual-sdk to build tooling of monorepo ([edf0991](https://github.com/contentful/experience-builder-toolkit/commit/edf0991cc44f07429047a86a71baa950d7255ef8))

## [0.0.2-alpha.3](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.2-alpha.2...@contentful/experience-builder-components@0.0.2-alpha.3) (2024-01-08)

### Bug Fixes

- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder-toolkit/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))

## 0.0.2-alpha.2 (2024-01-08)

### Bug Fixes

- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder-toolkit/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder-toolkit/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder-toolkit/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- update font weight validations ([#213](https://github.com/contentful/experience-builder-toolkit/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder-toolkit/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))

### Features

- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder-toolkit/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder-toolkit/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder-toolkit/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))

## [0.0.1-alpha.12](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.1-alpha.11...@contentful/experience-builder-components@0.0.1-alpha.12) (2023-12-06)

### Bug Fixes

- **components:** updating binding value of image from url to src ([805a62c](https://github.com/contentful/experience-builder-toolkit/commit/805a62c685d9c1e6fdecbc111c924a3377633f1e))

## [0.0.1-alpha.11](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.1-alpha.10...@contentful/experience-builder-components@0.0.1-alpha.11) (2023-12-06)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.1-alpha.10](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-components@0.0.1-alpha.9...@contentful/experience-builder-components@0.0.1-alpha.10) (2023-10-27)

### Bug Fixes

- **components:** expose the withExperienceBuilder hook ([fca2e37](https://github.com/contentful/experience-builder-toolkit/commit/fca2e371f99cae4e619a1fd4a608e899907a1805))

## 0.0.1-alpha.9 (2023-10-11)

### Features

- **create-experience-builder:** new CLI tool to create sites with EB [] ([1d326de](https://github.com/contentful/experience-builder-toolkit/commit/1d326dea081c270b5ad9a135157d5fd37afa0ec7))

## 0.0.1-alpha.8 (2023-10-05)

### Bug Fixes

- **components:** adding styles.css to build cache [] ([#27](https://github.com/contentful/experience-builder-toolkit/issues/27)) ([ecfc7d7](https://github.com/contentful/experience-builder-toolkit/commit/ecfc7d79b02944c347d5157457bddb313f7c78b6))
- **components:** faux fix to kick off build ([8a55356](https://github.com/contentful/experience-builder-toolkit/commit/8a553565c96318ffdebcccc0e7c7c370c5eadd52))

## 0.0.1-alpha.7 (2023-10-04)

### Bug Fixes

- **componets:** test fix ([659f10d](https://github.com/contentful/experience-builder-toolkit/commit/659f10d2e67e14866ddc7c12b2ad7791d738ac80))

## 0.0.1-alpha.6 (2023-10-04)

### Bug Fixes

- **components:** faux change to kick off build 2 ([7707a30](https://github.com/contentful/experience-builder-toolkit/commit/7707a30a75c095e1a85a6dfc3734fdacf388e49e))

## 0.0.1-alpha.5 (2023-10-04)

### Bug Fixes

- **components:** faux fix to kick off build ([9cab2cd](https://github.com/contentful/experience-builder-toolkit/commit/9cab2cdb5be07c6238702993af9d2add677679b0))

## 0.0.1-alpha.4 (2023-10-03)

## 0.0.1-alpha.3 (2023-10-03)

## 0.0.1-alpha.2 (2023-10-03)

### Bug Fixes

- **components:** adding cf class all the time ([6e42d53](https://github.com/contentful/experience-builder-toolkit/commit/6e42d53bd3b954ea9d1eec81fcd6040fbf90b191))

## [0.0.1-alpha.8](https://github.com/contentful/experience-builder-components/compare/v0.0.1-alpha.7...v0.0.1-alpha.8) (2023-10-05)

### Bug Fixes

- **components:** adding styles.css to build cache [] ([#27](https://github.com/contentful/experience-builder-components/issues/27)) ([ecfc7d7](https://github.com/contentful/experience-builder-components/commit/ecfc7d79b02944c347d5157457bddb313f7c78b6))
- **components:** faux fix to kick off build ([8a55356](https://github.com/contentful/experience-builder-components/commit/8a553565c96318ffdebcccc0e7c7c370c5eadd52))

## [0.0.1-alpha.7](https://github.com/contentful/experience-builder-components/compare/v0.0.1-alpha.6...v0.0.1-alpha.7) (2023-10-04)

### Bug Fixes

- **componets:** test fix ([659f10d](https://github.com/contentful/experience-builder-components/commit/659f10d2e67e14866ddc7c12b2ad7791d738ac80))

## [0.0.1-alpha.6](https://github.com/contentful/experience-builder-components/compare/v0.0.1-alpha.5...v0.0.1-alpha.6) (2023-10-04)

### Bug Fixes

- **components:** faux change to kick off build 2 ([7707a30](https://github.com/contentful/experience-builder-components/commit/7707a30a75c095e1a85a6dfc3734fdacf388e49e))

## [0.0.1-alpha.5](https://github.com/contentful/experience-builder-components/compare/v0.0.1-alpha.4...v0.0.1-alpha.5) (2023-10-04)

### Bug Fixes

- **components:** faux fix to kick off build ([9cab2cd](https://github.com/contentful/experience-builder-components/commit/9cab2cdb5be07c6238702993af9d2add677679b0))

## [0.0.1-alpha.4](https://github.com/contentful/experience-builder-components/compare/v0.0.1-alpha.3...v0.0.1-alpha.4) (2023-10-03)

**Note:** Version bump only for package @contentful/experience-builder-components

## [0.0.1-alpha.3](https://github.com/contentful/experience-builder-components/compare/v0.0.1-alpha.2...v0.0.1-alpha.3) (2023-10-03)

**Note:** Version bump only for package @contentful/experience-builder-components

## 0.0.1-alpha.2 (2023-10-03)

### Bug Fixes

- **components:** adding cf class all the time ([6e42d53](https://github.com/contentful/experience-builder-components/commit/6e42d53bd3b954ea9d1eec81fcd6040fbf90b191))
