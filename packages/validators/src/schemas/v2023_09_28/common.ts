import { z, ZodTypeAny } from 'zod';
import { Breakpoint } from '@/schemas/v2023_09_28/experience';
import { SchemaVersions } from '@/schemas/schemaVersions';

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
    return;
  }

  // Return early if there's only one generic breakpoint
  const hasNoBreakpointsStrategy = value.length === 1;
  if (hasNoBreakpointsStrategy) {
    return;
  }

  // Check if any breakpoint id occurs twice
  const ids = value.map((breakpoint) => breakpoint.id);
  const hasDuplicateIds = new Set(ids).size !== ids.length;
  if (hasDuplicateIds) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Breakpoint IDs must be unique`,
    });
    return;
  }

  // Skip the first one which is guaranteed to be a wildcard query
  const nonBaseBreakpoints = value.slice(1);
  const isMobileFirstStrategy = nonBaseBreakpoints[0].query.startsWith('>');
  const isDesktopFirstStrategy = nonBaseBreakpoints[0].query.startsWith('<');

  if (isMobileFirstStrategy) {
    const areOperatorsEqual = nonBaseBreakpoints.every(({ query }) => query.startsWith('>'));
    if (!areOperatorsEqual) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Breakpoint queries must be in the format ">[size]px" for mobile-first strategy`,
      });
    }

    // Extract the queries boundary by removing the special characters around it
    const queries = nonBaseBreakpoints.map((bp) => parseInt(bp.query.replace(/px|<|>/, '')));

    // Starting with the third breakpoint, check that every query is higher than the one above
    const isIncreasing = queries.every(
      (value, index, array) => index === 0 || value > array[index - 1],
    );
    if (!isIncreasing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `When using a mobile-first strategy, all breakpoints must have strictly increasing pixel values`,
      });
    }
  } else if (isDesktopFirstStrategy) {
    const areOperatorsEqual = nonBaseBreakpoints.every(({ query }) => query.startsWith('<'));
    if (!areOperatorsEqual) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Breakpoint queries must be in the format "<[size]px" for desktop-first strategy`,
      });
    }

    // Extract the queries boundary by removing the special characters around it
    const queries = nonBaseBreakpoints.map((bp) => parseInt(bp.query.replace(/px|<|>/, '')));

    // Starting with the third breakpoint, check that every query is lower than the one above
    const isDecreasing = queries.every(
      (value, index, array) => index === 0 || value < array[index - 1],
    );
    if (!isDecreasing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `When using a desktop-first strategy, all breakpoints must have strictly decreasing pixel values`,
      });
    }
  } else if (!isMobileFirstStrategy && !isDesktopFirstStrategy) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `You may only use a mobile-first or desktop-first strategy for breakpoints using '<' or '>' queries`,
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

export const ComponentPropertyValueSchema = z.discriminatedUnion('type', [
  DesignValueSchema,
  BoundValueSchema,
  UnboundValueSchema,
  HyperlinkValueSchema,
  ComponentValueSchema,
  NoValueSchema,
]);

export type ComponentPropertyValue = z.infer<typeof ComponentPropertyValueSchema>;

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
export const ParameterSchema = z.object({
  type: z.literal('BoundValue'),
  path: z.string(),
});

export const ParametersSchema = z.record(propertyKeySchema, ParameterSchema);

export const BreakpointSchema = z
  .object({
    id: propertyKeySchema,
    query: z.string().regex(/^\*$|^[<>][0-9*]+px$/),
    previewSize: z.string(),
    displayName: z.string(),
    displayIcon: z.enum(['desktop', 'tablet', 'mobile']).optional(),
  })
  .strict();

// Use helper schema to define a recursive schema with its type correctly below
const BaseComponentTreeNodeSchema = z.object({
  id: ComponentTreeNodeIdSchema.optional(),
  definitionId: DefinitionPropertyKeySchema,
  displayName: z.string().optional(),
  slotId: z.string().optional(),
  variables: z.record(propertyKeySchema, ComponentPropertyValueSchema),
  parameters: ParametersSchema.optional(),
});

export type ComponentTreeNode = z.infer<typeof BaseComponentTreeNodeSchema> & {
  children: ComponentTreeNode[];
};

export const ComponentVariableSchema = z.object({
  displayName: z.string().optional(),
  type: DefinitionPropertyTypeSchema,
  description: z.string().optional(),
  group: z.string().optional(),
  defaultValue: PrimitiveValueSchema.or(ComponentPropertyValueSchema).optional(),
  validations: z
    .object({
      bindingSourceType: BindingSourceTypeEnumSchema.optional(),
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
});

export const ComponentTreeNodeSchema: z.ZodType<ComponentTreeNode> =
  BaseComponentTreeNodeSchema.extend({
    children: z.lazy(() => ComponentTreeNodeSchema.array()),
  });

export const ComponentTreeSchema = z
  .object({
    breakpoints: z.array(BreakpointSchema).superRefine(breakpointsRefinement),
    children: z.array(ComponentTreeNodeSchema),
    schemaVersion: SchemaVersions,
  })
  .strict();
export const localeWrapper = (fieldSchema: ZodTypeAny) => z.record(z.string(), fieldSchema);
