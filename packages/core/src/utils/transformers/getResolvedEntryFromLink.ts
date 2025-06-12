import { Asset, Entry, UnresolvedLink } from 'contentful';
import { get } from '../get';
import { EntityStoreBase } from '@/entity';
import { isAsset, isEntry } from '../entityTypeChecks';

export function getResolvedEntryFromLink(
  entryOrAsset: Entry | Asset,
  path: string,
  entityStore: EntityStoreBase,
) {
  if (isAsset(entryOrAsset)) {
    return entryOrAsset;
  } else if (!isEntry(entryOrAsset)) {
    throw new Error(`Expected an Entry or Asset, but got: ${JSON.stringify(entryOrAsset)}`);
  }

  const value = get<UnresolvedLink<'Entry'> | Entry | Asset>(
    entryOrAsset,
    path.split('/').slice(2, -1),
  );

  let resolvedEntity: Entry | Asset | undefined;

  if (isAsset(value) || isEntry(value)) {
    // In some cases, reference fields are already resolved
    resolvedEntity = value;
  } else if (value?.sys.type === 'Link') {
    // Look up the reference in the entity store
    resolvedEntity = entityStore.getEntityFromLink(value);
    if (!resolvedEntity) {
      return;
    }
  } else {
    console.warn(`Expected a link to a reference, but got: ${JSON.stringify(value)}`);
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
    } else if (field && Array.isArray(field)) {
      resolvedEntity.fields[fieldKey] = field.map((innerField) => {
        if (innerField && innerField.sys?.type === 'Link') {
          const entity = entityStore.getEntityFromLink(innerField);
          if (entity) {
            return entity;
          }
        }
        return innerField;
      });
    }
  });

  return resolvedEntity;
}
