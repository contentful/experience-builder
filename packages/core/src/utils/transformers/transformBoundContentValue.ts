import {
  BoundComponentPropertyTypes,
  ComponentDefinitionVariable,
  ComponentTreeNode,
  ResolveDesignValueType,
} from '@/types';
import { transformRichText } from './transformRichText';
import { transformMedia } from './media/transformMedia';
import { EntityStoreBase } from '@/entity';
import { Asset, UnresolvedLink } from 'contentful';
import { getBoundValue } from './getBoundValue';

export const transformBoundContentValue = (
  variables: ComponentTreeNode['variables'],
  entityStore: EntityStoreBase,
  binding: UnresolvedLink<'Entry' | 'Asset'>,
  resolveDesignValue: ResolveDesignValueType,
  variableName: string,
  variableDefinition: ComponentDefinitionVariable,
  path: string,
): BoundComponentPropertyTypes => {
  const entityOrAsset = entityStore.getEntryOrAsset(binding, path);
  if (!entityOrAsset) return;

  switch (variableDefinition.type) {
    case 'Media':
      return transformMedia(entityOrAsset as Asset, variables, resolveDesignValue, variableName);
    case 'RichText':
      return transformRichText(entityOrAsset, path);
    default:
      return getBoundValue(entityOrAsset, path);
  }
};
