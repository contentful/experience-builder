import { z } from 'zod';
import { SchemaVersions } from '../schemaVersions';

const uuidKeySchema = z.string().regex(/^[a-zA-Z0-9-_]{1,21}$/);
const propertyKeySchema = z.string().regex(/^[a-zA-Z0-9-_]{1,32}$/);

const DataSourceSchema = z.record(
  uuidKeySchema,
  z.object({
    sys: z.object({
      type: z.literal('Link'),
      id: z.string(),
      linkType: z.literal('Entry').or(z.literal('Asset')),
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

export const ComponentDefinitionPropertyTypeSchema = z.enum([
  'Text',
  'RichText',
  'Number',
  'Date',
  'Boolean',
  'Location',
  'Media',
  'Object',
]);

const ValuesByBreakpointSchema = z.record(z.lazy(() => PrimitiveValueSchema));

const ComponentPropertyValueSchema = z.union([
  z.object({
    type: z.literal('DesignValue'),
    valuesByBreakpoint: ValuesByBreakpointSchema,
  }),
  z.object({
    type: z.literal('BoundValue'),
    path: z.string(),
  }),
  z.object({
    type: z.literal('UnboundValue'),
    key: z.string(),
  }),
  z.object({
    type: z.literal('ComponentValue'),
    key: z.string(),
  }),
]);

export type ComponentPropertyValue = z.infer<typeof ComponentPropertyValueSchema>;

const BreakpointSchema = z.object({
  id: propertyKeySchema,
  query: z.string().regex(/^\*$|^<[0-9*]+px$/),
  previewSize: z.string(),
  displayName: z.string(),
});

const UnboundValuesSchema = z.record(
  uuidKeySchema,
  z.object({
    value: PrimitiveValueSchema,
  }),
);

// Use helper schema to define a recursive schema with its type correctly below
const BaseComponentTreeNodeSchema = z.object({
  definitionId: z.string(),
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
      displayName: z.string(),
      type: ComponentDefinitionPropertyTypeSchema,
      defaultValue: ComponentPropertyValueSchema.optional(),
      description: z.string().optional(),
      group: z.string().optional(),
      validations: z.record(z.string()).optional(),
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

const breakpointsRefinement = (value: Breakpoint[], ctx: z.RefinementCtx) => {
  if (!value.length || value[0].id !== 'desktop' || value[0].query !== '*') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `The first breakpoint should include the following attributes: { "id": "desktop", "query": "*" }`,
      path: [...ctx.path, 0],
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

const ComponentTreeSchema = z.object({
  breakpoints: z.array(BreakpointSchema).superRefine(breakpointsRefinement),
  children: z.array(ComponentTreeNodeSchema),
  schemaVersion: SchemaVersions,
});

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
