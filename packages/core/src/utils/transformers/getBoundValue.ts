// import { EntityStoreBase } from '@/entity';
import { CompositionVariableValueType } from '@/types';
import { Asset, AssetFile, Entry } from 'contentful';
// import { isDeepPath } from '../pathSchema';
import { get } from '../get';

export const getBoundValue = (
  entryOrAsset: Entry | Asset,
  // entityStore: EntityStoreBase,
  // binding: UnresolvedLink<'Entry' | 'Asset'>,
  path: string,
): CompositionVariableValueType => {
  // if (isDeepPath(path)) {
  //   const [, uuid] = variable.path.split('/');
  //   const link = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
  //   const boundValue = entityStore.getValueDeep(link, variable.path);
  //   const value = boundValue || variableDefinition.defaultValue;
  // }

  const value = get<string>(entryOrAsset, path.split('/').slice(2, -1)); //entityStore.getValue(binding, path.slice(0, -1));
  // const value = get<string>(entryOrAsset, [...path].slice(0, -1)); //entityStore.getValue(binding, path.slice(0, -1));
  return value && typeof value == 'object' && (value as AssetFile).url
    ? (value as AssetFile).url
    : (value as string | undefined);
  // if (value) {
  //   value = typeof value == 'object' && (value as AssetFile).url ? (value as AssetFile).url : value;
  // } else {
  //   const foundAssetValue = entityStore.getValue(binding, [...path.slice(0, -2), 'fields', 'file']);
  //   if (foundAssetValue) {
  //     value = foundAssetValue;
  //   }
  // }
  // return value;
};

// export function transformAssetFileToUrl(
//   fieldValue: string | AssetFile | undefined,
// ): string | undefined {
//   return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
//     ? (fieldValue as AssetFile).url
//     : (fieldValue as string | undefined);
// }

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
