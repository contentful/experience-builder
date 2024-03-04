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
// import { isDeepPath } from '../pathSchema';

export const transformBoundContentValue = (
  variables: ComponentTreeNode['variables'],
  entityStore: EntityStoreBase,
  binding: UnresolvedLink<'Entry' | 'Asset'>,
  resolveDesignValue: ResolveDesignValueType,
  variableName: string,
  variableDefinition: ComponentDefinitionVariable,
  path: string,
): BoundComponentPropertyTypes => {
  const entityOrAsset = entityStore.getEntryOrAsset(binding, path); // getBoundValue(entityStore, binding, path);
  if (!entityOrAsset) return;

  switch (variableDefinition.type) {
    case 'Media':
      return transformMedia(
        entityOrAsset as Asset,
        variables,
        // entityStore,
        // binding,
        resolveDesignValue,
        variableName,
        path,
      );
    case 'RichText':
      return transformRichText(entityOrAsset, path);
    default:
      return getBoundValue(entityOrAsset, path);
  }
};

//       if (isDeepPath(variable.path)) {
//         const [, uuid] = variable.path.split('/');
//         const link = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
//         const boundValue = entityStore.getValueDeep(link, variable.path);
//         const value = boundValue || variableDefinition.defaultValue;
//         acc[variableName] = transformContentValue(value, variableDefinition);
//         break;
//       }
//       const [, uuid, ...path] = variable.path.split('/');
//       const binding = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
//       let value = entityStore.getValue(binding, path.slice(0, -1));
//       if (!value) {
//         const foundAssetValue = entityStore.getValue(binding, [
//           ...path.slice(0, -2),
//           'fields',
//           'file',
//         ]);
//         if (foundAssetValue) {
//           value = foundAssetValue;
//         }
//       }

//from useComponentProps.ts
// if (isDeepPath(variableMapping.path)) {
//   const [, uuid] = variableMapping.path.split('/');
//   const link = dataSource[uuid] as Link<'Entry' | 'Asset'>;
//   const boundValue = entityStore?.getValueDeep(link, variableMapping.path);
//   const value = boundValue || variableDefinition.defaultValue;
//   return {
//     ...acc,
//     [variableName]: transformContentValue(value, variableDefinition),
//   };
// }
