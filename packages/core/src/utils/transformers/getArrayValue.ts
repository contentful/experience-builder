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
        // seems that returning `undefined` will be more consistent, as it implies:
        // there's no data in the entityStore during path resolution and best thing is to wait
        // until next render cycle during EDITOR mode. Bound links is something we guaranteed to resolve.
        // Passing link, implies that user has to try to resolve it themselves.
        return;
        // return value;
      }
      return resolvedEntity;
    } else {
      console.warn(`Expected value to be a string or Link, but got: ${JSON.stringify(value)}`);
      return undefined;
    }
  });

  return result;
}
