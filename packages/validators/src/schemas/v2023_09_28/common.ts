import { z } from 'zod';
import { Breakpoint } from '@/schemas/v2023_09_28/experience';

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

export const PrimitiveValueSchema = z.union([
  z.string(),
  z.boolean(),
  z.number(),
  z.record(z.any(), z.any()),
  z.undefined(),
]);

export const UsedComponentsSchema = z.array(
  z.object({
    sys: z.object({
      type: z.literal('Link'),
      id: z.string(),
      linkType: z.literal('Entry'),
    }),
  }),
);

export const uuidKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]{1,21}$/, { message: 'Does not match /^[a-zA-Z0-9-_]{1,21}$/' });

export const DataSourceSchema = z.record(
  uuidKeySchema,
  z.object({
    sys: z.object({
      type: z.literal('Link'),
      id: z.string(),
      linkType: z.enum(['Entry', 'Asset']),
    }),
  }),
);

export const UnboundValuesSchema = z.record(
  uuidKeySchema,
  z.object({
    value: PrimitiveValueSchema,
  }),
);

/**
 * Property keys for imported components have a limit of 32 characters (to be implemented) while
 * property keys for patterns have a limit of 54 characters (<32-char-variable-name>_<21-char-nanoid-id>).
 * Because we cannot distinguish between the two in the componentTree, we will use the larger limit for both.
 */
export const propertyKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]{1,54}$/, { message: 'Does not match /^[a-zA-Z0-9-_]{1,54}$/' });

export const ComponentTreeNodeIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]{1,8}$/, { message: 'Does not match /^[a-zA-Z0-9]{1,8}$/' });

export const breakpointsRefinement = (value: Breakpoint[], ctx: z.RefinementCtx) => {
  if (!value.length || value[0].query !== '*') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `The first breakpoint should include the following attributes: { "query": "*" }`,
    });
  }

  const hasDuplicateIds = value.some((currentBreakpoint, currentBreakpointIndex) => {
    // check if the current breakpoint id is found in the rest of the array
    const breakpointIndex = value.findIndex((breakpoint) => breakpoint.id === currentBreakpoint.id);
    return breakpointIndex !== currentBreakpointIndex;
  });

  if (hasDuplicateIds) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Breakpoint IDs must be unique`,
    });
  }

  // Extract the queries boundary by removing the special characters around it
  const queries = value.map((bp) =>
    bp.query === '*' ? bp.query : parseInt(bp.query.replace(/px|<|>/, '')),
  );

  // sort updates queries array in place so we need to create a copy
  const originalQueries = [...queries];
  queries.sort((q1, q2) => {
    if (q1 === '*') {
      return -1;
    }
    if (q2 === '*') {
      return 1;
    }
    return q1 > q2 ? -1 : 1;
  });

  if (originalQueries.join('') !== queries.join('')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Breakpoints should be ordered from largest to smallest pixel value`,
    });
  }
};

export const ValuesByBreakpointSchema = z.record(z.lazy(() => PrimitiveValueSchema));

export const BindingSourceTypeEnumSchema = z
  .array(z.enum(['entry', 'asset', 'manual', 'experience']))
  .nonempty();

export const DesignValueSchema = z
  .object({
    type: z.literal('DesignValue'),
    valuesByBreakpoint: ValuesByBreakpointSchema,
  })
  .strict();

export const BoundValueSchema = z
  .object({
    type: z.literal('BoundValue'),
    path: z.string(),
  })
  .strict();

export const HyperlinkValueSchema = z
  .object({
    type: z.literal('HyperlinkValue'),
    linkTargetKey: z.string(),
    /** Allows to override parts of the URL, e.g. the locale */
    overrides: z.object({}).optional(),
  })
  .strict();

export const UnboundValueSchema = z
  .object({
    type: z.literal('UnboundValue'),
    key: z.string(),
  })
  .strict();

export const ComponentValueSchema = z
  .object({
    type: z.literal('ComponentValue'),
    key: z.string(),
  })
  .strict();

export const NoValueSchema = z.object({ type: z.literal('NoValue') }).strict();
