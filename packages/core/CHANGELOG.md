# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.1-alpha.3](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.2...@contentful/experiences-core@0.0.1-alpha.3) (2024-03-08)

### Bug Fixes

- **experiences:** proper handling of reparenting off canvas ([#460](https://github.com/contentful/experience-builder/issues/460)) ([9808cfc](https://github.com/contentful/experience-builder/commit/9808cfcdae03ad6c3fee7e3bb9278db06e179467))
- unused import lint errors ([1f8338d](https://github.com/contentful/experience-builder/commit/1f8338d325d403fa9667dc5ee867e44bb8186d68))
- update component tooltips to use component term instead of elements ([25db0e2](https://github.com/contentful/experience-builder/commit/25db0e2936eba1ea00a8ab0d5ae4318488243558))

### Features

- added toJSON function in entity store ([#467](https://github.com/contentful/experience-builder/issues/467)) ([7f9a504](https://github.com/contentful/experience-builder/commit/7f9a504dd0169851b77a1aa127f0839426dd3362))

## 0.0.1-alpha.2 (2024-03-04)

### Bug Fixes

- adjust auto to Auto so that the design tab is consistent throughout ([81c7f50](https://github.com/contentful/experience-builder/commit/81c7f5071e79e4f7e24df908f5c9ccca8b935b1c))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- assume not matching breakpoints and initialise correctly in the effect ([96c734a](https://github.com/contentful/experience-builder/commit/96c734a4b73630e2fd6a45fc9c0ae7b0778edd2b))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- case name of typing ([3b238c1](https://github.com/contentful/experience-builder/commit/3b238c121e3bc27f5641996da45f87706d533b09))
- change default border style color to 0px width ([#238](https://github.com/contentful/experience-builder/issues/238)) ([f067000](https://github.com/contentful/experience-builder/commit/f0670000b73a562127d26eae0ee3f13e27b7781f))
- change visual-sdk to build tooling of monorepo ([edf0991](https://github.com/contentful/experience-builder/commit/edf0991cc44f07429047a86a71baa950d7255ef8))
- **core:** add design token fallback values besed on default values in builtInStyles [ALT-200] ([#232](https://github.com/contentful/experience-builder/issues/232)) ([37e8feb](https://github.com/contentful/experience-builder/commit/37e8feb5361a7c1074da7bbc4e59736d21220d2b))
- **core:** add line height and letter spacing to DesignTokensDefinition [ALT-248] ([#233](https://github.com/contentful/experience-builder/issues/233)) ([1a44c44](https://github.com/contentful/experience-builder/commit/1a44c447e2b102feb147645b8bc1796acd60793d))
- **core:** enable design tokens for text color style [ALT-249] ([#244](https://github.com/contentful/experience-builder/issues/244)) ([81f5a27](https://github.com/contentful/experience-builder/commit/81f5a27acaa3815b381b2d114766f892bc1c764b))
- **core:** enabling design tokens for font size [ALT-245] ([#227](https://github.com/contentful/experience-builder/issues/227)) ([d4d8e15](https://github.com/contentful/experience-builder/commit/d4d8e15231230d89a1c139976c4ea66ea020db34))
- **core:** remove lodash dep to get rid of weird reference errors ([#272](https://github.com/contentful/experience-builder/issues/272)) ([5957b18](https://github.com/contentful/experience-builder/commit/5957b183c943d060b30e6f9d260196e3c3d91203))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))
- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder/commit/3e37f1518112c993456e08f74013c8a065b370fd))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- handle missing linkType property ([#237](https://github.com/contentful/experience-builder/issues/237)) ([1827d96](https://github.com/contentful/experience-builder/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))
- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))
- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))
- merge conflict in columns style type ([905add3](https://github.com/contentful/experience-builder/commit/905add3870c3e1d4390680c62b762cf03b09a2e6))
- mobile falls back to tablet style for token-enabled props ([0e1aa02](https://github.com/contentful/experience-builder/commit/0e1aa0214d69f7e388ee2b44e009570efe081e8a))
- set default cfHeight to fit-content [ALT-448] ([#373](https://github.com/contentful/experience-builder/issues/373)) ([67fb7d8](https://github.com/contentful/experience-builder/commit/67fb7d87d51979077a00194ae6ad85e505964db7))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- update background related fields to have display names of Background image and Background color ([84aecb4](https://github.com/contentful/experience-builder/commit/84aecb4cfcd4a51a29c9444d02686fa35254f30a))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))
- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))

### Features

- add cfBorder designTokens resolver ([e5de5e5](https://github.com/contentful/experience-builder/commit/e5de5e5d1023e58c6ab9ae3b1b42581b04e128c6))
- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- adds tooltip defn for heading, text, richtext, button, and image ([887b753](https://github.com/contentful/experience-builder/commit/887b753415d0e6450545e541d8ddfef81fd71e6d))
- clicking outside of the edited canvas sends post message to user interface ([6e35c29](https://github.com/contentful/experience-builder/commit/6e35c2904b33027302e83b1d90b8c674e2380527))
- **components:** ability to lock a column span for columns component ([#344](https://github.com/contentful/experience-builder/issues/344)) ([f01c907](https://github.com/contentful/experience-builder/commit/f01c907639ca549a7da48dbfd6279ec2e813fead))
- **components:** add new design value to track column wrap ([#338](https://github.com/contentful/experience-builder/issues/338)) ([4707707](https://github.com/contentful/experience-builder/commit/47077072b01a0fcb7ee3da2617a25362688bbbf7))
- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- **components:** column gaps [ALT-279] ([#324](https://github.com/contentful/experience-builder/issues/324)) ([465bd53](https://github.com/contentful/experience-builder/commit/465bd539b2dadc831096c9fba9f89c98e3687a04))
- **components:** column locking [ALT-357] ([#371](https://github.com/contentful/experience-builder/issues/371)) ([36fb2ec](https://github.com/contentful/experience-builder/commit/36fb2ecd00bf7c1263ba5627243a9e574e927e22))
- Container default margin auto [ALT-326] ([#286](https://github.com/contentful/experience-builder/issues/286)) ([16c1acf](https://github.com/contentful/experience-builder/commit/16c1acf05a5553dd31a5ebb04ead6c0a7724de54))
- experience validator [SPA-1700] ([#348](https://github.com/contentful/experience-builder/issues/348)) ([3c856d0](https://github.com/contentful/experience-builder/commit/3c856d019213a1d8e86489028b18edec80830a20))
- **experience-builder-sdk:** allow delivery mode in editor ([#341](https://github.com/contentful/experience-builder/issues/341)) ([2a3551a](https://github.com/contentful/experience-builder/commit/2a3551ac20cabd8538c6bba198e580852f07059e))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))

### Reverts

- Revert "chore: Update packages/core/src/fetchers/fetchBySlug.ts" ([d937add](https://github.com/contentful/experience-builder/commit/d937add2cbf4a40d38ae0b92f82127f94aefebf6))
- Revert "fix: typing errors" ([4a333e0](https://github.com/contentful/experience-builder/commit/4a333e00689f75f11fb26a200bb9a9ff78289e4d))

## [0.0.2-alpha.30](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.29...@contentful/experience-builder-core@0.0.2-alpha.30) (2024-03-01)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.29](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.28...@contentful/experience-builder-core@0.0.2-alpha.29) (2024-02-29)

### Features

- adds tooltip defn for heading, text, richtext, button, and image ([887b753](https://github.com/contentful/experience-builder/commit/887b753415d0e6450545e541d8ddfef81fd71e6d))

## [0.0.2-alpha.28](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.27...@contentful/experience-builder-core@0.0.2-alpha.28) (2024-02-28)

### Bug Fixes

- update background related fields to have display names of Background image and Background color ([84aecb4](https://github.com/contentful/experience-builder/commit/84aecb4cfcd4a51a29c9444d02686fa35254f30a))
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))

## [0.0.2-alpha.27](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.26...@contentful/experience-builder-core@0.0.2-alpha.27) (2024-02-26)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.26](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.25...@contentful/experience-builder-core@0.0.2-alpha.26) (2024-02-22)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.25](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.24...@contentful/experience-builder-core@0.0.2-alpha.25) (2024-02-21)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.24](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.23...@contentful/experience-builder-core@0.0.2-alpha.24) (2024-02-16)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.23](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.22...@contentful/experience-builder-core@0.0.2-alpha.23) (2024-02-15)

### Bug Fixes

- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))

### Features

- experience validator [SPA-1700] ([#348](https://github.com/contentful/experience-builder/issues/348)) ([3c856d0](https://github.com/contentful/experience-builder/commit/3c856d019213a1d8e86489028b18edec80830a20))

## [0.0.2-alpha.22](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.21...@contentful/experience-builder-core@0.0.2-alpha.22) (2024-02-14)

### Bug Fixes

- adjust auto to Auto so that the design tab is consistent throughout ([81c7f50](https://github.com/contentful/experience-builder/commit/81c7f5071e79e4f7e24df908f5c9ccca8b935b1c))
- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))
- set default cfHeight to fit-content [ALT-448] ([#373](https://github.com/contentful/experience-builder/issues/373)) ([67fb7d8](https://github.com/contentful/experience-builder/commit/67fb7d87d51979077a00194ae6ad85e505964db7))

### Features

- clicking outside of the edited canvas sends post message to user interface ([6e35c29](https://github.com/contentful/experience-builder/commit/6e35c2904b33027302e83b1d90b8c674e2380527))
- **components:** column locking [ALT-357] ([#371](https://github.com/contentful/experience-builder/issues/371)) ([36fb2ec](https://github.com/contentful/experience-builder/commit/36fb2ecd00bf7c1263ba5627243a9e574e927e22))
- **experience-builder-sdk:** allow delivery mode in editor ([#341](https://github.com/contentful/experience-builder/issues/341)) ([2a3551a](https://github.com/contentful/experience-builder/commit/2a3551ac20cabd8538c6bba198e580852f07059e))

## [0.0.2-alpha.21](https://github.com/contentful/experience-builder/compare/@contentful/experience-builder-core@0.0.2-alpha.20...@contentful/experience-builder-core@0.0.2-alpha.21) (2024-02-09)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.20](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.19...@contentful/experience-builder-core@0.0.2-alpha.20) (2024-02-08)

### Bug Fixes

- mobile falls back to tablet style for token-enabled props ([0e1aa02](https://github.com/contentful/experience-builder-toolkit/commit/0e1aa0214d69f7e388ee2b44e009570efe081e8a))

## [0.0.2-alpha.19](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.18...@contentful/experience-builder-core@0.0.2-alpha.19) (2024-02-07)

### Bug Fixes

- assume not matching breakpoints and initialise correctly in the effect ([96c734a](https://github.com/contentful/experience-builder-toolkit/commit/96c734a4b73630e2fd6a45fc9c0ae7b0778edd2b))
- merge conflict in columns style type ([905add3](https://github.com/contentful/experience-builder-toolkit/commit/905add3870c3e1d4390680c62b762cf03b09a2e6))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder-toolkit/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder-toolkit/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))

### Features

- **components:** ability to lock a column span for columns component ([#344](https://github.com/contentful/experience-builder-toolkit/issues/344)) ([f01c907](https://github.com/contentful/experience-builder-toolkit/commit/f01c907639ca549a7da48dbfd6279ec2e813fead))
- **components:** add new design value to track column wrap ([#338](https://github.com/contentful/experience-builder-toolkit/issues/338)) ([4707707](https://github.com/contentful/experience-builder-toolkit/commit/47077072b01a0fcb7ee3da2617a25362688bbbf7))
- **components:** column gaps [ALT-279] ([#324](https://github.com/contentful/experience-builder-toolkit/issues/324)) ([465bd53](https://github.com/contentful/experience-builder-toolkit/commit/465bd539b2dadc831096c9fba9f89c98e3687a04))

## [0.0.2-alpha.18](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.17...@contentful/experience-builder-core@0.0.2-alpha.18) (2024-02-06)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.17](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.15...@contentful/experience-builder-core@0.0.2-alpha.17) (2024-02-01)

### Bug Fixes

- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder-toolkit/issues/321)) ([453225c](https://github.com/contentful/experience-builder-toolkit/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder-toolkit/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))

### Features

- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder-toolkit/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder-toolkit/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder-toolkit/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder-toolkit/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))

## [0.0.2-alpha.15](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.14...@contentful/experience-builder-core@0.0.2-alpha.15) (2024-01-25)

### Features

- Container default margin auto [ALT-326] ([#286](https://github.com/contentful/experience-builder-toolkit/issues/286)) ([16c1acf](https://github.com/contentful/experience-builder-toolkit/commit/16c1acf05a5553dd31a5ebb04ead6c0a7724de54))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder-toolkit/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder-toolkit/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))

## [0.0.2-alpha.14](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.13...@contentful/experience-builder-core@0.0.2-alpha.14) (2024-01-23)

### Bug Fixes

- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder-toolkit/issues/277)) ([454c114](https://github.com/contentful/experience-builder-toolkit/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- **core:** remove lodash dep to get rid of weird reference errors ([#272](https://github.com/contentful/experience-builder-toolkit/issues/272)) ([5957b18](https://github.com/contentful/experience-builder-toolkit/commit/5957b183c943d060b30e6f9d260196e3c3d91203))

## [0.0.2-alpha.13](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.12...@contentful/experience-builder-core@0.0.2-alpha.13) (2024-01-16)

### Bug Fixes

- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder-toolkit/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder-toolkit/commit/3e37f1518112c993456e08f74013c8a065b370fd))

## [0.0.2-alpha.12](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.11...@contentful/experience-builder-core@0.0.2-alpha.12) (2024-01-16)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.11](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.10...@contentful/experience-builder-core@0.0.2-alpha.11) (2024-01-15)

**Note:** Version bump only for package @contentful/experience-builder-core

## [0.0.2-alpha.10](https://github.com/contentful/experience-builder-toolkit/compare/@contentful/experience-builder-core@0.0.2-alpha.9...@contentful/experience-builder-core@0.0.2-alpha.10) (2024-01-12)

### Bug Fixes

- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder-toolkit/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder-toolkit/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))

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
