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

export const THUMBNAIL_IDS = [
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
  parameterId: propertyKeySchema,
  type: z.literal('ContentTypeMapping'),
  pathsByContentType: z.record(z.string(), z.object({ path: z.string() })),
});

export const PassToNodeSchema = z
  .object({
    nodeId: propertyKeySchema,
    parameterId: propertyKeySchema,
    prebindingId: propertyKeySchema,
  })
  .strict();

const ParameterDefinitionSchema = z.object({
  defaultSource: z
    .strictObject({
      type: z.enum(['Entry']),
      contentTypeId: z.string(),
      link: z.strictObject({
        sys: z.strictObject({
          type: z.literal('Link'),
          id: z.string(),
          linkType: z.enum(['Entry']),
        }),
      }),
    })
    .optional(),
  contentTypes: z.array(z.string()),
  passToNodes: z.array(PassToNodeSchema).optional(),
});

export const ParameterDefinitionsSchema = z.record(propertyKeySchema, ParameterDefinitionSchema);

const VariableMappingsSchema = z.record(propertyKeySchema, VariableMappingSchema);

export const ComponentVariablesSchema = z.record(
  z.string().regex(/^[a-zA-Z0-9-_]{1,54}$/), // Here the key is <variableName>_<nanoidId> so we need to allow for a longer length
  ComponentVariableSchema,
);

export const PrebindingDefinitionSchema = z
  .object({
    id: propertyKeySchema,
    parameterDefinitions: ParameterDefinitionsSchema,
    variableMappings: VariableMappingsSchema.optional(),
    allowedVariableOverrides: z.array(z.string()).optional(),
  })
  .strict();

const ComponentSettingsSchema = z
  .object({
    variableDefinitions: ComponentVariablesSchema,
    thumbnailId: z.enum(THUMBNAIL_IDS).optional(),
    category: z.string().max(50, 'Category must contain at most 50 characters').optional(),
    prebindingDefinitions: z.array(PrebindingDefinitionSchema).length(1).optional(),
  })
  .strict();

export const PatternFieldsCMAShapeSchema = z.object({
  componentTree: localeWrapper(ComponentTreeSchema),
  dataSource: localeWrapper(DataSourceSchema),
  unboundValues: localeWrapper(UnboundValuesSchema),
  usedComponents: localeWrapper(UsedComponentsSchema).optional(),
  componentSettings: localeWrapper(ComponentSettingsSchema),
});

export type PatternFields = z.infer<typeof PatternFieldsCMAShapeSchema>;
export type ParameterDefinition = z.infer<typeof ParameterDefinitionSchema>;
export type VariableMapping = z.infer<typeof VariableMappingSchema>;
export type PatternComponentSettings = z.infer<typeof ComponentSettingsSchema>;
