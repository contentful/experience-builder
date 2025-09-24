import { type EntityStore, isLink } from '@contentful/experiences-core';
import { ExperienceComponentSettings, Parameter } from '@contentful/experiences-validators';

export const shouldUsePrebinding = ({
  componentValueKey,
  componentSettings,
  parameters,
}: {
  componentValueKey: string;
  componentSettings: ExperienceComponentSettings;
  parameters: Record<string, Parameter>;
}) => {
  const { prebindingDefinitions } = componentSettings;
  const { parameterDefinitions, variableMappings, allowedVariableOverrides } =
    prebindingDefinitions?.[0] || {};

  const variableMapping = variableMappings?.[componentValueKey];

  const parameterDefinition = parameterDefinitions?.[variableMapping?.parameterId || ''];
  const parameter = parameters?.[variableMapping?.parameterId || ''];

  const isValidForPrebinding =
    !!parameterDefinition &&
    !!parameter &&
    !!variableMapping &&
    !!allowedVariableOverrides &&
    Array.isArray(allowedVariableOverrides);

  if (!isValidForPrebinding) {
    return false;
  }

  // removed 'NoValue' check
  const isForDirectBindingOnly = allowedVariableOverrides.includes(componentValueKey);
  return !isForDirectBindingOnly;
};

export const resolvePrebindingPath = ({
  componentValueKey,
  componentSettings,
  parameters,
  entityStore,
}: {
  componentValueKey: string;
  componentSettings: ExperienceComponentSettings;
  parameters: Record<string, Parameter>;
  entityStore: EntityStore;
}) => {
  const prebindingDefinition = componentSettings.prebindingDefinitions?.[0];
  if (!prebindingDefinition) return '';

  const variableMapping = prebindingDefinition.variableMappings?.[componentValueKey];

  if (!variableMapping) return '';

  const parameter = parameters?.[variableMapping.parameterId];

  if (!parameter) return '';

  const dataSourceKey = parameter.path.split('/')[1];

  const entityLink = entityStore.dataSource[dataSourceKey];
  if (!entityLink) return '';

  const entity = entityStore.getEntityFromLink(entityLink);
  if (!entity || entity.sys.type === 'Asset') return '';

  const contentType = entity.sys.contentType.sys.id;

  const fieldPath = variableMapping?.pathsByContentType?.[contentType]?.path;

  if (!fieldPath) return '';

  return parameter.path + fieldPath;
};

export const resolveMaybePrebindingDefaultValuePath = ({
  componentValueKey,
  nodeId,
  entityStore,
}: {
  componentValueKey: string;
  nodeId: string;
  entityStore: EntityStore;
}): string | undefined => {
  console.log(entityStore.hoistedVariableMappings, entityStore.hoistedParameterDefinitions);
  const variableMapping = entityStore.hoistedVariableMappings[componentValueKey];
  if (!variableMapping) return;

  const pdID = variableMapping.parameterId;
  const hoistedpdID = entityStore.getHoistedParameterId(pdID, nodeId);
  const prebindingDefinition = entityStore.hoistedParameterDefinitions[hoistedpdID];

  if (!prebindingDefinition) {
    // probably shouldn't happen, as if ppd is not defined, then variableMapping should not be defined either
    return;
  }
  if (!prebindingDefinition.defaultSource) {
    // pretty normal, prebinding definitions are not required to have default source
    return;
  }

  const { contentTypeId, link: defaultEntryLink } = prebindingDefinition.defaultSource;

  if (!isLink(defaultEntryLink)) {
    // just extra safety check, defaultEntryLink should always be a link
    return;
  }

  console.log('lllll', contentTypeId, prebindingDefinition);

  if (prebindingDefinition.contentTypes.includes(contentTypeId)) {
    const entity = entityStore.getEntityFromLink(defaultEntryLink);
    console.log('e', entity);
    if (!entity) {
      // looks like sideloading of the prebinding default value didn't work as expected.
      // And didn't sideload the entry into entityStore (and didn't add it's sideloaded_dsKey to the entityStore.dataSource)
      return;
    }

    const fieldPath = variableMapping.pathsByContentType[contentTypeId].path;
    if (!fieldPath) {
      // Path not found or degenerate shape (e.g. empty string '')
      return;
    }

    const fullDefaultValuePath = `/${defaultEntryLink.sys.id}${fieldPath}`;
    return fullDefaultValuePath;
  }
};
