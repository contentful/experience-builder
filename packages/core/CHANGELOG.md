# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.0.0 (2025-03-21)

### ⚠ BREAKING CHANGES

- **experiences-sdk-react:** Any existing experiences using the basic components will need to be updated. To
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

- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))

### Features

- "ReadOnlyMode" post message listener ([#722](https://github.com/contentful/experience-builder/issues/722)) ([4f0cf3e](https://github.com/contentful/experience-builder/commit/4f0cf3e28a9568ec61038950bc535160de5c33ca))
- add base carousel component [ALT-1425] ([#842](https://github.com/contentful/experience-builder/issues/842)) ([97c6578](https://github.com/contentful/experience-builder/commit/97c6578c937a4bb2921d3d312f03e0ad386d1eef))
- add borderRadius definition to structure components ([b2117a7](https://github.com/contentful/experience-builder/commit/b2117a703ae8b5ed603e27b481f4764b6e830a1c))
- add borderRadius type for design tokens ([09c12eb](https://github.com/contentful/experience-builder/commit/09c12eb3de0cf683d65a3a4ad0522ba7a3f4d673))
- add cfBorder designTokens resolver ([e5de5e5](https://github.com/contentful/experience-builder/commit/e5de5e5d1023e58c6ab9ae3b1b42581b04e128c6))
- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))
- add experimental components to define components ([#843](https://github.com/contentful/experience-builder/issues/843)) ([21ec5db](https://github.com/contentful/experience-builder/commit/21ec5db2c490c3372595f7162c7095b3dfc4db53))
- add github documentation for the core package ([73419b5](https://github.com/contentful/experience-builder/commit/73419b52b9584a6fbc367ac686473d52fddfae81))
- add isEditorMode param to vanilla js fetchers [] ([#855](https://github.com/contentful/experience-builder/issues/855)) ([e38390d](https://github.com/contentful/experience-builder/commit/e38390dde23c3562c8089944b72f30d1b8b24f48))
- add new cfFlexReverse built in style property ([#789](https://github.com/contentful/experience-builder/issues/789)) ([bb904e1](https://github.com/contentful/experience-builder/commit/bb904e12bbae2418ee847f31f7c5cf4f36d57b2d))
- add sdk feature detection object in core ([de7a1b1](https://github.com/contentful/experience-builder/commit/de7a1b191e3cbfc3c5d8e4b575fa3b847948b3b6))
- add style prop to toggle visibility in component registeration ([4a6caf2](https://github.com/contentful/experience-builder/commit/4a6caf2dc3b489e6e2f30bcf7c499532c7873d20))
- add support for debug mode ([5cea4d0](https://github.com/contentful/experience-builder/commit/5cea4d082aafe3e1215a6615ef89c66cb2e650a7))
- add text design token ([1d3865f](https://github.com/contentful/experience-builder/commit/1d3865ff52414525c0ffa9004f962d6721d7e75b))
- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- added toJSON function in entity store ([#467](https://github.com/contentful/experience-builder/issues/467)) ([7f9a504](https://github.com/contentful/experience-builder/commit/7f9a504dd0169851b77a1aa127f0839426dd3362))
- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))
- adds tooltip defn for heading, text, richtext, button, and image ([887b753](https://github.com/contentful/experience-builder/commit/887b753415d0e6450545e541d8ddfef81fd71e6d))
- allow for optional composite design token values in experiences ([1984043](https://github.com/contentful/experience-builder/commit/1984043762c492cf8d2d2a95223f469401bd7eea))
- allow Link and Array type references as variables ([#685](https://github.com/contentful/experience-builder/issues/685)) ([55292da](https://github.com/contentful/experience-builder/commit/55292daacb8442da3f853748d9708687121c705d))
- allow multiple slots to be defined in a custom component [ALT-416] ([#620](https://github.com/contentful/experience-builder/issues/620)) ([5aff939](https://github.com/contentful/experience-builder/commit/5aff939a7842246767e98ecb48891d1debec37a9))
- changes required for nested patterns rendering and styles [SPA-2475] ([#870](https://github.com/contentful/experience-builder/issues/870)) ([a8135ee](https://github.com/contentful/experience-builder/commit/a8135ee71ccf50adf4ad94c4f1bd9e872bd8736d))
- clicking outside of the edited canvas sends post message to user interface ([6e35c29](https://github.com/contentful/experience-builder/commit/6e35c2904b33027302e83b1d90b8c674e2380527))
- **components:** ability to lock a column span for columns component ([#344](https://github.com/contentful/experience-builder/issues/344)) ([f01c907](https://github.com/contentful/experience-builder/commit/f01c907639ca549a7da48dbfd6279ec2e813fead))
- **components:** add loading attribute to image component ([#577](https://github.com/contentful/experience-builder/issues/577)) ([8115c53](https://github.com/contentful/experience-builder/commit/8115c53a0a7d045f514a5681a24049487f7d1dc6))
- **components:** add new design value to track column wrap ([#338](https://github.com/contentful/experience-builder/issues/338)) ([4707707](https://github.com/contentful/experience-builder/commit/47077072b01a0fcb7ee3da2617a25362688bbbf7))
- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- **components:** column gaps [ALT-279] ([#324](https://github.com/contentful/experience-builder/issues/324)) ([465bd53](https://github.com/contentful/experience-builder/commit/465bd539b2dadc831096c9fba9f89c98e3687a04))
- **components:** column locking [ALT-357] ([#371](https://github.com/contentful/experience-builder/issues/371)) ([36fb2ec](https://github.com/contentful/experience-builder/commit/36fb2ecd00bf7c1263ba5627243a9e574e927e22))
- Container default margin auto [ALT-326] ([#286](https://github.com/contentful/experience-builder/issues/286)) ([16c1acf](https://github.com/contentful/experience-builder/commit/16c1acf05a5553dd31a5ebb04ead6c0a7724de54))
- **content binding redesign - sensible defaults:** add bindingSourceType validations to built in ([e4da1f5](https://github.com/contentful/experience-builder/commit/e4da1f5e6112a9c423f954171f92e075f5d806c7))
- **core:** set background color opacity to 0 by default [ALT-887] ([#713](https://github.com/contentful/experience-builder/issues/713)) ([35242c4](https://github.com/contentful/experience-builder/commit/35242c4ce77b50dc2d1c613f060313805f8cafc5))
- enable rendering of the nested patterns ([#813](https://github.com/contentful/experience-builder/issues/813)) ([46573c4](https://github.com/contentful/experience-builder/commit/46573c43b9380840cb7dec2f61dffefd108131b0))
- experience validator [SPA-1700] ([#348](https://github.com/contentful/experience-builder/issues/348)) ([3c856d0](https://github.com/contentful/experience-builder/commit/3c856d019213a1d8e86489028b18edec80830a20))
- **experience-builder-sdk:** allow delivery mode in editor ([#341](https://github.com/contentful/experience-builder/issues/341)) ([2a3551a](https://github.com/contentful/experience-builder/commit/2a3551ac20cabd8538c6bba198e580852f07059e))
- **experiences-sdk-react:** update basic component IDs with contentful prefix ([#508](https://github.com/contentful/experience-builder/issues/508)) ([0e28c45](https://github.com/contentful/experience-builder/commit/0e28c45e589422574caab08c44bc6099a5cbdb42))
- **experiences:** implement layer renaming ([#597](https://github.com/contentful/experience-builder/issues/597)) ([6cde60e](https://github.com/contentful/experience-builder/commit/6cde60e0973e9038ef998f0209223667b4da211d))
- export deserialize pattern node variables from core package [SPA-2376] ([#751](https://github.com/contentful/experience-builder/issues/751)) ([3c5ff38](https://github.com/contentful/experience-builder/commit/3c5ff381361c81ad544d54cbaf23ff071d1a675d))
- expose entry ID in core entity store ([2806b3e](https://github.com/contentful/experience-builder/commit/2806b3e015e179ecda8401f061aace1b382551bd))
- expose function to define custom breakpoints [SPA-2076] ([#621](https://github.com/contentful/experience-builder/issues/621)) ([4443695](https://github.com/contentful/experience-builder/commit/44436952ecd3c39206484d5fc3e561fb917d8e38))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- introduce rendering cfVisibility in SDK ([d53a8d2](https://github.com/contentful/experience-builder/commit/d53a8d2cf1f810cc0e5587d28abe1c19636fcad5))
- make local override possbible ([b80703d](https://github.com/contentful/experience-builder/commit/b80703dddde977438e2911cfb8270d6440ab27f9))
- new component registration option for editorWrapperWidth [ALT-1358] ([#800](https://github.com/contentful/experience-builder/issues/800)) ([4b1891e](https://github.com/contentful/experience-builder/commit/4b1891ee301f9e1cc073c02ad2fbd77f0de5de75))
- only provide isInExpEditorMode if activated in options [SPA-2607] ([#1008](https://github.com/contentful/experience-builder/issues/1008)) ([3bb6ccb](https://github.com/contentful/experience-builder/commit/3bb6ccba93151e27a629f24274ee7439a9ced561))
- populate pattern nodes for Editor mode in the webapp ([9a1d456](https://github.com/contentful/experience-builder/commit/9a1d45633b62d0e869089d5a1c7e6ba27598ff36))
- **prebinding:** schema updates and rendering of prebinding mappings in delivery mode ([#1014](https://github.com/contentful/experience-builder/issues/1014)) ([53c66f8](https://github.com/contentful/experience-builder/commit/53c66f856189602ef77bdc90d42c4c6822bd9002)), closes [#998](https://github.com/contentful/experience-builder/issues/998) [#1006](https://github.com/contentful/experience-builder/issues/1006) [#1007](https://github.com/contentful/experience-builder/issues/1007)
- remove deprecated types altogether ([49c9858](https://github.com/contentful/experience-builder/commit/49c9858d7b4207c3cf0748566dcb0c09958e42e3))
- resolve entries that are embedded into bound entries [ALT-1368] ([#824](https://github.com/contentful/experience-builder/issues/824)) ([7bba27e](https://github.com/contentful/experience-builder/commit/7bba27e4b93245b8860d1ca4ba9ccaaa52bd43d7))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- test app stuff ([70a582b](https://github.com/contentful/experience-builder/commit/70a582b430e1e7d5f522b0c1c90757cfcbca512f))
- update definitions of fill to use 100% for components ([e29c08e](https://github.com/contentful/experience-builder/commit/e29c08e3a46782b75cc4a85a1541fc1120247089))
- update types for ComponentDefinition variables [ALT-690] ([#850](https://github.com/contentful/experience-builder/issues/850)) ([e015e2b](https://github.com/contentful/experience-builder/commit/e015e2be42606fd0dec4acb72eb08f01b0de5aa2))
- **validators:** new optional validation called bindingSourceType ([1a48f60](https://github.com/contentful/experience-builder/commit/1a48f6023fbe14b3ff2bd81999f0c8ecc48f0475))
- visibiity built in styles ([d736766](https://github.com/contentful/experience-builder/commit/d736766b2606d848f885760a6dec35a2a941097d))

### Bug Fixes

- activate original dropzone when moving root-level components [ALT-746] ([#572](https://github.com/contentful/experience-builder/issues/572)) ([7d0a2d8](https://github.com/contentful/experience-builder/commit/7d0a2d859461f3fbbc1b9ba48b6256da2eb691b0))
- add border radius to image component and make border radius an optional style ([582e40e](https://github.com/contentful/experience-builder/commit/582e40e077192b0e7a07a2358119cb2f4c00c01d))
- add maxWidth to list with design tokens ([876c927](https://github.com/contentful/experience-builder/commit/876c92721ca9d98a898039c4bec1142ec068ac3c))
- add type definitions for outgoing events ([ac1027c](https://github.com/contentful/experience-builder/commit/ac1027c85868897997740e3d10b1ed54fa07a540))
- add types for incoming events ([2d07b38](https://github.com/contentful/experience-builder/commit/2d07b38e5d858b8c8f84101c083f5649480d02c5))
- address review comments ([4ea07ed](https://github.com/contentful/experience-builder/commit/4ea07ed7510b16db78d35cdb306339ab4fec1241))
- adjust auto to Auto so that the design tab is consistent throughout ([81c7f50](https://github.com/contentful/experience-builder/commit/81c7f5071e79e4f7e24df908f5c9ccca8b935b1c))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- allow root-level structure components to be reparented into siblings [ALT-561] ([#555](https://github.com/contentful/experience-builder/issues/555)) ([43cc1cb](https://github.com/contentful/experience-builder/commit/43cc1cbb58dcd3a0471925f2abc1bd554e8be981))
- assemblies incorrectly rendered on initial drop [ALT-1220] ([#742](https://github.com/contentful/experience-builder/issues/742)) ([fbf3d88](https://github.com/contentful/experience-builder/commit/fbf3d889e0a57b2f654bf45d78c2acbfd05af7e1))
- assume not matching breakpoints and initialise correctly in the effect ([96c734a](https://github.com/contentful/experience-builder/commit/96c734a4b73630e2fd6a45fc9c0ae7b0778edd2b))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- case name of typing ([3b238c1](https://github.com/contentful/experience-builder/commit/3b238c121e3bc27f5641996da45f87706d533b09))
- change default border style color to 0px width ([#238](https://github.com/contentful/experience-builder/issues/238)) ([f067000](https://github.com/contentful/experience-builder/commit/f0670000b73a562127d26eae0ee3f13e27b7781f))
- change default Margin value back to 0 on all sides [ALT-1388] ([#818](https://github.com/contentful/experience-builder/issues/818)) ([129553e](https://github.com/contentful/experience-builder/commit/129553e53c8ef41dab551e4d38b5d28e017240c1))
- change image object fit to default to undefined instead of none ([#502](https://github.com/contentful/experience-builder/issues/502)) ([46a7e94](https://github.com/contentful/experience-builder/commit/46a7e9474dec15ef1ea30111f28619c09d5a9f3c))
- change visual-sdk to build tooling of monorepo ([edf0991](https://github.com/contentful/experience-builder/commit/edf0991cc44f07429047a86a71baa950d7255ef8))
- change width calc ([43d1533](https://github.com/contentful/experience-builder/commit/43d15332624c206db90f1ae956b8239353b28f88))
- cleanup ([6f418e1](https://github.com/contentful/experience-builder/commit/6f418e103f141e1345fcf58d453ff2199e07793e))
- columns uses incorrect default value ([#782](https://github.com/contentful/experience-builder/issues/782)) ([f3fb9a4](https://github.com/contentful/experience-builder/commit/f3fb9a48c9672982498ae4eb0d5ce604bda3c84f))
- **components:** change default of structure component margins to 0 ([#479](https://github.com/contentful/experience-builder/issues/479)) ([756eadb](https://github.com/contentful/experience-builder/commit/756eadbd8ed64f4b0b9018e6a16799960d9f0ae2))
- convert protocol agnostic image asset url to https [ALT-639] ([#499](https://github.com/contentful/experience-builder/issues/499)) ([4503cb2](https://github.com/contentful/experience-builder/commit/4503cb21914d85583ee9c05ca17c657958a4d494))
- core README to be more compliant with Contenetful's technical writing guidelines ([21ac522](https://github.com/contentful/experience-builder/commit/21ac522fd8a60ca5f9e09d1e6025399e54e406ba))
- **core:** add design token fallback values besed on default values in builtInStyles [ALT-200] ([#232](https://github.com/contentful/experience-builder/issues/232)) ([37e8feb](https://github.com/contentful/experience-builder/commit/37e8feb5361a7c1074da7bbc4e59736d21220d2b))
- **core:** add line height and letter spacing to DesignTokensDefinition [ALT-248] ([#233](https://github.com/contentful/experience-builder/issues/233)) ([1a44c44](https://github.com/contentful/experience-builder/commit/1a44c447e2b102feb147645b8bc1796acd60793d))
- **core:** enable design tokens for text color style [ALT-249] ([#244](https://github.com/contentful/experience-builder/issues/244)) ([81f5a27](https://github.com/contentful/experience-builder/commit/81f5a27acaa3815b381b2d114766f892bc1c764b))
- **core:** enabling design tokens for font size [ALT-245] ([#227](https://github.com/contentful/experience-builder/issues/227)) ([d4d8e15](https://github.com/contentful/experience-builder/commit/d4d8e15231230d89a1c139976c4ea66ea020db34))
- **core:** expect image quality to be a string with a percentage [ALT-643] ([#504](https://github.com/contentful/experience-builder/issues/504)) ([e9e0345](https://github.com/contentful/experience-builder/commit/e9e03455b2a0b5ed1d0cd4eeea09f84fc2e42179))
- **core:** export new type for ComponentDefinitionVariableTypeMap [ALT-690] ([#856](https://github.com/contentful/experience-builder/issues/856)) ([125f670](https://github.com/contentful/experience-builder/commit/125f67039e639fa30b0ce2165057e88eb420884c))
- **core:** remove lodash dep to get rid of weird reference errors ([#272](https://github.com/contentful/experience-builder/issues/272)) ([5957b18](https://github.com/contentful/experience-builder/commit/5957b183c943d060b30e6f9d260196e3c3d91203))
- **core:** resolving design values [ALT-1222] ([#744](https://github.com/contentful/experience-builder/issues/744)) ([93c9cc5](https://github.com/contentful/experience-builder/commit/93c9cc509f6e653b6bb4faaa44cb1f600b23fa3e))
- default value for container margin to be auto left/right ([#726](https://github.com/contentful/experience-builder/issues/726)) [ALT-1166] ([1344f8f](https://github.com/contentful/experience-builder/commit/1344f8f113940a52d5d3f33cc831918dc78948a2))
- default width to 100% when component doesn't have a width variable [ALT-956] ([#775](https://github.com/contentful/experience-builder/issues/775)) ([be9eed3](https://github.com/contentful/experience-builder/commit/be9eed3b4f1816691c623f44b7266d56e1761ab4))
- design tokens event payload ([a81964b](https://github.com/contentful/experience-builder/commit/a81964bc6c50a0c53a648b454ae8c0df4b38be1f))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- detect loops in fetchers and preview renderer ([da04623](https://github.com/contentful/experience-builder/commit/da046233388feaf38a383e7130add5d201e8ff21))
- dont crash the application when a deep-binding was not found but fall back to default value ([52977ba](https://github.com/contentful/experience-builder/commit/52977ba9df569fd721ee87b54657fd18fa81f0d1))
- dont ignore falsy breakpoint values ([8e3fb2e](https://github.com/contentful/experience-builder/commit/8e3fb2ebe1e5622c0fd665fcac89cfdf9482ba77))
- dont suppress errors in SDK code but only custom code ([5f3fa19](https://github.com/contentful/experience-builder/commit/5f3fa1994bba392c6f39ea4ade411dc4c6352660))
- drop circular reference in JSON for usedComponents ([ceb923b](https://github.com/contentful/experience-builder/commit/ceb923bfc6be19a4359c78097c887b4a7bc2bbcb))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))
- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder/commit/3e37f1518112c993456e08f74013c8a065b370fd))
- **experiences:** proper handling of reparenting off canvas ([#460](https://github.com/contentful/experience-builder/issues/460)) ([9808cfc](https://github.com/contentful/experience-builder/commit/9808cfcdae03ad6c3fee7e3bb9278db06e179467))
- export individual payload types ([2dd4e2e](https://github.com/contentful/experience-builder/commit/2dd4e2e38321843c93c1dd8de109b682ed854a34))
- extend validators to validate component registration on editor mode ([f0dda61](https://github.com/contentful/experience-builder/commit/f0dda6178e3b81ecdcd2b1d530b854117fdd6df0))
- fetch all referenced entities ([#507](https://github.com/contentful/experience-builder/issues/507)) ([099dcd6](https://github.com/contentful/experience-builder/commit/099dcd66884ea43edc5ff954dfe5a1f82b11df42))
- fetch all references with includes ([#519](https://github.com/contentful/experience-builder/issues/519)) ([962f70b](https://github.com/contentful/experience-builder/commit/962f70bc129408ba93a1d5550a3a9601a3dd63ea))
- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- handle missing linkType property ([#237](https://github.com/contentful/experience-builder/issues/237)) ([1827d96](https://github.com/contentful/experience-builder/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))
- hover outlines and default border style [ALT-323] ([#476](https://github.com/contentful/experience-builder/issues/476)) ([0378c6d](https://github.com/contentful/experience-builder/commit/0378c6d7499e9bdea6bedd632a9444dcde712984))
- hyperlinks to assets or entries should resolve in a rich text variable [ALT-1493] ([#873](https://github.com/contentful/experience-builder/issues/873)) ([9ad696f](https://github.com/contentful/experience-builder/commit/9ad696f1bf921aafff547c0df0d414c7b06ebfc8))
- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))
- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))
- isComponentAllowedOnRoot logic to allow patterns to be reparented at the root level ([34c8697](https://github.com/contentful/experience-builder/commit/34c86975c1576fe24530fdf004ce7443f31c83ed))
- let visibility display style take precedence when toggled ([1ddd81a](https://github.com/contentful/experience-builder/commit/1ddd81a837e4fe50b6bdb96228c2dbdb8d5f143d))
- lint ([35f6f38](https://github.com/contentful/experience-builder/commit/35f6f38804c0861efa7c45741d677628eba9b6a4))
- make all fields work for media ([6e2ca86](https://github.com/contentful/experience-builder/commit/6e2ca866bb0f39f80ddf85e48acdb3e360f330c2))
- make data required ([36805ff](https://github.com/contentful/experience-builder/commit/36805ff910cc3065d7f3ec855757df1260843134))
- make deep binding for images work for custom components ([c7577da](https://github.com/contentful/experience-builder/commit/c7577dad9b74404365a420dbb9463d6ae0ac289b))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))
- merge conflict in columns style type ([905add3](https://github.com/contentful/experience-builder/commit/905add3870c3e1d4390680c62b762cf03b09a2e6))
- mobile falls back to tablet style for token-enabled props ([0e1aa02](https://github.com/contentful/experience-builder/commit/0e1aa0214d69f7e388ee2b44e009570efe081e8a))
- move active and fallback breakpoint index inside resolveDesignValue ([7caa96e](https://github.com/contentful/experience-builder/commit/7caa96e48906dfb9fdebca9a290e5f3295481345))
- moving to json to its base class ([#471](https://github.com/contentful/experience-builder/issues/471)) ([9d276bb](https://github.com/contentful/experience-builder/commit/9d276bb87557623c7e9a8597a26a6ac50657e65b))
- only fallback for not defined breakpoint values ([100fd98](https://github.com/contentful/experience-builder/commit/100fd98b40bf813bac3434f5ad04ffe74fbde124))
- only have default background color for components that need to have them ([e4062e0](https://github.com/contentful/experience-builder/commit/e4062e059571111cd937ee3b46bd358596f09580))
- override browser hr border style + set default background color [ALT-1281] ([#777](https://github.com/contentful/experience-builder/issues/777)) ([b0fd86d](https://github.com/contentful/experience-builder/commit/b0fd86d00c53f2f51e231544b6fff3a2122ef45d))
- readd generic type ([05762a7](https://github.com/contentful/experience-builder/commit/05762a7993a927a8240c807e681d850b4be40bcb))
- remove check if no margin ([aa1421e](https://github.com/contentful/experience-builder/commit/aa1421edb0ebb03d31f428727239dcab348bbaac))
- remove error when breakpoints are not defined ([15c82c2](https://github.com/contentful/experience-builder/commit/15c82c24be4a326a80ae60e78b818cc372d57ef3))
- remove typo and rename utility to resolveDeepUsedComponents ([4733def](https://github.com/contentful/experience-builder/commit/4733def022bdd4e382ec997545ed8330dcec2952))
- rename editorWrapperWidth option to wrapContainerWidth [ALT-1358] ([#801](https://github.com/contentful/experience-builder/issues/801)) ([93425ea](https://github.com/contentful/experience-builder/commit/93425ea662c0fe129e47f78036190d20b1106a21))
- replace circular self reference with link ([4842536](https://github.com/contentful/experience-builder/commit/4842536b99531b9a2c1e60e6a1558d246a0e745a))
- resolve fetched entities for experiences [ALT-1146] ([#754](https://github.com/contentful/experience-builder/issues/754)) ([e475e62](https://github.com/contentful/experience-builder/commit/e475e62eb7fdee66e36b52c4a3076cb9503a9918))
- resolving component values for nested pattern nodes [SPA-2586] ([#982](https://github.com/contentful/experience-builder/issues/982)) ([270aced](https://github.com/contentful/experience-builder/commit/270aced5504818402cf7e3ef7d073c2c62b99ac3))
- resync on first pass ([#979](https://github.com/contentful/experience-builder/issues/979)) ([8c42407](https://github.com/contentful/experience-builder/commit/8c424072fe7cca45c96c85bffbb4427f1dc5afca))
- reuse circular check for fetchById ([787ec66](https://github.com/contentful/experience-builder/commit/787ec667e9f7e3f59771ed00ab4cd01b0f4e0d74))
- revert type for validation option values [ALT-690] ([#862](https://github.com/contentful/experience-builder/issues/862)) ([62475da](https://github.com/contentful/experience-builder/commit/62475da7d4648b987c7beb904752440300883d69))
- review follow up ([97a6a78](https://github.com/contentful/experience-builder/commit/97a6a78a82fbe2646dd0456fa2d9a2c44ee13136))
- revised buildCfStyles and add useComponentProps tests [ALT-1293] ([#779](https://github.com/contentful/experience-builder/issues/779)) ([4b9346f](https://github.com/contentful/experience-builder/commit/4b9346f6aec4e074abfd2526eb42fec61dd2672c))
- set default cfHeight to fit-content [ALT-448] ([#373](https://github.com/contentful/experience-builder/issues/373)) ([67fb7d8](https://github.com/contentful/experience-builder/commit/67fb7d87d51979077a00194ae6ad85e505964db7))
- simplify width logic ([37c65d5](https://github.com/contentful/experience-builder/commit/37c65d538309f04de2374d75652b180c4d4ee673))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- ssr styles extraction for editable patterns [SPA-2157] ([#707](https://github.com/contentful/experience-builder/issues/707)) ([65ec4bb](https://github.com/contentful/experience-builder/commit/65ec4bb89b0657d899cd22493381dc1bf835d7f9))
- ssr styles for cf visibility ([c200a15](https://github.com/contentful/experience-builder/commit/c200a15f85cb4dd58496c48869b7ce24aa5565fd))
- **ssr-styles:** consider breakpoint ID for hash generation [SPA-2599] ([#993](https://github.com/contentful/experience-builder/issues/993)) ([8f96b7d](https://github.com/contentful/experience-builder/commit/8f96b7d3057aae66b19e3724be112263027d706d))
- target width now applies the background image url css properly ([65d24c8](https://github.com/contentful/experience-builder/commit/65d24c83b9dd9c24a904e9968c116b9cf326000c))
- test-apps mobile breakpoint [ALT-1167] ([#725](https://github.com/contentful/experience-builder/issues/725)) ([258f5aa](https://github.com/contentful/experience-builder/commit/258f5aa7932162257f14cdca3a81a762ae9df8c0))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- tidy up ([a212287](https://github.com/contentful/experience-builder/commit/a212287cffd2e27f490cef6cd8e12b7a0fec96a1))
- type error when breakpoint is undefined ([64d0aa8](https://github.com/contentful/experience-builder/commit/64d0aa842c76b0c1a5abbbfaf08ced5f86133de7))
- types export from core package ([8d57a97](https://github.com/contentful/experience-builder/commit/8d57a9750fdb9f6033e63e1e63738fdb342a5ebb))
- typos and dont crash on reload due to race condition in mode detection ([f16f709](https://github.com/contentful/experience-builder/commit/f16f7098986f0233d75b70ff09ef50f1abbee257))
- unused import lint errors ([1f8338d](https://github.com/contentful/experience-builder/commit/1f8338d325d403fa9667dc5ee867e44bb8186d68))
- update background related fields to have display names of Background image and Background color ([84aecb4](https://github.com/contentful/experience-builder/commit/84aecb4cfcd4a51a29c9444d02686fa35254f30a))
- update component tooltips to use component term instead of elements ([25db0e2](https://github.com/contentful/experience-builder/commit/25db0e2936eba1ea00a8ab0d5ae4318488243558))
- update design token breakpoint parsing logic to work with spaced out dt keys ([bab0d61](https://github.com/contentful/experience-builder/commit/bab0d61339becee1b5759306fa73ec9cf777e895))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))
- use const types and update property descriptions [] ([#1019](https://github.com/contentful/experience-builder/issues/1019)) ([7e3b57f](https://github.com/contentful/experience-builder/commit/7e3b57f378654058e0103bc5c02e5aa08d95b09b))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- use the correct description for hyperlink behaviour property ([56fb4fe](https://github.com/contentful/experience-builder/commit/56fb4fe44ecf1e2151835543cbd45bab3c196c5d))
- use unique set of IDs for fetching entries and assets ([3a2408b](https://github.com/contentful/experience-builder/commit/3a2408bb1d2997c435c027b3c78092ecb4127dfb))
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))
- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))
- width applied to both wrapping div and img [ALT-1293] ([#778](https://github.com/contentful/experience-builder/issues/778)) ([e0d12f6](https://github.com/contentful/experience-builder/commit/e0d12f60b18575b50bb742ce0916adad2d0a5ff1))

### Reverts

- Revert "fix: resolve fetched entities for experiences [ALT-1146] (#754)" (#767) ([9ba8a3b](https://github.com/contentful/experience-builder/commit/9ba8a3b3826ae50002984f2770aa0e94202c429a)), closes [#754](https://github.com/contentful/experience-builder/issues/754) [#767](https://github.com/contentful/experience-builder/issues/767)
- Revert "fix: fetch all referenced entities (#507)" (#515) ([2b376f6](https://github.com/contentful/experience-builder/commit/2b376f6f1b6ab63e46c3f62affea0621af33e698)), closes [#507](https://github.com/contentful/experience-builder/issues/507) [#515](https://github.com/contentful/experience-builder/issues/515)
- Revert "chore: Update packages/core/src/fetchers/fetchBySlug.ts" ([d937add](https://github.com/contentful/experience-builder/commit/d937add2cbf4a40d38ae0b92f82127f94aefebf6))
- Revert "fix: typing errors" ([4a333e0](https://github.com/contentful/experience-builder/commit/4a333e00689f75f11fb26a200bb9a9ff78289e4d))

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
