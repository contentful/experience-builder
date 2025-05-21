import { z, ZodTypeAny } from 'zod';
import { SchemaVersions } from '../schemaVersions';
import {
  BindingSourceTypeEnumSchema,
  BoundValueSchema,
  breakpointsRefinement,
  ComponentTreeNodeIdSchema,
  ComponentValueSchema,
  DataSourceSchema,
  DefinitionPropertyKeySchema,
  DefinitionPropertyTypeSchema,
  DesignValueSchema,
  HyperlinkValueSchema,
  NoValueSchema,
  PrimitiveValueSchema,
  propertyKeySchema,
  UnboundValueSchema,
  UnboundValuesSchema,
  UsedComponentsSchema,
  ValuesByBreakpointSchema,
} from './common';

const ComponentPropertyValueSchema = z.discriminatedUnion('type', [
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
const PatternPropertySchema = z.object({
  type: z.literal('BoundValue'),
  path: z.string(),
  contentType: z.string(),
});

export const PatternPropertiesSchema = z.record(propertyKeySchema, PatternPropertySchema);

export const BreakpointSchema = z
  .object({
    id: propertyKeySchema,
    query: z.string().regex(/^\*$|^<[0-9*]+px$/),
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
  patternProperties: PatternPropertiesSchema.optional(),
});
export type ComponentTreeNode = z.infer<typeof BaseComponentTreeNodeSchema> & {
  children: ComponentTreeNode[];
};
const ComponentTreeNodeSchema: z.ZodType<ComponentTreeNode> = BaseComponentTreeNodeSchema.extend({
  children: z.lazy(() => ComponentTreeNodeSchema.array()),
});

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

export const ComponentTreeSchema = z
  .object({
    breakpoints: z.array(BreakpointSchema).superRefine(breakpointsRefinement),
    children: z.array(ComponentTreeNodeSchema),
    schemaVersion: SchemaVersions,
  })
  .strict();

const localeWrapper = (fieldSchema: ZodTypeAny) => z.record(z.string(), fieldSchema);

export const ExperienceFieldsCMAShapeSchema = z.object({
  componentTree: localeWrapper(ComponentTreeSchema),
  dataSource: localeWrapper(DataSourceSchema),
  unboundValues: localeWrapper(UnboundValuesSchema),
  usedComponents: localeWrapper(UsedComponentsSchema).optional(),
});

export type ExperienceFields = z.infer<typeof ExperienceFieldsCMAShapeSchema>;
export type ExperienceDataSource = z.infer<typeof DataSourceSchema>;
export type ExperienceUnboundValues = z.infer<typeof UnboundValuesSchema>;
export type ExperienceUsedComponents = z.infer<typeof UsedComponentsSchema>;
export type ExperienceComponentTree = z.infer<typeof ComponentTreeSchema>;
export type ValuesByBreakpoint = z.infer<typeof ValuesByBreakpointSchema>;
export type Breakpoint = z.infer<typeof BreakpointSchema>;
export type PrimitiveValue = z.infer<typeof PrimitiveValueSchema>;
export type DesignValue = z.infer<typeof DesignValueSchema>;
export type BoundValue = z.infer<typeof BoundValueSchema>;
export type NoValue = z.infer<typeof NoValueSchema>;
export type UnboundValue = z.infer<typeof UnboundValueSchema>;
export type HyperlinkValue = z.infer<typeof HyperlinkValueSchema>;
export type ComponentValue = z.infer<typeof ComponentValueSchema>;
export type BindingSourceTypeEnum = z.infer<typeof BindingSourceTypeEnumSchema>;
export type PatternProperty = z.infer<typeof PatternPropertySchema>;
export { breakpointsRefinement };

// Re-exports for compatibility. Remove when no longer needed
export { PATTERN_THUMBNAIL_IDS } from './pattern'; // re-export for compatibility
export type {
  VariableMapping,
  PatternComponentSettings as ExperienceComponentSettings,
} from './pattern';
