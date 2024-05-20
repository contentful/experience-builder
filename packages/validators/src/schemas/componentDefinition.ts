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
  'Hyperlink',
  'Dropzone',
]);

export const DefinitionPropertyKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]{1,32}$/, { message: 'Property needs to match: /^[a-zA-Z0-9-_]{1,32}$/' });

export const ComponentDefinitionSchema = z.object({
  id: DefinitionPropertyKeySchema,
  variables: z.record(
    DefinitionPropertyKeySchema,
    z.object({
      // TODO - extend with definition of validations and defaultValue
      displayName: z.string().optional(),
      type: DefinitionPropertyTypeSchema,
      description: z.string().optional(),
      group: z.string().optional(),
    }),
  ),
});

export type ComponentDefinitionPropertyType = z.infer<typeof DefinitionPropertyTypeSchema>;
