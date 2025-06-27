import { EntityStore } from '@contentful/experiences-core';
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
  const { prebindingDefinitions } = componentSettings;
  const { parameterDefinitions, variableMappings } = prebindingDefinitions?.[0] || {};

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
  entityStore,
}: {
  componentValueKey: string;
  entityStore: EntityStore;
}): string | undefined => {
  if (!entityStore.experienceEntryFields?.componentSettings) return;

  const componentSettings = entityStore.experienceEntryFields.componentSettings;

  const prebindingDefinition = componentSettings.prebindingDefinitions?.[0];
  if (!prebindingDefinition) return '';

  const mapping = prebindingDefinition.variableMappings?.[componentValueKey];
  if (!mapping) return;

  const mappingId = mapping.parameterId || '';
  const prebinding = prebindingDefinition.parameterDefinitions?.[mappingId];
  if (!prebinding || !prebinding?.defaultSource) return;

  const { contentTypeId, link } = prebinding.defaultSource;
  if (contentTypeId in prebinding.contentTypes) {
    return resolvePrebindingPath({
      componentValueKey,
      entityStore,
      componentSettings,
      parameters: {
        [mappingId]: {
          path: `/${link.sys.id}`,
          type: 'BoundValue',
        },
      },
    });
  }
};
