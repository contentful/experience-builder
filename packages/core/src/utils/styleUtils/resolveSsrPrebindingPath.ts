import type { Asset, Entry } from 'contentful';
import type { ComponentTreeNode } from '@/types';
import type {
  ExperienceComponentSettings,
  ExperienceDataSource,
  Parameter,
} from '@contentful/experiences-validators';

/**
 * SSR counterpart of `resolvePrebindingPath` from the SDK (which relies on state that only exists
 * while deserializing patterns on the client). Resolves a pattern variable through the pattern's
 * `variableMappings` and the `parameters` of the pattern instance.
 *
 * @returns the full bound path, e.g. `/cardLink/fields/featuredImage/~locale/fields/file/~locale`,
 * or `undefined` when the variable is not prebound or the prebinding can't be resolved.
 */
export const resolveSsrPrebindingPath = ({
  componentValueKey,
  componentSettings,
  parameters,
  dataSource,
  getBoundEntityById,
}: {
  componentValueKey: string;
  componentSettings?: ExperienceComponentSettings;
  parameters?: Record<string, Parameter>;
  dataSource: ExperienceDataSource;
  getBoundEntityById: (id: string) => Entry | Asset | undefined;
}): string | undefined => {
  const prebindingDefinition = componentSettings?.prebindingDefinitions?.[0];
  const variableMapping = prebindingDefinition?.variableMappings?.[componentValueKey];
  if (!prebindingDefinition || !variableMapping) {
    return undefined;
  }

  // Variables that may be overwritten on the instance are not driven by the prebinding
  const { allowedVariableOverrides } = prebindingDefinition;
  if (
    !Array.isArray(allowedVariableOverrides) ||
    allowedVariableOverrides.includes(componentValueKey)
  ) {
    return undefined;
  }

  const parameter = parameters?.[variableMapping.parameterId];
  if (!parameter) {
    return undefined;
  }

  const [, dataSourceKey] = parameter.path.split('/');
  const entityLink = dataSource[dataSourceKey];
  if (!entityLink) {
    return undefined;
  }

  const entity = getBoundEntityById(entityLink.sys.id);
  if (!entity || entity.sys.type !== 'Entry') {
    return undefined;
  }

  // Same guard as in the SDK: the parameter only accepts entries of the allowed content types
  const contentTypeId = entity.sys.contentType.sys.id;
  const parameterDefinition =
    prebindingDefinition.parameterDefinitions?.[variableMapping.parameterId];
  if (!parameterDefinition?.contentTypes.includes(contentTypeId)) {
    return undefined;
  }

  const fieldPath = variableMapping.pathsByContentType?.[contentTypeId]?.path;
  if (!fieldPath) {
    return undefined;
  }

  return parameter.path + fieldPath;
};

/**
 * Computes the parameters of a pattern node that is rendered inside another pattern.
 * The wrapping pattern forwards its own parameters to the nested pattern node through
 * `passToNodes` (e.g. `rowParam` of "Card row" becomes `cardParam` of the nested "Single Card").
 * Parameters set directly on the node (pattern instances in an experience) are kept as they are.
 */
export const resolveSsrPatternNodeParameters = ({
  patternNode,
  wrapperComponentSettings,
  wrapperParameters,
}: {
  patternNode: ComponentTreeNode;
  wrapperComponentSettings?: ExperienceComponentSettings;
  wrapperParameters?: Record<string, Parameter>;
}): Record<string, Parameter> | undefined => {
  const passedParameters: Record<string, Parameter> = {};

  const parameterDefinitions =
    wrapperComponentSettings?.prebindingDefinitions?.[0]?.parameterDefinitions ?? {};

  for (const [parameterId, parameterDefinition] of Object.entries(parameterDefinitions)) {
    const [passToNode] = parameterDefinition.passToNodes ?? [];
    const wrapperParameter = wrapperParameters?.[parameterId];
    if (passToNode && patternNode.id && passToNode.nodeId === patternNode.id && wrapperParameter) {
      passedParameters[passToNode.parameterId] = wrapperParameter;
    }
  }

  const parameters = { ...passedParameters, ...patternNode.parameters };
  return Object.keys(parameters).length ? parameters : undefined;
};
