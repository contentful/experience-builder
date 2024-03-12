import { z } from 'zod';

export const DefinitionPropertyTypeSchema = z.enum([
  'Text',
  'RichText',
  'Number',
  'Date',
  'Boolean',
  'Location',
  'Media',
  'Object',
]);

export const DefinitionPropertyKeySchema = z.string().regex(/^[a-zA-Z0-9-_]{1,32}$/);

export const ComponentDefinitionSchema = z.object({
  definitionId: DefinitionPropertyKeySchema,
  variables: z.record(
    DefinitionPropertyKeySchema,
    z.object({
      displayName: z.string().optional(),
      type: DefinitionPropertyTypeSchema,
      defaultValue: z.any().optional(),
      description: z.string().optional(),
      group: z.string().optional(),
      validations: z
        .object({
          required: z.boolean().optional(),
          format: z.literal('URL').optional(),
          in: z
            .array(
              z.object({
                value: z.union([z.string(), z.number()]),
                displayName: z.string().optional(),
              }),
            )
            .optional(),
        })
        .optional(),
    }),
  ),
});
