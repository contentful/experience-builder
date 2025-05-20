import { z, ZodTypeAny } from 'zod';
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
  UnboundValueSchema,
  UnboundValuesSchema,
  UsedComponentsSchema,
} from '../v2023_09_28/common';
import { SchemaVersions } from '@/schemas/schemaVersions';

/**
 * Property keys for patterns have a limit of 54 characters (<32-char-variable-name>_<21-char-nanoid-id>).
 */
const propertyKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9-_]{1,54}$/, { message: 'Does not match /^[a-zA-Z0-9-_]{1,54}$/' });

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
  'duplex',
] as const;

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
export const PatternPropertySchema = z.object({
  type: z.literal('BoundValue'),
  path: z.string(),
  contentType: z.string(),
});

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
const VariableMappingSchema = z.object({
  patternPropertyDefinitionId: propertyKeySchema,
  type: z.literal('ContentTypeMapping'),
  pathsByContentType: z.record(z.string(), z.object({ path: z.string() })),
});

// TODO: finalize schema structure before release
// https://contentful.atlassian.net/browse/LUMOS-523
const PatternPropertyDefinitionSchema = z.object({
  defaultValue: z
    .record(
      z.string(),
      z.object({
        sys: z.object({
          type: z.literal('Link'),
          id: z.string(),
          linkType: z.enum(['Entry']),
        }),
      }),
    )
    .optional(),
  contentTypes: z.record(z.string(), z.any()),
});

export const PatternPropertyDefinitionsSchema = z.record(
  propertyKeySchema,
  PatternPropertyDefinitionSchema,
);

const localeWrapper = (fieldSchema: ZodTypeAny) => z.record(z.string(), fieldSchema);
const VariableMappingsSchema = z.record(propertyKeySchema, VariableMappingSchema);

const ComponentPropertyValueSchema = z.discriminatedUnion('type', [
  DesignValueSchema,
  BoundValueSchema,
  UnboundValueSchema,
  HyperlinkValueSchema,
  ComponentValueSchema,
  NoValueSchema,
]);

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

export const PatternPropertiesSchema = z.record(propertyKeySchema, PatternPropertySchema);

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

export const BreakpointSchema = z
  .object({
    id: propertyKeySchema,
    query: z.string().regex(/^\*$|^<[0-9*]+px$/),
    previewSize: z.string(),
    displayName: z.string(),
    displayIcon: z.enum(['desktop', 'tablet', 'mobile']).optional(),
  })
  .strict();

export const ComponentTreeSchema = z
  .object({
    breakpoints: z.array(BreakpointSchema).superRefine(breakpointsRefinement),
    children: z.array(ComponentTreeNodeSchema),
    schemaVersion: SchemaVersions,
  })
  .strict();

export const ComponentVariablesSchema = z.record(
  z.string().regex(/^[a-zA-Z0-9-_]{1,54}$/), // Here the key is <variableName>_<nanoidId> so we need to allow for a longer length
  ComponentVariableSchema,
);

const ComponentSettingsSchema = z.object({
  variableDefinitions: ComponentVariablesSchema,
  thumbnailId: z.enum(THUMBNAIL_IDS).optional(),
  category: z.string().max(50, 'Category must contain at most 50 characters').optional(),
  variableMappings: VariableMappingsSchema.optional(),
  patternPropertyDefinitions: PatternPropertyDefinitionsSchema.optional(),
});

// export const PatternFieldsCMAShapeSchema = ExperienceFieldsCMAShapeSchema;
export const PatternFieldsCMAShapeSchema = z.object({
  componentTree: localeWrapper(ComponentTreeSchema),
  dataSource: localeWrapper(DataSourceSchema),
  unboundValues: localeWrapper(UnboundValuesSchema),
  usedComponents: localeWrapper(UsedComponentsSchema).optional(),
  componentSettings: localeWrapper(ComponentSettingsSchema),
});

export { THUMBNAIL_IDS as PATTERN_THUMBNAIL_IDS };

export type PatternFields = z.infer<typeof PatternFieldsCMAShapeSchema>;
export type PatternPropertyDefinition = z.infer<typeof PatternPropertyDefinitionSchema>;
export type VariableMapping = z.infer<typeof VariableMappingSchema>;
export type PatternComponentSettings = z.infer<typeof ComponentSettingsSchema>;
