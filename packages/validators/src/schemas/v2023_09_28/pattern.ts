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
import { treeVisit } from '@/utils/treeVisit';

export const MAX_ALLOWED_PATHS = 200;

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
  pathsByContentType: z
    .record(z.string(), z.object({ path: z.string() }))
    .superRefine((paths, ctx) => {
      const variableId = ctx.path[ctx.path.length - 2];
      if (Object.keys(paths).length > MAX_ALLOWED_PATHS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Too many paths defined for variable mapping with id "${variableId}", maximum allowed is ${MAX_ALLOWED_PATHS}`,
        });
      }
    }),
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
  contentTypes: z.array(z.string()).min(1),
  passToNodes: z
    .array(PassToNodeSchema)
    .max(1, 'At most one "passToNodes" element is allowed per parameter definition.')
    .optional(), // we might change this to be empty array for native parameter definitions, that's why we don't use .length(1)
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
  .strict()
  .superRefine((componentSettings, ctx) => {
    const { variableDefinitions, prebindingDefinitions } = componentSettings;
    if (!prebindingDefinitions || prebindingDefinitions.length === 0) {
      return;
    }
    const { parameterDefinitions, variableMappings, allowedVariableOverrides } =
      prebindingDefinitions[0];

    validateAtMostOneNativeParameterDefinition(parameterDefinitions, ctx);
    validateNoOverlapBetweenMappingAndOverrides(variableMappings, allowedVariableOverrides, ctx);
    validateMappingsAgainstVariableDefinitions(
      variableMappings,
      allowedVariableOverrides,
      variableDefinitions,
      ctx,
    );
    validateMappingsAgainstParameterDefinitions(variableMappings, parameterDefinitions, ctx);
  });

export const PatternFieldsCMAShapeSchema = z
  .object({
    componentTree: localeWrapper(ComponentTreeSchema),
    dataSource: localeWrapper(DataSourceSchema),
    unboundValues: localeWrapper(UnboundValuesSchema),
    usedComponents: localeWrapper(UsedComponentsSchema).optional(),
    componentSettings: localeWrapper(ComponentSettingsSchema),
  })
  .superRefine((patternFields, ctx) => {
    const { componentTree, componentSettings } = patternFields;

    // values at this point are wrapped under locale code
    const nonLocalisedComponentTree = Object.values(componentTree)[0];
    const nonLocalisedComponentSettings = Object.values(componentSettings)[0];

    if (!nonLocalisedComponentSettings || !nonLocalisedComponentTree) {
      return;
    }

    validatePassToNodes(
      nonLocalisedComponentTree.children || ([] as z.infer<typeof ComponentTreeSchema>['children']),
      nonLocalisedComponentSettings || ({} as PatternComponentSettings),
      ctx,
    );
  });

const validateAtMostOneNativeParameterDefinition = (
  parameterDefinitions: Record<string, ParameterDefinition>,
  ctx: z.RefinementCtx,
) => {
  const nativeParamDefinitions = Object.values(parameterDefinitions).filter(
    (paramDefinition) => !(paramDefinition.passToNodes && paramDefinition.passToNodes.length > 0),
  );

  if (nativeParamDefinitions.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Only one native parameter definition (parameter definition without passToNodes) is allowed per prebinding definition.`,
    });
  }
};

const validateNoOverlapBetweenMappingAndOverrides = (
  variableMappings: VariableMappings | undefined,
  allowedVariableOverrides: string[] | undefined,
  ctx: z.RefinementCtx,
) => {
  const variableMappingKeys = Object.keys(variableMappings || {});
  const overridesSet = new Set(allowedVariableOverrides || []);
  const overlap = variableMappingKeys.filter((key) => overridesSet.has(key));
  if (overlap.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Found both variable mapping and allowed override for the following keys: ${overlap.map((key) => `"${key}"`).join(', ')}.`,
    });
  }
};

const validateMappingsAgainstVariableDefinitions = (
  variableMappings: VariableMappings | undefined,
  allowedVariableOverrides: string[] | undefined,
  variableDefinitions: Record<string, z.infer<typeof ComponentVariableSchema>>,
  ctx: z.RefinementCtx,
) => {
  const nonDesignVariableDefinitionKeys = Object.entries(variableDefinitions)
    .filter(([_, def]) => def.group !== 'style')
    .map(([key]) => key);

  const variableMappingKeys = Object.keys(variableMappings || {});

  const allKeys = [...variableMappingKeys, ...(allowedVariableOverrides || [])];
  const invalidMappings = allKeys.filter((key) => !nonDesignVariableDefinitionKeys.includes(key));
  if (invalidMappings.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `The following variable mappings or overrides are missing from the variable definitions: ${invalidMappings.map((key) => `"${key}"`).join(', ')}.`,
    });
  }
};

const validateMappingsAgainstParameterDefinitions = (
  variableMappings: VariableMappings | undefined,
  parameterDefinitions: ParameterDefinitions,
  ctx: z.RefinementCtx,
) => {
  const parameterDefinitionKeys = Object.keys(parameterDefinitions || {});
  for (const [mappingKey, mappingValue] of Object.entries(variableMappings || {})) {
    if (!parameterDefinitionKeys.includes(mappingValue.parameterId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The variable mapping with id "${mappingKey}" references a non-existing parameterId "${mappingValue.parameterId}".`,
      });
    }
  }
};

const validatePassToNodes = (
  rootChildren: z.infer<typeof ComponentTreeSchema>['children'],
  componentSettings: PatternComponentSettings,
  ctx: z.RefinementCtx,
) => {
  if (
    !componentSettings.prebindingDefinitions ||
    componentSettings.prebindingDefinitions.length === 0
  ) {
    return;
  }
  const { parameterDefinitions } = componentSettings.prebindingDefinitions[0];

  let nodeIds: Set<string> = new Set();
  for (const paramDef of Object.values(parameterDefinitions || {})) {
    paramDef.passToNodes?.forEach((n) => nodeIds.add(n.nodeId));
  }

  treeVisit(rootChildren, (node) => {
    if (!node.id) return;
    if (nodeIds.has(node.id)) {
      nodeIds.delete(node.id);
    }
  });

  if (nodeIds.size > 0) {
    const stringifiedNodeIds = Array.from(nodeIds)
      .map((id) => `"${id}"`)
      .join(', ');
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `The following node IDs referenced in passToNodes are not present in the component tree: ${stringifiedNodeIds}.`,
    });
  }
};

export type PatternFields = z.infer<typeof PatternFieldsCMAShapeSchema>;
export type ParameterDefinition = z.infer<typeof ParameterDefinitionSchema>;
export type ParameterDefinitions = z.infer<typeof ParameterDefinitionsSchema>;
export type VariableMapping = z.infer<typeof VariableMappingSchema>;
export type VariableMappings = z.infer<typeof VariableMappingsSchema>;
export type PatternComponentSettings = z.infer<typeof ComponentSettingsSchema>;
export type PrebindingDefinition = z.infer<typeof PrebindingDefinitionSchema>;
