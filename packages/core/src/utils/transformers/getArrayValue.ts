import { Asset, Entry, UnresolvedLink } from 'contentful';
import { get } from '../get';
import { EntityStoreBase } from '@/entity';
import { isArray } from 'lodash-es';

export function getArrayValue(
  entryOrAsset: Entry | Asset,
  path: string,
  entityStore: EntityStoreBase,
) {
  if (entryOrAsset.sys.type === 'Asset') {
    return entryOrAsset;
  }

  const arrayValue = get<Array<string | UnresolvedLink<'Entry' | 'Asset'>>>(
    entryOrAsset,
    path.split('/').slice(2, -1),
  );

  if (!isArray(arrayValue)) {
    console.warn(`Expected a value to be an array, but got: ${JSON.stringify(arrayValue)}`);
    return;
  }

  const result = arrayValue.map((value) => {
    if (typeof value === 'string') {
      return value;
    } else if (value?.sys?.type === 'Link') {
      const resolvedEntity = entityStore.getEntityFromLink(value);
      if (!resolvedEntity) {
        return;
      }
      //resolve any embedded links - we currently only support 2 levels deep
      const fields = resolvedEntity.fields || {};
      Object.entries(fields).forEach(([fieldKey, field]) => {
        if (field && field.sys?.type === 'Link') {
          const entity = entityStore.getEntityFromLink(field);
          if (entity) {
            resolvedEntity.fields[fieldKey] = entity;
          }
        }
      });

      return resolvedEntity;
    } else {
      console.warn(`Expected value to be a string or Link, but got: ${JSON.stringify(value)}`);
      return undefined;
    }
  });

  return result;
}
