import { z } from 'zod';
import {
  ComponentTreeSchema,
  ComponentVariableSchema,
  DataSourceSchema,
  localeWrapper,
  propertyKeySchema,
  UnboundValuesSchema,
  UsedComponentsSchema,
} from '../v2023_09_28/common';

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
  contentTypes: z.record(
    z.string(),
    z.object({
      sys: z.object({
        type: z.literal('Link'),
        id: z.string(),
        linkType: z.enum(['ContentType']),
      }),
    }),
  ),
});

export const PatternPropertyDefinitionsSchema = z.record(
  propertyKeySchema,
  PatternPropertyDefinitionSchema,
);

const VariableMappingsSchema = z.record(propertyKeySchema, VariableMappingSchema);

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
