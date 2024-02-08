import { Entry, Asset, EntryCollection, EntrySkeletonType } from 'contentful';
import { DeepReference } from '@/deep-binding/deep-reference';

/**
 * Traverses deep-references and extracts referents (referent entities)
 */
export function gatherAutoFetchedReferents(
  deepReferences: DeepReference[],
  entriesResponse: EntryCollection<EntrySkeletonType>
) {
  const autofetchedReferentEntries: Entry[] = [];
  const autofetchedReferentAssets: Asset[] = [];

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
    console.log(`:::referenceField`, { linkField: referentEntity });

    if (!referentEntity) {
      debugger;
      console.warn(
        `fetchReferencedEntities():: referentEntity is not found within refernece--field. Probably reference is simply not set.`
      );
      continue;
    }

    if (referentEntity.sys.type === 'Entry') {
      console.log(`:::autofetched entry:`, referentEntity);
      autofetchedReferentEntries.push(referentEntity as Entry);
    } else if (referentEntity.sys.type === 'Asset') {
      console.log(`:::autofetched asset:`, referentEntity);
      autofetchedReferentAssets.push(referentEntity as Asset);
    } else {
      throw new Error(
        `Cannot detect type of the referent entity (maybe it's merely a link) (${JSON.stringify({
          referentEntity,
        })})`
      );
    }
  }
  return { autofetchedReferentAssets, autofetchedReferentEntries };
}
