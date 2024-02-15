import { Entry, Asset, EntryCollection, EntrySkeletonType } from 'contentful';
import { DeepReference } from '@/deep-binding/DeepReference';

/**
 * Traverses deep-references and extracts referents (referent entities)
 */
export function gatherAutoFetchedReferents(
  deepReferences: DeepReference[],
  entriesResponse: EntryCollection<EntrySkeletonType>
) {
  const autoFetchedReferentEntries: Entry[] = [];
  const autoFetchedReferentAssets: Asset[] = [];

  for (const reference of deepReferences) {
    const entry = entriesResponse.items.find((entry) => entry.sys.id === reference.entityId);
    if (!entry) {
      throw new Error(
        `LogicError: When resolving deep-references could not find reference-entry ${reference.entityId}`
      );
    }

    const referentEntity: Entry | Asset | undefined = entry.fields[reference.field] as
      | Entry
      | Asset
      | undefined;

    if (!referentEntity) {
      console.warn(
        `fetchReferencedEntities():: referentEntity is not found within refernece--field. Probably reference is simply not set.`
      );
      continue;
    }

    if (referentEntity.sys.type === 'Entry') {
      autoFetchedReferentEntries.push(referentEntity as Entry);
    } else if (referentEntity.sys.type === 'Asset') {
      autoFetchedReferentAssets.push(referentEntity as Asset);
    } else {
      throw new Error(
        `Cannot detect type of the referent entity (maybe it's merely a link) (${JSON.stringify({
          referentEntity,
        })})`
      );
    }
  }
  return { autoFetchedReferentAssets, autoFetchedReferentEntries };
}
