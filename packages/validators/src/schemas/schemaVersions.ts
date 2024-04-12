import { z } from 'zod';
// If more than one version is supported, use z.union
export const SchemaVersions = z.literal('2023-09-28');

export type SchemaVersions = z.infer<typeof SchemaVersions>;

// Keep deprecated versions here just for reference
export const UnsupportedSchemaVersions = z.union([
  z.literal('2023-08-23'),
  z.literal('2023-07-26'),
  z.literal('2023-06-27'),
]);
