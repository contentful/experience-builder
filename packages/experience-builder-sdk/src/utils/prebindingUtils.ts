import { EntityStore } from '@contentful/experiences-core';
import { SIDELOADED_PREFIX } from '@contentful/experiences-core/constants';
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
  const variableMapping = entityStore.variableMappings[componentValueKey];
  if (!variableMapping) return;

  const ppdID = variableMapping.patternPropertyDefinitionId;
  const ppd = entityStore.patternPropertyDefinitions[ppdID];
  if (!ppd) {
    // probably shouldn't happen, as if ppd is not defined, then variableMapping should not be defined either
    return;
  }
  if (!ppd.defaultValue) {
    // pretty normal, ppds are not required to have default values
    return;
  }

  const [[contentTypeId, defaultEntryLink]] = Object.entries(ppd.defaultValue);
  if (contentTypeId in ppd.contentTypes) {
    const entity = entityStore.getEntityFromLink(defaultEntryLink);
    if (!entity) {
      // looks like sideloading of the prebinding default value didn't work as expected.
      // And didn't sideload the entry into entityStore (and didn't add it's sideloaded_dsKey to the entityStore.dataSource)
      return;
    }
    if (entity.sys.type === 'Asset') {
      // really shouldn't happen, as ATM UI allows for default prebinding values to only be entries.
      return;
    }

    const fieldPath = variableMapping.pathsByContentType[contentTypeId]?.path;
    if (!fieldPath) {
      // Maybe content type mismatch between variableMapping and ppd or something. If you observe an example document it here.
      return;
    }

    const fullDefaultValuePath = `/${SIDELOADED_PREFIX}${defaultEntryLink.sys.id}${fieldPath}`;
    return fullDefaultValuePath;
  }
};
