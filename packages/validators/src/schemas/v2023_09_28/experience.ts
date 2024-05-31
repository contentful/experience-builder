import { z } from 'zod';
import { SchemaVersions } from '../schemaVersions';
import { DefinitionPropertyTypeSchema, DefinitionPropertyKeySchema } from '../componentDefinition';

const uuidKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]{1,21}$/, { message: 'Does not match /^[a-zA-Z0-9-_]{1,21}$/' });

/**
 * Property keys for imported components have a limit of 32 characters (to be implemented) while
 * property keys for patterns have a limit of 54 characters (<32-char-variabl-name>_<21-char-nanoid-id>).
 * Because we cannot distinguish between the two in the componentTree, we will use the larger limit for both.
 */
const propertyKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]{1,54}$/, { message: 'Does not match /^[a-zA-Z0-9-_]{1,54}$/' });

const DataSourceSchema = z.record(
  uuidKeySchema,
  z.object({
    sys: z.object({
      type: z.literal('Link'),
      id: z.string(),
      linkType: z.enum(['Entry', 'Asset']),
    }),
  }),
);

const PrimitiveValueSchema = z.union([
  z.string(),
  z.boolean(),
  z.number(),
  z.record(z.any(), z.any()),
  z.undefined(),
]);

const ValuesByBreakpointSchema = z.record(z.lazy(() => PrimitiveValueSchema));

const DesignValueSchema = z
  .object({
    type: z.literal('DesignValue'),
    valuesByBreakpoint: ValuesByBreakpointSchema,
  })
  .strict();
const BoundValueSchema = z
  .object({
    type: z.literal('BoundValue'),
    path: z.string(),
  })
  .strict();
const HyperlinkValueSchema = z
  .object({
    type: z.literal('HyperlinkValue'),
    linkTargetKey: z.string(),
    overrides: z.object({}).optional(),
  })
  .strict();
const UnboundValueSchema = z
  .object({
    type: z.literal('UnboundValue'),
    key: z.string(),
  })
  .strict();
const ComponentValueSchema = z
  .object({
    type: z.literal('ComponentValue'),
    key: z.string(),
  })
  .strict();

const ComponentPropertyValueSchema = z.discriminatedUnion('type', [
  DesignValueSchema,
  BoundValueSchema,
  UnboundValueSchema,
  HyperlinkValueSchema,
  ComponentValueSchema,
]);

export type ComponentPropertyValue = z.infer<typeof ComponentPropertyValueSchema>;

export const BreakpointSchema = z
  .object({
    id: propertyKeySchema,
    query: z.string().regex(/^\*$|^<[0-9*]+px$/),
    previewSize: z.string(),
    displayName: z.string(),
    displayIconUrl: z.string().optional(),
  })
  .strict();

const UnboundValuesSchema = z.record(
  uuidKeySchema,
  z.object({
    value: PrimitiveValueSchema,
  }),
);

// Use helper schema to define a recursive schema with its type correctly below
const BaseComponentTreeNodeSchema = z.object({
  definitionId: DefinitionPropertyKeySchema,
  displayName: z.string().optional(),
  slotId: z.string().optional(),
  variables: z.record(propertyKeySchema, ComponentPropertyValueSchema),
});
export type ComponentTreeNode = z.infer<typeof BaseComponentTreeNodeSchema> & {
  children: ComponentTreeNode[];
};
const ComponentTreeNodeSchema: z.ZodType<ComponentTreeNode> = BaseComponentTreeNodeSchema.extend({
  children: z.lazy(() => ComponentTreeNodeSchema.array()),
});

const ComponentSettingsSchema = z.object({
  variableDefinitions: z.record(
    z.string().regex(/^[a-zA-Z0-9-_]{1,54}$/), // Here the key is <variableName>_<nanoidId> so we need to allow for a longer length
    z.object({
      displayName: z.string().optional(),
      type: DefinitionPropertyTypeSchema,
      defaultValue: PrimitiveValueSchema.or(ComponentPropertyValueSchema).optional(),
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

const UsedComponentsSchema = z.array(
  z.object({
    sys: z.object({
      type: z.literal('Link'),
      id: z.string(),
      linkType: z.literal('Entry'),
    }),
  }),
);

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

const componentSettingsRefinement = (value, ctx: z.RefinementCtx) => {
  const { componentSettings, usedComponents } = value as ExperienceFields;

  if (!componentSettings || !usedComponents) {
    return;
  }
  const localeKey = Object.keys(componentSettings ?? {})[0];

  if (componentSettings[localeKey] !== undefined && usedComponents[localeKey] !== undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `'componentSettings' field cannot be used in conjunction with 'usedComponents' field`,
      path: ['componentSettings', localeKey],
    });
  }
};

const ComponentTreeSchema = z
  .object({
    breakpoints: z.array(BreakpointSchema).superRefine(breakpointsRefinement),
    children: z.array(ComponentTreeNodeSchema),
    schemaVersion: SchemaVersions,
  })
  .strict();

const localeWrapper = (fieldSchema: any) => z.record(z.string(), fieldSchema);

export const ExperienceFieldsCMAShapeSchema = z
  .object({
    componentTree: localeWrapper(ComponentTreeSchema),
    dataSource: localeWrapper(DataSourceSchema),
    unboundValues: localeWrapper(UnboundValuesSchema),
    usedComponents: localeWrapper(UsedComponentsSchema).optional(),
    componentSettings: localeWrapper(ComponentSettingsSchema).optional(),
  })
  .superRefine(componentSettingsRefinement);

export type ExperienceFields = z.infer<typeof ExperienceFieldsCMAShapeSchema>;
export type ExperienceDataSource = z.infer<typeof DataSourceSchema>;
export type ExperienceUnboundValues = z.infer<typeof UnboundValuesSchema>;
export type ExperienceUsedComponents = z.infer<typeof UsedComponentsSchema>;
export type ExperienceComponentSettings = z.infer<typeof ComponentSettingsSchema>;
export type ExperienceComponentTree = z.infer<typeof ComponentTreeSchema>;
export type ValuesByBreakpoint = z.infer<typeof ValuesByBreakpointSchema>;
export type Breakpoint = z.infer<typeof BreakpointSchema>;
export type PrimitiveValue = z.infer<typeof PrimitiveValueSchema>;
export type DesignValue = z.infer<typeof DesignValueSchema>;
export type BoundValue = z.infer<typeof BoundValueSchema>;
export type UnboundValue = z.infer<typeof UnboundValueSchema>;
export type ComponentValue = z.infer<typeof ComponentValueSchema>;
