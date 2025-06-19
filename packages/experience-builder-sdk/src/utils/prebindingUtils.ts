import { EntityStore } from '@contentful/experiences-core';
import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-validators';

export const shouldUsePrebinding = ({
  componentValueKey,
  componentSettings,
  parameters,
  variable,
}: {
  componentValueKey: string;
  componentSettings: ExperienceComponentSettings;
  parameters: Record<string, PatternProperty>;
  variable: ComponentPropertyValue;
}) => {
  const { parameterDefinitions, variableMappings } = componentSettings;

  const variableMapping = variableMappings?.[componentValueKey];

  const patternPropertyDefinition =
    parameterDefinitions?.[variableMapping?.parameterDefinitionId || ''];
  const patternProperty = parameters?.[variableMapping?.parameterDefinitionId || ''];

  const isValidForPrebinding =
    !!patternPropertyDefinition && !!patternProperty && !!variableMapping;

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
  parameters: Record<string, PatternProperty>;
  entityStore: EntityStore;
}) => {
  const variableMapping = componentSettings.variableMappings?.[componentValueKey];

  if (!variableMapping) return '';

  const patternProperty = parameters?.[variableMapping.parameterDefinitionId];

  if (!patternProperty) return '';

  const dataSourceKey = patternProperty.path.split('/')[1];

  const entityLink = entityStore.dataSource[dataSourceKey];
  if (!entityLink) return '';

  const entity = entityStore.getEntityFromLink(entityLink);
  if (!entity || entity.sys.type === 'Asset') return '';

  const contentType = entity.sys.contentType.sys.id;

  const fieldPath = variableMapping?.pathsByContentType?.[contentType]?.path;

  if (!fieldPath) return '';

  return patternProperty.path + fieldPath;
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
  const prebinding = componentSettings.variableMappings?.[componentValueKey];
  if (!prebinding) return;

  const mappingId = prebinding.parameterDefinitionId || '';
  const mapping = componentSettings.parameterDefinitions?.[mappingId];
  if (!mapping || !mapping?.defaultValue) return;

  const [[contentTypeId, defaultEntryLink]] = Object.entries(mapping.defaultValue);
  if (contentTypeId in mapping.contentTypes) {
    return resolvePrebindingPath({
      componentValueKey,
      entityStore,
      componentSettings,
      parameters: {
        [mappingId]: {
          path: `/${defaultEntryLink.sys.id}`,
          type: 'BoundValue',
        },
      },
    });
  }
};
