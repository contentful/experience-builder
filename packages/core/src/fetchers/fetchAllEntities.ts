import { Asset, ContentfulClientApi, Entry } from 'contentful';
import { MinimalEntryCollection } from './gatherAutoFetchedReferentsFromIncludes';

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
}) => {
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

    if (skip + limit < responseTotal) {
      await fetchAllEntries({
        client,
        ids,
        locale,
        skip: skip + limit,
        limit,
        responseItems,
        responseIncludes,
      });
    }

    return {
      items: responseItems,
      includes: responseIncludes,
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
}) => {
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
      await fetchAllAssets({
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
