# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.2](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.1...v1.0.2) (2024-04-04)

**Note:** Version bump only for package @contentful/experience

## [1.0.2-beta.1](https://github.com/contentful/experience-builder/compare/v1.0.2-beta.0...v1.0.2-beta.1) (2024-04-04)

### Bug Fixes

- **components:** rich text formatting [ALT-585] ([#533](https://github.com/contentful/experience-builder/issues/533)) ([865608d](https://github.com/contentful/experience-builder/commit/865608d26d3a7f63c188c71f81d86ecabea12cbc))
- **visual-editor:** select component when image loads [ALT-646] ([#537](https://github.com/contentful/experience-builder/issues/537)) ([95a9c92](https://github.com/contentful/experience-builder/commit/95a9c9200035f06a943e9c1688757cafccbcb400))

### Features

- [SPA-1774] add hyperlink value to schema ([#540](https://github.com/contentful/experience-builder/issues/540)) ([5ce6203](https://github.com/contentful/experience-builder/commit/5ce6203f013fe5dde25d98ba64fa3714cc0565c0))

## [1.0.2-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.1...v1.0.2-beta.0) (2024-04-04)

**Note:** Version bump only for package @contentful/experience

## [1.0.1](https://github.com/contentful/experience-builder/compare/v1.0.1-beta.0...v1.0.1) (2024-03-29)

**Note:** Version bump only for package @contentful/experience

## [1.0.1-beta.0](https://github.com/contentful/experience-builder/compare/v1.0.0...v1.0.1-beta.0) (2024-03-29)

### Bug Fixes

- **storybook-plugin:** working with the latest SDK on storybook v7 ([#531](https://github.com/contentful/experience-builder/issues/531)) ([8bbe30f](https://github.com/contentful/experience-builder/commit/8bbe30f0ff17c62bbfee7776e330dd7065d2f497))

### Features

- adds divider structure component ([be2ae10](https://github.com/contentful/experience-builder/commit/be2ae1066b5674a69f41ede1d1aba69bc3a653a4))

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experience

## [0.0.1-beta.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.0...v0.0.1-beta.1) (2024-03-26)

- fix(components)!: removing styles.css file from components (#526) ([5113a1a](https://github.com/contentful/experience-builder/commit/5113a1a24e0cced9df49563595f6f4ac74452c49)), closes [#526](https://github.com/contentful/experience-builder/issues/526)

### BREAKING CHANGES

- If you were previously importing styles.css from '@contentful/experiences-components-react' you no longer need to do so. This file is no longer built and can be removed safely from any apps that were importing it.

## 0.0.1-beta.0 (2024-03-26)

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