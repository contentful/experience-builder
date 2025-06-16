import { EntityStore } from '@contentful/experiences-core';
import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-validators';

export const shouldUsePrebinding = ({
  componentValueKey,
  componentSettings,
  patternProperties,
  variable,
}: {
  componentValueKey: string;
  componentSettings: ExperienceComponentSettings;
  patternProperties: Record<string, PatternProperty>;
  variable: ComponentPropertyValue;
}) => {
  const { patternPropertyDefinitions, variableMappings } = componentSettings;

  const variableMapping = variableMappings?.[componentValueKey];

  const patternPropertyDefinition =
    patternPropertyDefinitions?.[variableMapping?.patternPropertyDefinitionId || ''];
  const patternProperty = patternProperties?.[variableMapping?.patternPropertyDefinitionId || ''];

  const isValidForPrebinding =
    !!patternPropertyDefinition && !!patternProperty && !!variableMapping;

  return isValidForPrebinding && variable?.type === 'NoValue';
};

export const resolvePrebindingPath = ({
  componentValueKey,
  componentSettings,
  patternProperties,
  entityStore,
}: {
  componentValueKey: string;
  componentSettings: ExperienceComponentSettings;
  patternProperties: Record<string, PatternProperty>;
  entityStore: EntityStore;
}) => {
  const variableMapping = componentSettings.variableMappings?.[componentValueKey];

  if (!variableMapping) return '';

  const patternProperty = patternProperties?.[variableMapping.patternPropertyDefinitionId];

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
  const prebinding =
    entityStore.experienceEntryFields?.componentSettings?.variableMappings?.[componentValueKey];
  if (!prebinding) return;

  const mappingId = prebinding?.patternPropertyDefinitionId || '';
  const mapping =
    entityStore.experienceEntryFields?.componentSettings?.patternPropertyDefinitions?.[mappingId];
  if (!mapping || !mapping?.defaultValue) return;

  const [[contentTypeId, defaultEntryLink]] = Object.entries(mapping?.defaultValue || {});
  if (contentTypeId in (mapping?.contentTypes || {})) {
    return resolvePrebindingPath({
      componentValueKey,
      entityStore,
      componentSettings: (entityStore.experienceEntryFields?.componentSettings ||
        {}) as ExperienceComponentSettings,
      patternProperties: {
        [mappingId]: {
          path: `/${defaultEntryLink.sys.id}`,
          type: 'BoundValue',
        },
      },
    });
  }
};
