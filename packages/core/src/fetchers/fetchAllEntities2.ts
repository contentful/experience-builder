import {
  Asset,
  AssetCollection as AssetCollectionOriginal,
  ContentfulClientApi,
  Entry as EntryOriginal,
  EntryCollection as EntryCollectionOriginal,
  EntrySkeletonType,
} from 'contentful';
import { uniqBy } from '../utils/uniqBy';
type UnresolvedEntryCollection = EntryCollectionOriginal<
  EntrySkeletonType,
  'WITHOUT_LINK_RESOLUTION'
>;
type EntryCollection = Pick<
  EntryCollectionOriginal<EntrySkeletonType, 'WITHOUT_LINK_RESOLUTION'>,
  'items' | 'includes'
>;
type AssetCollection = Pick<AssetCollectionOriginal, 'items'>;
type UnresolvedEntry = EntryOriginal<EntrySkeletonType, 'WITHOUT_LINK_RESOLUTION', string>;

const MIN_FETCH_LIMIT = 1;
const DEFAULT_FETCH_LIMIT = 100;

export type FetchAllEntitiesOpts = {
  client: ContentfulClientApi<undefined>;
  ids: string[];
  entityType: 'Entry' | 'Asset';
  locale: string;
};

type FetchAllEntitiesImplOpts = {
  skip: number;
  ids: string[];
  limit: number;
};

const fetchEntities = async ({
  entityType,
  client,
  query,
}: {
  entityType: 'Entry' | 'Asset';
  client: ContentfulClientApi<undefined>;
  query: { 'sys.id[in]': string[]; locale: string; limit: number; skip: number };
}): Promise<UnresolvedEntryCollection | AssetCollectionOriginal> => {
  if (entityType === 'Asset') {
    return client.getAssets({ ...query });
  }

  return client.withoutLinkResolution.getEntries({ ...query });
};

export const fetchAllEntities = async ({
  client,
  ids,
  entityType,
  locale,
}: FetchAllEntitiesOpts): Promise<EntryCollection | AssetCollection> => {
  const responseItems: Array<UnresolvedEntry | Asset> = [];
  const responseAssetsFromIncludes: Asset[] = [];
  const responseEntriesFromIncludes: UnresolvedEntry[] = [];

  if (!client) {
    throw new Error(
      'Failed to fetch experience entities. Required "client" parameter was not provided',
    );
  }

  if (!ids.length) {
    // simulate return of empty collection
    return {
      items: [],
    };
  }

  const fetchAllEntitiesImpl = async ({
    skip,
    ids,
    limit = 100,
  }: {
    skip: number;
    ids: string[];
    limit: number;
  }) => {
    const alreadyFetchedCount = skip;

    // Fetch a page
    const query = { 'sys.id[in]': ids, locale, limit, skip };
    const response = await fetchEntities({ entityType, client, query });
    const lastFetchedCount = response.items.length;

    // Store fetched items
    if ('Entry' === entityType) {
      const entryResponse = response as UnresolvedEntryCollection;
      responseItems.push(...entryResponse.items);
      const assets = entryResponse.includes?.Asset || [];
      const entries = entryResponse.includes?.Entry || [];
      responseAssetsFromIncludes.push(...assets);
      responseEntriesFromIncludes.push(...entries);
    } else if ('Asset' === entityType) {
      const assetResponse = response as AssetCollectionOriginal;
      responseItems.push(...assetResponse.items);
    } else {
      throw new Error(`Unsupported entityType: ${entityType}`);
    }

    // If more fetches, fetch recursively
    const hasMorePagesToFetch = alreadyFetchedCount + lastFetchedCount < response.total;
    if (!hasMorePagesToFetch) {
      return;
    }

    await fetchAllEntitiesImpl({
      skip: alreadyFetchedCount + lastFetchedCount,
      ids,
      limit,
    });
  };

  const fetchAllEntitiesWithFetchLimitDownsizing = async (opts: FetchAllEntitiesImplOpts) => {
    const { skip, ids, limit } = opts;
    try {
      await fetchAllEntitiesImpl({
        ids,
        skip,
        limit,
      });
    } catch (e) {
      if (e instanceof Error && e.message.includes('size too big') && limit > MIN_FETCH_LIMIT) {
        const newLimit = Math.max(MIN_FETCH_LIMIT, Math.floor(limit / 2));
        await fetchAllEntitiesWithFetchLimitDownsizing({
          skip,
          ids,
          limit: newLimit,
        });
      }
    }
  };

  await fetchAllEntitiesWithFetchLimitDownsizing({
    ids,
    skip: 0,
    limit: DEFAULT_FETCH_LIMIT,
  });

  // Deduplicate included assets and entries
  const dedupedEntries = uniqBy(responseEntriesFromIncludes, (entry) => entry.sys.id);
  const dedupedAssets = uniqBy(responseAssetsFromIncludes, (asset) => asset.sys.id);

  if ('Entry' === entityType) {
    return {
      items: responseItems as UnresolvedEntry[],
      includes: {
        Asset: dedupedAssets,
        Entry: dedupedEntries,
      },
    };
  } else if ('Asset' === entityType) {
    return {
      items: responseItems as Asset[],
    };
  } else {
    throw new Error(`Unsupported entityType: ${entityType}`);
  }
};
