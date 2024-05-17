# @contentful/experiences-validators

This package defines schemas and validator functions for experience data structures in the [Experiences SDK](https://www.contentful.com/developers/docs/experiences/set-up-experiences-sdk/). These validators ensure the integrity and correctness of the data used in experiences.

## Purpose

Defines and exports schema validators for experience and pattern entries as well for component definitions.
Exports types related to experience fields infered from the schemas.


## Concepts
- **schemaVersion** Each experience or pattern entry contains the schema version it need to conform to under `fields` -> `componentTree` -> `schemaVersion`. We use this version to know which schema validations to run.
- **schemas** Under the schemas folder we define the schema validations for each schema version we support. Can also contain other schema used
in Studio Experiences, e.g. schema for the component definitions. All schemas are defined using the [Zod](https://zod.dev/) libary.
- **validators** Functions that validate different entities, e.g. experiences using the schemas defined in this package.
- **ExperienceEntryFields** This include only the reserved for experiences fields: `componentTree`, `dataSource`, `unboundValues`, `componentSettings` and `usedComponents`. These validators are not meant to validate any custom fields.
- This package is built for both CommonJS and ESM format as it is being used both in our frontend and backend applications.

### Relevant Contentful Documentation Links
- [Contentful Entry Tree Data Structure](https://www.contentful.com/developers/docs/experiences/data-structures/)