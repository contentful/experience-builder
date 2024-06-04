import { Entry, Asset, EntryCollection, EntrySkeletonType, UnresolvedLink } from 'contentful';
import type { DeepReference } from '@/deep-binding/DeepReference';
import { isLink } from '@/utils/isLink';

export type MinimalEntryCollection = {
  items: Entry[];
  includes: {
    Entry: Entry[];
    Asset: Asset[];
  };
};

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
  entriesResponse: MinimalEntryCollection,
): {
  autoFetchedReferentEntries: Entry[];
  autoFetchedReferentAssets: Asset[];
} {
  const autoFetchedReferentEntries: Entry[] = [];
  const autoFetchedReferentAssets: Asset[] = [];

  for (const reference of deepReferences) {
    const headEntry = entriesResponse.items.find(
      (entry) => entry.sys.id === reference.headEntityId,
    );
    if (!headEntry) {
      throw new Error(
        `LogicError: When resolving deep-references could not find headEntry (id=${reference.entityId})`,
      );
    }

    const linkToReferent = headEntry.fields[reference.field] as UnresolvedLink<'Asset' | 'Entry'>;

    if (undefined === linkToReferent) {
      console.debug(
        `[experiences-sdk-react::gatherAutoFetchedReferentsFromIncludes] Empty reference in headEntity. Probably reference is simply not set.`,
      );
      continue;
    }

    if (!isLink(linkToReferent)) {
      console.debug(
        `[experiences-sdk-react::gatherAutoFetchedReferentsFromIncludes] Non-link value in headEntity. Probably broken path '${reference.originalPath}'`,
      );
      continue;
    }

    const linkType = linkToReferent.sys.linkType;

    if (!['Entry', 'Asset'].includes(linkType)) {
      console.debug(
        `[experiences-sdk-react::gatherAutoFetchedReferentsFromIncludes] Unhandled linkType :${JSON.stringify(
          linkToReferent,
        )}`,
      );
      continue;
    }

    const referentEntity = entriesResponse.includes?.[linkType]?.find(
      (entity) => entity.sys.id === linkToReferent.sys.id,
    );
    if (!referentEntity) {
      throw new Error(
        `Logic Error: L2-referent ${linkType} was not found within .includes (${JSON.stringify({
          linkToReferent,
        })})`,
      );
    }

    linkType === 'Entry'
      ? autoFetchedReferentEntries.push(referentEntity as Entry)
      : autoFetchedReferentAssets.push(referentEntity as Asset);
  } // for (reference of deepReferences)

  return { autoFetchedReferentAssets, autoFetchedReferentEntries };
}
