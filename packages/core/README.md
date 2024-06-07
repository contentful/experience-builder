# @contentful/experiences-core

### Purpose
- To contain shared code and utilities across the Experiences packages such as constants, types, transformers, and hooks.
- This means additions to core should be framework agnostic. For example, code that is only compatible with React does not belong in the core package.

### Concepts
- **Deep binding**: Relates to the ability to resolve multiple references. Such an entry containing a reference to another entry which may also contain a reference to another entry and so on.
- **Component definition** Baseline definition to outline what is needed to define all component types whether it is a structure, built-in, or custom component.
- **Entity**: Contentful entries that get converted into an experience object that can be used within the experiences packages.
- **Fetchers**: The helper classes and functions in the Entity directory get consumed by the fetchers which get bundled up into either `fetchBySlug` or `fetchById`. The listed fetchers are the two main functions that are exposed to the end user in the SDK to fetch a user's experience which is stored in Contentful as an entry.
- **Registries**: An in-memory storage technique that the user can decide to provide for themselves or other personas in the editor canvas. Design tokens is an useful example where a user can provide their own thematic values with regards to text size, component sizes, spacing, colors, and borders in a JSON format that is resolved by the registry and provided as options in the UI editor sidebar.
- **Exporting types and constants**: Notice in the `package.json` there is a `typesVersions` definition that separates the constants and types as separated bundled packages where the rollup is defined in the `rollup.config.mjs` file. This effectively means in practice consuming the types and constants have different imports - namely `@contentful/experiences-core/constants` and `@contentful/experiences-core/types`.

### Relevant Contentful documentation links
- [Data structures](https://www.contentful.com/developers/docs/experiences/data-structures/)
- [Design tokens](https://www.contentful.com/developers/docs/experiences/design-tokens/)
