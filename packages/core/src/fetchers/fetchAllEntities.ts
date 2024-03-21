import { ContentfulClientApi, Entry } from 'contentful';

const MIN_FETCH_LIMIT = 1;

const fetchEntities = async ({
  entityType,
  client,
  query,
}: {
  entityType: 'Entry' | 'Asset';
  client: ContentfulClientApi<undefined>;
  query: { 'sys.id[in]': string[]; locale: string; limit: number; skip: number };
}) => {
  if (entityType === 'Asset') {
    return client.getAssets({ ...query });
  }

  return client.withoutLinkResolution.getEntries({ ...query });
};

export const fetchAllEntities = async ({
  client,
  entityType,
  ids,
  locale,
  skip = 0,
  limit = 100,
  responseItems = [],
}: {
  client: ContentfulClientApi<undefined>;
  entityType: 'Entry' | 'Asset';
  ids: string[];
  locale: string;
  skip?: number;
  limit?: number;
  responseItems?: Entry[];
}) => {
  try {
    if (!ids.length || !client) {
      return {
        items: [],
      };
    }

    const query = { 'sys.id[in]': ids, locale, limit, skip };

    const response = await fetchEntities({ entityType, client, query });

    if (!response) {
      return {
        items: responseItems,
      };
    }

    responseItems.push(...(response.items as Entry[]));

    if (skip + limit < response.total) {
      await fetchAllEntities({
        client,
        entityType,
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
      return fetchAllEntities({
        client,
        entityType,
        ids,
        locale,
        skip,
        limit: newLimit,
        responseItems,
      });
    }

    return error;
  }
};
