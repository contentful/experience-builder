import type { Experience, Link } from '@/types';
import type { Entry, Asset } from 'contentful';
import { referencesOf, uniqueById } from './referencesOf';
import { isLinkToAsset, isLinkToEntry, isAsset, isPatternEntry } from '@/utils';

const excludeAssets = (entity: Entry | Asset): entity is Entry => !isAsset(entity);
const excludePatternEntries = (entry: Entry): entry is Entry => !isPatternEntry(entry);

/**
 * Parses experience and extracts all leaf links that are referenced from the experience.
 * PRECONDITION: Relies on the fact that entityStore is preloaded with all dataSource
 * entries using include=2 (meaning that up to L3 entries are already preloaded into EntitStore).
 *
 * The function iterates over all entries in the entityStore (assuming they can be L1, L2, L3) and
 * over all of their references. Any references that are NOT available in the entityStore are considered
 * "leaf references" aka "leaf links" and are returned.
 *
 * The EntityStore happens to contain also entities representing patterns, which we do NOT consider
 * as entries that point to leaf links. So we don't iterate over patterns only over entries which
 * can be used for binding.
 */
export const extractLeafLinksReferencedFromExperience = (experience: Experience) => {
  const assetLinks: Link<'Asset'>[] = [];
  const entryLinks: Link<'Entry'>[] = [];

  if (!experience.entityStore) {
    throw new Error(
      'Parameter `experience` should have valid `experience.entityStore` object. Without it, we cannot extract leaf links. Most likely you passed `experience` instance that was not fully fetched. Check your experience fetching logic.',
    );
  }

  // We want only leaf links which can be used for binding. We use two filters:
  // excludeAssets:         because assets do not have references, so we don't need to traverse them
  // excludePatternEntries: because EntityStore happens to also store pattern-entries.
  //                        Those point to other patterns, and we don't want to consider them as
  //                        parents of leaf links pointing to actual data carrying entries used for binding.
  const entries: Entry[] = experience.entityStore.entities
    .filter(excludeAssets)
    .filter(excludePatternEntries);

  // We assume that ALL of the entries in the experience
  for (const entry of entries) {
    const references = referencesOf(entry);
    for (const ref of references) {
      if (isLinkToAsset(ref)) {
        if (!experience.entityStore.getEntityFromLink(ref)) {
          assetLinks.push(ref);
        }
      } else if (isLinkToEntry(ref)) {
        if (!experience.entityStore.getEntityFromLink(ref)) {
          entryLinks.push(ref);
        }
      } else {
        console.warn(
          `Unexpected reference type found in entry "${entry.sys.id}": ${JSON.stringify(ref)}`,
        );
      }
    }
  }

  const dedupedAssetLinks = uniqueById(assetLinks);
  const dedupedEntryLinks = uniqueById(entryLinks);

  return {
    assetLinks: dedupedAssetLinks,
    entryLinks: dedupedEntryLinks,
    assetIds: dedupedAssetLinks.map((link) => link.sys.id),
    entryIds: dedupedEntryLinks.map((link) => link.sys.id),
  };
};
