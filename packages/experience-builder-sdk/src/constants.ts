// TODO: With the next major version bump, we will drop the "/types" subpath but only export types through the index export file.
import type { SchemaVersions } from '@contentful/experiences-core/types';

// this is the array of version which currently LATEST_SCHEMA_VERSION is compatible with
export const compatibleVersions: SchemaVersions[] = ['2023-09-28'];

export { SDK_VERSION } from './sdkVersion';
