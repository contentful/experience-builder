import { type EntityStore, isLink } from '@contentful/experiences-core';
import { SIDELOADED_PREFIX } from '@contentful/experiences-core/constants';
import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
  Parameter,
} from '@contentful/experiences-validators';

export const shouldUsePrebinding = ({
  componentValueKey,
  componentSettings,
  parameters,
  variable,
}: {
  componentValueKey: string;
  componentSettings: ExperienceComponentSettings;
  parameters: Record<string, Parameter>;
  variable: ComponentPropertyValue;
}) => {
  const { parameterDefinitions, variableMappings } = componentSettings;

  const variableMapping = variableMappings?.[componentValueKey];

  const parameterDefinition = parameterDefinitions?.[variableMapping?.parameterId || ''];
  const parameter = parameters?.[variableMapping?.parameterId || ''];

  const isValidForPrebinding = !!parameterDefinition && !!parameter && !!variableMapping;

  return isValidForPrebinding && variable?.type === 'NoValue';
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
  const variableMapping = componentSettings.variableMappings?.[componentValueKey];

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
  entityStore,
}: {
  componentValueKey: string;
  entityStore: EntityStore;
}): string | undefined => {
  const variableMapping = entityStore.variableMappings[componentValueKey];
  if (!variableMapping) return;

  const pdID = variableMapping.parameterId;
  const prebindingDefinition = entityStore.parameterDefinitions[pdID];

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

  if (contentTypeId in prebindingDefinition.contentTypes) {
    const entity = entityStore.getEntityFromLink(defaultEntryLink);
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

    const fullDefaultValuePath = `/${SIDELOADED_PREFIX}${defaultEntryLink.sys.id}${fieldPath}`;
    return fullDefaultValuePath;
  }
};
