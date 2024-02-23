import { EntityStoreBase } from '@/entity';
import { CompositionVariableValueType } from '@/types';
import { AssetFile, UnresolvedLink } from 'contentful';

export const getBoundValue = (
  entityStore: EntityStoreBase,
  binding: UnresolvedLink<'Entry' | 'Asset'>,
  path: string[],
): CompositionVariableValueType => {
  let value = entityStore.getValue(binding, path.slice(0, -1));
  if (value) {
    value = typeof value == 'object' && (value as AssetFile).url ? (value as AssetFile).url : value;
  } else {
    const foundAssetValue = entityStore.getValue(binding, [...path.slice(0, -2), 'fields', 'file']);
    if (foundAssetValue) {
      value = foundAssetValue;
    }
  }
  return value;
  // const variableDefinition = componentRegistration.definition.variables[variableName];
};
