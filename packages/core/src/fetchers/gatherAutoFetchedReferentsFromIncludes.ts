import { Entry, Asset, EntryCollection, EntrySkeletonType, UnresolvedLink } from 'contentful';
import { DeepReference } from '@/deep-binding/deep-reference';
export type MinimalEntryCollection = Pick<
  EntryCollection<EntrySkeletonType, 'WITHOUT_LINK_RESOLUTION'>,
  'items' | 'includes'
>;

/**
 * Traverses deep-references and extracts referents (referent entities)
 */
export function gatherAutoFetchedReferentsFromIncludes(
  deepReferences: DeepReference[],
  entriesResponse: MinimalEntryCollection
) {
  const autofetchedReferentEntries: Entry[] = [];
  const autofetchedReferentAssets: Asset[] = [];

  for (const reference of deepReferences) {
    const headEntry = entriesResponse.items.find(
      (entry) => entry.sys.id === reference.headEntityId
    );
    if (!headEntry) {
      throw new Error(
        `LogicError: When resolving deep-references could not find reference-entry ${reference.entityId}`
      );
    }

    const linkToReferent = headEntry.fields[reference.field] as UnresolvedLink<'Asset' | 'Entry'>;

    if (!linkToReferent) {
      debugger;
      console.warn(
        `fetchReferencedEntities():: link to referent not found within reference-field. Probably reference is simply not set.`
      );
      continue;
    }

    if (linkToReferent.sys.linkType === 'Entry') {
      const referentAsset = entriesResponse.includes?.Entry?.find(
        (entry) => entry.sys.id === linkToReferent.sys.id
      );
      if (!referentAsset) {
        throw new Error(
          `Logic Error: L1-referent was not found within includes (${JSON.stringify({
            linkToReferent,
          })})`
        );
      }
      console.log(`:::autofetched via includes entry:`, referentAsset);
      autofetchedReferentEntries.push(referentAsset as Entry);
    } else if (linkToReferent.sys.linkType === 'Asset') {
      const referentEntity = entriesResponse.includes?.Asset?.find(
        (entry) => entry.sys.id === linkToReferent.sys.id
      );
      if (!referentEntity) {
        throw new Error(
          `Logic Error: L1-referent was not found within includes (${JSON.stringify({
            linkToReferent,
          })})`
        );
      }
      console.log(`:::autofetched via includes asset:`, referentEntity);
      autofetchedReferentAssets.push(referentEntity as Asset);
    } else {
      throw new Error(
        `Cannot detect linkType of the referent, maybe it's not even a link (${JSON.stringify({
          linkToReferent,
        })})`
      );
    }
  } // for (reference of deepReferences)

  return { autofetchedReferentAssets, autofetchedReferentEntries };
}
