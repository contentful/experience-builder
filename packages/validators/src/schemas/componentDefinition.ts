import { z } from 'zod';
import {
  ComponentVariableSchema,
  DefinitionPropertyKeySchema,
  DefinitionPropertyTypeSchema,
  PrimitiveValueSchema,
} from './v2023_09_28/common';

export const ComponentDefinitionSchema = z
  .object({
    id: DefinitionPropertyKeySchema,
    name: z.string(),
    category: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    thumbnailId: z.string().optional(),
    hyperlinkPattern: z.string().optional(),
    children: z.boolean().optional(),
    slots: z
      .record(DefinitionPropertyKeySchema, z.object({ displayName: z.string().optional() }))
      .optional(),
    builtInStyles: z.array(z.string()).optional(),
    tooltip: z.object({ imageUrl: z.string().optional(), description: z.string() }).optional(),
    variables: z.record(
      DefinitionPropertyKeySchema,
      ComponentVariableSchema.extend({
        defaultValue: PrimitiveValueSchema.optional(),
      }).superRefine((val, ctx) => {
        switch (val.type) {
          case 'Array':
            if (typeof val.defaultValue !== 'undefined') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `defaultValue is not supported for "Array" type for ${ctx.path.join('.')}`,
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
                message: `defaultValue is not supported for "Link" type for ${ctx.path.join('.')}`,
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
  })
  .superRefine((val, ctx) => {
    if (val.children === true && (!!val.variables.children || !!val.slots?.children)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Cannot activate 'children: true' and name a variable or slot 'children' at the same time`,
        fatal: false,
      });
    }
    // Ensure that slots and variables don't use the same names
    if (val.variables && val.slots) {
      Object.keys(val.variables).forEach((name) => {
        if (val.slots![name]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Variable and slot cannot have the same name: ${name}`,
            fatal: false,
          });
        }
      });
    }
  });

export type ComponentDefinitionPropertyType = z.infer<typeof DefinitionPropertyTypeSchema>;
export type ComponentDefinitionType = z.infer<typeof ComponentDefinitionSchema>;
