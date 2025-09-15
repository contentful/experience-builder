# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.6.2](https://github.com/contentful/experience-builder/compare/v3.6.1...v3.6.2) (2025-09-15)

### Bug Fixes

- preselect asset type for media variables ([#1317](https://github.com/contentful/experience-builder/issues/1317)) ([251a338](https://github.com/contentful/experience-builder/commit/251a33873d9b1653c60692b288e198b29ab7b104))

## [3.6.1](https://github.com/contentful/experience-builder/compare/v3.6.0...v3.6.1) (2025-09-09)

**Note:** Version bump only for package @contentful/experiences-core

## [3.6.0](https://github.com/contentful/experience-builder/compare/v3.5.0...v3.6.0) (2025-09-03)

### Features

- introduce SDK option to enable full structure overwrites ([9c558e7](https://github.com/contentful/experience-builder/commit/9c558e7c9e07142b0e67545e2c1baa1841cb6d40))

### Bug Fixes

- add prebindingId to the ExperienceTreeNode type ([8b3377c](https://github.com/contentful/experience-builder/commit/8b3377c7fb1a2b98ceab0be52fcaefcccd3993bd))

## [3.5.0](https://github.com/contentful/experience-builder/compare/v3.4.0...v3.5.0) (2025-09-03)

### Features

- replace node editorProp with isEmpty and nodeBlocKId ([25110d5](https://github.com/contentful/experience-builder/commit/25110d5d330e758db481e7b8ef8ebc8c0ee374df))

### Bug Fixes

- dont enforce ContentfulContainer in preview mode ([1549968](https://github.com/contentful/experience-builder/commit/15499686191c56e6bfeef151a79290a45680b5cf))
- improve resolver types and streamline logging shape ([39db821](https://github.com/contentful/experience-builder/commit/39db8214423759759e7a67e1571c6c4f5ff64ab4))
- introduce new registry options to remove special casing for structures ([08c86d0](https://github.com/contentful/experience-builder/commit/08c86d0a6697765c23b303eada3778baba0ecf25))

## [3.4.0](https://github.com/contentful/experience-builder/compare/v3.3.0...v3.4.0) (2025-08-25)

### Features

- automatically translate text alignment to be RTL aware [SPA-3060] ([#1280](https://github.com/contentful/experience-builder/issues/1280)) ([8bcc4b9](https://github.com/contentful/experience-builder/commit/8bcc4b9bad54b79600d1310cf372c274368689d6))

### Bug Fixes

- combine all preprocessing steps in one function and add to documentation ([#1276](https://github.com/contentful/experience-builder/issues/1276)) ([a31a6e8](https://github.com/contentful/experience-builder/commit/a31a6e837747f489e4cbf2f280086ad5ace2bc35))
- prevent using some browser APIs unsupported in old versions [ZEND-6795] ([#1277](https://github.com/contentful/experience-builder/issues/1277)) ([5f2fae7](https://github.com/contentful/experience-builder/commit/5f2fae7f385ef6178a7fa5bc6f47b0ae47de8b06))
- render slot children only once in preview [SPA-3147] ([#1275](https://github.com/contentful/experience-builder/issues/1275)) ([bc8206a](https://github.com/contentful/experience-builder/commit/bc8206a6b049e3f7459570e27bd900f111d7aef9))

## [3.3.0](https://github.com/contentful/experience-builder/compare/v3.2.0...v3.3.0) (2025-08-20)

### Features

- handle prebinding on variables [SPA-2922] ([#1250](https://github.com/contentful/experience-builder/issues/1250)) ([fd92026](https://github.com/contentful/experience-builder/commit/fd920261045d1b9c4a31b08d2b782eebbd7ce128))

## [3.2.0](https://github.com/contentful/experience-builder/compare/v3.1.1...v3.2.0) (2025-08-12)

### Features

- allow mobile-first breakpoint definitions [SPA-3041] ([#1253](https://github.com/contentful/experience-builder/issues/1253)) ([c477cd9](https://github.com/contentful/experience-builder/commit/c477cd9fb5460dd7a9849f9408431e14d8d864ed))

## [3.1.1](https://github.com/contentful/experience-builder/compare/v3.1.0...v3.1.1) (2025-08-11)

**Note:** Version bump only for package @contentful/experiences-core

## [3.1.0](https://github.com/contentful/experience-builder/compare/v3.0.0...v3.1.0) (2025-08-07)

### Features

- [] prepare SDK to delegate pan to the canvas ([#1249](https://github.com/contentful/experience-builder/issues/1249)) ([78e6af6](https://github.com/contentful/experience-builder/commit/78e6af69c114ea0c03f909c20782d335dbdd93c0))

### Bug Fixes

- [SPA-3075] send canvas geometry on image load separately ([#1248](https://github.com/contentful/experience-builder/issues/1248)) ([c928267](https://github.com/contentful/experience-builder/commit/c9282671638ec7b09370317e866e4f38a5d0feba))

## [3.0.0](https://github.com/contentful/experience-builder/compare/v2.0.2...v3.0.0) (2025-08-06)

### ⚠ BREAKING CHANGES

- move DND to the host application and ensure WYSIWYG experience [SPA-2744] (#1216)

### Features

- move DND to the host application and ensure WYSIWYG experience [SPA-2744] ([#1216](https://github.com/contentful/experience-builder/issues/1216)) ([f97eb57](https://github.com/contentful/experience-builder/commit/f97eb57de3c33aa8f6f354979ad03f6255d92bd1)), closes [#1134](https://github.com/contentful/experience-builder/issues/1134) [#1138](https://github.com/contentful/experience-builder/issues/1138) [#1134](https://github.com/contentful/experience-builder/issues/1134) [#1144](https://github.com/contentful/experience-builder/issues/1144) [#1149](https://github.com/contentful/experience-builder/issues/1149) [#1155](https://github.com/contentful/experience-builder/issues/1155) [#1193](https://github.com/contentful/experience-builder/issues/1193) [#1171](https://github.com/contentful/experience-builder/issues/1171) [#1219](https://github.com/contentful/experience-builder/issues/1219)

### Bug Fixes

- text align validation from left right to start end [SPA-3060] ([#1243](https://github.com/contentful/experience-builder/issues/1243)) ([ad32c9f](https://github.com/contentful/experience-builder/commit/ad32c9f3ff9e09488d2f025fefe1b5191f9d2730))

## [2.0.2](https://github.com/contentful/experience-builder/compare/v2.0.1...v2.0.2) (2025-07-31)

### Bug Fixes

- add zustand in the core package's dependencies ([067fbce](https://github.com/contentful/experience-builder/commit/067fbce3c36ed23da79b23e3ef21ce8cb6217e34))

## [2.0.1](https://github.com/contentful/experience-builder/compare/v2.0.0...v2.0.1) (2025-07-11)

**Note:** Version bump only for package @contentful/experiences-core

## [2.0.0](https://github.com/contentful/experience-builder/compare/v1.42.3...v2.0.0) (2025-07-07)

### ⚠ BREAKING CHANGES

- manually resolving links [SPA-2754] PR to merge into v2-prerelease branch (#1139)
- merge breakpoint defaults for visual editor and SSR [SPA-2602] (#1125)

### Features

- early preload [SPA-2755] ([#1141](https://github.com/contentful/experience-builder/issues/1141)) ([9101809](https://github.com/contentful/experience-builder/commit/91018091940ac0fe442d6fd7c0a4977aa5048ce9))
- manually resolving links [SPA-2754] PR to merge into v2-prerelease branch ([#1139](https://github.com/contentful/experience-builder/issues/1139)) ([7e472c3](https://github.com/contentful/experience-builder/commit/7e472c3ff5c61778e6dd1b256b5a8d05bc5df6ec)), closes [#1109](https://github.com/contentful/experience-builder/issues/1109)

### Bug Fixes

- adds ssrStyles.ts as per Thomases merge ([7f8f776](https://github.com/contentful/experience-builder/commit/7f8f776ce23acbfc943affc7641a7b1c9e24bfc4))
- forgot to rename ./entityTypeChecks->typeguards ([4c664be](https://github.com/contentful/experience-builder/commit/4c664bef2d654a228385060f31cae8af790a324d))
- handle undefined defaultvalue in merge functionality ([#1211](https://github.com/contentful/experience-builder/issues/1211)) ([709c21e](https://github.com/contentful/experience-builder/commit/709c21e1ba093af3034757854cb47b5fb85dc831))
- merge breakpoint defaults for visual editor and SSR [SPA-2602] ([#1125](https://github.com/contentful/experience-builder/issues/1125)) ([d60171d](https://github.com/contentful/experience-builder/commit/d60171d26923a38673cb5f062c04024ffd9fe588))
- remove old backgroundImage properties [SPA-2836] ([#1151](https://github.com/contentful/experience-builder/issues/1151)) ([9f7404b](https://github.com/contentful/experience-builder/commit/9f7404be6f2fb2b1b01028ed0e80b42894fae89d))
- replaces entityTypeChecks with typeguards ([bd8a494](https://github.com/contentful/experience-builder/commit/bd8a494e0e328c624d798ae1eede981eeb436a2e))

## [1.42.3](https://github.com/contentful/experience-builder/compare/v1.42.2...v1.42.3) (2025-07-02)

### Bug Fixes

- makes in Preview+Delivery mode default value for nested pattern's prebinding work (scope applies to when pattern nests pattern, not experience embeds pattern) [SPA-2853] ([#1202](https://github.com/contentful/experience-builder/issues/1202)) ([7e94407](https://github.com/contentful/experience-builder/commit/7e944074b49a3ec83a7d8ef5836cc0150ddfbd99))

## [1.42.2](https://github.com/contentful/experience-builder/compare/v1.42.1...v1.42.2) (2025-06-30)

**Note:** Version bump only for package @contentful/experiences-core

## [1.42.1](https://github.com/contentful/experience-builder/compare/v1.42.0...v1.42.1) (2025-06-30)

**Note:** Version bump only for package @contentful/experiences-core

## [1.42.0](https://github.com/contentful/experience-builder/compare/v1.41.0...v1.42.0) (2025-06-27)

### Features

- resolves pre bound field mappings in preview mode [SPA-2852] ([#1184](https://github.com/contentful/experience-builder/issues/1184)) ([3f313ab](https://github.com/contentful/experience-builder/commit/3f313ab8774b5bd829c264d09b00586e82ba8725))

## [1.41.0](https://github.com/contentful/experience-builder/compare/v1.40.2...v1.41.0) (2025-06-13)

### Features

- remove explicit border box [SPA-2792] ([#1173](https://github.com/contentful/experience-builder/issues/1173)) ([85aabd5](https://github.com/contentful/experience-builder/commit/85aabd525a5f0bd961fc011bb02409eff1b0a227))

### Bug Fixes

- handle entry fields being already resolved links ([#1176](https://github.com/contentful/experience-builder/issues/1176)) ([5a7de24](https://github.com/contentful/experience-builder/commit/5a7de24342c552889f2f513c16ce690693e8c63d))
- handle unexpected json data gracefully ([556fd40](https://github.com/contentful/experience-builder/commit/556fd40f7fe5c100a7b8e534df5c9b29ed9295b4))
- handle unexpected scenarios gracefully or render better error message ([#1170](https://github.com/contentful/experience-builder/issues/1170)) ([618fdd9](https://github.com/contentful/experience-builder/commit/618fdd9681a62eb8dd4f57c9bc6947d2c61dac74))

## [1.40.2](https://github.com/contentful/experience-builder/compare/v1.40.1...v1.40.2) (2025-06-10)

### Bug Fixes

- **core:** consolidate CSS generation for cfVisibility in SSR and CSR [SPA-2782] ([#1166](https://github.com/contentful/experience-builder/issues/1166)) ([ebbee81](https://github.com/contentful/experience-builder/commit/ebbee812dc1766c0a173e5c71c8bfdb28c7cd6ea))
- move typeof check to try catch block as well ([7358ebd](https://github.com/contentful/experience-builder/commit/7358ebddac5a715c89b30054300a204c580c0a16))

## [1.40.1](https://github.com/contentful/experience-builder/compare/v1.40.0...v1.40.1) (2025-06-06)

### Bug Fixes

- **core:** deep binding resolution with reference field already being a resolve entity [SPA-2843] ([#1156](https://github.com/contentful/experience-builder/issues/1156)) ([fb1d2c5](https://github.com/contentful/experience-builder/commit/fb1d2c53f1ab6f0a73f0c6253415b0ecef79ff04))
- **delivery:** use disjunct media queries to only hide for explicit breakpoints [SPA-2782[ ([#1158](https://github.com/contentful/experience-builder/issues/1158)) ([83179af](https://github.com/contentful/experience-builder/commit/83179af1e99d7d4718f725a8d45b1244bc538892))

## [1.40.0](https://github.com/contentful/experience-builder/compare/v1.39.0...v1.40.0) (2025-06-04)

### Features

- stretch option for vertical and horizontal alignment [SPA-2836] ([#1150](https://github.com/contentful/experience-builder/issues/1150)) ([fc115de](https://github.com/contentful/experience-builder/commit/fc115ded7cc8e9ac0b9259235abc5fc03dc01830))

## [1.39.0](https://github.com/contentful/experience-builder/compare/v1.38.0...v1.39.0) (2025-06-03)

### Features

- split pattern and experience schemas ([3e696e5](https://github.com/contentful/experience-builder/commit/3e696e578c4cb786f68967e4ae62350aef5efa4e))

### Bug Fixes

- **core:** handle null or disabled localStorage [SPA-2838] [ZEND-6469] ([#1145](https://github.com/contentful/experience-builder/issues/1145)) ([ecbd0d2](https://github.com/contentful/experience-builder/commit/ecbd0d26e1e2394da25127f4ae1b45ccc4507c91))

## [1.38.0](https://github.com/contentful/experience-builder/compare/v1.37.2...v1.38.0) (2025-05-23)

### Bug Fixes

- match ID chain for prebinding and SSR class lookup ([4c1d7f3](https://github.com/contentful/experience-builder/commit/4c1d7f3c7c809c2b0a13ea631a36b9c05d300c6a))
- only consider pattern node ids for the so called chain ([96e8f2a](https://github.com/contentful/experience-builder/commit/96e8f2a30b0b8ff027f9c0417f4a717b6d3849e8))

## [1.37.2](https://github.com/contentful/experience-builder/compare/v1.37.1...v1.37.2) (2025-05-15)

### Bug Fixes

- remove unused variable from useSingleColumn hook ([#1106](https://github.com/contentful/experience-builder/issues/1106)) ([cfcf3a2](https://github.com/contentful/experience-builder/commit/cfcf3a2cbb5f7e2b881f6a2b5d7da8ff408f9bba))
- unique nested classnames [SPA-2766] ([#1121](https://github.com/contentful/experience-builder/issues/1121)) ([4c9ed48](https://github.com/contentful/experience-builder/commit/4c9ed48370746c54a9386373dc73ae372afd3c56))

## [1.37.1](https://github.com/contentful/experience-builder/compare/v1.37.0...v1.37.1) (2025-04-24)

### Bug Fixes

- not throw logic error if a resolved entity was detected ([#1101](https://github.com/contentful/experience-builder/issues/1101)) ([#1107](https://github.com/contentful/experience-builder/issues/1107)) ([041ea13](https://github.com/contentful/experience-builder/commit/041ea13ab6816c37ed3ba7caaa3203f1353ded85))

## [1.37.0](https://github.com/contentful/experience-builder/compare/v1.36.0...v1.37.0) (2025-04-23)

### Features

- add localizeEntity and update docs ([060cda2](https://github.com/contentful/experience-builder/commit/060cda2179e7768d02102ee4d4af2bcdab155255))
- add new fetcher hook useCustomFetch that enables caching ([914551c](https://github.com/contentful/experience-builder/commit/914551cd1288cac292a880148470f32da3d54503))

### Bug Fixes

- add locale in fixtures ([66fc810](https://github.com/contentful/experience-builder/commit/66fc81095a0ac2b3a775c3a057583c6c519059c4))
- add locale in fixtures ([b5661e8](https://github.com/contentful/experience-builder/commit/b5661e873ff7d8b9528216f73406c47bd5769389))
- adjust error checks for tests and export functions correctly ([78d1ccd](https://github.com/contentful/experience-builder/commit/78d1ccdb84571f2d94b8d358208290f7572c2157))
- adjust interface for new union type ([c066466](https://github.com/contentful/experience-builder/commit/c066466df79e1f6c4f23f4889edf3e0456f18586))
- correct tests to reflect reality ([69a909a](https://github.com/contentful/experience-builder/commit/69a909a0f1dec77ca1f2d8e96cc2d4249f45b1e9))
- error message ([dd71fc3](https://github.com/contentful/experience-builder/commit/dd71fc3f7daa13e4796e07375e541ed883649226))
- resolve background image optimization in SSR [SPA-2698] ([#1093](https://github.com/contentful/experience-builder/issues/1093)) ([f9ffd36](https://github.com/contentful/experience-builder/commit/f9ffd36fdc00c23a5bf40b05a991cb4bcd031521))
- silent eslint warnings ([2b0d666](https://github.com/contentful/experience-builder/commit/2b0d666166760059c07f5509586950278f594066))

## [1.36.0](https://github.com/contentful/experience-builder/compare/v1.35.1...v1.36.0) (2025-04-17)

**Note:** Version bump only for package @contentful/experiences-core

## [1.35.1](https://github.com/contentful/experience-builder/compare/v1.35.0...v1.35.1) (2025-03-26)

**Note:** Version bump only for package @contentful/experiences-core

## [1.35.0](https://github.com/contentful/experience-builder/compare/v1.35.0-beta.0...v1.35.0) (2025-03-24)

**Note:** Version bump only for package @contentful/experiences-core

## [1.34.1](https://github.com/contentful/experience-builder/compare/v1.34.1-beta.0...v1.34.1) (2025-03-05)

**Note:** Version bump only for package @contentful/experiences-core

## [1.34.0](https://github.com/contentful/experience-builder/compare/v1.34.0-beta.0...v1.34.0) (2025-03-03)

**Note:** Version bump only for package @contentful/experiences-core

## [1.33.3](https://github.com/contentful/experience-builder/compare/v1.33.3-beta.0...v1.33.3) (2025-02-28)

**Note:** Version bump only for package @contentful/experiences-core

## [1.33.2](https://github.com/contentful/experience-builder/compare/v1.33.2-beta.0...v1.33.2) (2025-02-26)

**Note:** Version bump only for package @contentful/experiences-core

## [1.33.1](https://github.com/contentful/experience-builder/compare/v1.33.1-beta.0...v1.33.1) (2025-02-24)

**Note:** Version bump only for package @contentful/experiences-core

## [1.33.0](https://github.com/contentful/experience-builder/compare/v1.33.0-beta.0...v1.33.0) (2025-02-20)

**Note:** Version bump only for package @contentful/experiences-core

## [1.32.0](https://github.com/contentful/experience-builder/compare/v1.32.0-beta.0...v1.32.0) (2025-02-20)

**Note:** Version bump only for package @contentful/experiences-core

## [1.31.1](https://github.com/contentful/experience-builder/compare/v1.31.1-beta.0...v1.31.1) (2025-02-19)

**Note:** Version bump only for package @contentful/experiences-core

## [1.31.0](https://github.com/contentful/experience-builder/compare/v1.31.0-beta.0...v1.31.0) (2025-02-18)

**Note:** Version bump only for package @contentful/experiences-core

## [1.30.5](https://github.com/contentful/experience-builder/compare/v1.30.5-beta.0...v1.30.5) (2025-02-10)

**Note:** Version bump only for package @contentful/experiences-core

## [1.30.4](https://github.com/contentful/experience-builder/compare/v1.30.4-beta.0...v1.30.4) (2025-02-06)

**Note:** Version bump only for package @contentful/experiences-core

## [1.30.3](https://github.com/contentful/experience-builder/compare/v1.30.3-beta.0...v1.30.3) (2025-02-04)

**Note:** Version bump only for package @contentful/experiences-core

## [1.30.2](https://github.com/contentful/experience-builder/compare/v1.30.2-beta.0...v1.30.2) (2025-02-01)

**Note:** Version bump only for package @contentful/experiences-core

## [1.30.1](https://github.com/contentful/experience-builder/compare/v1.30.1-beta.0...v1.30.1) (2025-01-31)

**Note:** Version bump only for package @contentful/experiences-core

## [1.30.0](https://github.com/contentful/experience-builder/compare/v1.30.0-beta.0...v1.30.0) (2025-01-29)

**Note:** Version bump only for package @contentful/experiences-core

## [1.29.0](https://github.com/contentful/experience-builder/compare/v1.29.0-beta.0...v1.29.0) (2025-01-23)

**Note:** Version bump only for package @contentful/experiences-core

## [1.28.3](https://github.com/contentful/experience-builder/compare/v1.28.3-beta.0...v1.28.3) (2025-01-22)

**Note:** Version bump only for package @contentful/experiences-core

## [1.28.2](https://github.com/contentful/experience-builder/compare/v1.28.2-beta.0...v1.28.2) (2025-01-20)

**Note:** Version bump only for package @contentful/experiences-core

## [1.28.1](https://github.com/contentful/experience-builder/compare/v1.28.1-beta.0...v1.28.1) (2025-01-13)

**Note:** Version bump only for package @contentful/experiences-core

## [1.28.0](https://github.com/contentful/experience-builder/compare/v1.28.0-beta.0...v1.28.0) (2025-01-09)

**Note:** Version bump only for package @contentful/experiences-core

## [1.27.1](https://github.com/contentful/experience-builder/compare/v1.27.0...v1.27.1) (2024-12-19)

**Note:** Version bump only for package @contentful/experiences-core

## [1.27.0](https://github.com/contentful/experience-builder/compare/v1.27.0-beta.0...v1.27.0) (2024-12-17)

**Note:** Version bump only for package @contentful/experiences-core

## [1.26.0](https://github.com/contentful/experience-builder/compare/v1.26.0-beta.0...v1.26.0) (2024-12-10)

**Note:** Version bump only for package @contentful/experiences-core

## [1.25.1](https://github.com/contentful/experience-builder/compare/v1.25.1-beta.0...v1.25.1) (2024-12-09)

**Note:** Version bump only for package @contentful/experiences-core

## [1.25.0](https://github.com/contentful/experience-builder/compare/v1.25.0-beta.0...v1.25.0) (2024-12-06)

**Note:** Version bump only for package @contentful/experiences-core

## [1.24.0](https://github.com/contentful/experience-builder/compare/v1.24.0-beta.0...v1.24.0) (2024-12-04)

**Note:** Version bump only for package @contentful/experiences-core

## [1.23.0](https://github.com/contentful/experience-builder/compare/v1.23.0-beta.0...v1.23.0) (2024-12-03)

**Note:** Version bump only for package @contentful/experiences-core

## [1.22.0](https://github.com/contentful/experience-builder/compare/v1.22.0-beta.0...v1.22.0) (2024-11-08)

**Note:** Version bump only for package @contentful/experiences-core

## [1.21.0](https://github.com/contentful/experience-builder/compare/v1.21.0-beta.0...v1.21.0) (2024-11-06)

**Note:** Version bump only for package @contentful/experiences-core

## [1.20.1](https://github.com/contentful/experience-builder/compare/v1.20.1-beta.0...v1.20.1) (2024-11-04)

**Note:** Version bump only for package @contentful/experiences-core

## [1.20.0](https://github.com/contentful/experience-builder/compare/v1.20.0-beta.0...v1.20.0) (2024-10-23)

**Note:** Version bump only for package @contentful/experiences-core

## [1.19.0](https://github.com/contentful/experience-builder/compare/v1.19.0-beta.0...v1.19.0) (2024-10-14)

**Note:** Version bump only for package @contentful/experiences-core

## [1.18.0](https://github.com/contentful/experience-builder/compare/v1.18.0-beta.0...v1.18.0) (2024-10-10)

**Note:** Version bump only for package @contentful/experiences-core

## [1.17.1](https://github.com/contentful/experience-builder/compare/v1.17.1-beta.0...v1.17.1) (2024-10-03)

**Note:** Version bump only for package @contentful/experiences-core

## [1.17.0](https://github.com/contentful/experience-builder/compare/v1.17.0-beta.1...v1.17.0) (2024-09-30)

**Note:** Version bump only for package @contentful/experiences-core

## [1.16.1](https://github.com/contentful/experience-builder/compare/v1.16.1-beta.1...v1.16.1) (2024-09-25)

**Note:** Version bump only for package @contentful/experiences-core

## [1.16.0](https://github.com/contentful/experience-builder/compare/v1.16.0-beta.0...v1.16.0) (2024-09-17)

**Note:** Version bump only for package @contentful/experiences-core

## [1.15.1](https://github.com/contentful/experience-builder/compare/v1.15.0...v1.15.1) (2024-09-12)

**Note:** Version bump only for package @contentful/experiences-core

## [1.15.0](https://github.com/contentful/experience-builder/compare/v1.14.0...v1.15.0) (2024-09-11)

### Features

- introduce rendering cfVisibility in SDK ([d53a8d2](https://github.com/contentful/experience-builder/commit/d53a8d2cf1f810cc0e5587d28abe1c19636fcad5))

### Bug Fixes

- assemblies incorrectly rendered on initial drop [ALT-1220] ([#742](https://github.com/contentful/experience-builder/issues/742)) ([fbf3d88](https://github.com/contentful/experience-builder/commit/fbf3d889e0a57b2f654bf45d78c2acbfd05af7e1))
- **core:** resolving design values [ALT-1222] ([#744](https://github.com/contentful/experience-builder/issues/744)) ([93c9cc5](https://github.com/contentful/experience-builder/commit/93c9cc509f6e653b6bb4faaa44cb1f600b23fa3e))
- dont suppress errors in SDK code but only custom code ([5f3fa19](https://github.com/contentful/experience-builder/commit/5f3fa1994bba392c6f39ea4ade411dc4c6352660))
- only fallback for not defined breakpoint values ([100fd98](https://github.com/contentful/experience-builder/commit/100fd98b40bf813bac3434f5ad04ffe74fbde124))

## [1.14.0](https://github.com/contentful/experience-builder/compare/v1.14.0-beta.0...v1.14.0) (2024-09-10)

**Note:** Version bump only for package @contentful/experiences-core

## [1.13.0](https://github.com/contentful/experience-builder/compare/v1.13.0-beta.0...v1.13.0) (2024-09-05)

**Note:** Version bump only for package @contentful/experiences-core

## [1.12.0](https://github.com/contentful/experience-builder/compare/v1.12.0-beta.0...v1.12.0) (2024-08-21)

**Note:** Version bump only for package @contentful/experiences-core

## [1.11.2](https://github.com/contentful/experience-builder/compare/v1.11.2-beta.0...v1.11.2) (2024-07-31)

**Note:** Version bump only for package @contentful/experiences-core

## [1.11.1](https://github.com/contentful/experience-builder/compare/v1.11.1-beta.0...v1.11.1) (2024-07-19)

**Note:** Version bump only for package @contentful/experiences-core

## [1.11.0](https://github.com/contentful/experience-builder/compare/v1.11.0-beta.0...v1.11.0) (2024-07-19)

**Note:** Version bump only for package @contentful/experiences-core

## [1.10.0](https://github.com/contentful/experience-builder/compare/v1.10.0-beta.0...v1.10.0) (2024-07-11)

**Note:** Version bump only for package @contentful/experiences-core

## [1.9.0](https://github.com/contentful/experience-builder/compare/v1.9.0-beta.0...v1.9.0) (2024-06-28)

**Note:** Version bump only for package @contentful/experiences-core

## [1.8.2](https://github.com/contentful/experience-builder/compare/v1.8.2-beta.0...v1.8.2) (2024-06-27)

**Note:** Version bump only for package @contentful/experiences-core

## [1.8.1](https://github.com/contentful/experience-builder/compare/v1.8.1-beta.0...v1.8.1) (2024-06-24)

**Note:** Version bump only for package @contentful/experiences-core

## [1.8.0](https://github.com/contentful/experience-builder/compare/v1.8.0-beta.0...v1.8.0) (2024-06-17)

**Note:** Version bump only for package @contentful/experiences-core

## [1.7.1](https://github.com/contentful/experience-builder/compare/v1.7.1-beta.0...v1.7.1) (2024-06-11)

**Note:** Version bump only for package @contentful/experiences-core

## [1.7.0](https://github.com/contentful/experience-builder/compare/v1.7.0-beta.0...v1.7.0) (2024-06-07)

**Note:** Version bump only for package @contentful/experiences-core

## [1.6.0](https://github.com/contentful/experience-builder/compare/v1.6.0-beta.0...v1.6.0) (2024-06-03)

**Note:** Version bump only for package @contentful/experiences-core

## [1.5.2](https://github.com/contentful/experience-builder/compare/v1.5.2-beta.0...v1.5.2) (2024-05-30)

**Note:** Version bump only for package @contentful/experiences-core

## [1.5.1](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.2...v1.5.1) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-core

## [1.5.1-beta.2](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.1...v1.5.1-beta.2) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-core

## [1.5.1-beta.1](https://github.com/contentful/experience-builder/compare/v1.5.1-beta.0...v1.5.1-beta.1) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-core

## [1.5.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.5.0...v1.5.1-beta.0) (2024-05-27)

**Note:** Version bump only for package @contentful/experiences-core

# [1.5.0](https://github.com/contentful/experience-builder/compare/v1.5.0-beta.0...v1.5.0) (2024-05-16)

**Note:** Version bump only for package @contentful/experiences-core

# [1.5.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.4.0...v1.5.0-beta.0) (2024-05-16)

### Bug Fixes

- add maxWidth to list with design tokens ([876c927](https://github.com/contentful/experience-builder/commit/876c92721ca9d98a898039c4bec1142ec068ac3c))

# [1.4.0](https://github.com/contentful/experience-builder/compare/v1.4.0-beta.0...v1.4.0) (2024-05-15)

**Note:** Version bump only for package @contentful/experiences-core

# [1.4.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.3.0...v1.4.0-beta.0) (2024-05-15)

**Note:** Version bump only for package @contentful/experiences-core

# [1.3.0](https://github.com/contentful/experience-builder/compare/v1.3.0-beta.0...v1.3.0) (2024-05-06)

**Note:** Version bump only for package @contentful/experiences-core

# [1.3.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.2.0...v1.3.0-beta.0) (2024-05-06)

### Bug Fixes

- remove check if no margin ([aa1421e](https://github.com/contentful/experience-builder/commit/aa1421edb0ebb03d31f428727239dcab348bbaac))

### Features

- **experiences:** implement layer renaming ([#597](https://github.com/contentful/experience-builder/issues/597)) ([6cde60e](https://github.com/contentful/experience-builder/commit/6cde60e0973e9038ef998f0209223667b4da211d))

# [1.2.0](https://github.com/contentful/experience-builder/compare/v1.2.0-beta.0...v1.2.0) (2024-04-30)

**Note:** Version bump only for package @contentful/experiences-core

# [1.2.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.1.0...v1.2.0-beta.0) (2024-04-30)

### Features

- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))

# [1.1.0](https://github.com/contentful/experience-builder/compare/v1.1.0-beta.0...v1.1.0) (2024-04-29)

**Note:** Version bump only for package @contentful/experiences-core

# [1.1.0-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.9-beta.0...v1.1.0-beta.0) (2024-04-29)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.9-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.8...v1.0.9-beta.0) (2024-04-26)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.8](https://github.com/contentful/experience-builder/compare/v1.0.8-beta.0...v1.0.8) (2024-04-26)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.8-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.7...v1.0.8-beta.0) (2024-04-26)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.7](https://github.com/contentful/experience-builder/compare/v1.0.7-beta.0...v1.0.7) (2024-04-25)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.7-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.6...v1.0.7-beta.0) (2024-04-25)

### Bug Fixes

- activate original dropzone when moving root-level components [ALT-746] ([#572](https://github.com/contentful/experience-builder/issues/572)) ([7d0a2d8](https://github.com/contentful/experience-builder/commit/7d0a2d859461f3fbbc1b9ba48b6256da2eb691b0))

### Features

- **components:** add loading attribute to image component ([#577](https://github.com/contentful/experience-builder/issues/577)) ([8115c53](https://github.com/contentful/experience-builder/commit/8115c53a0a7d045f514a5681a24049487f7d1dc6))
- update definitions of fill to use 100% for components ([e29c08e](https://github.com/contentful/experience-builder/commit/e29c08e3a46782b75cc4a85a1541fc1120247089))

## [1.0.6](https://github.com/contentful/experience-builder/compare/v1.0.6-beta.0...v1.0.6) (2024-04-18)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.6-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.5...v1.0.6-beta.0) (2024-04-18)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.5](https://github.com/contentful/experience-builder/compare/v1.0.5-beta.0...v1.0.5) (2024-04-16)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.5-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.4...v1.0.5-beta.0) (2024-04-16)

### Bug Fixes

- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))

### Features

- make local override possbible ([b80703d](https://github.com/contentful/experience-builder/commit/b80703dddde977438e2911cfb8270d6440ab27f9))
- test app stuff ([70a582b](https://github.com/contentful/experience-builder/commit/70a582b430e1e7d5f522b0c1c90757cfcbca512f))

## [1.0.4](https://github.com/contentful/experience-builder/compare/v1.0.4-beta.0...v1.0.4) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.4-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.3...v1.0.4-beta.0) (2024-04-12)

### Bug Fixes

- cleanup ([6f418e1](https://github.com/contentful/experience-builder/commit/6f418e103f141e1345fcf58d453ff2199e07793e))
- make all fields work for media ([6e2ca86](https://github.com/contentful/experience-builder/commit/6e2ca866bb0f39f80ddf85e48acdb3e360f330c2))
- make deep binding for images work for custom components ([c7577da](https://github.com/contentful/experience-builder/commit/c7577dad9b74404365a420dbb9463d6ae0ac289b))
- review follow up ([97a6a78](https://github.com/contentful/experience-builder/commit/97a6a78a82fbe2646dd0456fa2d9a2c44ee13136))

## [1.0.3](https://github.com/contentful/experience-builder/compare/v1.0.3-beta.0...v1.0.3) (2024-04-12)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.3-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.2...v1.0.3-beta.0) (2024-04-12)

### Bug Fixes

- allow root-level structure components to be reparented into siblings [ALT-561] ([#555](https://github.com/contentful/experience-builder/issues/555)) ([43cc1cb](https://github.com/contentful/experience-builder/commit/43cc1cbb58dcd3a0471925f2abc1bd554e8be981))

## [1.0.2](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.1...v1.0.2) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.2-beta.1](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.0...v1.0.2-beta.1) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.2-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.1...v1.0.2-beta.0) (2024-04-04)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.1](https://github.com/contentful/experience-builder/compare/v1.0.1-beta.0...v1.0.1) (2024-03-29)

**Note:** Version bump only for package @contentful/experiences-core

## [1.0.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.0...v1.0.1-beta.0) (2024-03-29)

### Features

- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-core

**Note:** Version bump only for package @contentful/experiences-core

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-core

## [0.0.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.1...v0.0.1) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-core

## [0.0.1-beta.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2024-03-26)

**Note:** Version bump only for package @contentful/experiences-core

## 0.0.1-beta.0 (2024-03-26)

### Bug Fixes

- add border radius to image component and make border radius an optional style ([582e40e](https://github.com/contentful/experience-builder/commit/582e40e077192b0e7a07a2358119cb2f4c00c01d))
- adjust auto to Auto so that the design tab is consistent throughout ([81c7f50](https://github.com/contentful/experience-builder/commit/81c7f5071e79e4f7e24df908f5c9ccca8b935b1c))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- assume not matching breakpoints and initialise correctly in the effect ([96c734a](https://github.com/contentful/experience-builder/commit/96c734a4b73630e2fd6a45fc9c0ae7b0778edd2b))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- case name of typing ([3b238c1](https://github.com/contentful/experience-builder/commit/3b238c121e3bc27f5641996da45f87706d533b09))
- change default border style color to 0px width ([#238](https://github.com/contentful/experience-builder/issues/238)) ([f067000](https://github.com/contentful/experience-builder/commit/f0670000b73a562127d26eae0ee3f13e27b7781f))
- change image object fit to default to undefined instead of none ([#502](https://github.com/contentful/experience-builder/issues/502)) ([46a7e94](https://github.com/contentful/experience-builder/commit/46a7e9474dec15ef1ea30111f28619c09d5a9f3c))
- change visual-sdk to build tooling of monorepo ([edf0991](https://github.com/contentful/experience-builder/commit/edf0991cc44f07429047a86a71baa950d7255ef8))
- **components:** change default of structure component margins to 0 ([#479](https://github.com/contentful/experience-builder/issues/479)) ([756eadb](https://github.com/contentful/experience-builder/commit/756eadbd8ed64f4b0b9018e6a16799960d9f0ae2))
- convert protocol agnostic image asset url to https [ALT-639] ([#499](https://github.com/contentful/experience-builder/issues/499)) ([4503cb2](https://github.com/contentful/experience-builder/commit/4503cb21914d85583ee9c05ca17c657958a4d494))
- **core:** add design token fallback values besed on default values in builtInStyles [ALT-200] ([#232](https://github.com/contentful/experience-builder/issues/232)) ([37e8feb](https://github.com/contentful/experience-builder/commit/37e8feb5361a7c1074da7bbc4e59736d21220d2b))
- **core:** add line height and letter spacing to DesignTokensDefinition [ALT-248] ([#233](https://github.com/contentful/experience-builder/issues/233)) ([1a44c44](https://github.com/contentful/experience-builder/commit/1a44c447e2b102feb147645b8bc1796acd60793d))
- **core:** enable design tokens for text color style [ALT-249] ([#244](https://github.com/contentful/experience-builder/issues/244)) ([81f5a27](https://github.com/contentful/experience-builder/commit/81f5a27acaa3815b381b2d114766f892bc1c764b))
- **core:** enabling design tokens for font size [ALT-245] ([#227](https://github.com/contentful/experience-builder/issues/227)) ([d4d8e15](https://github.com/contentful/experience-builder/commit/d4d8e15231230d89a1c139976c4ea66ea020db34))
- **core:** expect image quality to be a string with a percentage [ALT-643] ([#504](https://github.com/contentful/experience-builder/issues/504)) ([e9e0345](https://github.com/contentful/experience-builder/commit/e9e03455b2a0b5ed1d0cd4eeea09f84fc2e42179))
- **core:** remove lodash dep to get rid of weird reference errors ([#272](https://github.com/contentful/experience-builder/issues/272)) ([5957b18](https://github.com/contentful/experience-builder/commit/5957b183c943d060b30e6f9d260196e3c3d91203))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))
- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder/commit/3e37f1518112c993456e08f74013c8a065b370fd))
- **experiences:** proper handling of reparenting off canvas ([#460](https://github.com/contentful/experience-builder/issues/460)) ([9808cfc](https://github.com/contentful/experience-builder/commit/9808cfcdae03ad6c3fee7e3bb9278db06e179467))
- extend validators to validate component registration on editor mode ([f0dda61](https://github.com/contentful/experience-builder/commit/f0dda6178e3b81ecdcd2b1d530b854117fdd6df0))
- fetch all referenced entities ([#507](https://github.com/contentful/experience-builder/issues/507)) ([099dcd6](https://github.com/contentful/experience-builder/commit/099dcd66884ea43edc5ff954dfe5a1f82b11df42))
- fetch all references with includes ([#519](https://github.com/contentful/experience-builder/issues/519)) ([962f70b](https://github.com/contentful/experience-builder/commit/962f70bc129408ba93a1d5550a3a9601a3dd63ea))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- handle missing linkType property ([#237](https://github.com/contentful/experience-builder/issues/237)) ([1827d96](https://github.com/contentful/experience-builder/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))
- hover outlines and default border style [ALT-323] ([#476](https://github.com/contentful/experience-builder/issues/476)) ([0378c6d](https://github.com/contentful/experience-builder/commit/0378c6d7499e9bdea6bedd632a9444dcde712984))
- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))
- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))
- merge conflict in columns style type ([905add3](https://github.com/contentful/experience-builder/commit/905add3870c3e1d4390680c62b762cf03b09a2e6))
- mobile falls back to tablet style for token-enabled props ([0e1aa02](https://github.com/contentful/experience-builder/commit/0e1aa0214d69f7e388ee2b44e009570efe081e8a))
- moving to json to its base class ([#471](https://github.com/contentful/experience-builder/issues/471)) ([9d276bb](https://github.com/contentful/experience-builder/commit/9d276bb87557623c7e9a8597a26a6ac50657e65b))
- set default cfHeight to fit-content [ALT-448] ([#373](https://github.com/contentful/experience-builder/issues/373)) ([67fb7d8](https://github.com/contentful/experience-builder/commit/67fb7d87d51979077a00194ae6ad85e505964db7))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- unused import lint errors ([1f8338d](https://github.com/contentful/experience-builder/commit/1f8338d325d403fa9667dc5ee867e44bb8186d68))
- update background related fields to have display names of Background image and Background color ([84aecb4](https://github.com/contentful/experience-builder/commit/84aecb4cfcd4a51a29c9444d02686fa35254f30a))
- update component tooltips to use component term instead of elements ([25db0e2](https://github.com/contentful/experience-builder/commit/25db0e2936eba1ea00a8ab0d5ae4318488243558))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))
- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))

- feat(experiences-sdk-react)!: update basic component IDs with contentful prefix (#508) ([0e28c45](https://github.com/contentful/experience-builder/commit/0e28c45e589422574caab08c44bc6099a5cbdb42)), closes [#508](https://github.com/contentful/experience-builder/issues/508)
- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))

### Features

- add borderRadius definition to structure components ([b2117a7](https://github.com/contentful/experience-builder/commit/b2117a703ae8b5ed603e27b481f4764b6e830a1c))
- add borderRadius type for design tokens ([09c12eb](https://github.com/contentful/experience-builder/commit/09c12eb3de0cf683d65a3a4ad0522ba7a3f4d673))
- add cfBorder designTokens resolver ([e5de5e5](https://github.com/contentful/experience-builder/commit/e5de5e5d1023e58c6ab9ae3b1b42581b04e128c6))
- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- added toJSON function in entity store ([#467](https://github.com/contentful/experience-builder/issues/467)) ([7f9a504](https://github.com/contentful/experience-builder/commit/7f9a504dd0169851b77a1aa127f0839426dd3362))
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
- remove deprecated types altogether ([49c9858](https://github.com/contentful/experience-builder/commit/49c9858d7b4207c3cf0748566dcb0c09958e42e3))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))

### Reverts

- Revert "fix: fetch all referenced entities (#507)" (#515) ([2b376f6](https://github.com/contentful/experience-builder/commit/2b376f6f1b6ab63e46c3f62affea0621af33e698)), closes [#507](https://github.com/contentful/experience-builder/issues/507) [#515](https://github.com/contentful/experience-builder/issues/515)
- Revert "chore: Update packages/core/src/fetchers/fetchBySlug.ts" ([d937add](https://github.com/contentful/experience-builder/commit/d937add2cbf4a40d38ae0b92f82127f94aefebf6))
- Revert "fix: typing errors" ([4a333e0](https://github.com/contentful/experience-builder/commit/4a333e00689f75f11fb26a200bb9a9ff78289e4d))

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

## [0.0.1-alpha.11](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.10...@contentful/experiences-core@0.0.1-alpha.11) (2024-03-22)

### Reverts

- Revert "fix: fetch all referenced entities (#507)" (#515) ([2b376f6](https://github.com/contentful/experience-builder/commit/2b376f6f1b6ab63e46c3f62affea0621af33e698)), closes [#507](https://github.com/contentful/experience-builder/issues/507) [#515](https://github.com/contentful/experience-builder/issues/515)

## [0.0.1-alpha.10](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.9...@contentful/experiences-core@0.0.1-alpha.10) (2024-03-22)

### Bug Fixes

- **core:** expect image quality to be a string with a percentage [ALT-643] ([#504](https://github.com/contentful/experience-builder/issues/504)) ([e9e0345](https://github.com/contentful/experience-builder/commit/e9e03455b2a0b5ed1d0cd4eeea09f84fc2e42179))

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

## [0.0.1-alpha.9](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.8...@contentful/experiences-core@0.0.1-alpha.9) (2024-03-21)

### Bug Fixes

- change image object fit to default to undefined instead of none ([#502](https://github.com/contentful/experience-builder/issues/502)) ([46a7e94](https://github.com/contentful/experience-builder/commit/46a7e9474dec15ef1ea30111f28619c09d5a9f3c))
- fetch all referenced entities ([#507](https://github.com/contentful/experience-builder/issues/507)) ([099dcd6](https://github.com/contentful/experience-builder/commit/099dcd66884ea43edc5ff954dfe5a1f82b11df42))

### Features

- add borderRadius type for design tokens ([09c12eb](https://github.com/contentful/experience-builder/commit/09c12eb3de0cf683d65a3a4ad0522ba7a3f4d673))

## [0.0.1-alpha.8](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.7...@contentful/experiences-core@0.0.1-alpha.8) (2024-03-20)

### Bug Fixes

- convert protocol agnostic image asset url to https [ALT-639] ([#499](https://github.com/contentful/experience-builder/issues/499)) ([4503cb2](https://github.com/contentful/experience-builder/commit/4503cb21914d85583ee9c05ca17c657958a4d494))

## [0.0.1-alpha.7](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.6...@contentful/experiences-core@0.0.1-alpha.7) (2024-03-19)

### Bug Fixes

- extend validators to validate component registration on editor mode ([f0dda61](https://github.com/contentful/experience-builder/commit/f0dda6178e3b81ecdcd2b1d530b854117fdd6df0))

### Features

- add borderRadius definition to structure components ([b2117a7](https://github.com/contentful/experience-builder/commit/b2117a703ae8b5ed603e27b481f4764b6e830a1c))

## [0.0.1-alpha.6](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.5...@contentful/experiences-core@0.0.1-alpha.6) (2024-03-18)

- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))

### BREAKING CHANGES

- Any existing experiences that have a background image with a structural component will need to reset their image positioning values.

## [0.0.1-alpha.5](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.4...@contentful/experiences-core@0.0.1-alpha.5) (2024-03-13)

### Bug Fixes

- hover outlines and default border style [ALT-323] ([#476](https://github.com/contentful/experience-builder/issues/476)) ([0378c6d](https://github.com/contentful/experience-builder/commit/0378c6d7499e9bdea6bedd632a9444dcde712984))

## [0.0.1-alpha.4](https://github.com/contentful/experience-builder/compare/@contentful/experiences-core@0.0.1-alpha.3...@contentful/experiences-core@0.0.1-alpha.4) (2024-03-12)

### Bug Fixes

- **components:** change default of structure component margins to 0 ([#479](https://github.com/contentful/experience-builder/issues/479)) ([756eadb](https://github.com/contentful/experience-builder/commit/756eadbd8ed64f4b0b9018e6a16799960d9f0ae2))
- moving to json to its base class ([#471](https://github.com/contentful/experience-builder/issues/471)) ([9d276bb](https://github.com/contentful/experience-builder/commit/9d276bb87557623c7e9a8597a26a6ac50657e65b))

### Features

- remove deprecated types altogether ([49c9858](https://github.com/contentful/experience-builder/commit/49c9858d7b4207c3cf0748566dcb0c09958e42e3))

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
