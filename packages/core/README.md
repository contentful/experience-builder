# @contentful/experiences-core

### Purpose
- To contain shared code and utilities across the Experience-builder packages such as constants, types, transformers, and hooks.
- This means additions to core should be framework agnostic. For example, code that is only compatible with React does not belong in the core package.

### Concepts
- **Deep binding**: Relates to the ability to resolve n references. Such an entry containing a reference to another entry which may also contain a reference to another entry and so on.
- **Component definition** Baseline definition to outline what is needed to define all component types whether it is a structure, built-in, or custom component.
- **Entity**: Contentful entries that get converted into an experience object that can be used within the experience builder packages.
- **Fetchers**: The helper classes and functions in the Entity directory get consumed by the fetchers which get bundled up into either `fetchBySlug` or `fetchById`. The listed fetchers are the two main functions that are exposed to the end user in the sdk to fetch a user's experience which is stored in Contentful as an entry.
- **Registries**: An in memory storage technique that the user can decide to provide for themselves or other personas in the editor canvas. Design Tokens is an useful example where a user can provide their own thematic values with regards to text size, component sizes, spacing, colors, and borders in a json format that is resolved by the registry and provided as options in the ui editor sidebar.
- **Exporting types and constants**: Notice in the `package.json` there is a `typesVersions` definition that separates the constants and types as separated bundled packages where the rollup is defined in the `rollup.config.mjs` file. This effectively means in practice consuming the types and constants have different imports - namely `@contentful/experiences-core/constants` and `@contentful/experiences-core/types`.

### Relevant Contentful Documentation Links
- [Data Structures](https://www.contentful.com/developers/docs/experiences/data-structures/)
- [Design Tokens](https://www.contentful.com/developers/docs/experiences/design-tokens/)
