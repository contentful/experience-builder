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
- **experience-builder-sdk:** make returned experience reactive to props [] (#161)
- Registered components will be wrapped with a div container by default. The `wrapComponent` option can be used when registering components to opt-out of this behavior if necessary.

- feat!(components): image component and background image use ctfl asset api for optimized images ([dbcbac0](https://github.com/contentful/experience-builder/commit/dbcbac0f6e195a00206ec6a1eb94a2dc20af904a))

### Features

- "ReadOnlyMode" post message listener ([#722](https://github.com/contentful/experience-builder/issues/722)) ([4f0cf3e](https://github.com/contentful/experience-builder/commit/4f0cf3e28a9568ec61038950bc535160de5c33ca))
- [SPA-1522] send also the margins with the coordinates ([#149](https://github.com/contentful/experience-builder/issues/149)) ([4ef60ba](https://github.com/contentful/experience-builder/commit/4ef60baf75ce5ed0ad84bb1d260714233afe14eb))
- [SPA-1574] add media type and handle it ([#168](https://github.com/contentful/experience-builder/issues/168)) ([7fe96c3](https://github.com/contentful/experience-builder/commit/7fe96c3f3e89db1208e787d06c7291765ee18c19))
- add base carousel component [ALT-1425] ([#842](https://github.com/contentful/experience-builder/issues/842)) ([97c6578](https://github.com/contentful/experience-builder/commit/97c6578c937a4bb2921d3d312f03e0ad386d1eef))
- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))
- add github documentation for the sdk package ([139d35e](https://github.com/contentful/experience-builder/commit/139d35e7e8b435ebdd5a3eb4c4dd51d6db0a7d42))
- add isEditorMode param to vanilla js fetchers [] ([#855](https://github.com/contentful/experience-builder/issues/855)) ([e38390d](https://github.com/contentful/experience-builder/commit/e38390dde23c3562c8089944b72f30d1b8b24f48))
- add new constant and remove unused variables [SPA-1605] ([#163](https://github.com/contentful/experience-builder/issues/163)) ([bdd6a08](https://github.com/contentful/experience-builder/commit/bdd6a086d0f107eae55b3bc519a7ed8f70b489b0))
- add nextjs marketing demo app to list of cli templates [ALT-1265] ([#761](https://github.com/contentful/experience-builder/issues/761)) ([2419c7a](https://github.com/contentful/experience-builder/commit/2419c7a83a3cae091269f18875a75926f069bcd9))
- add sdk feature detection object in core ([de7a1b1](https://github.com/contentful/experience-builder/commit/de7a1b191e3cbfc3c5d8e4b575fa3b847948b3b6))
- add sdk ui version has available feature ([#638](https://github.com/contentful/experience-builder/issues/638)) ([cca038d](https://github.com/contentful/experience-builder/commit/cca038d66ee6158c3f7604d8193a83ffb2a9d6e5))
- add style prop to toggle visibility in component registeration ([4a6caf2](https://github.com/contentful/experience-builder/commit/4a6caf2dc3b489e6e2f30bcf7c499532c7873d20))
- add support for debug mode ([5cea4d0](https://github.com/contentful/experience-builder/commit/5cea4d082aafe3e1215a6615ef89c66cb2e650a7))
- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- add watch command to npm build command for hot reload development ([0e3de5e](https://github.com/contentful/experience-builder/commit/0e3de5ef9ea4e0db7e311a73e48c854f93e36e8b))
- adds design token resultion for cfGap, cfWidth, cfHeight, and cfBackgroundColor ([ab747e5](https://github.com/contentful/experience-builder/commit/ab747e5eba2c4ad98290f551105a41c49e3c4395))
- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))
- allow for optional composite design token values in experiences ([1984043](https://github.com/contentful/experience-builder/commit/1984043762c492cf8d2d2a95223f469401bd7eea))
- allow multiple slots to be defined in a custom component [ALT-416] ([#620](https://github.com/contentful/experience-builder/issues/620)) ([5aff939](https://github.com/contentful/experience-builder/commit/5aff939a7842246767e98ecb48891d1debec37a9))
- allow users to drop new components onto canvas ([6c24fc3](https://github.com/contentful/experience-builder/commit/6c24fc35a828a07bb1c3e330d1edbcc3d1f5f6cd))
- change container defaults ([9a9afeb](https://github.com/contentful/experience-builder/commit/9a9afeba07a1f3b6d400023eec5ceca724a68837))
- changes required for nested patterns rendering and styles [SPA-2475] ([#870](https://github.com/contentful/experience-builder/issues/870)) ([a8135ee](https://github.com/contentful/experience-builder/commit/a8135ee71ccf50adf4ad94c4f1bd9e872bd8736d))
- Experience builder monorepo setup [SPA-1395] ([#141](https://github.com/contentful/experience-builder/issues/141)) ([a183719](https://github.com/contentful/experience-builder/commit/a1837192f366f09a09538c4bbfb992fffcc5a916))
- experience validator [SPA-1700] ([#348](https://github.com/contentful/experience-builder/issues/348)) ([3c856d0](https://github.com/contentful/experience-builder/commit/3c856d019213a1d8e86489028b18edec80830a20))
- **experience-builder-sdk:** allow delivery mode in editor ([#341](https://github.com/contentful/experience-builder/issues/341)) ([2a3551a](https://github.com/contentful/experience-builder/commit/2a3551ac20cabd8538c6bba198e580852f07059e))
- **experience-builder-sdk:** make returned experience reactive to props [] ([#161](https://github.com/contentful/experience-builder/issues/161)) ([02f1739](https://github.com/contentful/experience-builder/commit/02f1739bd1043729a5abbd75ec574eea621e525b))
- **experience-builder-sdk:** use visual editor package ([#169](https://github.com/contentful/experience-builder/issues/169)) ([7477225](https://github.com/contentful/experience-builder/commit/74772256690b031cb3d8a57b34b23ce6935422fe))
- **experiences-sdk-react:** update basic component IDs with contentful prefix ([#508](https://github.com/contentful/experience-builder/issues/508)) ([0e28c45](https://github.com/contentful/experience-builder/commit/0e28c45e589422574caab08c44bc6099a5cbdb42))
- export version in Experiences SDK ([#847](https://github.com/contentful/experience-builder/issues/847)) ([941b45c](https://github.com/contentful/experience-builder/commit/941b45cc637cc528f75d6fbe236492f1509d783d))
- expose function to define custom breakpoints [SPA-2076] ([#621](https://github.com/contentful/experience-builder/issues/621)) ([4443695](https://github.com/contentful/experience-builder/commit/44436952ecd3c39206484d5fc3e561fb917d8e38))
- fallback for design component values in preview mode ([e626e12](https://github.com/contentful/experience-builder/commit/e626e1273d6bc1c92f47796a1cef1e3f7a353dc0))
- first draft ([5c9f00d](https://github.com/contentful/experience-builder/commit/5c9f00d744d6499aa83140d60fda780717e60c25))
- handle bindings for design components [SPA-1606] ([#167](https://github.com/contentful/experience-builder/issues/167)) ([3eb7bb5](https://github.com/contentful/experience-builder/commit/3eb7bb5b05ccb6057d8834c9a0bc9718b90faf50))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- improve logs for example using a consistent prefix ([#207](https://github.com/contentful/experience-builder/issues/207)) ([96c306d](https://github.com/contentful/experience-builder/commit/96c306d23ac546c6b7bf6f425b434a9517f99b6f))
- increase the timeout for editor entity store to avoid data loss ([#212](https://github.com/contentful/experience-builder/issues/212)) ([844a1ad](https://github.com/contentful/experience-builder/commit/844a1adf9c0ed33d91c76bd3c9a01680adea906b))
- initialization code for injectable editor ([6f49c40](https://github.com/contentful/experience-builder/commit/6f49c40ce9345dc1f6e41f64f36af8f6266f8066))
- initialize sustainable entity store ([#200](https://github.com/contentful/experience-builder/issues/200)) ([b136abf](https://github.com/contentful/experience-builder/commit/b136abf860a7c90de072e18d69652e2b4fc65956))
- inject user defined layout styling through component definition ([9d18ed6](https://github.com/contentful/experience-builder/commit/9d18ed68a82c6ece4c162ed764313837a178f1b7))
- make delivery and preview work ([65c45dd](https://github.com/contentful/experience-builder/commit/65c45dd52fd9226c6af356303089391fda59f38e))
- **prebinding:** schema updates and rendering of prebinding mappings in delivery mode ([#1014](https://github.com/contentful/experience-builder/issues/1014)) ([53c66f8](https://github.com/contentful/experience-builder/commit/53c66f856189602ef77bdc90d42c4c6822bd9002)), closes [#998](https://github.com/contentful/experience-builder/issues/998) [#1006](https://github.com/contentful/experience-builder/issues/1006) [#1007](https://github.com/contentful/experience-builder/issues/1007)
- register toolkit components and include wrap container by default [ALT-115] ([#175](https://github.com/contentful/experience-builder/issues/175)) ([1097764](https://github.com/contentful/experience-builder/commit/1097764e33fa0a5a5b89007b04d0cf5f18d6d71e))
- render design component values in preview mode ([9d692ba](https://github.com/contentful/experience-builder/commit/9d692ba2c513da6e636c68be1e7c98857d84b529))
- render design component within an experience [SPA-1583] ([#151](https://github.com/contentful/experience-builder/issues/151)) ([cb4a38a](https://github.com/contentful/experience-builder/commit/cb4a38a3fbf75f8c4773ff95b203a11ae12220bc))
- resolve css variables in experiences ([9180d23](https://github.com/contentful/experience-builder/commit/9180d238a890870dffffb364b6ab88bab70b09e7))
- resolve design tokens for row and column gap ([0b5d122](https://github.com/contentful/experience-builder/commit/0b5d122a10b01438bd014038665597b97f0cb807))
- resolve entries that are embedded into bound entries [ALT-1368] ([#824](https://github.com/contentful/experience-builder/issues/824)) ([7bba27e](https://github.com/contentful/experience-builder/commit/7bba27e4b93245b8860d1ca4ba9ccaaa52bd43d7))
- resolves the design token values ([2b2936a](https://github.com/contentful/experience-builder/commit/2b2936aae773859bbed4f6c265f51e6e2c48393e))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- support ssr [SPA-1435] ([#136](https://github.com/contentful/experience-builder/issues/136)) ([6cec574](https://github.com/contentful/experience-builder/commit/6cec574d82bd2c9471f0caef7179979fdcee3236))
- update types for ComponentDefinition variables [ALT-690] ([#850](https://github.com/contentful/experience-builder/issues/850)) ([e015e2b](https://github.com/contentful/experience-builder/commit/e015e2be42606fd0dec4acb72eb08f01b0de5aa2))
- updates rich text component definition to hold default stylings rather than using css modules ([7ddf6ed](https://github.com/contentful/experience-builder/commit/7ddf6ed7748f383cdc6776ec68200c15500d16bf))

### Bug Fixes

- add divider to list of optionalBuiltInComponents ([#788](https://github.com/contentful/experience-builder/issues/788)) ([8f94448](https://github.com/contentful/experience-builder/commit/8f94448d491f80bdfda9b3b8a70eebcf8bff6425))
- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))
- add tests for useBreakpoints ([f91feee](https://github.com/contentful/experience-builder/commit/f91feeeef23222822af8cac9c5d28da6232c5102))
- address pr comments ([5d91d47](https://github.com/contentful/experience-builder/commit/5d91d47e45130bb56070412b704236bdd5c80a59))
- address review comments ([4ea07ed](https://github.com/contentful/experience-builder/commit/4ea07ed7510b16db78d35cdb306339ab4fec1241))
- adjust code to latest prettier config ([94c546a](https://github.com/contentful/experience-builder/commit/94c546a3433b95828e7c1540722dcb092b0979e5))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow children variable on components with no children nodes [ALT-636] ([#509](https://github.com/contentful/experience-builder/issues/509)) ([bf8aea4](https://github.com/contentful/experience-builder/commit/bf8aea487f4f700ff0915b49667bb026986f4f4d))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- allow ExperienceRoot to render editor mode when entry first created [ALT-104] ([d69d5da](https://github.com/contentful/experience-builder/commit/d69d5dabd448929164ab37a93bdab8122fbfe899))
- allow experiences-sdk-react components/hooks to be imported in NextJS server components ([#667](https://github.com/contentful/experience-builder/issues/667)) ([ee5ef2b](https://github.com/contentful/experience-builder/commit/ee5ef2b7f76f64868827ed2d5fa2852656f74ceb))
- build scripts with new entity store ([be0349a](https://github.com/contentful/experience-builder/commit/be0349a7beaed235d2ac0e8b930e4fd4adf42166))
- calculate component client rect via children ([#196](https://github.com/contentful/experience-builder/issues/196)) ([e7d537e](https://github.com/contentful/experience-builder/commit/e7d537eea09b5d7e6442699a70bc27d52f3e2a8d))
- change types reference to core ([51b3ec7](https://github.com/contentful/experience-builder/commit/51b3ec7230acd4da74df33350d9cd82e3aa6dbb9))
- clean up the wrong entry ([cfe24a1](https://github.com/contentful/experience-builder/commit/cfe24a196c65f64d7593dfbc2c74de9bc8e6f12b))
- cleanup code ([53f68e0](https://github.com/contentful/experience-builder/commit/53f68e06f71fe3315312e1f2721274cc0fb1a6ae))
- container default sizing height to fit all children [] ([#146](https://github.com/contentful/experience-builder/issues/146)) ([d301fe8](https://github.com/contentful/experience-builder/commit/d301fe827f2d895c10ca94370b80895d311c3dc1))
- correctly retrieve the url from the bound asset in preview/delivery ([#152](https://github.com/contentful/experience-builder/issues/152)) ([cb36d40](https://github.com/contentful/experience-builder/commit/cb36d40ee87d5d6cc11e2b099cb5490429567523))
- design token logic breaks auto height for empty containers ([#210](https://github.com/contentful/experience-builder/issues/210)) ([901bf67](https://github.com/contentful/experience-builder/commit/901bf67c6f7e3fb1a6b968b7fbb26b27d302f13b))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- detect loops in fetchers and preview renderer ([da04623](https://github.com/contentful/experience-builder/commit/da046233388feaf38a383e7130add5d201e8ff21))
- do not attempt to send components via postMessage ([#510](https://github.com/contentful/experience-builder/issues/510)) ([f0b1498](https://github.com/contentful/experience-builder/commit/f0b1498b56d6c0be5aaeefbbf18ee5e7919e704a))
- don't add client object to fetchBy dependency arrays to fix infinite rerenders ([#830](https://github.com/contentful/experience-builder/issues/830)) ([9873919](https://github.com/contentful/experience-builder/commit/9873919b3b59c121a2f6c7b8cbd6e23a262820e6))
- don't spread props meant for custom components onto plain html wrapping elements ([#898](https://github.com/contentful/experience-builder/issues/898)) ([ba7ba90](https://github.com/contentful/experience-builder/commit/ba7ba9030d79233cb02e545147bb2e4150dbcc53)), closes [#899](https://github.com/contentful/experience-builder/issues/899)
- don't track errors thrown from imported components ([070360f](https://github.com/contentful/experience-builder/commit/070360f1910c73ba0c81e2d24b9c64fb812cdf32))
- dont initialise entity store on every render by using state [SPA-1711] ([#208](https://github.com/contentful/experience-builder/issues/208)) ([b04f44b](https://github.com/contentful/experience-builder/commit/b04f44bae930df18ee53c74754f40ddb2bca2fbe))
- dont recreate mediaQuery matchers on every render ([#968](https://github.com/contentful/experience-builder/issues/968)) ([5c29618](https://github.com/contentful/experience-builder/commit/5c296182ed497d7c713f475b8ec67ee05a9cef2a))
- dont send pattern definitions to the editor ([#983](https://github.com/contentful/experience-builder/issues/983)) ([0c4a4ec](https://github.com/contentful/experience-builder/commit/0c4a4ec46767876f16e9d199176982ddb7f40f48))
- dont show warning about alien message, don't render invalid attributes [] ([#170](https://github.com/contentful/experience-builder/issues/170)) ([e52ab8d](https://github.com/contentful/experience-builder/commit/e52ab8d0861f1d9c751922d018f17980d002a37a))
- ease exp entry validation [] ([#147](https://github.com/contentful/experience-builder/issues/147)) ([cbe3cd9](https://github.com/contentful/experience-builder/commit/cbe3cd9d27d87e2ce2b5439fbc7dd58bb1ff9383))
- empty container highlight on hover ([4501be2](https://github.com/contentful/experience-builder/commit/4501be237704ea53cd7ea4bea3ccab92dc69668f))
- enable typography styles on the default Text component [ALT-144] ([#202](https://github.com/contentful/experience-builder/issues/202)) ([ec89fc3](https://github.com/contentful/experience-builder/commit/ec89fc3f888d216decfb925ebd71aff96af592c0))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- exclude any node_modules from being included in the bundle ([1bf2682](https://github.com/contentful/experience-builder/commit/1bf26820b7d6205331dc1dd72a127017743561b3))
- **experience-builder-sdk:** export ComponentDefintion ([#243](https://github.com/contentful/experience-builder/issues/243)) ([b74d292](https://github.com/contentful/experience-builder/commit/b74d2927575cc10dcd4bb7e4800c47b979d7e15b))
- **experience-builder-sdk:** export ExternalSDKMode and EntityStore types [] ([#156](https://github.com/contentful/experience-builder/issues/156)) ([32a50a8](https://github.com/contentful/experience-builder/commit/32a50a81d669506837caef3e653332ae84a35f76))
- **experience-builder-sdk:** fix dragProps for Assembly wrapper [ALT-1064] ([#701](https://github.com/contentful/experience-builder/issues/701)) ([0632f7b](https://github.com/contentful/experience-builder/commit/0632f7b1dbf8ac3ae744f3391b64e0541eccdcf7))
- **experience-builder-sdk:** SSR classNames not being attached to components rendered in SSR [ZEND-5755] ([#874](https://github.com/contentful/experience-builder/issues/874)) ([bded854](https://github.com/contentful/experience-builder/commit/bded854c8520937dd28a68499412018d8eae1ee7))
- **experience-builder-sdk:** support ssr in nextjs pages router ([#370](https://github.com/contentful/experience-builder/issues/370)) ([22cde82](https://github.com/contentful/experience-builder/commit/22cde82de00eca82d3bf3ee41e2f459c7f08b0c3))
- **experience-builder-sdk:** update rollup config to not include react in build ([#155](https://github.com/contentful/experience-builder/issues/155)) ([7e0f5ca](https://github.com/contentful/experience-builder/commit/7e0f5ca8b731586fc43a26dd9d562013cb4b1250))
- experiences patterns slots ([#651](https://github.com/contentful/experience-builder/issues/651)) ([53ee8ba](https://github.com/contentful/experience-builder/commit/53ee8bae7e0cde5b11a3541b675fe4cb9d2e7402))
- extend validators to validate component registration on editor mode ([f0dda61](https://github.com/contentful/experience-builder/commit/f0dda6178e3b81ecdcd2b1d530b854117fdd6df0))
- failing test due to change in function signature ([d53c443](https://github.com/contentful/experience-builder/commit/d53c4431fe0733e5d228ee0f6d0bbd812d8f174f))
- fetch all referenced entities ([#507](https://github.com/contentful/experience-builder/issues/507)) ([099dcd6](https://github.com/contentful/experience-builder/commit/099dcd66884ea43edc5ff954dfe5a1f82b11df42))
- fetch all references with includes ([#519](https://github.com/contentful/experience-builder/issues/519)) ([962f70b](https://github.com/contentful/experience-builder/commit/962f70bc129408ba93a1d5550a3a9601a3dd63ea))
- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))
- fix css tests ([29bf73b](https://github.com/contentful/experience-builder/commit/29bf73b7601ab42a58372af3bf8e6724657cc82d))
- fix for preview/delivery mode ([30e0746](https://github.com/contentful/experience-builder/commit/30e07465b0a5f176b68846ad434857d214e1befe))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- fix sdk version being out-of-date with published package ([fbfbe05](https://github.com/contentful/experience-builder/commit/fbfbe059d403be40ee29271f9be1601bd486ccfe))
- fixing tests and EntityStore getValue fetch ([63eec38](https://github.com/contentful/experience-builder/commit/63eec3847bae76776ca89e6ce4f241592b996b5f))
- handle leaking dragProps ([27effa0](https://github.com/contentful/experience-builder/commit/27effa0f2caa6dc0dcb88591aa3833c5e0e1e1be))
- hyperlinks to assets or entries should resolve in a rich text variable [ALT-1493] ([#873](https://github.com/contentful/experience-builder/issues/873)) ([9ad696f](https://github.com/contentful/experience-builder/commit/9ad696f1bf921aafff547c0df0d414c7b06ebfc8))
- incorporate reviewer feedback ([ea236c9](https://github.com/contentful/experience-builder/commit/ea236c93eab52b51135169dfa43f1c73948f32b6))
- initial setup for experience-builder-types [SPA-1395] ([#145](https://github.com/contentful/experience-builder/issues/145)) ([7b138ab](https://github.com/contentful/experience-builder/commit/7b138ab68ff2e1d685c95d665de5f7930d897916))
- inject script for Visual Editor [ALT-169] ([#193](https://github.com/contentful/experience-builder/issues/193)) ([2125f70](https://github.com/contentful/experience-builder/commit/2125f70fd8bac95c7490e25ffac4cdbef8f6ee31))
- instance values overrule default unbound values in preview mode ([2cc67cb](https://github.com/contentful/experience-builder/commit/2cc67cbfadad902d45c9f9fc5d5a8a4b4fcc7477))
- invalid calc value for width CSS property ([65dc14c](https://github.com/contentful/experience-builder/commit/65dc14c1aa68038fc9f5152c1c6aa270474b1392))
- linter ([52dfbba](https://github.com/contentful/experience-builder/commit/52dfbbaa63f83a8cc2adc22905d591f9d62987d9))
- make data required ([36805ff](https://github.com/contentful/experience-builder/commit/36805ff910cc3065d7f3ec855757df1260843134))
- minor change to empty container font color [ALT-59] ([3a08275](https://github.com/contentful/experience-builder/commit/3a082759b97e03f9dc7a218001e255fe458b58a0))
- move active and fallback breakpoint index inside resolveDesignValue ([7caa96e](https://github.com/contentful/experience-builder/commit/7caa96e48906dfb9fdebca9a290e5f3295481345))
- move vite-plugin-css-injected-by-js plugin to dev deps ([#932](https://github.com/contentful/experience-builder/issues/932)) ([309f325](https://github.com/contentful/experience-builder/commit/309f325a0690002473907fed1272493d9594842b))
- not generate styles on csr if generated on ssr [SPA-2049] ([#600](https://github.com/contentful/experience-builder/issues/600)) ([149a569](https://github.com/contentful/experience-builder/commit/149a56978043fd799fce5d09b47626f2d414cf93))
- only have default background color for components that need to have them ([e4062e0](https://github.com/contentful/experience-builder/commit/e4062e059571111cd937ee3b46bd358596f09580))
- prevent missing components error when viewing experience in read only mode [LUMOS-208] ([#931](https://github.com/contentful/experience-builder/issues/931)) ([16e420c](https://github.com/contentful/experience-builder/commit/16e420cd53513976a99879c844da0b2e70936efc))
- putting peerdeps back in temporarily to fix runtime issue ([48197d8](https://github.com/contentful/experience-builder/commit/48197d8da7eb19d33dcea0650ce623a2cd0695b0))
- refactoring and update contentful cli to latest [ALT-106] ([7b290a2](https://github.com/contentful/experience-builder/commit/7b290a23e000cd1ad4704da5dbaaa04c735f8bfb))
- remove the key update via the use effect ([#1035](https://github.com/contentful/experience-builder/issues/1035)) ([8013879](https://github.com/contentful/experience-builder/commit/8013879d3a48a8b1ee8ce4f8218a25b8f7ea5d6f))
- remove unecessary exports from experience-builder-sdk ([175a3fe](https://github.com/contentful/experience-builder/commit/175a3fe5e399869d0d1819275711ed8c0230d4a8))
- render component values in preview and resolve links properly [] ([#194](https://github.com/contentful/experience-builder/issues/194)) ([7183fbd](https://github.com/contentful/experience-builder/commit/7183fbdc16e27c1cef3b2cab8a556d7a54f54770))
- render defaultValue in preview when resolving doesnt work ([3f11c75](https://github.com/contentful/experience-builder/commit/3f11c7513d12b3912ae6d023e530dea0573ca756))
- replace component values with actual onces before rendering [] ([#192](https://github.com/contentful/experience-builder/issues/192)) ([2eb2b66](https://github.com/contentful/experience-builder/commit/2eb2b666bb524c7bd0e1251a0119dad1187e2966))
- resolve breakpoint values correctly so that the ui doesn't crash ([91cc76a](https://github.com/contentful/experience-builder/commit/91cc76a65e45e621f90665118410d7089e6f5a94))
- resolve fetched entities for experiences [ALT-1146] ([#754](https://github.com/contentful/experience-builder/issues/754)) ([e475e62](https://github.com/contentful/experience-builder/commit/e475e62eb7fdee66e36b52c4a3076cb9503a9918))
- resolving component values for nested pattern nodes [SPA-2586] ([#982](https://github.com/contentful/experience-builder/issues/982)) ([270aced](https://github.com/contentful/experience-builder/commit/270aced5504818402cf7e3ef7d073c2c62b99ac3))
- resync on first pass ([#979](https://github.com/contentful/experience-builder/issues/979)) ([8c42407](https://github.com/contentful/experience-builder/commit/8c424072fe7cca45c96c85bffbb4427f1dc5afca))
- Revert "fix: prevent missing components error when viewing experience in read…" ([#942](https://github.com/contentful/experience-builder/issues/942)) ([f7c35c2](https://github.com/contentful/experience-builder/commit/f7c35c2b7b8b8073c0190836bc2f9bb786faae21))
- saw this code that i think is just duplicated? ([#840](https://github.com/contentful/experience-builder/issues/840)) ([796f0a6](https://github.com/contentful/experience-builder/commit/796f0a604ec131210a694b80028d6f2b90be9d9b))
- sdk level README to be more compliant with Contenetful's technical writing guidelines ([f79a2ea](https://github.com/contentful/experience-builder/commit/f79a2ea83f6d6bdc69fc409e94eafcbd90c9f4df))
- selected component jumps around on scroll [ALT-62] ([#150](https://github.com/contentful/experience-builder/issues/150)) ([315b60d](https://github.com/contentful/experience-builder/commit/315b60d6934c00af7d374b6711fca47dd93a4ce2))
- set mediaQueriesMatches when breakpoints change ([ff850ca](https://github.com/contentful/experience-builder/commit/ff850cace14fc3bea5fe54b67cb3d9f981495c0b))
- simplify width logic ([37c65d5](https://github.com/contentful/experience-builder/commit/37c65d538309f04de2374d75652b180c4d4ee673))
- small fix to design token registry resolving design token values ([9dadf38](https://github.com/contentful/experience-builder/commit/9dadf389dec6dfa8c1ee2e1ea93dfc9ba042a17d))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- spelling of contentType [LUMOS-561] ([#1013](https://github.com/contentful/experience-builder/issues/1013)) ([25107a5](https://github.com/contentful/experience-builder/commit/25107a56abdb7df8bbad6fdbec558931ae95b8bd)), closes [#998](https://github.com/contentful/experience-builder/issues/998) [#1006](https://github.com/contentful/experience-builder/issues/1006) [#1007](https://github.com/contentful/experience-builder/issues/1007)
- ssr styles extraction for editable patterns [SPA-2157] ([#707](https://github.com/contentful/experience-builder/issues/707)) ([65ec4bb](https://github.com/contentful/experience-builder/commit/65ec4bb89b0657d899cd22493381dc1bf835d7f9))
- strictly check for asset link type [SPA-1673] ([#187](https://github.com/contentful/experience-builder/issues/187)) ([c5f1c18](https://github.com/contentful/experience-builder/commit/c5f1c1802bde6373237f49de45b84a6bd110921d))
- switching locale makes design components disappear [SPA-1711] ([#209](https://github.com/contentful/experience-builder/issues/209)) ([84ca724](https://github.com/contentful/experience-builder/commit/84ca7248cbfcbd835a58c979d26ec9d375a02931))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- types export from core package ([8d57a97](https://github.com/contentful/experience-builder/commit/8d57a9750fdb9f6033e63e1e63738fdb342a5ebb))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([d71c898](https://github.com/contentful/experience-builder/commit/d71c898e2fe32b45f0003c829171e18b555a347e))
- typos and dont crash on reload due to race condition in mode detection ([f16f709](https://github.com/contentful/experience-builder/commit/f16f7098986f0233d75b70ff09ef50f1abbee257))
- unit tests ([7e6fa8a](https://github.com/contentful/experience-builder/commit/7e6fa8a31a9b5bf0354aa1ee59ddaa4c4170c63c))
- update font weight validations ([#213](https://github.com/contentful/experience-builder/issues/213)) ([79dbd95](https://github.com/contentful/experience-builder/commit/79dbd95339edc34c0f288b78d413e02b98ed7811))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update Text component built in styles and add hyperlink options [ALT-358] ([#319](https://github.com/contentful/experience-builder/issues/319)) ([441e11e](https://github.com/contentful/experience-builder/commit/441e11ee04038a701220535d78cab621433ad483))
- update text transform label and import builtInStyles from core package [ALT-227] ([#214](https://github.com/contentful/experience-builder/issues/214)) ([6c563e7](https://github.com/contentful/experience-builder/commit/6c563e7cb8163a7c609f756b540d6b86bca14c7f))
- use const types and update property descriptions [] ([#1019](https://github.com/contentful/experience-builder/issues/1019)) ([7e3b57f](https://github.com/contentful/experience-builder/commit/7e3b57f378654058e0103bc5c02e5aa08d95b09b))
- use entryMap instead of entitiesMap in the EntityStore ([3b10b89](https://github.com/contentful/experience-builder/commit/3b10b8989b005337e8efbe6cd4c52a8458c13280))
- use matches instead of matchers on state update ([41366c5](https://github.com/contentful/experience-builder/commit/41366c5f4cfd6f38f48d5786f0b19af0e05cccf9))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- useDetectEditorMode [] ([#690](https://github.com/contentful/experience-builder/issues/690)) ([19a8b08](https://github.com/contentful/experience-builder/commit/19a8b087c092834d64b8c35df406477862a6665b))
- **visual-editor:** remove wrapping div for draggable and droppables ([56e44c7](https://github.com/contentful/experience-builder/commit/56e44c737ffd3fe59dee46556083fbd3db1875a5))
- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))
- width applied to both wrapping div and img [ALT-1293] ([#778](https://github.com/contentful/experience-builder/issues/778)) ([e0d12f6](https://github.com/contentful/experience-builder/commit/e0d12f60b18575b50bb742ce0916adad2d0a5ff1))

### Reverts

- Revert "fix: resolve fetched entities for experiences [ALT-1146] (#754)" (#767) ([9ba8a3b](https://github.com/contentful/experience-builder/commit/9ba8a3b3826ae50002984f2770aa0e94202c429a)), closes [#754](https://github.com/contentful/experience-builder/issues/754) [#767](https://github.com/contentful/experience-builder/issues/767)
- Revert "fix: fetch all referenced entities (#507)" (#515) ([2b376f6](https://github.com/contentful/experience-builder/commit/2b376f6f1b6ab63e46c3f62affea0621af33e698)), closes [#507](https://github.com/contentful/experience-builder/issues/507) [#515](https://github.com/contentful/experience-builder/issues/515)
- Revert "fix: import EntityStore from visual-sdk" ([61402a4](https://github.com/contentful/experience-builder/commit/61402a4a0ee75d07524afd57e070b2c1b2dad83d))

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
