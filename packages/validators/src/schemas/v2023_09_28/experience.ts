import { z } from 'zod';
import { SchemaVersions } from '../schemaVersions';

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
    /** Allows to override parts of the URL, e.g. the locale */
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

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
const EmptyObjectSchema = z.object({ type: z.undefined() });

const ComponentPropertyValueSchema = z.discriminatedUnion('type', [
  DesignValueSchema,
  BoundValueSchema,
  UnboundValueSchema,
  HyperlinkValueSchema,
  ComponentValueSchema,
  EmptyObjectSchema,
]);

export type ComponentPropertyValue = z.infer<typeof ComponentPropertyValueSchema>;

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
const VariableMappingSchema = z.object({
  patternPropertyDefinitionId: propertyKeySchema,
  type: z.literal('ContentTypeMapping'),
  pathsByContentType: z.record(z.string(), z.object({ path: z.string() })),
});

const VariableMappingsSchema = z.record(propertyKeySchema, VariableMappingSchema);

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
const PatternPropertyDefinitionSchema = z.object({
  defaultValue: z.union([
    z.object({
      path: z.string(),
      type: z.literal('BoundValue'),
    }),
    z.null(),
  ]),
  contentTypes: z.record(z.string(), z.any()),
});

const PatternPropertyDefinitionsSchema = z.record(
  propertyKeySchema,
  PatternPropertyDefinitionSchema,
);

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
const PatternPropertySchema = z.object({
  type: z.literal('BoundValue'),
  path: z.string(),
});

const PatternPropertysSchema = z.record(propertyKeySchema, PatternPropertySchema);

export const BreakpointSchema = z
  .object({
    id: propertyKeySchema,
    query: z.string().regex(/^\*$|^<[0-9*]+px$/),
    previewSize: z.string(),
    displayName: z.string(),
    displayIcon: z.enum(['desktop', 'tablet', 'mobile']).optional(),
  })
  .strict();

const UnboundValuesSchema = z.record(
  uuidKeySchema,
  z.object({
    value: PrimitiveValueSchema,
  }),
);

export const ComponentTreeNodeIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]{1,8}$/, { message: 'Does not match /^[a-zA-Z0-9]{1,8}$/' });

// Use helper schema to define a recursive schema with its type correctly below
const BaseComponentTreeNodeSchema = z.object({
  id: ComponentTreeNodeIdSchema.optional(),
  definitionId: DefinitionPropertyKeySchema,
  displayName: z.string().optional(),
  slotId: z.string().optional(),
  variables: z.record(propertyKeySchema, ComponentPropertyValueSchema),
  patternProperties: PatternPropertysSchema.optional(),
});
export type ComponentTreeNode = z.infer<typeof BaseComponentTreeNodeSchema> & {
  children: ComponentTreeNode[];
};
const ComponentTreeNodeSchema: z.ZodType<ComponentTreeNode> = BaseComponentTreeNodeSchema.extend({
  children: z.lazy(() => ComponentTreeNodeSchema.array()),
});

const BindingSourceTypeEnumSchema = z
  .array(z.enum(['entry', 'asset', 'manual', 'experience']))
  .nonempty();

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

export const ComponentVariablesSchema = z.record(
  z.string().regex(/^[a-zA-Z0-9-_]{1,54}$/), // Here the key is <variableName>_<nanoidId> so we need to allow for a longer length
  ComponentVariableSchema,
);

const THUMBNAIL_IDS = [
  'columns',
  'columnsPlusRight',
  'imagesSquare',
  'subtitles',
  'rowsPlusBottom',
  'userRectangle',
  'textbox',
  'monitorPlay',
  'article',
  'table',
  'star',
  'heartStraight',
  'frameCorners',
  'rows',
  'dotsThreeOutline',
  'listDashes',
  'checkerBoard',
  'gridFour',
  'slideshow',
  'diamondsFour',
  'cards',
  'textColumns',
] as const;

const ComponentSettingsSchema = z.object({
  variableDefinitions: ComponentVariablesSchema,
  thumbnailId: z.enum(THUMBNAIL_IDS),
  variableMappings: VariableMappingsSchema.optional(),
  patternPropertyDefinitions: PatternPropertyDefinitionsSchema.optional(),
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

const ComponentTreeSchema = z
  .object({
    breakpoints: z.array(BreakpointSchema).superRefine(breakpointsRefinement),
    children: z.array(ComponentTreeNodeSchema),
    schemaVersion: SchemaVersions,
  })
  .strict();

const localeWrapper = (fieldSchema: any) => z.record(z.string(), fieldSchema);

export const ExperienceFieldsCMAShapeSchema = z.object({
  componentTree: localeWrapper(ComponentTreeSchema),
  dataSource: localeWrapper(DataSourceSchema),
  unboundValues: localeWrapper(UnboundValuesSchema),
  usedComponents: localeWrapper(UsedComponentsSchema).optional(),
  componentSettings: localeWrapper(ComponentSettingsSchema).optional(),
});

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
export type HyperlinkValue = z.infer<typeof HyperlinkValueSchema>;
export type ComponentValue = z.infer<typeof ComponentValueSchema>;
export type BindingSourceTypeEnum = z.infer<typeof BindingSourceTypeEnumSchema>;
export type PatternPropertyDefinition = z.infer<typeof PatternPropertyDefinitionSchema>;
export type PatternProperty = z.infer<typeof PatternPropertySchema>;
export type VariableMapping = z.infer<typeof VariableMappingSchema>;
