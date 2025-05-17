import { Asset, Entry, UnresolvedLink } from 'contentful';
import { get } from '../get';
import { EntityStoreBase } from '@/entity';
import { isArray } from 'lodash-es';

const excludeUndefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
};

export function getArrayValue(
  entryOrAsset: Entry | Asset,
  path: string,
  entityStore: EntityStoreBase,
) {
  // NOTE: Not sure if we need this if-statement,
  // as it is NOT possible to bind to Array variable an Asset
  // (as Assets don't have multi-reference fields)
  if (entryOrAsset.sys.type === 'Asset') {
    return entryOrAsset;
  }

  const fieldName = path.split('/').slice(2, -1);
  const arrayValue = get<Array<string | UnresolvedLink<'Entry' | 'Asset'>>>(
    entryOrAsset,
    fieldName,
  );

  if (!isArray(arrayValue)) {
    console.warn(
      `A field '${fieldName}' of an entity was bound to an Array variable. Expected value of that field to be an array, but got: ${JSON.stringify(arrayValue)}`,
      { entity: entryOrAsset },
    );
    return;
  }

  const result = arrayValue
    .map((value) => {
      if (typeof value === 'string') {
        return value; // NOTE: not sure when array elements can be strings?
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
    })
    .filter(excludeUndefined);

  // eg. imagine you have multi-referene field with 3 links to archived entries,
  //     all of them will be undefined on previous step and will be filtered out
  //     of resultWithoutUndefined. Instead of passing to component an empty array,
  //     we pass undefined. This means that develloper making custom component
  //     does not have to handle empty array case. But only undefiened, which signals:
  //     user didn't bind anything; user bound to reference field which is unset; all references are archived
  return result.length > 0 ? result : undefined;
}
