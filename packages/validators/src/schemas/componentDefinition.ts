import { z } from 'zod';
import { PrimitiveValueSchema } from './v2023_09_28/experience';

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
  'Array',
  'Link',
]);

export const DefinitionPropertyKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]{1,32}$/, { message: 'Property needs to match: /^[a-zA-Z0-9-_]{1,32}$/' });

export const ComponentDefinitionSchema = z.object({
  id: DefinitionPropertyKeySchema,
  variables: z.record(
    DefinitionPropertyKeySchema,
    z
      .object({
        // TODO - extend with definition of validations and defaultValue
        displayName: z.string().optional(),
        type: DefinitionPropertyTypeSchema,
        description: z.string().optional(),
        group: z.string().optional(),
        defaultValue: PrimitiveValueSchema.optional(),
      })
      .superRefine((val, ctx) => {
        switch (val.type) {
          case 'Array':
            if (typeof val.defaultValue !== 'undefined' && !Array.isArray(val.defaultValue)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be an array when type is "Array" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Boolean':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'boolean') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be a boolean when type is "Boolean" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Date':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'string') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be a string when type is "Date" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Hyperlink':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'string') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be a string when type is "Hyperlink" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Link':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'object') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be an object when type is "Link" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Location':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'object') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be an object when type is "Location" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Media':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'string') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be a string when type is "Media" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Number':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'number') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be a number when type is "Number" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Object':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'object') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be an object when type is "Object" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'RichText':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'object') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be an object when type is "RichText" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
          case 'Text':
            if (typeof val.defaultValue !== 'undefined' && typeof val.defaultValue !== 'string') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue must be a string when type is "Text" for ${ctx.path.join('.')}, got ${typeof val.defaultValue} instead`,
                fatal: false,
              });
            }
            break;
        }
      }),
  ),
});

export type ComponentDefinitionPropertyType = z.infer<typeof DefinitionPropertyTypeSchema>;
export type ComponentDefinitionType = z.infer<typeof ComponentDefinitionSchema>;
