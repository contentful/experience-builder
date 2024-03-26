# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

**Note:** Version bump only for package @contentful/experience

# [1.0.0](https://github.com/contentful/experience-builder/compare/v0.0.1...v1.0.0) (2024-03-26)

**Note:** Version bump only for package @contentful/experience

## [0.0.1](https://github.com/contentful/experience-builder/compare/v0.0.1-beta.1...v0.0.1) (2024-03-26)

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
