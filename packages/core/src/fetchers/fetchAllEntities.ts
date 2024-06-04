import { Asset, AssetCollection, ContentfulClientApi, Entry } from 'contentful';
import { MinimalEntryCollection } from './gatherAutoFetchedReferentsFromIncludes';
import { uniqBy } from 'lodash-es';

const MIN_FETCH_LIMIT = 1;
export const fetchAllEntries = async ({
  client,
  ids,
  locale,
  skip = 0,
  limit = 100,
  responseItems = [],
  responseIncludes = { Entry: [], Asset: [] },
}: {
  client: ContentfulClientApi<undefined>;
  ids: string[];
  locale: string;
  skip?: number;
  limit?: number;
  responseItems?: Entry[];
  responseIncludes?: MinimalEntryCollection['includes'];
}): Promise<{
  items: Entry[];
  includes: {
    Entry: Entry[];
    Asset: Asset[];
  };
}> => {
  try {
    if (!client) {
      throw new Error(
        'Failed to fetch experience entities. Required "client" parameter was not provided',
      );
    }

    if (!ids.length) {
      return {
        items: [],
        includes: {
          Entry: [],
          Asset: [],
        },
      };
    }

    const query = { 'sys.id[in]': ids, locale, limit, skip };

    const {
      items,
      includes,
      total: responseTotal,
    } = await client.withoutLinkResolution.getEntries({ ...query });

    responseItems.push(...(items as Entry[]));
    responseIncludes?.Entry?.push(...(includes?.Entry || []));
    responseIncludes?.Asset?.push(...(includes?.Asset || []));

    // E.g Total entries = 99
    // First fetch => { skip: 0, limit: 50, total: 99 } => 50 Entries fetched in Page 0
    // Total Entries fetched = 50, 49 remaining

    // 0(skip) + 50(limit) < 99(total) => Fetch again
    // Second fetch => { skip: 50, limit: 50, total: 99 } => 49 Entries fetched in Page 1
    // Total Entries fetched = 50(Page 0) + 49(Page 1) = 99, 0 remaining

    // 50(skip) + 50(limit) > 99(total) => Stop fetching
    if (skip + limit < responseTotal) {
      return await fetchAllEntries({
        client,
        ids,
        locale,
        skip: skip + limit,
        limit,
        responseItems,
        responseIncludes,
      });
    }

    const dedupedEntries = uniqBy(responseIncludes?.Entry, (entry) => entry.sys.id);
    const dedupedAssets = uniqBy(responseIncludes?.Asset, (asset) => asset.sys.id);

    return {
      items: responseItems,
      includes: {
        Entry: dedupedEntries,
        Asset: dedupedAssets,
      },
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('size too big') &&
      limit > MIN_FETCH_LIMIT
    ) {
      const newLimit = Math.max(MIN_FETCH_LIMIT, Math.floor(limit / 2));
      return fetchAllEntries({
        client,
        ids,
        locale,
        skip,
        limit: newLimit,
        responseItems,
      });
    }

    throw error;
  }
};

export const fetchAllAssets = async ({
  client,
  ids,
  locale,
  skip = 0,
  limit = 100,
  responseItems = [],
}: {
  client: ContentfulClientApi<undefined>;
  ids: string[];
  locale: string;
  skip?: number;
  limit?: number;
  responseItems?: Asset[];
}): Promise<{ items: Asset[] }> => {
  try {
    if (!client) {
      throw new Error(
        'Failed to fetch experience entities. Required "client" parameter was not provided',
      );
    }

    if (!ids.length) {
      return { items: [] };
    }

    const query = { 'sys.id[in]': ids, locale, limit, skip };

    const { items, total: responseTotal } = await client.getAssets({ ...query });

    responseItems.push(...(items as Asset[]));

    if (skip + limit < responseTotal) {
      return await fetchAllAssets({
        client,
        ids,
        locale,
        skip: skip + limit,
        limit,
        responseItems,
      });
    }

    return {
      items: responseItems,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('size too big') &&
      limit > MIN_FETCH_LIMIT
    ) {
      const newLimit = Math.max(MIN_FETCH_LIMIT, Math.floor(limit / 2));
      return fetchAllAssets({
        client,
        ids,
        locale,
        skip,
        limit: newLimit,
        responseItems,
      });
    }

    throw error;
  }
};
