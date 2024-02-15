import { Entry, Asset, EntryCollection, EntrySkeletonType, UnresolvedLink } from 'contentful';
import { DeepReference } from '@/deep-binding/DeepReference';
import { isLink } from '@/utils/isLink';
export type MinimalEntryCollection = Pick<
  EntryCollection<EntrySkeletonType, 'WITHOUT_LINK_RESOLUTION'>,
  'items' | 'includes'
>;

/**
 * Traverses deep-references and extracts referents from valid deep-paths.
 * The referents are received from the CDA/CPA response `.includes` field.
 *
 * In case deep-paths not resolving till the end, eg.:
 *  - non-link referents: are ignored
 *  - unset references:   are ignored
 *
 * Errors are thrown in case of deep-paths being correct,
 * but referents not found. Because if we don't throw now, the EntityStore will
 * be missing entities and upon rendering will not be able to render bindings.
 */
export function gatherAutoFetchedReferentsFromIncludes(
  deepReferences: DeepReference[],
  entriesResponse: MinimalEntryCollection
): {
  autoFetchedReferentEntries: Entry[];
  autoFetchedReferentAssets: Asset[];
} {
  const autoFetchedReferentEntries: Entry[] = [];
  const autoFetchedReferentAssets: Asset[] = [];

  for (const reference of deepReferences) {
    const headEntry = entriesResponse.items.find(
      (entry) => entry.sys.id === reference.headEntityId
    );
    if (!headEntry) {
      throw new Error(
        `LogicError: When resolving deep-references could not find headEntry (id=${reference.entityId})`
      );
    }

    const linkToReferent = headEntry.fields[reference.field] as UnresolvedLink<'Asset' | 'Entry'>;

    if (undefined === linkToReferent) {
      console.debug(
        `[exp-builder.sdk::gatherAutoFetchedReferentsFromIncludes] Empty reference in headEntity. Probably reference is simply not set.`
      );
      continue;
    }

    if (!isLink(linkToReferent)) {
      console.debug(
        `[exp-builder.sdk::gatherAutoFetchedReferentsFromIncludes] Non-link value in headEntity. Probably broken path '${reference.originalPath}'`
      );
      continue;
    }

    if (linkToReferent.sys.linkType === 'Entry') {
      const referentEntry = entriesResponse.includes?.Entry?.find(
        (entry) => entry.sys.id === linkToReferent.sys.id
      );
      if (!referentEntry) {
        throw new Error(
          `Logic Error: L2-referent Entry was not found within .includes (${JSON.stringify({
            linkToReferent,
          })})`
        );
      }
      autoFetchedReferentEntries.push(referentEntry as Entry);
    } else if (linkToReferent.sys.linkType === 'Asset') {
      const referentAsset = entriesResponse.includes?.Asset?.find(
        (entry) => entry.sys.id === linkToReferent.sys.id
      );
      if (!referentAsset) {
        throw new Error(
          `Logic Error: L2-referent Asset was not found within includes (${JSON.stringify({
            linkToReferent,
          })})`
        );
      }
      autoFetchedReferentAssets.push(referentAsset as Asset);
    } else {
      console.debug(
        `[exp-builder.sdk::gatherAutoFetchedReferentsFromIncludes] Unhandled linkType :${JSON.stringify(
          linkToReferent
        )}`
      );
    }
  } // for (reference of deepReferences)

  return { autoFetchedReferentAssets, autoFetchedReferentEntries };
}
