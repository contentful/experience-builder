# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.40.0](https://github.com/contentful/experience-builder/compare/v1.39.0...v1.40.0) (2025-06-04)

### Features

- stretch option for vertical and horizontal alignment [SPA-2836] ([#1150](https://github.com/contentful/experience-builder/issues/1150)) ([fc115de](https://github.com/contentful/experience-builder/commit/fc115ded7cc8e9ac0b9259235abc5fc03dc01830))

## [1.39.0](https://github.com/contentful/experience-builder/compare/v1.38.0...v1.39.0) (2025-06-03)

### Features

- split pattern and experience schemas ([3e696e5](https://github.com/contentful/experience-builder/commit/3e696e578c4cb786f68967e4ae62350aef5efa4e))
- update package-lock.json to include vite-tsconfig-paths ([bb2e1fb](https://github.com/contentful/experience-builder/commit/bb2e1fbc2ffe220ccfb1b1b889d363f63b41f083))

### Bug Fixes

- add contentful-management as explicit dependency ([8250e62](https://github.com/contentful/experience-builder/commit/8250e6278a1d41f8f2381bfeaeee8698583156e1))
- bump base-x dep to non-vulnerable version ([#1142](https://github.com/contentful/experience-builder/issues/1142)) ([140c77e](https://github.com/contentful/experience-builder/commit/140c77e34312a740e743d9b70b6b003ad75f575a))
- consolidate more validators into "common" ([1076645](https://github.com/contentful/experience-builder/commit/1076645739b5add2939e7f9ae097643964a05531))
- **core:** handle null or disabled localStorage [SPA-2838] [ZEND-6469] ([#1145](https://github.com/contentful/experience-builder/issues/1145)) ([ecbd0d2](https://github.com/contentful/experience-builder/commit/ecbd0d26e1e2394da25127f4ae1b45ccc4507c91))
- export VariableMapping from the correct location ([6a832e0](https://github.com/contentful/experience-builder/commit/6a832e005caa287226213de61cef956b94c5527f))
- fix ts errors ([6f59b33](https://github.com/contentful/experience-builder/commit/6f59b334ac7c3fcf9f51e24b74dd121095da78b5))
- fix ts errors ([f8dcf0e](https://github.com/contentful/experience-builder/commit/f8dcf0edac61e83b9730e3bb51a8e9d06b524cb0))
- fix ts errors ([fce12ab](https://github.com/contentful/experience-builder/commit/fce12abc2cde13dc82a4a1bd9402e8c42945de4a))

## [1.38.0](https://github.com/contentful/experience-builder/compare/v1.37.2...v1.38.0) (2025-05-23)

### Features

- update validation for patternPropertyDefinitions contentTypes ([da44298](https://github.com/contentful/experience-builder/commit/da44298f42e641f9a5c10dcbbcf540400b2ec1cb))

### Bug Fixes

- dont chain every node in the IDs chain ([bcc5916](https://github.com/contentful/experience-builder/commit/bcc59160d04b8adc51d77dd04569bcf71e4e4b54))
- match ID chain for prebinding and SSR class lookup ([4c1d7f3](https://github.com/contentful/experience-builder/commit/4c1d7f3c7c809c2b0a13ea631a36b9c05d300c6a))
- only consider pattern node ids for the so called chain ([96e8f2a](https://github.com/contentful/experience-builder/commit/96e8f2a30b0b8ff027f9c0417f4a717b6d3849e8))

## [1.37.2](https://github.com/contentful/experience-builder/compare/v1.37.1...v1.37.2) (2025-05-15)

### Features

- add top-level dev script ([55ecf70](https://github.com/contentful/experience-builder/commit/55ecf70945f5bf38df5c53137bb7e2bd3658637f))

### Bug Fixes

- [SPA-2694] consider iframe horizontal scroll when sending mouse move position ([#1118](https://github.com/contentful/experience-builder/issues/1118)) ([0515759](https://github.com/contentful/experience-builder/commit/0515759b2e46e485fc85f00dc305864dae8ee453))
- add relative position wrapper for misaligned image placeholder ([#1119](https://github.com/contentful/experience-builder/issues/1119)) ([61f8c85](https://github.com/contentful/experience-builder/commit/61f8c85967a2bdcc983ff1f1175ec5ee4c4857fc))
- remove style nodes from the DOM in the cleanup function of the injection hook [SPA-2765] ([#1122](https://github.com/contentful/experience-builder/issues/1122)) ([f8869f4](https://github.com/contentful/experience-builder/commit/f8869f45d16d0288687a62d81a8e5a1409ae13a7))
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
- publish create package to github registry ([#1098](https://github.com/contentful/experience-builder/issues/1098)) ([c14ac85](https://github.com/contentful/experience-builder/commit/c14ac850d366e12b274846d0d8f48cd6cc39c303))
- resolve background image optimization in SSR [SPA-2698] ([#1093](https://github.com/contentful/experience-builder/issues/1093)) ([f9ffd36](https://github.com/contentful/experience-builder/commit/f9ffd36fdc00c23a5bf40b05a991cb4bcd031521))
- silent eslint warnings ([2b0d666](https://github.com/contentful/experience-builder/commit/2b0d666166760059c07f5509586950278f594066))
- update lock file for new package name ([0d885ee](https://github.com/contentful/experience-builder/commit/0d885eeb58f0b4ba3db203515b320f0ab7165c5f))
- use contentful scope for create package ([224386e](https://github.com/contentful/experience-builder/commit/224386e7f24b539b0e37e11a6e816c40b9a1e133))

## [1.36.0](https://github.com/contentful/experience-builder/compare/v1.35.1...v1.36.0) (2025-04-17)

### Features

- add new component with Link field for testing ([#1081](https://github.com/contentful/experience-builder/issues/1081)) ([4caddd5](https://github.com/contentful/experience-builder/commit/4caddd5ed76e718fae20eb9d0e390a50bac954c9))
- **prebinding:** prebindings with multiple pattern instances in a pattern [LUMOS-610] ([bb7d4c2](https://github.com/contentful/experience-builder/commit/bb7d4c2c0970c1d706e6e64c0a61d34174e9d4f3))

### Bug Fixes

- add debug log for REQUESTED_ENTITIES as well ([#1079](https://github.com/contentful/experience-builder/issues/1079)) ([fbd5fc1](https://github.com/contentful/experience-builder/commit/fbd5fc1bad21a48409b8bbc205b9b882cf67c5fe))
- hiding nodes bug [SPA-2656] ([#1071](https://github.com/contentful/experience-builder/issues/1071)) ([7860e70](https://github.com/contentful/experience-builder/commit/7860e702eeb604777dc684ba72233e651735ae59))
- pattern only has width 100% if its first top level node has ([fed746d](https://github.com/contentful/experience-builder/commit/fed746dcc5c6d771f1a77944a37ab6262bd2676b))
- set pattern wrapper height to 100% only when the main component has 100% height ([#1080](https://github.com/contentful/experience-builder/issues/1080)) ([a3614ea](https://github.com/contentful/experience-builder/commit/a3614ea792095c61ccdde1232035c1da187abbac))
- update lock file ([a86bc46](https://github.com/contentful/experience-builder/commit/a86bc46f0ed3ee82d48f1b7db14d38a157c68265))

## [1.35.1](https://github.com/contentful/experience-builder/compare/v1.35.0...v1.35.1) (2025-03-26)

### Bug Fixes

- sync next js version between test app and marketing demo app ([964cab9](https://github.com/contentful/experience-builder/commit/964cab926f2e064052cbe4176da8b2f8eae61d25))
- trivial typo fix to test release process ([bbca38a](https://github.com/contentful/experience-builder/commit/bbca38aa512d40cc0f9bd6cd4ec207736e6a4b5f))
- use --git-tag-command to override lerna version tag for prereleases ([773e4a8](https://github.com/contentful/experience-builder/commit/773e4a8449f7a07b5b980d645d3ccca8ce7a4a22))

## [1.35.0](https://github.com/contentful/experience-builder/compare/v1.34.1...v1.35.0) (2025-03-24)

### Features

- add support for debug mode ([5cea4d0](https://github.com/contentful/experience-builder/commit/5cea4d082aafe3e1215a6615ef89c66cb2e650a7))
- **prebinding:** render nested patterns with prebinding [LUMOS-525] ([#1047](https://github.com/contentful/experience-builder/issues/1047)) ([a11cb8e](https://github.com/contentful/experience-builder/commit/a11cb8e6b1e5e1f0f8daf418d69b3b5562801f96))

### Bug Fixes

- address review comments ([4ea07ed](https://github.com/contentful/experience-builder/commit/4ea07ed7510b16db78d35cdb306339ab4fec1241))
- explicitely enable debug mode in NextJS app ([66ce631](https://github.com/contentful/experience-builder/commit/66ce631b3d42b7790be5d5287faca34a1027273e))

## [1.34.1](https://github.com/contentful/experience-builder/compare/v1.34.0...v1.34.1) (2025-03-05)

### Bug Fixes

- remove the key update via the use effect ([#1035](https://github.com/contentful/experience-builder/issues/1035)) ([8013879](https://github.com/contentful/experience-builder/commit/8013879d3a48a8b1ee8ce4f8218a25b8f7ea5d6f))

## [1.34.0](https://github.com/contentful/experience-builder/compare/v1.33.3...v1.34.0) (2025-03-03)

### Features

- add an optional category field to componentSettings ([#1027](https://github.com/contentful/experience-builder/issues/1027)) ([87c41f6](https://github.com/contentful/experience-builder/commit/87c41f6ea1382ed2beb7b40baea55c0ae36aeec9))

## [1.33.3](https://github.com/contentful/experience-builder/compare/v1.33.2...v1.33.3) (2025-02-28)

### Bug Fixes

- types export from core package ([8d57a97](https://github.com/contentful/experience-builder/commit/8d57a9750fdb9f6033e63e1e63738fdb342a5ebb))

## [1.33.2](https://github.com/contentful/experience-builder/compare/v1.33.1...v1.33.2) (2025-02-26)

### Bug Fixes

- **text-component:** add asset and experience to binding-source-type validation ([f8e6988](https://github.com/contentful/experience-builder/commit/f8e698895a5f469cfc2cbb12616bc1f868fa96df))
- **text-component:** add asset and experience to binding-source-type validation ([9634705](https://github.com/contentful/experience-builder/commit/9634705e07bc5e1b89f62a5673f1f42d1038a877))
- use const types and update property descriptions [] ([#1019](https://github.com/contentful/experience-builder/issues/1019)) ([7e3b57f](https://github.com/contentful/experience-builder/commit/7e3b57f378654058e0103bc5c02e5aa08d95b09b))

## [1.33.1](https://github.com/contentful/experience-builder/compare/v1.33.0...v1.33.1) (2025-02-24)

## [1.33.0](https://github.com/contentful/experience-builder/compare/v1.32.0...v1.33.0) (2025-02-20)

### Features

- **prebinding:** schema updates and rendering of prebinding mappings in delivery mode ([#1014](https://github.com/contentful/experience-builder/issues/1014)) ([53c66f8](https://github.com/contentful/experience-builder/commit/53c66f856189602ef77bdc90d42c4c6822bd9002)), closes [#998](https://github.com/contentful/experience-builder/issues/998) [#1006](https://github.com/contentful/experience-builder/issues/1006) [#1007](https://github.com/contentful/experience-builder/issues/1007)

### Bug Fixes

- spelling of contentType [LUMOS-561] ([#1013](https://github.com/contentful/experience-builder/issues/1013)) ([25107a5](https://github.com/contentful/experience-builder/commit/25107a56abdb7df8bbad6fdbec558931ae95b8bd)), closes [#998](https://github.com/contentful/experience-builder/issues/998) [#1006](https://github.com/contentful/experience-builder/issues/1006) [#1007](https://github.com/contentful/experience-builder/issues/1007)

## [1.32.0](https://github.com/contentful/experience-builder/compare/v1.31.1...v1.32.0) (2025-02-20)

### Features

- only provide isInExpEditorMode if activated in options [SPA-2607] ([#1008](https://github.com/contentful/experience-builder/issues/1008)) ([3bb6ccb](https://github.com/contentful/experience-builder/commit/3bb6ccba93151e27a629f24274ee7439a9ced561))

## [1.31.1](https://github.com/contentful/experience-builder/compare/v1.31.0...v1.31.1) (2025-02-19)

### Bug Fixes

- add tests for useBreakpoints ([f91feee](https://github.com/contentful/experience-builder/commit/f91feeeef23222822af8cac9c5d28da6232c5102))
- failing test due to change in function signature ([d53c443](https://github.com/contentful/experience-builder/commit/d53c4431fe0733e5d228ee0f6d0bbd812d8f174f))
- handle case where single column is not wrapped in columns component ([21d6759](https://github.com/contentful/experience-builder/commit/21d6759f3cad4d28f0e7030f230f5c36ec249368))
- make thumbnail id optional ([6605026](https://github.com/contentful/experience-builder/commit/6605026210735b82f9c4238066a420d2c4ab17fe))
- move active and fallback breakpoint index inside resolveDesignValue ([7caa96e](https://github.com/contentful/experience-builder/commit/7caa96e48906dfb9fdebca9a290e5f3295481345))
- set mediaQueriesMatches when breakpoints change ([ff850ca](https://github.com/contentful/experience-builder/commit/ff850cace14fc3bea5fe54b67cb3d9f981495c0b))
- use matches instead of matchers on state update ([41366c5](https://github.com/contentful/experience-builder/commit/41366c5f4cfd6f38f48d5786f0b19af0e05cccf9))

## [1.31.0](https://github.com/contentful/experience-builder/compare/v1.30.5...v1.31.0) (2025-02-18)

### Features

- add buffer space to bottom of canvas [LUMOS-549] ([#990](https://github.com/contentful/experience-builder/issues/990)) ([e07efed](https://github.com/contentful/experience-builder/commit/e07efeded0ceb43f1c549a2c746a1ca331c76cc7))

### Bug Fixes

- resolving component values for nested pattern nodes [SPA-2586] ([#982](https://github.com/contentful/experience-builder/issues/982)) ([270aced](https://github.com/contentful/experience-builder/commit/270aced5504818402cf7e3ef7d073c2c62b99ac3))
- **ssr-styles:** consider breakpoint ID for hash generation [SPA-2599] ([#993](https://github.com/contentful/experience-builder/issues/993)) ([8f96b7d](https://github.com/contentful/experience-builder/commit/8f96b7d3057aae66b19e3724be112263027d706d))

## [1.30.5](https://github.com/contentful/experience-builder/compare/v1.30.4...v1.30.5) (2025-02-10)

### Bug Fixes

- dont render pseudo overlay from divider in delivery ([#987](https://github.com/contentful/experience-builder/issues/987)) ([1706722](https://github.com/contentful/experience-builder/commit/17067220c7278118d37922843adfa25ff1b33ca6))
- dont send pattern definitions to the editor ([#983](https://github.com/contentful/experience-builder/issues/983)) ([0c4a4ec](https://github.com/contentful/experience-builder/commit/0c4a4ec46767876f16e9d199176982ddb7f40f48))

## [1.30.4](https://github.com/contentful/experience-builder/compare/v1.30.3...v1.30.4) (2025-02-06)

### Bug Fixes

- resync on first pass ([#979](https://github.com/contentful/experience-builder/issues/979)) ([8c42407](https://github.com/contentful/experience-builder/commit/8c424072fe7cca45c96c85bffbb4427f1dc5afca))

## [1.30.3](https://github.com/contentful/experience-builder/compare/v1.30.2...v1.30.3) (2025-02-04)

### Bug Fixes

- update marketing demo template app for trials so that the contact and about links are disabled ([519eb1a](https://github.com/contentful/experience-builder/commit/519eb1a2d25268ffebdda836dfd7dc51ede1912b))

## [1.30.2](https://github.com/contentful/experience-builder/compare/v1.30.1...v1.30.2) (2025-02-01)

## [1.30.1](https://github.com/contentful/experience-builder/compare/v1.30.0...v1.30.1) (2025-01-31)

### Bug Fixes

- dont recreate mediaQuery matchers on every render ([#968](https://github.com/contentful/experience-builder/issues/968)) ([5c29618](https://github.com/contentful/experience-builder/commit/5c296182ed497d7c713f475b8ec67ee05a9cef2a))

## [1.30.0](https://github.com/contentful/experience-builder/compare/v1.29.0...v1.30.0) (2025-01-29)

### Features

- **content binding redesign - sensible defaults:** add bindingSourceType validations to built in ([e4da1f5](https://github.com/contentful/experience-builder/commit/e4da1f5e6112a9c423f954171f92e075f5d806c7))
- expose entry ID in core entity store ([2806b3e](https://github.com/contentful/experience-builder/commit/2806b3e015e179ecda8401f061aace1b382551bd))

### Bug Fixes

- detect loops in fetchers and preview renderer ([da04623](https://github.com/contentful/experience-builder/commit/da046233388feaf38a383e7130add5d201e8ff21))
- drop circular reference in JSON for usedComponents ([ceb923b](https://github.com/contentful/experience-builder/commit/ceb923bfc6be19a4359c78097c887b4a7bc2bbcb))
- readd generic type ([05762a7](https://github.com/contentful/experience-builder/commit/05762a7993a927a8240c807e681d850b4be40bcb))
- remove typo and rename utility to resolveDeepUsedComponents ([4733def](https://github.com/contentful/experience-builder/commit/4733def022bdd4e382ec997545ed8330dcec2952))
- replace circular self reference with link ([4842536](https://github.com/contentful/experience-builder/commit/4842536b99531b9a2c1e60e6a1558d246a0e745a))
- reuse circular check for fetchById ([787ec66](https://github.com/contentful/experience-builder/commit/787ec667e9f7e3f59771ed00ab4cd01b0f4e0d74))
- typos and dont crash on reload due to race condition in mode detection ([f16f709](https://github.com/contentful/experience-builder/commit/f16f7098986f0233d75b70ff09ef50f1abbee257))
- use unique set of IDs for fetching entries and assets ([3a2408b](https://github.com/contentful/experience-builder/commit/3a2408bb1d2997c435c027b3c78092ecb4127dfb))

## [1.29.0](https://github.com/contentful/experience-builder/compare/v1.28.3...v1.29.0) (2025-01-23)

### Features

- add circularity error message, wrappingPatternIds and handle entryId as rootBlockId ([73c82f5](https://github.com/contentful/experience-builder/commit/73c82f522c7401528a5ac206ed1f32a0d557a273))
- allow changes to the tree root ([44f1431](https://github.com/contentful/experience-builder/commit/44f143153446ebb039f59c864ec6e39dfaa90973))
- **validators:** new optional validation called bindingSourceType ([1a48f60](https://github.com/contentful/experience-builder/commit/1a48f6023fbe14b3ff2bd81999f0c8ecc48f0475))

## [1.28.3](https://github.com/contentful/experience-builder/compare/v1.28.2...v1.28.3) (2025-01-22)

### Bug Fixes

- image component in experiences updates display name to alt text for the alt variable ([30aaf13](https://github.com/contentful/experience-builder/commit/30aaf137cec5278c90206d9ae0777fad7079ee77))
- let visibility display style take precedence when toggled ([1ddd81a](https://github.com/contentful/experience-builder/commit/1ddd81a837e4fe50b6bdb96228c2dbdb8d5f143d))
- Revert "fix: prevent missing components error when viewing experience in read…" ([#942](https://github.com/contentful/experience-builder/issues/942)) ([f7c35c2](https://github.com/contentful/experience-builder/commit/f7c35c2b7b8b8073c0190836bc2f9bb786faae21))

## [1.28.2](https://github.com/contentful/experience-builder/compare/v1.28.1...v1.28.2) (2025-01-20)

### Features

- add gatsby spa to the examples directory ([1a583b8](https://github.com/contentful/experience-builder/commit/1a583b8f76b933cd54aec49a9d309d79101d1b9d))

### Bug Fixes

- **experience-builder:** show the selection rectangle of nested patterns [SPA-2534] ([#908](https://github.com/contentful/experience-builder/issues/908)) ([cb2eed9](https://github.com/contentful/experience-builder/commit/cb2eed945f8866d4f40aedfae045c095d22dacbf))
- move vite-plugin-css-injected-by-js plugin to dev deps ([#932](https://github.com/contentful/experience-builder/issues/932)) ([309f325](https://github.com/contentful/experience-builder/commit/309f325a0690002473907fed1272493d9594842b))
- prevent missing components error when viewing experience in read only mode [LUMOS-208] ([#931](https://github.com/contentful/experience-builder/issues/931)) ([16e420c](https://github.com/contentful/experience-builder/commit/16e420cd53513976a99879c844da0b2e70936efc))
- react-router import in gatsby spa to match the docs ([f6480bb](https://github.com/contentful/experience-builder/commit/f6480bb3493b9ef891fdb566ed12e2d8a7f3b6c6))

## [1.28.1](https://github.com/contentful/experience-builder/compare/v1.28.0...v1.28.1) (2025-01-13)

### Bug Fixes

- **components:** add className to anchor tag when passing url to the Text component [ALT-1522] ([#905](https://github.com/contentful/experience-builder/issues/905)) ([a454e24](https://github.com/contentful/experience-builder/commit/a454e24d4433ab9c6bd7632fa1df5e0fda2fcee9))

## [1.28.0](https://github.com/contentful/experience-builder/compare/v1.27.1...v1.28.0) (2025-01-09)

### Features

- add more strict id schema for component tree node ([c60cf98](https://github.com/contentful/experience-builder/commit/c60cf98b07152bb9a0ce836f21da176747e56675))
- **components:** rename builtin component content fields [LUMOS-459] ([#879](https://github.com/contentful/experience-builder/issues/879)) ([6512afc](https://github.com/contentful/experience-builder/commit/6512afcb3bfe041137ab68d72e665e9e842497d6))
- **components:** rename builtin component content fields [LUMOS-459] ([#879](https://github.com/contentful/experience-builder/issues/879)) ([2e08a67](https://github.com/contentful/experience-builder/commit/2e08a6774b62a7c1f3f799500e1323fbbcc41813))

### Bug Fixes

- don't spread props meant for custom components onto plain html wrapping elements ([8403209](https://github.com/contentful/experience-builder/commit/8403209b2ccad92f632fb5cb7a00bc9a1a3bd3fe))
- don't spread props meant for custom components onto plain html wrapping elements ([#898](https://github.com/contentful/experience-builder/issues/898)) ([ba7ba90](https://github.com/contentful/experience-builder/commit/ba7ba9030d79233cb02e545147bb2e4150dbcc53)), closes [#899](https://github.com/contentful/experience-builder/issues/899)
- hyperlinks to assets or entries should resolve in a rich text variable [ALT-1493] ([#873](https://github.com/contentful/experience-builder/issues/873)) ([9ad696f](https://github.com/contentful/experience-builder/commit/9ad696f1bf921aafff547c0df0d414c7b06ebfc8))
- render patterns in preview [SPA-2518] ([#884](https://github.com/contentful/experience-builder/issues/884)) ([dc05f7f](https://github.com/contentful/experience-builder/commit/dc05f7fcf5d3ee14f7cd5936a505fb9306fce344))
- update package lock file ([a58f868](https://github.com/contentful/experience-builder/commit/a58f8680c0a15cfcb6a9da0515be1fd567704ff8))

## [1.27.1](https://github.com/contentful/experience-builder/compare/v1.27.0...v1.27.1) (2024-12-19)

## [1.27.0](https://github.com/contentful/experience-builder/compare/v1.26.0...v1.27.0) (2024-12-17)

### Features

- changes required for nested patterns rendering and styles [SPA-2475] ([#870](https://github.com/contentful/experience-builder/issues/870)) ([a8135ee](https://github.com/contentful/experience-builder/commit/a8135ee71ccf50adf4ad94c4f1bd9e872bd8736d))

### Bug Fixes

- **experience-builder-sdk:** SSR classNames not being attached to components rendered in SSR [ZEND-5755] ([#874](https://github.com/contentful/experience-builder/issues/874)) ([bded854](https://github.com/contentful/experience-builder/commit/bded854c8520937dd28a68499412018d8eae1ee7))
- update dep for rich-text-renderer for react v19 compat ([#869](https://github.com/contentful/experience-builder/issues/869)) ([315389a](https://github.com/contentful/experience-builder/commit/315389a63cb94aee1c4becacaccfd79b26dcefcf))
- **visual-editor:** prevent hover tooltip for selected component [ALT-1090] ([#872](https://github.com/contentful/experience-builder/issues/872)) ([ff5c3fa](https://github.com/contentful/experience-builder/commit/ff5c3fa6be7489ee832814b0480a57c433111ca2))

## [1.26.0](https://github.com/contentful/experience-builder/compare/v1.25.1...v1.26.0) (2024-12-10)

### Features

- add isEditorMode param to vanilla js fetchers [] ([#855](https://github.com/contentful/experience-builder/issues/855)) ([e38390d](https://github.com/contentful/experience-builder/commit/e38390dde23c3562c8089944b72f30d1b8b24f48))

## [1.25.1](https://github.com/contentful/experience-builder/compare/v1.25.0...v1.25.1) (2024-12-09)

### Bug Fixes

- revert type for validation option values [ALT-690] ([#862](https://github.com/contentful/experience-builder/issues/862)) ([62475da](https://github.com/contentful/experience-builder/commit/62475da7d4648b987c7beb904752440300883d69))

## [1.25.0](https://github.com/contentful/experience-builder/compare/v1.24.0...v1.25.0) (2024-12-06)

### Features

- add optional id property for component tree nodes ([50dc7ff](https://github.com/contentful/experience-builder/commit/50dc7ff3ee06b8c03deee4d8ae91dcf6d25a5886))

## [1.24.0](https://github.com/contentful/experience-builder/compare/v1.23.0...v1.24.0) (2024-12-04)

### Features

- add is in experiences mode type to component when dropped onto the canvas ([d6d09ac](https://github.com/contentful/experience-builder/commit/d6d09acc5c1821cf30659bf676adde15631f8ec8))

### Bug Fixes

- **core:** export new type for ComponentDefinitionVariableTypeMap [ALT-690] ([#856](https://github.com/contentful/experience-builder/issues/856)) ([125f670](https://github.com/contentful/experience-builder/commit/125f67039e639fa30b0ce2165057e88eb420884c))

## [1.23.0](https://github.com/contentful/experience-builder/compare/v1.22.0...v1.23.0) (2024-12-03)

### Features

- add base carousel component [ALT-1425] ([#842](https://github.com/contentful/experience-builder/issues/842)) ([97c6578](https://github.com/contentful/experience-builder/commit/97c6578c937a4bb2921d3d312f03e0ad386d1eef))
- add experimental components to define components ([#843](https://github.com/contentful/experience-builder/issues/843)) ([21ec5db](https://github.com/contentful/experience-builder/commit/21ec5db2c490c3372595f7162c7095b3dfc4db53))
- enable rendering of the nested patterns ([#813](https://github.com/contentful/experience-builder/issues/813)) ([46573c4](https://github.com/contentful/experience-builder/commit/46573c43b9380840cb7dec2f61dffefd108131b0))
- export version in Experiences SDK ([#847](https://github.com/contentful/experience-builder/issues/847)) ([941b45c](https://github.com/contentful/experience-builder/commit/941b45cc637cc528f75d6fbe236492f1509d783d))
- **nextjs-marketing-demo:** update footer [ALT-1379] ([#846](https://github.com/contentful/experience-builder/issues/846)) ([70e35fe](https://github.com/contentful/experience-builder/commit/70e35fe87eb1e80f6f82ee7affbdf777344d3244))
- **nextjs-marketing-demo:** update header navigation [ALT-1378] ([#844](https://github.com/contentful/experience-builder/issues/844)) ([fe82002](https://github.com/contentful/experience-builder/commit/fe82002e83f71924dd792c25a03a789a71287989))
- update types for ComponentDefinition variables [ALT-690] ([#850](https://github.com/contentful/experience-builder/issues/850)) ([e015e2b](https://github.com/contentful/experience-builder/commit/e015e2be42606fd0dec4acb72eb08f01b0de5aa2))

### Bug Fixes

- don't add client object to fetchBy dependency arrays to fix infinite rerenders ([#830](https://github.com/contentful/experience-builder/issues/830)) ([9873919](https://github.com/contentful/experience-builder/commit/9873919b3b59c121a2f6c7b8cbd6e23a262820e6))
- react on changes of breakpoint when tree is the same ([4560282](https://github.com/contentful/experience-builder/commit/4560282e2af8d8aecab16f8d2f29d82edb4c1556))
- saw this code that i think is just duplicated? ([#840](https://github.com/contentful/experience-builder/issues/840)) ([796f0a6](https://github.com/contentful/experience-builder/commit/796f0a604ec131210a694b80028d6f2b90be9d9b))
- target width now applies the background image url css properly ([65d24c8](https://github.com/contentful/experience-builder/commit/65d24c83b9dd9c24a904e9968c116b9cf326000c))
- use lodash for correct array eq check ([011a8f0](https://github.com/contentful/experience-builder/commit/011a8f00d971692e001887e890f6f081fdd56828))

## [1.22.0](https://github.com/contentful/experience-builder/compare/v1.21.0...v1.22.0) (2024-11-08)

### Features

- populate pattern nodes for Editor mode in the webapp ([9a1d456](https://github.com/contentful/experience-builder/commit/9a1d45633b62d0e869089d5a1c7e6ba27598ff36))

### Bug Fixes

- **visual-editor:** prevent elements from resizing on drag [ALT-1371] ([#828](https://github.com/contentful/experience-builder/issues/828)) ([6c005a7](https://github.com/contentful/experience-builder/commit/6c005a7358a9b92a885c309d770a4f9be0a1115c))

## [1.21.0](https://github.com/contentful/experience-builder/compare/v1.20.1...v1.21.0) (2024-11-06)

### Features

- resolve entries that are embedded into bound entries [ALT-1368] ([#824](https://github.com/contentful/experience-builder/issues/824)) ([7bba27e](https://github.com/contentful/experience-builder/commit/7bba27e4b93245b8860d1ca4ba9ccaaa52bd43d7))

### Bug Fixes

- drag-n-drop error when moving custom components [ALT-1446] ([#825](https://github.com/contentful/experience-builder/issues/825)) ([af51a55](https://github.com/contentful/experience-builder/commit/af51a5554c0e2d426f408d51a774f296388c23f3))

## [1.20.1](https://github.com/contentful/experience-builder/compare/v1.20.0...v1.20.1) (2024-11-04)

### Features

- add optional locale param in URL for vite app ([24130b5](https://github.com/contentful/experience-builder/commit/24130b58bc168d48e233c0b73a3c4971fd6dbe16))

### Bug Fixes

- add min width 80px for dropping children in empty containers ([55d14ba](https://github.com/contentful/experience-builder/commit/55d14bae3bc6dec8a4d099719de0e0cae2f9a424))
- change default Margin value back to 0 on all sides [ALT-1388] ([#818](https://github.com/contentful/experience-builder/issues/818)) ([129553e](https://github.com/contentful/experience-builder/commit/129553e53c8ef41dab551e4d38b5d28e017240c1))
- dont rerender styles on every render via memoization ([7295b17](https://github.com/contentful/experience-builder/commit/7295b17983793aeae11dc5a4a21b22a180ef6faa))
- dont shrink button height when empty ([79bf85d](https://github.com/contentful/experience-builder/commit/79bf85dc379dd2316247652f545cd4ab5d106f2c))
- forcibly disable pointer-events on drag/drop clone elements [ALT-1391] ([#821](https://github.com/contentful/experience-builder/issues/821)) ([8b5d95b](https://github.com/contentful/experience-builder/commit/8b5d95bdfb380f61522443062f757de6966a2bfa))
- handle leaking dragProps ([27effa0](https://github.com/contentful/experience-builder/commit/27effa0f2caa6dc0dcb88591aa3833c5e0e1e1be))
- remove styles tag when not used anymore ([ae78d07](https://github.com/contentful/experience-builder/commit/ae78d07dafc7ef3f2d1e30744d181f0a9cf4f261))
- use the correct description for hyperlink behaviour property ([56fb4fe](https://github.com/contentful/experience-builder/commit/56fb4fe44ecf1e2151835543cbd45bab3c196c5d))

## [1.20.0](https://github.com/contentful/experience-builder/compare/v1.19.0...v1.20.0) (2024-10-23)

### Features

- new component registration option for editorWrapperWidth [ALT-1358] ([#800](https://github.com/contentful/experience-builder/issues/800)) ([4b1891e](https://github.com/contentful/experience-builder/commit/4b1891ee301f9e1cc073c02ad2fbd77f0de5de75))

### Bug Fixes

- rename editorWrapperWidth option to wrapContainerWidth [ALT-1358] ([#801](https://github.com/contentful/experience-builder/issues/801)) ([93425ea](https://github.com/contentful/experience-builder/commit/93425ea662c0fe129e47f78036190d20b1106a21))
- update design token breakpoint parsing logic to work with spaced out dt keys ([bab0d61](https://github.com/contentful/experience-builder/commit/bab0d61339becee1b5759306fa73ec9cf777e895))
- update display name for text variable in the Heading component [] ([#796](https://github.com/contentful/experience-builder/issues/796)) ([1386004](https://github.com/contentful/experience-builder/commit/1386004899a5fd53ddde401c6acc3a6af25125f4))

## [1.19.0](https://github.com/contentful/experience-builder/compare/v1.18.0...v1.19.0) (2024-10-14)

### Features

- allow componentSettings and usedComponents fields to co-exist within the same entity ([#793](https://github.com/contentful/experience-builder/issues/793)) ([d082a68](https://github.com/contentful/experience-builder/commit/d082a681d7d0b61e7514d11885e9acb6e138a876))

### Bug Fixes

- add divider to list of optionalBuiltInComponents ([#788](https://github.com/contentful/experience-builder/issues/788)) ([8f94448](https://github.com/contentful/experience-builder/commit/8f94448d491f80bdfda9b3b8a70eebcf8bff6425))

## [1.18.0](https://github.com/contentful/experience-builder/compare/v1.17.1...v1.18.0) (2024-10-10)

### Features

- add new cfFlexReverse built in style property ([#789](https://github.com/contentful/experience-builder/issues/789)) ([bb904e1](https://github.com/contentful/experience-builder/commit/bb904e12bbae2418ee847f31f7c5cf4f36d57b2d))

### Bug Fixes

- apply margin to wrapperStyles when drag wrapper is enabled [ALT-1293] ([#784](https://github.com/contentful/experience-builder/issues/784)) ([dddb811](https://github.com/contentful/experience-builder/commit/dddb811da5648d58b971797d62f3563ef7e754dd))
- columns uses incorrect default value ([#782](https://github.com/contentful/experience-builder/issues/782)) ([f3fb9a4](https://github.com/contentful/experience-builder/commit/f3fb9a48c9672982498ae4eb0d5ce604bda3c84f))
- dnd between custom components and patterns [ALT-1230] ([#785](https://github.com/contentful/experience-builder/issues/785)) ([abf9103](https://github.com/contentful/experience-builder/commit/abf9103341f46fe36618badfc907032c0b88a342))
- make assemblyblock height 100% ([#786](https://github.com/contentful/experience-builder/issues/786)) ([f8c537f](https://github.com/contentful/experience-builder/commit/f8c537fbd6a4dddc47a6dd68b339ed423008c456))
- revised buildCfStyles and add useComponentProps tests [ALT-1293] ([#779](https://github.com/contentful/experience-builder/issues/779)) ([4b9346f](https://github.com/contentful/experience-builder/commit/4b9346f6aec4e074abfd2526eb42fec61dd2672c))
- update NextJS apps to import config server side so design tokens are registered ([#783](https://github.com/contentful/experience-builder/issues/783)) ([c1fdbe8](https://github.com/contentful/experience-builder/commit/c1fdbe8117e14a073ffb9bc2e3a8268565d114c2))

## [1.17.1](https://github.com/contentful/experience-builder/compare/v1.17.0...v1.17.1) (2024-10-03)

### Features

- hide nav on mobile in marketing demo app [ALT-1295] ([#776](https://github.com/contentful/experience-builder/issues/776)) ([38a2023](https://github.com/contentful/experience-builder/commit/38a20234a066884573c1c8abd43a6f98f147e329))

### Bug Fixes

- default width to 100% when component doesn't have a width variable [ALT-956] ([#775](https://github.com/contentful/experience-builder/issues/775)) ([be9eed3](https://github.com/contentful/experience-builder/commit/be9eed3b4f1816691c623f44b7266d56e1761ab4))
- override browser hr border style + set default background color [ALT-1281] ([#777](https://github.com/contentful/experience-builder/issues/777)) ([b0fd86d](https://github.com/contentful/experience-builder/commit/b0fd86d00c53f2f51e231544b6fff3a2122ef45d))
- width applied to both wrapping div and img [ALT-1293] ([#778](https://github.com/contentful/experience-builder/issues/778)) ([e0d12f6](https://github.com/contentful/experience-builder/commit/e0d12f60b18575b50bb742ce0916adad2d0a5ff1))

## [1.17.0](https://github.com/contentful/experience-builder/compare/v1.16.1...v1.17.0) (2024-09-30)

### Features

- add Card custom component ([#770](https://github.com/contentful/experience-builder/issues/770)) ([3819cb4](https://github.com/contentful/experience-builder/commit/3819cb4e02fa734535fb2807eecf59f59e4d438f))
- add custom rating to the marketing template ([824f5d4](https://github.com/contentful/experience-builder/commit/824f5d44586a359547b0eb85f91f18a236ece91f))
- add nextjs marketing demo app to list of cli templates [ALT-1265] ([#761](https://github.com/contentful/experience-builder/issues/761)) ([2419c7a](https://github.com/contentful/experience-builder/commit/2419c7a83a3cae091269f18875a75926f069bcd9))
- **nextjs-marketing-demo:** add design tokens and card cover slot [ALT-1272] ([#772](https://github.com/contentful/experience-builder/issues/772)) ([9a4c024](https://github.com/contentful/experience-builder/commit/9a4c02425dbe2041c07a764c4110f9bffdde54da))
- **nextjs-marketing-demo:** add Header, Footer, and light mode styling [ALT-1270] ([#764](https://github.com/contentful/experience-builder/issues/764)) ([044a437](https://github.com/contentful/experience-builder/commit/044a4375a6c5a6351642873f4ef061979b9bd524))

### Bug Fixes

- reference sdk via path not version in react-vite template ([14b7ca7](https://github.com/contentful/experience-builder/commit/14b7ca76d02f54b54fa86917dd89eda88d7f982d))

## [1.16.1](https://github.com/contentful/experience-builder/compare/v1.16.0...v1.16.1) (2024-09-25)

### Features

- add ant component lib and button component [ALT-1241] [ALT-1244] ([#758](https://github.com/contentful/experience-builder/issues/758)) ([56de7e1](https://github.com/contentful/experience-builder/commit/56de7e1192652468206524c4ad660cc86ac56549))

### Bug Fixes

- isComponentAllowedOnRoot logic to allow patterns to be reparented at the root level ([34c8697](https://github.com/contentful/experience-builder/commit/34c86975c1576fe24530fdf004ce7443f31c83ed))
- resolve fetched entities for experiences [ALT-1146] ([#754](https://github.com/contentful/experience-builder/issues/754)) ([e475e62](https://github.com/contentful/experience-builder/commit/e475e62eb7fdee66e36b52c4a3076cb9503a9918))

## [1.16.0](https://github.com/contentful/experience-builder/compare/v1.15.1...v1.16.0) (2024-09-17)

### Features

- "ReadOnlyMode" post message listener ([#722](https://github.com/contentful/experience-builder/issues/722)) ([4f0cf3e](https://github.com/contentful/experience-builder/commit/4f0cf3e28a9568ec61038950bc535160de5c33ca))
- export deserialize pattern node variables from core package [SPA-2376] ([#751](https://github.com/contentful/experience-builder/issues/751)) ([3c5ff38](https://github.com/contentful/experience-builder/commit/3c5ff381361c81ad544d54cbaf23ff071d1a675d))

### Bug Fixes

- dont ignore falsy breakpoint values ([8e3fb2e](https://github.com/contentful/experience-builder/commit/8e3fb2ebe1e5622c0fd665fcac89cfdf9482ba77))
- ssr styles for cf visibility ([c200a15](https://github.com/contentful/experience-builder/commit/c200a15f85cb4dd58496c48869b7ce24aa5565fd))

## [1.15.1](https://github.com/contentful/experience-builder/compare/v1.15.0...v1.15.1) (2024-09-12)

## [1.15.0](https://github.com/contentful/experience-builder/compare/v1.14.0...v1.15.0) (2024-09-11)

### Features

- introduce rendering cfVisibility in SDK ([d53a8d2](https://github.com/contentful/experience-builder/commit/d53a8d2cf1f810cc0e5587d28abe1c19636fcad5))

### Bug Fixes

- assemblies incorrectly rendered on initial drop [ALT-1220] ([#742](https://github.com/contentful/experience-builder/issues/742)) ([fbf3d88](https://github.com/contentful/experience-builder/commit/fbf3d889e0a57b2f654bf45d78c2acbfd05af7e1))
- **core:** resolving design values [ALT-1222] ([#744](https://github.com/contentful/experience-builder/issues/744)) ([93c9cc5](https://github.com/contentful/experience-builder/commit/93c9cc509f6e653b6bb4faaa44cb1f600b23fa3e))
- dont suppress errors in SDK code but only custom code ([5f3fa19](https://github.com/contentful/experience-builder/commit/5f3fa1994bba392c6f39ea4ade411dc4c6352660))
- only fallback for not defined breakpoint values ([100fd98](https://github.com/contentful/experience-builder/commit/100fd98b40bf813bac3434f5ad04ffe74fbde124))

## [1.14.0](https://github.com/contentful/experience-builder/compare/v1.13.0...v1.14.0) (2024-09-10)

### Features

- add style prop to toggle visibility in component registeration ([4a6caf2](https://github.com/contentful/experience-builder/commit/4a6caf2dc3b489e6e2f30bcf7c499532c7873d20))
- enable text colors for rich text component [ALT-1216] ([#736](https://github.com/contentful/experience-builder/issues/736)) ([36286da](https://github.com/contentful/experience-builder/commit/36286da5f3d507f53eb3146e7d4d854b8bf6198e))
- visibiity built in styles ([d736766](https://github.com/contentful/experience-builder/commit/d736766b2606d848f885760a6dec35a2a941097d))

## [1.13.0](https://github.com/contentful/experience-builder/compare/v1.12.0...v1.13.0) (2024-09-05)

### Features

- expose the HyperlinkValue type to consume it directly ([c26471d](https://github.com/contentful/experience-builder/commit/c26471d66dbbf613fae2e52322f6e29855fed21f))

### Bug Fixes

- default value for container margin to be auto left/right ([#726](https://github.com/contentful/experience-builder/issues/726)) [ALT-1166] ([1344f8f](https://github.com/contentful/experience-builder/commit/1344f8f113940a52d5d3f33cc831918dc78948a2))
- dont swallow SDK errors ([3dc83e1](https://github.com/contentful/experience-builder/commit/3dc83e1576a9b952beca1244213257889a5922d8))
- hovering pattern in layers tab now renders the display name on canvas in studio experiences ([1ac11d2](https://github.com/contentful/experience-builder/commit/1ac11d21aa97056e3a436c5ab61c156d2225257b))
- test-apps mobile breakpoint [ALT-1167] ([#725](https://github.com/contentful/experience-builder/issues/725)) ([258f5aa](https://github.com/contentful/experience-builder/commit/258f5aa7932162257f14cdca3a81a762ae9df8c0))
- type error when breakpoint is undefined ([64d0aa8](https://github.com/contentful/experience-builder/commit/64d0aa842c76b0c1a5abbbfaf08ced5f86133de7))
- use a reasonable preview size for mobile ([5bd8951](https://github.com/contentful/experience-builder/commit/5bd8951b83f4a1c9417f840a95f3c74137aefd27))

## [1.12.0](https://github.com/contentful/experience-builder/compare/v1.11.2...v1.12.0) (2024-08-21)

### Features

- **core:** set background color opacity to 0 by default [ALT-887] ([#713](https://github.com/contentful/experience-builder/issues/713)) ([35242c4](https://github.com/contentful/experience-builder/commit/35242c4ce77b50dc2d1c613f060313805f8cafc5))

### Bug Fixes

- divider not selectable in editor mode [ALT-1120] ([#714](https://github.com/contentful/experience-builder/issues/714)) ([c1fe341](https://github.com/contentful/experience-builder/commit/c1fe3415d841ae4d790eccc169deadc6c5bc8c36))
- don't wrap rich text with an inline element ([#716](https://github.com/contentful/experience-builder/issues/716)) ([8ea4d09](https://github.com/contentful/experience-builder/commit/8ea4d09930198138891ce336f8bfb3f5a423249f))
- validate defaultValue type matches type value of variable ([#704](https://github.com/contentful/experience-builder/issues/704)) ([44b632f](https://github.com/contentful/experience-builder/commit/44b632fa0700316a4b0bc66176ddec121653ea36))

## [1.11.2](https://github.com/contentful/experience-builder/compare/v1.11.1...v1.11.2) (2024-07-31)

### Bug Fixes

- incorrect placeholder styling ([#705](https://github.com/contentful/experience-builder/issues/705)) ([1c1add1](https://github.com/contentful/experience-builder/commit/1c1add1c1091811ba44973b58c27d3b7751264d5))
- render defaultValue in preview when resolving doesnt work ([3f11c75](https://github.com/contentful/experience-builder/commit/3f11c7513d12b3912ae6d023e530dea0573ca756))
- slot components should fit their height content once they have children ([#706](https://github.com/contentful/experience-builder/issues/706)) ([dd1094a](https://github.com/contentful/experience-builder/commit/dd1094a7f2321c5a3f94a642596a4d625eaa683b))
- ssr styles extraction for editable patterns [SPA-2157] ([#707](https://github.com/contentful/experience-builder/issues/707)) ([65ec4bb](https://github.com/contentful/experience-builder/commit/65ec4bb89b0657d899cd22493381dc1bf835d7f9))
- **visual-editor:** styling for custom component children dropzone [ALT-1085] ([#709](https://github.com/contentful/experience-builder/issues/709)) ([8ed41a3](https://github.com/contentful/experience-builder/commit/8ed41a3c070b65fe78eb960d9bfe104f5542645b))

## [1.11.1](https://github.com/contentful/experience-builder/compare/v1.11.0...v1.11.1) (2024-07-19)

### Bug Fixes

- **experience-builder-sdk:** fix dragProps for Assembly wrapper [ALT-1064] ([#701](https://github.com/contentful/experience-builder/issues/701)) ([0632f7b](https://github.com/contentful/experience-builder/commit/0632f7b1dbf8ac3ae744f3391b64e0541eccdcf7))

## [1.11.0](https://github.com/contentful/experience-builder/compare/v1.10.0...v1.11.0) (2024-07-19)

### Features

- add text design token ([1d3865f](https://github.com/contentful/experience-builder/commit/1d3865ff52414525c0ffa9004f962d6721d7e75b))
- fallback for design component values in preview mode ([e626e12](https://github.com/contentful/experience-builder/commit/e626e1273d6bc1c92f47796a1cef1e3f7a353dc0))
- fallback to defaultValue for design values ([bb50822](https://github.com/contentful/experience-builder/commit/bb5082266588f28efef8372a89c36dfbf695ef4e))
- implement column reorder ([#694](https://github.com/contentful/experience-builder/issues/694)) ([d48b81a](https://github.com/contentful/experience-builder/commit/d48b81a4de4bbaf7deddf5928646db95335e1968))
- render design component values in editor mode ([c850ada](https://github.com/contentful/experience-builder/commit/c850adabe18c8067cac76609819f0c111d2fca84))
- render design component values in preview mode ([9d692ba](https://github.com/contentful/experience-builder/commit/9d692ba2c513da6e636c68be1e7c98857d84b529))

### Bug Fixes

- fix issue where dragging a structure component will periodically make it go bye bye ([#698](https://github.com/contentful/experience-builder/issues/698)) ([1c07c3a](https://github.com/contentful/experience-builder/commit/1c07c3a22915e237b9db0fccdbc220db0bcc7852))
- full-width for pattern wrapper ([#696](https://github.com/contentful/experience-builder/issues/696)) [ALT-1036] ([54a1570](https://github.com/contentful/experience-builder/commit/54a15701a4288831449271d6ad6b707bacf72e9b))
- useDetectEditorMode [] ([#690](https://github.com/contentful/experience-builder/issues/690)) ([19a8b08](https://github.com/contentful/experience-builder/commit/19a8b087c092834d64b8c35df406477862a6665b))

## [1.10.0](https://github.com/contentful/experience-builder/compare/v1.9.0...v1.10.0) (2024-07-11)

### Features

- allow Link and Array type references as variables ([#685](https://github.com/contentful/experience-builder/issues/685)) ([55292da](https://github.com/contentful/experience-builder/commit/55292daacb8442da3f853748d9708687121c705d))

### Bug Fixes

- **create-contentful-studio-experiences:** add option to pass in ctfl host via command line ([#683](https://github.com/contentful/experience-builder/issues/683)) ([56f0f54](https://github.com/contentful/experience-builder/commit/56f0f5413c47677a6ec9162ed48e27869433b44b))
- define display icon for test-app breakpoints ([6b123ed](https://github.com/contentful/experience-builder/commit/6b123ed4abbdd5e3c0a377988e2134fb7ef3fc59))

## [1.9.0](https://github.com/contentful/experience-builder/compare/v1.8.2...v1.9.0) (2024-06-28)

### Features

- **create-contentful-studio-experiences:** handle script cancellation [ALT-1020] ([#676](https://github.com/contentful/experience-builder/issues/676)) ([de997cf](https://github.com/contentful/experience-builder/commit/de997cf6ad62bf232947ee9b9a88dab5a61cc9c3))

## [1.8.2](https://github.com/contentful/experience-builder/compare/v1.8.1...v1.8.2) (2024-06-27)

### Features

- **create-contentful-studio-experiences:** add Environment selection to CLI tool [ALT-995] ([#675](https://github.com/contentful/experience-builder/issues/675)) ([ac210ce](https://github.com/contentful/experience-builder/commit/ac210ce4b85d39c200f2ea9a26fc977f6dd0370b))
- **create-contentful-studio-experiences:** add more validation to CLI tool [ALT-991] ([#674](https://github.com/contentful/experience-builder/issues/674)) ([aacdffb](https://github.com/contentful/experience-builder/commit/aacdffb1c54d442e373752cc0885b30dd91186e1))
- **create-contentful-studio-experiences:** rename package for the CLI tool [ALT-991] ([#670](https://github.com/contentful/experience-builder/issues/670)) ([940b953](https://github.com/contentful/experience-builder/commit/940b953cdac1de76468a28501e4f292a9f9da229))

### Bug Fixes

- add version prop to fixture to match mgmt entity shape ([ec3b485](https://github.com/contentful/experience-builder/commit/ec3b4851463d6dee922cb1b35cb1b1aece49881e))
- adjust pacts storage and upload in pipeline ([82d745b](https://github.com/contentful/experience-builder/commit/82d745b07bc8afce207beaa3a92a2f8e4346593c))
- allow experiences-sdk-react components/hooks to be imported in NextJS server components ([#667](https://github.com/contentful/experience-builder/issues/667)) ([ee5ef2b](https://github.com/contentful/experience-builder/commit/ee5ef2b7f76f64868827ed2d5fa2852656f74ceb))
- dont crash the application when a deep-binding was not found but fall back to default value ([52977ba](https://github.com/contentful/experience-builder/commit/52977ba9df569fd721ee87b54657fd18fa81f0d1))
- hover outlines ([81138c3](https://github.com/contentful/experience-builder/commit/81138c315a408fdfabf589a7823d34b3cbc22d71))
- mob qa bug fixes ([f0f2892](https://github.com/contentful/experience-builder/commit/f0f28929b458e6c1f73a9097039d5b2729841ce9))
- pointer-events drag issue ([6eb49d2](https://github.com/contentful/experience-builder/commit/6eb49d211d46b57e376d8fa1a2d1193e126b3b75))
- proper pass github branch to pact publish cmd ([bfe77ff](https://github.com/contentful/experience-builder/commit/bfe77ff08a46b2563c2d521cd519b8ed4851c628))
- revert changes ([e5341e0](https://github.com/contentful/experience-builder/commit/e5341e0a843e73ccffeef3c465cb17535d00af82))
- silence lint errors ([378a50a](https://github.com/contentful/experience-builder/commit/378a50a8ad5d46445ba3b4a4ae7d3e10ce5b225a))
- use test environment in pact broker ([003b706](https://github.com/contentful/experience-builder/commit/003b70640c94f3a58ebc9d61cb19309affebb0c8))
- **visual-editor:** remove wrapping div for draggable and droppables ([56e44c7](https://github.com/contentful/experience-builder/commit/56e44c737ffd3fe59dee46556083fbd3db1875a5))
- **visual-editor:** remove wrapping div for draggable and droppables ([fda5897](https://github.com/contentful/experience-builder/commit/fda58972136ff36cadc1b5fae5fc28d19934eeb8))

## [1.8.1](https://github.com/contentful/experience-builder/compare/v1.8.0...v1.8.1) (2024-06-24)

### Features

- **create-experience-builder:** get create-experience-builder cli tool working again ([7495cb0](https://github.com/contentful/experience-builder/commit/7495cb031ea7e1b33a48e057249934d2da63c00b))

### Bug Fixes

- add type definitions for outgoing events ([ac1027c](https://github.com/contentful/experience-builder/commit/ac1027c85868897997740e3d10b1ed54fa07a540))
- add types for incoming events ([2d07b38](https://github.com/contentful/experience-builder/commit/2d07b38e5d858b8c8f84101c083f5649480d02c5))
- **core:** remove lodash dep to get rid of weird reference errors ([6511abe](https://github.com/contentful/experience-builder/commit/6511abe9f219a1104c34714e01cb535409720b5f))
- design tokens event payload ([a81964b](https://github.com/contentful/experience-builder/commit/a81964bc6c50a0c53a648b454ae8c0df4b38be1f))
- export individual payload types ([2dd4e2e](https://github.com/contentful/experience-builder/commit/2dd4e2e38321843c93c1dd8de109b682ed854a34))
- make data required ([36805ff](https://github.com/contentful/experience-builder/commit/36805ff910cc3065d7f3ec855757df1260843134))
- tidy up ([a212287](https://github.com/contentful/experience-builder/commit/a212287cffd2e27f490cef6cd8e12b7a0fec96a1))

## [1.8.0](https://github.com/contentful/experience-builder/compare/v1.7.1...v1.8.0) (2024-06-17)

### Features

- fallback missing components [SPA-2033] ([#658](https://github.com/contentful/experience-builder/issues/658)) ([a2d0f55](https://github.com/contentful/experience-builder/commit/a2d0f551767a1af3d086d1c16f7289dce0b0a689))
- **test-app:** change custom component icons ([6fb472b](https://github.com/contentful/experience-builder/commit/6fb472b5f4d26f165ec3ffbdb1aafdae6893539e))

## [1.7.1](https://github.com/contentful/experience-builder/compare/v1.7.0...v1.7.1) (2024-06-11)

### Bug Fixes

- experiences patterns slots ([#651](https://github.com/contentful/experience-builder/issues/651)) ([53ee8ba](https://github.com/contentful/experience-builder/commit/53ee8bae7e0cde5b11a3541b675fe4cb9d2e7402))
- only have default background color for components that need to have them ([e4062e0](https://github.com/contentful/experience-builder/commit/e4062e059571111cd937ee3b46bd358596f09580))

## [1.7.0](https://github.com/contentful/experience-builder/compare/v1.6.0...v1.7.0) (2024-06-07)

### Features

- allow for optional composite design token values in experiences ([1984043](https://github.com/contentful/experience-builder/commit/1984043762c492cf8d2d2a95223f469401bd7eea))

### Bug Fixes

- change width calc ([43d1533](https://github.com/contentful/experience-builder/commit/43d15332624c206db90f1ae956b8239353b28f88))
- fix css tests ([29bf73b](https://github.com/contentful/experience-builder/commit/29bf73b7601ab42a58372af3bf8e6724657cc82d))
- lint ([35f6f38](https://github.com/contentful/experience-builder/commit/35f6f38804c0861efa7c45741d677628eba9b6a4))
- simplify width logic ([37c65d5](https://github.com/contentful/experience-builder/commit/37c65d538309f04de2374d75652b180c4d4ee673))
- update package ([661cb0e](https://github.com/contentful/experience-builder/commit/661cb0eb36d8733b6e3cc927ac69513d39725db9))

## [1.6.0](https://github.com/contentful/experience-builder/compare/v1.5.2...v1.6.0) (2024-06-03)

### Features

- add sdk feature detection object in core ([de7a1b1](https://github.com/contentful/experience-builder/commit/de7a1b191e3cbfc3c5d8e4b575fa3b847948b3b6))
- add sdk ui version has available feature ([#638](https://github.com/contentful/experience-builder/issues/638)) ([cca038d](https://github.com/contentful/experience-builder/commit/cca038d66ee6158c3f7604d8193a83ffb2a9d6e5))
- allow multiple slots to be defined in a custom component [ALT-416] ([#620](https://github.com/contentful/experience-builder/issues/620)) ([5aff939](https://github.com/contentful/experience-builder/commit/5aff939a7842246767e98ecb48891d1debec37a9))

### Bug Fixes

- remove error when breakpoints are not defined ([15c82c2](https://github.com/contentful/experience-builder/commit/15c82c24be4a326a80ae60e78b818cc372d57ef3))

## [1.5.2](https://github.com/contentful/experience-builder/compare/v1.5.1...v1.5.2) (2024-05-30)

### Bug Fixes

- fix sdk version being out-of-date with published package ([fbfbe05](https://github.com/contentful/experience-builder/commit/fbfbe059d403be40ee29271f9be1601bd486ccfe))

## [1.5.1](https://github.com/contentful/experience-builder/compare/v1.5.0...v1.5.1) (2024-05-27)

### Features

- add github documentation for the components package ([6b4cff7](https://github.com/contentful/experience-builder/commit/6b4cff7cb0fea9e4530370a478c4a62ae96096ec))
- add github documentation for the core package ([73419b5](https://github.com/contentful/experience-builder/commit/73419b52b9584a6fbc367ac686473d52fddfae81))
- add github documentation for the sdk package ([139d35e](https://github.com/contentful/experience-builder/commit/139d35e7e8b435ebdd5a3eb4c4dd51d6db0a7d42))
- add github documentation for the visual editor package ([fcfccd2](https://github.com/contentful/experience-builder/commit/fcfccd2f2101d7d1f82cc7c30c54941070043a4d))
- expose function to define custom breakpoints [SPA-2076] ([#621](https://github.com/contentful/experience-builder/issues/621)) ([4443695](https://github.com/contentful/experience-builder/commit/44436952ecd3c39206484d5fc3e561fb917d8e38))
- update github readme at the root level for more direct links and more detailed explanations ([3111828](https://github.com/contentful/experience-builder/commit/3111828e41ee6ee19da676a9ce209bf00bea0693))

### Bug Fixes

- component level README to be more compliant with Contenetful's technical writing guidelines ([895021d](https://github.com/contentful/experience-builder/commit/895021de1f9ce83dbc12c964e35b4f76f158563f))
- core README to be more compliant with Contenetful's technical writing guidelines ([21ac522](https://github.com/contentful/experience-builder/commit/21ac522fd8a60ca5f9e09d1e6025399e54e406ba))
- display name of hover of component ([9f419b2](https://github.com/contentful/experience-builder/commit/9f419b2955449d5be40663ec8de2b3f6d155db3d))
- root level README to be more compliant with Contenetful's technical writing guidelines ([55d6125](https://github.com/contentful/experience-builder/commit/55d6125e77b2890fb596ced07b8227d530b34ae3))
- sdk level README to be more compliant with Contenetful's technical writing guidelines ([f79a2ea](https://github.com/contentful/experience-builder/commit/f79a2ea83f6d6bdc69fc409e94eafcbd90c9f4df))
- visual-editor README to be more compliant with Contenetful's technical writing guidelines ([6ae3a6e](https://github.com/contentful/experience-builder/commit/6ae3a6ee1eeaa6ecea1ccc14b15d9db815d4e1bd))

## [1.5.0](https://github.com/contentful/experience-builder/compare/v1.4.0...v1.5.0) (2024-05-16)

### Features

- resolve css variables in experiences ([9180d23](https://github.com/contentful/experience-builder/commit/9180d238a890870dffffb364b6ab88bab70b09e7))

### Bug Fixes

- add maxWidth to list with design tokens ([876c927](https://github.com/contentful/experience-builder/commit/876c92721ca9d98a898039c4bec1142ec068ac3c))
- cleanup code ([53f68e0](https://github.com/contentful/experience-builder/commit/53f68e06f71fe3315312e1f2721274cc0fb1a6ae))

## [1.4.0](https://github.com/contentful/experience-builder/compare/v1.3.0...v1.4.0) (2024-05-15)

### Features

- **validators:** add optional slotId to component tree node ([6abf9b3](https://github.com/contentful/experience-builder/commit/6abf9b34f7323125bbc02e64f3dbdcc68429f078))

### Bug Fixes

- not generate styles on csr if generated on ssr [SPA-2049] ([#600](https://github.com/contentful/experience-builder/issues/600)) ([149a569](https://github.com/contentful/experience-builder/commit/149a56978043fd799fce5d09b47626f2d414cf93))

## [1.3.0](https://github.com/contentful/experience-builder/compare/v1.2.0...v1.3.0) (2024-05-06)

### Features

- **experiences:** implement layer renaming ([#597](https://github.com/contentful/experience-builder/issues/597)) ([6cde60e](https://github.com/contentful/experience-builder/commit/6cde60e0973e9038ef998f0209223667b4da211d))

### Bug Fixes

- remove check if no margin ([aa1421e](https://github.com/contentful/experience-builder/commit/aa1421edb0ebb03d31f428727239dcab348bbaac))

## [1.2.0](https://github.com/contentful/experience-builder/compare/v1.1.0...v1.2.0) (2024-04-30)

### Features

- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))

## [1.1.0](https://github.com/contentful/experience-builder/compare/v1.0.8...v1.1.0) (2024-04-29)

### Features

- **validators:** add optional displayName to ComponentTreeNode [ALT-780] ([#590](https://github.com/contentful/experience-builder/issues/590)) ([44f51b0](https://github.com/contentful/experience-builder/commit/44f51b01dbd7ee97fc48ae5950812f9e65c263c2))

### Bug Fixes

- **visual-editor:** show canvas hover state in layers tab [ALT-787] ([#587](https://github.com/contentful/experience-builder/issues/587)) ([8541e97](https://github.com/contentful/experience-builder/commit/8541e974b675e5645be6a457ba4d2b6541c372a0))
- **visual-editor:** show hovered component outlines when hovering the layers tab [ALT-673] ([#584](https://github.com/contentful/experience-builder/issues/584)) ([34f0dee](https://github.com/contentful/experience-builder/commit/34f0dee341ac411730885ba060bebbeff2408f52))

## [1.0.8](https://github.com/contentful/experience-builder/compare/v1.0.7...v1.0.8) (2024-04-26)

### Bug Fixes

- fix for preview/delivery mode ([30e0746](https://github.com/contentful/experience-builder/commit/30e07465b0a5f176b68846ad434857d214e1befe))
- use default values for componentValue properties ([53d9f79](https://github.com/contentful/experience-builder/commit/53d9f79f5481fb395acf62ff65bbdce9f9226fc5))

## [1.0.7](https://github.com/contentful/experience-builder/compare/v1.0.6...v1.0.7) (2024-04-25)

### Features

- **components:** add loading attribute to image component ([#577](https://github.com/contentful/experience-builder/issues/577)) ([8115c53](https://github.com/contentful/experience-builder/commit/8115c53a0a7d045f514a5681a24049487f7d1dc6))
- update definitions of fill to use 100% for components ([e29c08e](https://github.com/contentful/experience-builder/commit/e29c08e3a46782b75cc4a85a1541fc1120247089))

### Bug Fixes

- activate original dropzone when moving root-level components [ALT-746] ([#572](https://github.com/contentful/experience-builder/issues/572)) ([7d0a2d8](https://github.com/contentful/experience-builder/commit/7d0a2d859461f3fbbc1b9ba48b6256da2eb691b0))
- **visual-editor:** extra dropzone padding when dragging [ALT-746] ([#575](https://github.com/contentful/experience-builder/issues/575)) ([2bbc88c](https://github.com/contentful/experience-builder/commit/2bbc88c8a7b540763e6f7727463305e574ffaded))

## [1.0.6](https://github.com/contentful/experience-builder/compare/v1.0.5...v1.0.6) (2024-04-18)

### Bug Fixes

- don't track errors thrown from imported components ([070360f](https://github.com/contentful/experience-builder/commit/070360f1910c73ba0c81e2d24b9c64fb812cdf32))
- **visual-editor:** allow first and last root dropzones to activate when moving components [ALT-746] ([#571](https://github.com/contentful/experience-builder/issues/571)) ([090181e](https://github.com/contentful/experience-builder/commit/090181e7f923a7146b1dc4af181c2f3c4fb3e02e))

## [1.0.5](https://github.com/contentful/experience-builder/compare/v1.0.4...v1.0.5) (2024-04-16)

### Features

- first draft ([5c9f00d](https://github.com/contentful/experience-builder/commit/5c9f00d744d6499aa83140d60fda780717e60c25))
- make delivery and preview work ([65c45dd](https://github.com/contentful/experience-builder/commit/65c45dd52fd9226c6af356303089391fda59f38e))
- make local override possbible ([b80703d](https://github.com/contentful/experience-builder/commit/b80703dddde977438e2911cfb8270d6440ab27f9))
- test app stuff ([70a582b](https://github.com/contentful/experience-builder/commit/70a582b430e1e7d5f522b0c1c90757cfcbca512f))

### Bug Fixes

- clean up the wrong entry ([cfe24a1](https://github.com/contentful/experience-builder/commit/cfe24a196c65f64d7593dfbc2c74de9bc8e6f12b))
- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))
- unit tests ([7e6fa8a](https://github.com/contentful/experience-builder/commit/7e6fa8a31a9b5bf0354aa1ee59ddaa4c4170c63c))

## [1.0.4](https://github.com/contentful/experience-builder/compare/v1.0.3...v1.0.4) (2024-04-12)

### Bug Fixes

- cleanup ([6f418e1](https://github.com/contentful/experience-builder/commit/6f418e103f141e1345fcf58d453ff2199e07793e))
- linting ([c41896b](https://github.com/contentful/experience-builder/commit/c41896b3d9d8df0093aad7bacce2e02b4832a90f))
- make all fields work for media ([6e2ca86](https://github.com/contentful/experience-builder/commit/6e2ca866bb0f39f80ddf85e48acdb3e360f330c2))
- make deep binding for images work for custom components ([c7577da](https://github.com/contentful/experience-builder/commit/c7577dad9b74404365a420dbb9463d6ae0ac289b))
- remove testing component ([b60a4d2](https://github.com/contentful/experience-builder/commit/b60a4d20a9eb04496b19aa00c5ac735fec619eae))
- review follow up ([97a6a78](https://github.com/contentful/experience-builder/commit/97a6a78a82fbe2646dd0456fa2d9a2c44ee13136))

## [1.0.3](https://github.com/contentful/experience-builder/compare/v1.0.2...v1.0.3) (2024-04-12)

### Features

- add hyperlink to component definition ([6ced4ba](https://github.com/contentful/experience-builder/commit/6ced4ba433cd2c20f481bc890ced665719f70287))

### Bug Fixes

- allow root-level structure components to be reparented into siblings [ALT-561] ([#555](https://github.com/contentful/experience-builder/issues/555)) ([43cc1cb](https://github.com/contentful/experience-builder/commit/43cc1cbb58dcd3a0471925f2abc1bd554e8be981))
- test ([f9f80e9](https://github.com/contentful/experience-builder/commit/f9f80e9f18687da17d4fc3a36d78af63e679e105))

## [1.0.2](https://github.com/contentful/experience-builder/compare/v1.0.1...v1.0.2) (2024-04-04)

### Features

- [SPA-1774] add hyperlink value to schema ([#540](https://github.com/contentful/experience-builder/issues/540)) ([5ce6203](https://github.com/contentful/experience-builder/commit/5ce6203f013fe5dde25d98ba64fa3714cc0565c0))

### Bug Fixes

- **components:** rich text formatting [ALT-585] ([#533](https://github.com/contentful/experience-builder/issues/533)) ([865608d](https://github.com/contentful/experience-builder/commit/865608d26d3a7f63c188c71f81d86ecabea12cbc))
- **visual-editor:** select component when image loads [ALT-646] ([#537](https://github.com/contentful/experience-builder/issues/537)) ([95a9c92](https://github.com/contentful/experience-builder/commit/95a9c9200035f06a943e9c1688757cafccbcb400))

## [1.0.1](https://github.com/contentful/experience-builder/compare/v1.0.0...v1.0.1) (2024-03-29)

### Features

- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))

### Bug Fixes

- **storybook-plugin:** working with the latest SDK on storybook v7 ([#531](https://github.com/contentful/experience-builder/issues/531)) ([8bbe30f](https://github.com/contentful/experience-builder/commit/8bbe30f0ff17c62bbfee7776e330dd7065d2f497))
