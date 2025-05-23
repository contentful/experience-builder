import { Asset, Entry, UnresolvedLink } from 'contentful';
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

  const fieldName = path.split('/').slice(2, -1);
  const value = get<UnresolvedLink<'Entry'>>(entryOrAsset, fieldName);

  if (value?.sys.type !== 'Link') {
    console.warn(
      `When attempting to follow link in field '${fieldName}' of entity, the value is expected to be a link, but got: ${JSON.stringify(value)}`,
      { entity: entryOrAsset },
    );
    return;
  }

  // no need to make structuredClone(entityStore.getEntityFromLink(value)) because
  // we provide component with the original Object.frozen object of the entity.
  // As we don't resolve L3 and don't mutate the entity before returning anymore,
  // we don't need to make a copy of the entity. And even provide better referential integrity
  // for the component for the same entity.
  const resolvedEntity = entityStore.getEntityFromLink(value);

  if (!resolvedEntity) {
    return;
  }

  return resolvedEntity;
}
