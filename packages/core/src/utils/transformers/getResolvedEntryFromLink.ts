import { PrimitiveValue } from '@/types';
import { Asset, AssetFile, Entry, UnresolvedLink } from 'contentful';
import { get } from '../get';
import { EntityStoreBase } from '@/entity';

export function getResolvedEntryFromLink(
  entryOrAsset: Entry | Asset,
  path: string,
  entityStore: EntityStoreBase,
) {
  if (entryOrAsset.sys.type === 'Asset') {
    return entryOrAsset;
  }

  const value = get<UnresolvedLink<'Entry'>>(entryOrAsset, path.split('/').slice(2, -1));

  if (value?.sys.type !== 'Link') {
    console.warn(`Expected a link to a reference, but got: ${JSON.stringify(value)}`);
    return;
  }

  //Look up the reference in the entity store
  const resolvedEntity = entityStore.getEntityFromLink(value);
  // const resolvedEntity = entityStore.getEntityFromLink(value);
  console.log('aaa', { value, entryOrAsset, path, entityStore, resolvedEntity });
  return resolvedEntity;
}

// {
//   "sys": { "type": "Link", "linkType": "Entry", "id": "ABpagfAmvNIxdxqGMejT8" }
// }
