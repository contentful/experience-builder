import { EntityStore } from '@contentful/experiences-core';
import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
  PatternProperty,
} from '@contentful/experiences-validators';
import { UnresolvedLink } from 'contentful';

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

  const [, uuid] = patternProperty.path.split('/');
  const binding = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
  const entityOrAsset = entityStore.getEntryOrAsset(binding, patternProperty.path);

  if (entityOrAsset?.sys?.type !== 'Entry') {
    return '';
  }

  const contentType = entityOrAsset.sys.contentType.sys.id;

  const fieldPath = variableMapping.pathsByContentType[contentType]?.path;

  if (!fieldPath) return '';

  return patternProperty.path + fieldPath;
};
