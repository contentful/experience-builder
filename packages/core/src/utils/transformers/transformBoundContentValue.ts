import {
  BoundComponentPropertyTypes,
  ComponentDefinitionVariable,
  ComponentTreeNode,
  ResolveDesignValueType,
} from '@/types';
import { transformRichText } from './transformRichText';
import { transformMedia } from './media/transformMedia';
import { EntityStoreBase } from '@/entity';
import { UnresolvedLink } from 'contentful';
import { getBoundValue } from './getBoundValue';

export const transformBoundContentValue = (
  variables: ComponentTreeNode['variables'],
  entityStore: EntityStoreBase,
  binding: UnresolvedLink<'Entry' | 'Asset'>,
  resolveDesignValue: ResolveDesignValueType,
  variableName: string,
  variableDefinition: ComponentDefinitionVariable,
  path: string[],
): BoundComponentPropertyTypes => {
  switch (variableDefinition.type) {
    case 'Media':
      return transformMedia(variables, entityStore, binding, resolveDesignValue, variableName);
    case 'RichText':
      return transformRichText(entityStore, binding, path);
    default:
      return getBoundValue(entityStore, binding, path);
  }
};
