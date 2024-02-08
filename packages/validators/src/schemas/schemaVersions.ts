import { z } from "zod";

export const SchemaVersions = z.union([z.literal('2023-09-28'), z.literal('2023-06-27'), z.literal('2023-07-26'), z.literal('2023-08-23')]);
export type SchemaVersions = z.infer<typeof SchemaVersions>;