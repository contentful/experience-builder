import {
  BoundComponentPropertyTypes,
  ComponentDefinitionVariableType,
  ComponentTreeNode,
  ResolveDesignValueType,
} from '@/types';
import { transformRichText } from './transformRichText';
import { transformMedia } from './media/transformMedia';
import { EntityStoreBase } from '@/entity';
import { Asset, UnresolvedLink } from 'contentful';
import { getBoundValue } from './getBoundValue';
import { getResolvedEntryFromLink } from './getResolvedEntryFromLink';
import { getArrayValue } from './getArrayValue';

export const transformBoundContentValue = (
  variables: ComponentTreeNode['variables'],
  entityStore: EntityStoreBase,
  binding: UnresolvedLink<'Entry' | 'Asset'>,
  resolveDesignValue: ResolveDesignValueType,
  variableName: string,
  variableType: ComponentDefinitionVariableType,
  path: string,
): BoundComponentPropertyTypes => {
  const entityOrAsset = entityStore.getEntryOrAsset(binding, path);
  if (!entityOrAsset) return;

  switch (variableType) {
    case 'Media':
      // If we bound a normal entry field to the media variable we just return the bound value
      if (entityOrAsset.sys.type === 'Entry') {
        return getBoundValue(entityOrAsset, path);
      }
      return transformMedia(
        entityOrAsset as Asset,
        variables,
        resolveDesignValue,
        variableName,
        path,
      );
    case 'RichText':
      return transformRichText(entityOrAsset, entityStore, path);
    case 'Array':
      return getArrayValue(entityOrAsset, path, entityStore);
    case 'Link':
      return getResolvedEntryFromLink(entityOrAsset, path, entityStore);
    default:
      return getBoundValue(entityOrAsset, path);
  }
};
