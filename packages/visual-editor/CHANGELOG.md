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

- add buffer space to bottom of canvas [LUMOS-549] ([#990](https://github.com/contentful/experience-builder/issues/990)) ([e07efed](https://github.com/contentful/experience-builder/commit/e07efeded0ceb43f1c549a2c746a1ca331c76cc7))
- add circularity error message, wrappingPatternIds and handle entryId as rootBlockId ([73c82f5](https://github.com/contentful/experience-builder/commit/73c82f522c7401528a5ac206ed1f32a0d557a273))
- add detachExperienceStyles function [SPA-2049] ([#579](https://github.com/contentful/experience-builder/issues/579)) ([8404b16](https://github.com/contentful/experience-builder/commit/8404b16953731bb0cd6a0b477983880d6ac09c1b))
- add is in experiences mode type to component when dropped onto the canvas ([d6d09ac](https://github.com/contentful/experience-builder/commit/d6d09acc5c1821cf30659bf676adde15631f8ec8))
- add useFetchBySlug, useFetchById hooks and plain js fetchBySlug and fetchById methods ([#206](https://github.com/contentful/experience-builder/issues/206)) ([9e9b72f](https://github.com/contentful/experience-builder/commit/9e9b72f2af18bc2aaf1f6ede429ad6e5d971d3a8))
- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))
- allow changes to the tree root ([44f1431](https://github.com/contentful/experience-builder/commit/44f143153446ebb039f59c864ec6e39dfaa90973))
- allow multiple slots to be defined in a custom component [ALT-416] ([#620](https://github.com/contentful/experience-builder/issues/620)) ([5aff939](https://github.com/contentful/experience-builder/commit/5aff939a7842246767e98ecb48891d1debec37a9))
- clicking outside of the edited canvas sends post message to user interface ([6e35c29](https://github.com/contentful/experience-builder/commit/6e35c2904b33027302e83b1d90b8c674e2380527))
- **components:** built-in styles for columns [ALT-276, ALT-277] ([#316](https://github.com/contentful/experience-builder/issues/316)) ([7a057c3](https://github.com/contentful/experience-builder/commit/7a057c36e855b580262f5e368cbf5c037e8dc323))
- **components:** column gaps [ALT-279] ([#324](https://github.com/contentful/experience-builder/issues/324)) ([465bd53](https://github.com/contentful/experience-builder/commit/465bd539b2dadc831096c9fba9f89c98e3687a04))
- Container default margin auto [ALT-326] ([#286](https://github.com/contentful/experience-builder/issues/286)) ([16c1acf](https://github.com/contentful/experience-builder/commit/16c1acf05a5553dd31a5ebb04ead6c0a7724de54))
- enable rendering of the nested patterns ([#813](https://github.com/contentful/experience-builder/issues/813)) ([46573c4](https://github.com/contentful/experience-builder/commit/46573c43b9380840cb7dec2f61dffefd108131b0))
- **experiences-sdk-react:** update basic component IDs with contentful prefix ([#508](https://github.com/contentful/experience-builder/issues/508)) ([0e28c45](https://github.com/contentful/experience-builder/commit/0e28c45e589422574caab08c44bc6099a5cbdb42))
- export deserialize pattern node variables from core package [SPA-2376] ([#751](https://github.com/contentful/experience-builder/issues/751)) ([3c5ff38](https://github.com/contentful/experience-builder/commit/3c5ff381361c81ad544d54cbaf23ff071d1a675d))
- fallback for design component values in preview mode ([e626e12](https://github.com/contentful/experience-builder/commit/e626e1273d6bc1c92f47796a1cef1e3f7a353dc0))
- fallback missing components [SPA-2033] ([#658](https://github.com/contentful/experience-builder/issues/658)) ([a2d0f55](https://github.com/contentful/experience-builder/commit/a2d0f551767a1af3d086d1c16f7289dce0b0a689)), closes [/github.com/contentful/experience-builder/pull/625#discussion_r1625886402](https://github.com/contentful//github.com/contentful/experience-builder/pull/625/issues/discussion_r1625886402)
- fallback to defaultValue for design values ([bb50822](https://github.com/contentful/experience-builder/commit/bb5082266588f28efef8372a89c36dfbf695ef4e))
- first draft ([5c9f00d](https://github.com/contentful/experience-builder/commit/5c9f00d744d6499aa83140d60fda780717e60c25))
- implement column reorder ([#694](https://github.com/contentful/experience-builder/issues/694)) ([d48b81a](https://github.com/contentful/experience-builder/commit/d48b81a4de4bbaf7deddf5928646db95335e1968))
- implement columns component with presets and custom options [ALT-43] ([#285](https://github.com/contentful/experience-builder/issues/285)) ([dd74a5f](https://github.com/contentful/experience-builder/commit/dd74a5f409c7b4d66722d0809eba43a3cf0e1cfd))
- implement design components with hybrid editor ([9601a9b](https://github.com/contentful/experience-builder/commit/9601a9b2365e63a4068d895cc72ffa3ccd46d10d))
- introduce rendering cfVisibility in SDK ([d53a8d2](https://github.com/contentful/experience-builder/commit/d53a8d2cf1f810cc0e5587d28abe1c19636fcad5))
- make delivery and preview work ([65c45dd](https://github.com/contentful/experience-builder/commit/65c45dd52fd9226c6af356303089391fda59f38e))
- make local override possbible ([b80703d](https://github.com/contentful/experience-builder/commit/b80703dddde977438e2911cfb8270d6440ab27f9))
- new component registration option for editorWrapperWidth [ALT-1358] ([#800](https://github.com/contentful/experience-builder/issues/800)) ([4b1891e](https://github.com/contentful/experience-builder/commit/4b1891ee301f9e1cc073c02ad2fbd77f0de5de75))
- only provide isInExpEditorMode if activated in options [SPA-2607] ([#1008](https://github.com/contentful/experience-builder/issues/1008)) ([3bb6ccb](https://github.com/contentful/experience-builder/commit/3bb6ccba93151e27a629f24274ee7439a9ced561))
- populate pattern nodes for Editor mode in the webapp ([9a1d456](https://github.com/contentful/experience-builder/commit/9a1d45633b62d0e869089d5a1c7e6ba27598ff36))
- render design component values in editor mode ([c850ada](https://github.com/contentful/experience-builder/commit/c850adabe18c8067cac76609819f0c111d2fca84))
- section component [ALT-205] ([#279](https://github.com/contentful/experience-builder/issues/279)) ([aea2ac8](https://github.com/contentful/experience-builder/commit/aea2ac899dbf12e9e62ac174d84b5171ce60dbdb))
- update types for ComponentDefinition variables [ALT-690] ([#850](https://github.com/contentful/experience-builder/issues/850)) ([e015e2b](https://github.com/contentful/experience-builder/commit/e015e2be42606fd0dec4acb72eb08f01b0de5aa2))

### Bug Fixes

- activate original dropzone when moving root-level components [ALT-746] ([#572](https://github.com/contentful/experience-builder/issues/572)) ([7d0a2d8](https://github.com/contentful/experience-builder/commit/7d0a2d859461f3fbbc1b9ba48b6256da2eb691b0))
- add dnd cypress stub [SPA-1712] ([#270](https://github.com/contentful/experience-builder/issues/270)) ([cb88716](https://github.com/contentful/experience-builder/commit/cb887160ae9a37c8be4cb38d12419e914c6f1be1))
- add min width 80px for dropping children in empty containers ([55d14ba](https://github.com/contentful/experience-builder/commit/55d14bae3bc6dec8a4d099719de0e0cae2f9a424))
- add missing script-inject dep to required packages ([ba16c1b](https://github.com/contentful/experience-builder/commit/ba16c1bc89b17457496ddceed055bb96eb755e54))
- add purple hover outline for assemblies [ALT-260] ([9d65eef](https://github.com/contentful/experience-builder/commit/9d65eef2ae81c3e8f191eab9aceb056a45f282b1))
- add type definitions for outgoing events ([ac1027c](https://github.com/contentful/experience-builder/commit/ac1027c85868897997740e3d10b1ed54fa07a540))
- add types for incoming events ([2d07b38](https://github.com/contentful/experience-builder/commit/2d07b38e5d858b8c8f84101c083f5649480d02c5))
- add version prop to fixture to match mgmt entity shape ([ec3b485](https://github.com/contentful/experience-builder/commit/ec3b4851463d6dee922cb1b35cb1b1aece49881e))
- adjsut type for not defined coords ([1a34169](https://github.com/contentful/experience-builder/commit/1a341691caa65f27ec45861638620d31664bc9e0))
- adjust pacts storage and upload in pipeline ([82d745b](https://github.com/contentful/experience-builder/commit/82d745b07bc8afce207beaa3a92a2f8e4346593c))
- adjust where the hover label goes for components and containers in xb ([5fbbe65](https://github.com/contentful/experience-builder/commit/5fbbe656be7f0f5b5fa0bfd4bbebf06a4e56b2e4))
- allow built-in components to be disabled [ALT-267] ([#321](https://github.com/contentful/experience-builder/issues/321)) ([453225c](https://github.com/contentful/experience-builder/commit/453225cf9c0813137441e1445754c4ed3aecd8bc))
- allow clicking the canvas to drop a dragged component [ALT-283] ([#277](https://github.com/contentful/experience-builder/issues/277)) ([454c114](https://github.com/contentful/experience-builder/commit/454c114d0f3d47a2a6d2df724f17be07e6ac0ead))
- allow root-level structure components to be reparented into siblings [ALT-561] ([#555](https://github.com/contentful/experience-builder/issues/555)) ([43cc1cb](https://github.com/contentful/experience-builder/commit/43cc1cbb58dcd3a0471925f2abc1bd554e8be981))
- allows re-parenting of components, however does not allow for new containers to be created ([0614fd7](https://github.com/contentful/experience-builder/commit/0614fd77c41c63790649a8de3bc5618357d51ce9))
- apply margin to wrapperStyles when drag wrapper is enabled [ALT-1293] ([#784](https://github.com/contentful/experience-builder/issues/784)) ([dddb811](https://github.com/contentful/experience-builder/commit/dddb811da5648d58b971797d62f3563ef7e754dd))
- assemblies incorrectly rendered on initial drop [ALT-1220] ([#742](https://github.com/contentful/experience-builder/issues/742)) ([fbf3d88](https://github.com/contentful/experience-builder/commit/fbf3d889e0a57b2f654bf45d78c2acbfd05af7e1))
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
- clean up the wrong entry ([cfe24a1](https://github.com/contentful/experience-builder/commit/cfe24a196c65f64d7593dfbc2c74de9bc8e6f12b))
- cleanup remanining new imports under experience-builder since the pr was up ([4fe1b43](https://github.com/contentful/experience-builder/commit/4fe1b436d5ac40d0a90595bb37acaa91fa4ad99f))
- design tokens in visual editor [ALT-200] ([#222](https://github.com/contentful/experience-builder/issues/222)) ([f4ffc8b](https://github.com/contentful/experience-builder/commit/f4ffc8b7d5e726f1c0eb6252daca4147070fba52))
- dnd between custom components and patterns [ALT-1230] ([#785](https://github.com/contentful/experience-builder/issues/785)) ([abf9103](https://github.com/contentful/experience-builder/commit/abf9103341f46fe36618badfc907032c0b88a342))
- don't spread props meant for custom components onto plain html wrapping elements ([#898](https://github.com/contentful/experience-builder/issues/898)) ([ba7ba90](https://github.com/contentful/experience-builder/commit/ba7ba9030d79233cb02e545147bb2e4150dbcc53)), closes [#899](https://github.com/contentful/experience-builder/issues/899)
- don't track errors thrown from imported components ([070360f](https://github.com/contentful/experience-builder/commit/070360f1910c73ba0c81e2d24b9c64fb812cdf32))
- dont rerender styles on every render via memoization ([7295b17](https://github.com/contentful/experience-builder/commit/7295b17983793aeae11dc5a4a21b22a180ef6faa))
- dont suppress errors in SDK code but only custom code ([5f3fa19](https://github.com/contentful/experience-builder/commit/5f3fa1994bba392c6f39ea4ade411dc4c6352660))
- dont swallow SDK errors ([3dc83e1](https://github.com/contentful/experience-builder/commit/3dc83e1576a9b952beca1244213257889a5922d8))
- drag-n-drop error when moving custom components [ALT-1446] ([#825](https://github.com/contentful/experience-builder/issues/825)) ([af51a55](https://github.com/contentful/experience-builder/commit/af51a5554c0e2d426f408d51a774f296388c23f3))
- empty state canvas now says add components to begin ([14a39d8](https://github.com/contentful/experience-builder/commit/14a39d82b20c19b8a4bc5466dd74675968930288))
- entity store issues with design components ([28446d8](https://github.com/contentful/experience-builder/commit/28446d85695b3a6d5847c7309de544074be2dacc))
- **experience-builder:** only accept new assembly event [SPA-1730] ([#260](https://github.com/contentful/experience-builder/issues/260)) ([3e37f15](https://github.com/contentful/experience-builder/commit/3e37f1518112c993456e08f74013c8a065b370fd))
- **experience-builder:** show the selection rectangle of nested patterns [SPA-2534] ([#908](https://github.com/contentful/experience-builder/issues/908)) ([cb2eed9](https://github.com/contentful/experience-builder/commit/cb2eed945f8866d4f40aedfae045c095d22dacbf))
- experiences patterns slots ([#651](https://github.com/contentful/experience-builder/issues/651)) ([53ee8ba](https://github.com/contentful/experience-builder/commit/53ee8bae7e0cde5b11a3541b675fe4cb9d2e7402))
- **experiences:** proper handling of reparenting off canvas ([#460](https://github.com/contentful/experience-builder/issues/460)) ([9808cfc](https://github.com/contentful/experience-builder/commit/9808cfcdae03ad6c3fee7e3bb9278db06e179467))
- export individual payload types ([2dd4e2e](https://github.com/contentful/experience-builder/commit/2dd4e2e38321843c93c1dd8de109b682ed854a34))
- first working resolving of links ([2397e93](https://github.com/contentful/experience-builder/commit/2397e93eff651ad3a65fbef66e127496c06893cc))
- fix for locale switcher ([#491](https://github.com/contentful/experience-builder/issues/491)) ([c9e9c82](https://github.com/contentful/experience-builder/commit/c9e9c821df8070e03a4493ce5c6ab4fd2576da58))
- fix issue where dragging a structure component will periodically make it go bye bye ([#698](https://github.com/contentful/experience-builder/issues/698)) ([1c07c3a](https://github.com/contentful/experience-builder/commit/1c07c3a22915e237b9db0fccdbc220db0bcc7852))
- fix lodash deps ([a7cba34](https://github.com/contentful/experience-builder/commit/a7cba342e1c92bfef8dccc7ae027326955d8b741))
- forcibly disable pointer-events on drag/drop clone elements [ALT-1391] ([#821](https://github.com/contentful/experience-builder/issues/821)) ([8b5d95b](https://github.com/contentful/experience-builder/commit/8b5d95bdfb380f61522443062f757de6966a2bfa))
- full-width for pattern wrapper ([#696](https://github.com/contentful/experience-builder/issues/696)) [ALT-1036] ([54a1570](https://github.com/contentful/experience-builder/commit/54a15701a4288831449271d6ad6b707bacf72e9b))
- handle case where single column is not wrapped in columns component ([21d6759](https://github.com/contentful/experience-builder/commit/21d6759f3cad4d28f0e7030f230f5c36ec249368))
- handle missing linkType property ([#237](https://github.com/contentful/experience-builder/issues/237)) ([1827d96](https://github.com/contentful/experience-builder/commit/1827d960f0a53412e1e39b06e265f7e1511e54f5))
- hide overflow on draggable component to fix scrolling ([5c3b9f4](https://github.com/contentful/experience-builder/commit/5c3b9f48fef58cc8668972be2325a513a21287d6))
- hover outlines ([81138c3](https://github.com/contentful/experience-builder/commit/81138c315a408fdfabf589a7823d34b3cbc22d71))
- hover outlines and default border style [ALT-323] ([#476](https://github.com/contentful/experience-builder/issues/476)) ([0378c6d](https://github.com/contentful/experience-builder/commit/0378c6d7499e9bdea6bedd632a9444dcde712984))
- hovering pattern in layers tab now renders the display name on canvas in studio experiences ([1ac11d2](https://github.com/contentful/experience-builder/commit/1ac11d21aa97056e3a436c5ab61c156d2225257b))
- incorrect placeholder styling ([#705](https://github.com/contentful/experience-builder/issues/705)) ([1c1add1](https://github.com/contentful/experience-builder/commit/1c1add1c1091811ba44973b58c27d3b7751264d5))
- isComponentAllowedOnRoot logic to allow patterns to be reparented at the root level ([34c8697](https://github.com/contentful/experience-builder/commit/34c86975c1576fe24530fdf004ce7443f31c83ed))
- make assemblyblock height 100% ([#786](https://github.com/contentful/experience-builder/issues/786)) ([f8c537f](https://github.com/contentful/experience-builder/commit/f8c537fbd6a4dddc47a6dd68b339ed423008c456))
- make data required ([36805ff](https://github.com/contentful/experience-builder/commit/36805ff910cc3065d7f3ec855757df1260843134))
- make React prop optional in other places as well ([81bf035](https://github.com/contentful/experience-builder/commit/81bf0355d1bb8fa48be2de7fa4572c31f686685c))
- mob qa bug fixes ([f0f2892](https://github.com/contentful/experience-builder/commit/f0f28929b458e6c1f73a9097039d5b2729841ce9))
- move active and fallback breakpoint index inside resolveDesignValue ([7caa96e](https://github.com/contentful/experience-builder/commit/7caa96e48906dfb9fdebca9a290e5f3295481345))
- not generate styles on csr if generated on ssr [SPA-2049] ([#600](https://github.com/contentful/experience-builder/issues/600)) ([149a569](https://github.com/contentful/experience-builder/commit/149a56978043fd799fce5d09b47626f2d414cf93))
- pointer-events drag issue ([6eb49d2](https://github.com/contentful/experience-builder/commit/6eb49d211d46b57e376d8fa1a2d1193e126b3b75))
- properly remove event listener on scroll ([#345](https://github.com/contentful/experience-builder/issues/345)) ([da2514c](https://github.com/contentful/experience-builder/commit/da2514c29c3b45419d19aa00892ab39b97e979fa))
- re-fetch entity store on locale change ([#300](https://github.com/contentful/experience-builder/issues/300)) ([2da61b6](https://github.com/contentful/experience-builder/commit/2da61b686d7059864e849d71b011cb53ac7a3281))
- react on changes of breakpoint when tree is the same ([4560282](https://github.com/contentful/experience-builder/commit/4560282e2af8d8aecab16f8d2f29d82edb4c1556))
- recognize replacement by detaching assembly node with current child cound ([41d3be5](https://github.com/contentful/experience-builder/commit/41d3be5f1ca1d29bcc2b9377932467ce873dac05))
- remove circular dep and bring related code in one place ([c6dc913](https://github.com/contentful/experience-builder/commit/c6dc913ab78cd68a8cf9cc74f9814f1fcec43eeb))
- remove error regarding any type ([222e82c](https://github.com/contentful/experience-builder/commit/222e82cce6c25ad2c819c3aeb8f83a2a39e86efb))
- remove styles tag when not used anymore ([ae78d07](https://github.com/contentful/experience-builder/commit/ae78d07dafc7ef3f2d1e30744d181f0a9cf4f261))
- remove the previous hotfix ([157dc57](https://github.com/contentful/experience-builder/commit/157dc57adfe85c42e725b62da8d0cb3a5a5a18ec))
- remove unused import ([8b48cbb](https://github.com/contentful/experience-builder/commit/8b48cbb3187f1848fb8b9831fa7c962e2af2cc82))
- rename editorWrapperWidth option to wrapContainerWidth [ALT-1358] ([#801](https://github.com/contentful/experience-builder/issues/801)) ([93425ea](https://github.com/contentful/experience-builder/commit/93425ea662c0fe129e47f78036190d20b1106a21))
- render defaultValue in preview when resolving doesnt work ([3f11c75](https://github.com/contentful/experience-builder/commit/3f11c7513d12b3912ae6d023e530dea0573ca756))
- replace original node with assembly node completely ([cfc55d3](https://github.com/contentful/experience-builder/commit/cfc55d305affd361ac82882c3c13350afae4c912))
- revert changes ([e5341e0](https://github.com/contentful/experience-builder/commit/e5341e0a843e73ccffeef3c465cb17535d00af82))
- revised buildCfStyles and add useComponentProps tests [ALT-1293] ([#779](https://github.com/contentful/experience-builder/issues/779)) ([4b9346f](https://github.com/contentful/experience-builder/commit/4b9346f6aec4e074abfd2526eb42fec61dd2672c))
- show outline when hovering over readonly blocks in an assembly [ALT-260] ([d2331ea](https://github.com/contentful/experience-builder/commit/d2331ea0ec707a189d850c752b87297d92c192af))
- silence lint errors ([378a50a](https://github.com/contentful/experience-builder/commit/378a50a8ad5d46445ba3b4a4ae7d3e10ce5b225a))
- simplify width logic ([37c65d5](https://github.com/contentful/experience-builder/commit/37c65d538309f04de2374d75652b180c4d4ee673))
- slot components should fit their height content once they have children ([#706](https://github.com/contentful/experience-builder/issues/706)) ([dd1094a](https://github.com/contentful/experience-builder/commit/dd1094a7f2321c5a3f94a642596a4d625eaa683b))
- smaller dropzone indicator and container height adjustments [ALT-356] ([#326](https://github.com/contentful/experience-builder/issues/326)) ([bf75c10](https://github.com/contentful/experience-builder/commit/bf75c10b13e3e165dac1f4d1d6a68deae1622078))
- tests and linting ([c1e2e05](https://github.com/contentful/experience-builder/commit/c1e2e05ec7b1fcca14ec364f83944eae201cc1d8))
- tidy up ([a212287](https://github.com/contentful/experience-builder/commit/a212287cffd2e27f490cef6cd8e12b7a0fec96a1))
- types in visual editor [] ([#313](https://github.com/contentful/experience-builder/issues/313)) ([21de9ae](https://github.com/contentful/experience-builder/commit/21de9aea921c97190e9115a8d0afb33b4a244937))
- typos and dont crash on reload due to race condition in mode detection ([f16f709](https://github.com/contentful/experience-builder/commit/f16f7098986f0233d75b70ff09ef50f1abbee257))
- update dropzone to consider children margins[ALT-282] ([5df13cc](https://github.com/contentful/experience-builder/commit/5df13cc9e24a7d38406617ab2c3bd4070a6c3103))
- update Heading component built in styles [ALT-154] ([#296](https://github.com/contentful/experience-builder/issues/296)) ([b064bfc](https://github.com/contentful/experience-builder/commit/b064bfc16a158c2ff429105cb7b856326265e151))
- update hover labels to be more like onclick labels ([6ba51c1](https://github.com/contentful/experience-builder/commit/6ba51c131887cec9681da36ad385680d7c03e8d3))
- use casting to overcome type clash ([8dcc651](https://github.com/contentful/experience-builder/commit/8dcc65112fc3e068506c97216cac558657c68cb1))
- use default values for componentValue properties ([53d9f79](https://github.com/contentful/experience-builder/commit/53d9f79f5481fb395acf62ff65bbdce9f9226fc5))
- use lodash for correct array eq check ([011a8f0](https://github.com/contentful/experience-builder/commit/011a8f00d971692e001887e890f6f081fdd56828))
- use named exports vs default for lodash ([aa3c91a](https://github.com/contentful/experience-builder/commit/aa3c91a045078a598f9eb640922948da1d36fb4d))
- **visual-editor:** allow first and last root dropzones to activate when moving components [ALT-746] ([#571](https://github.com/contentful/experience-builder/issues/571)) ([090181e](https://github.com/contentful/experience-builder/commit/090181e7f923a7146b1dc4af181c2f3c4fb3e02e))
- **visual-editor:** canvas interactions flickering on changes [ALT-241] ([#240](https://github.com/contentful/experience-builder/issues/240)) ([6ccea0f](https://github.com/contentful/experience-builder/commit/6ccea0f6e2b3e58852ee4e137ead35678831f84d)), closes [#243](https://github.com/contentful/experience-builder/issues/243) [#242](https://github.com/contentful/experience-builder/issues/242) [#244](https://github.com/contentful/experience-builder/issues/244) [#249](https://github.com/contentful/experience-builder/issues/249)
- **visual-editor:** canvas usability and placeholders [ALT-449] ([#414](https://github.com/contentful/experience-builder/issues/414)) ([f338605](https://github.com/contentful/experience-builder/commit/f338605f709007bd67cb49f7e236b9b7e5019977))
- **visual-editor:** change component outlines and dropzone backgrounds [ALT-273] [ALT-275] ([#257](https://github.com/contentful/experience-builder/issues/257)) ([1e47be7](https://github.com/contentful/experience-builder/commit/1e47be7051e53b49d219da73851705bf476592c1))
- **visual-editor:** component re-select on breakpoint change ([#473](https://github.com/contentful/experience-builder/issues/473)) ([14d60f5](https://github.com/contentful/experience-builder/commit/14d60f580bfa1f64c0bdee7d007b9ed8bee8f3b8))
- **visual-editor:** enable dropzones on custom components ([#253](https://github.com/contentful/experience-builder/issues/253)) ([b0d87c0](https://github.com/contentful/experience-builder/commit/b0d87c02d4343e8c0ec79daf00edee2d3e07bad9))
- **visual-editor:** extra dropzone padding when dragging [ALT-746] ([#575](https://github.com/contentful/experience-builder/issues/575)) ([2bbc88c](https://github.com/contentful/experience-builder/commit/2bbc88c8a7b540763e6f7727463305e574ffaded))
- **visual-editor:** prevent elements from resizing on drag [ALT-1371] ([#828](https://github.com/contentful/experience-builder/issues/828)) ([6c005a7](https://github.com/contentful/experience-builder/commit/6c005a7358a9b92a885c309d770a4f9be0a1115c))
- **visual-editor:** prevent hover tooltip for selected component [ALT-1090] ([#872](https://github.com/contentful/experience-builder/issues/872)) ([ff5c3fa](https://github.com/contentful/experience-builder/commit/ff5c3fa6be7489ee832814b0480a57c433111ca2))
- **visual-editor:** properly handle when drag operations are canceled ([#242](https://github.com/contentful/experience-builder/issues/242)) ([e5e99e8](https://github.com/contentful/experience-builder/commit/e5e99e891d05991e90d69d5788b236c9adbb038d))
- **visual-editor:** remove error around passing editor props to normal elements ([#231](https://github.com/contentful/experience-builder/issues/231)) ([4024a68](https://github.com/contentful/experience-builder/commit/4024a68b3da06919ae777c15e7d25a8a40d6c263))
- **visual-editor:** remove wrapping div for draggable and droppables ([56e44c7](https://github.com/contentful/experience-builder/commit/56e44c737ffd3fe59dee46556083fbd3db1875a5))
- **visual-editor:** remove wrapping div for draggable and droppables ([fda5897](https://github.com/contentful/experience-builder/commit/fda58972136ff36cadc1b5fae5fc28d19934eeb8))
- **visual-editor:** render assembly nodes by passing the required props [ALT-255] ([#245](https://github.com/contentful/experience-builder/issues/245)) ([6d2dd5a](https://github.com/contentful/experience-builder/commit/6d2dd5a64337e13ac84c0014da2c03e519f7f78b))
- **visual-editor:** request components after DC is dropped to display them ([#258](https://github.com/contentful/experience-builder/issues/258)) ([94f630e](https://github.com/contentful/experience-builder/commit/94f630e275ea4d691975131a7baed24292cb34d3))
- **visual-editor:** reselect component after scroll ([#276](https://github.com/contentful/experience-builder/issues/276)) ([7fa6446](https://github.com/contentful/experience-builder/commit/7fa6446eed801dd2fe03c5627223bd815425be80))
- **visual-editor:** show canvas hover state in layers tab [ALT-787] ([#587](https://github.com/contentful/experience-builder/issues/587)) ([8541e97](https://github.com/contentful/experience-builder/commit/8541e974b675e5645be6a457ba4d2b6541c372a0))
- **visual-editor:** show hovered component outlines when hovering the layers tab [ALT-673] ([#584](https://github.com/contentful/experience-builder/issues/584)) ([34f0dee](https://github.com/contentful/experience-builder/commit/34f0dee341ac411730885ba060bebbeff2408f52))
- **visual-editor:** styling for custom component children dropzone [ALT-1085] ([#709](https://github.com/contentful/experience-builder/issues/709)) ([8ed41a3](https://github.com/contentful/experience-builder/commit/8ed41a3c070b65fe78eb960d9bfe104f5542645b))
- **visual-editor:** throw error when component registration not found in useComponent hook [ALT-515] ([#517](https://github.com/contentful/experience-builder/issues/517)) ([147f5aa](https://github.com/contentful/experience-builder/commit/147f5aac5870f663cafcd91e820af39a9f89c2b5))
- **visual-editor:** update dropzone and selected component logic [ALT-317] ([#283](https://github.com/contentful/experience-builder/issues/283)) ([edb4349](https://github.com/contentful/experience-builder/commit/edb434928ac79523cc5aede61ae6cdca3e44f04b))
- **visual-sdk:** only show bg color of dropzone for components being dragged in ([#278](https://github.com/contentful/experience-builder/issues/278)) ([2895c16](https://github.com/contentful/experience-builder/commit/2895c16935ba9ac6ecc8638b0601f2d3eb48718e))
- width applied to both wrapping div and img [ALT-1293] ([#778](https://github.com/contentful/experience-builder/issues/778)) ([e0d12f6](https://github.com/contentful/experience-builder/commit/e0d12f60b18575b50bb742ce0916adad2d0a5ff1))
- wrap assembly with correct container styles ([222cd37](https://github.com/contentful/experience-builder/commit/222cd3721e47135e16d2ef52e16baedb982135a4))

### Reverts

- dont overwrite assembly block height manually ([117d59c](https://github.com/contentful/experience-builder/commit/117d59c76ec9c6664fb416c1f6a5f8a46562664e))

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
