import { Entry, Asset, UnresolvedLink } from 'contentful';
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
      console.debug(
        `[experiences-sdk-core::fetchers] When resolving deep-references could not find headEntry with id '${reference.entityId}'`,
      );
      continue;
    }

    const linkToReferent = headEntry.fields[reference.field] as UnresolvedLink<'Asset' | 'Entry'>;

    if (undefined === linkToReferent) {
      console.debug(
        `[experiences-sdk-core::fetchers] Empty reference in headEntity. Probably reference is simply not set.`,
      );
      continue;
    }

    if (!isLink(linkToReferent)) {
      console.debug(
        `[experiences-sdk-core::fetchers] Non-link value in headEntity. Probably broken path '${reference.originalPath}'`,
      );
      continue;
    }

    const linkType = linkToReferent.sys.linkType;

    if (!['Entry', 'Asset'].includes(linkType)) {
      console.debug(
        `[experiences-sdk-core::fetchers] Unhandled linkType :${JSON.stringify(linkToReferent)}`,
      );
      continue;
    }

    const referentEntity = entriesResponse.includes?.[linkType]?.find(
      (entity) => entity.sys.id === linkToReferent.sys.id,
    );
    if (!referentEntity) {
      console.debug(
        `[experiences-sdk-core::fetchers] L2-referent ${linkType} was not found within .includes (${JSON.stringify(
          {
            linkToReferent,
          },
        )})`,
      );
      continue;
    }

    linkType === 'Entry'
      ? autoFetchedReferentEntries.push(referentEntity as Entry)
      : autoFetchedReferentAssets.push(referentEntity as Asset);
  } // for (reference of deepReferences)

  return { autoFetchedReferentAssets, autoFetchedReferentEntries };
}
