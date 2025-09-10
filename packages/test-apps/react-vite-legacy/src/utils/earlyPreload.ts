import type { Experience } from '@contentful/experiences-sdk-react';
import type { ContentfulClientApi, Asset, Entry } from 'contentful';
import {
  inMemoryEntities,
  extractReferencesFromEntriesAsIds,
  extractLeafLinksReferencedFromExperience,
} from '@contentful/experiences-sdk-react';

type EntitiesToFetch = {
  assetsToFetch: string[];
  entriesToFetch: string[];
};

export const fetchAdditionalLevels = async (
  depth: number,
  experience: Experience,
  localeCode: string,
  client: ContentfulClientApi<undefined>,
) => {
  // As first step we extract reference to L4 entities and kick off recursive fetching

  const addToMemory = (entities: Array<Entry | Asset>) => {
    // This function is a placeholder for whatever in-memory storage you are using
    // to store fetched entities. It should add the entity to your in-memory cache.
    // For example, if you are using a custom in-memory store, you might do:
    // inMemoryEntities.addEntity(entity);
    // For this example, we will just log the entity.
    if (entities.length === 0) {
      return;
    }
    inMemoryEntities.addEntities(entities);
  };

  const { assetIds, entryIds } = extractLeafLinksReferencedFromExperience(experience);

  await fetchLevel(depth, { assetsToFetch: assetIds, entriesToFetch: entryIds });

  async function fetchLevel(depth: number, { assetsToFetch, entriesToFetch }: EntitiesToFetch) {
    if (depth <= 0) {
      return;
    }

    const assetItems = await (async () => {
      if (assetsToFetch.length === 0) {
        return [];
      }
      // TODO: parallelize taking pagination into account
      const { items: assetItems } = await client.getAssets({
        'sys.id[in]': assetsToFetch,
        locale: localeCode,
        limit: 1000,
        skip: 0,
      });
      return assetItems;
    })();

    const entryItems = await (async () => {
      if (entriesToFetch.length === 0) {
        return [];
      }
      // Important that we should fetch Entries WITHOUT link resolution,
      // as that's the format that in-memory store expects.
      const { items: entryItems } = await client.withoutLinkResolution.getEntries({
        'sys.id[in]': entriesToFetch,
        locale: localeCode,
        limit: 1000,
        skip: 0,
      });
      return entryItems;
    })();

    // Example: Here you can add custom logic to omit certain fields
    // entryItems.forEach((entry) => {
    //   entry.fields = {
    //     ...omit(entry.fields, 'allIngredients', 'allAuthors'),
    //   }
    // });

    addToMemory([...assetItems, ...entryItems]);

    {
      const [referencedEntryIds, referencedAssetIds] =
        extractReferencesFromEntriesAsIds(entryItems);

      // narrow down to the ones which are NOT yet in memory...
      const entriesToFetch = referencedEntryIds.filter(
        (entryId) => !inMemoryEntities.hasEntry(entryId),
      );

      const assetsToFetch = referencedAssetIds.filter(
        (assetId) => !inMemoryEntities.hasAsset(assetId),
      );

      await fetchLevel(depth - 1, {
        entriesToFetch,
        assetsToFetch,
      });
    }
  }
};
