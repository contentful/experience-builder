import { entries, generateEntries } from '../test/__fixtures__/entities';
import { fetchAllEntities } from './fetchAllEntities2';

import { describe, afterEach, it, expect, vi, Mock } from 'vitest';
import { ContentfulClientApi } from 'contentful';

const mockClient = {
  getAssets: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn().mockImplementation(() => {
      debugger;
      throw new Error(`mock implementation`);
    }),
  },
} as unknown as ContentfulClientApi<undefined>;

describe('fetchAllEntities', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all entities', async () => {
    let entries = generateEntries(100);
    (mockClient.withoutLinkResolution.getEntries as Mock).mockImplementation((query) => {
      const { limit, skip } = query;
      console.log(`getEntries() returns:`, {
        items: `[${skip}, ${skip + limit})`,
        total: entries.length,
        skip,
        limit,
      });
      const result = {
        items: [...entries.slice(skip, skip + limit)],
        skip,
        limit,
        total: entries.length,
      };
      return result;
    });

    const params = {
      ids: entries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    await fetchAllEntities(params);

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledTimes(5);
  });

  it('should reduce limit and refetch all entities if response error is gotten', async () => {
    let entries = generateEntries(100);

    (mockClient.withoutLinkResolution.getEntries as Mock)
      .mockRejectedValueOnce(new Error('Response size too big'))
      .mockImplementation((query) => {
        const { limit, skip } = query;
        console.log(`getEntries() returns:`, {
          items: `[${skip}, ${skip + limit})`,
          total: entries.length,
          skip,
          limit,
        });
        const result = {
          items: [...entries.slice(skip, skip + limit)],
          skip,
          limit,
          total: entries.length,
        };
        return result;
      });

    const params = {
      ids: entries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    await fetchAllEntities(params);

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenNthCalledWith(11, {
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 90,
      limit: 10,
    });
  });

  it('should never reduce limit to less than MIN_FETCH_LIMIT', async () => {
    (mockClient.withoutLinkResolution.getEntries as Mock).mockRejectedValue(
      new Error('Response size too big'),
    );

    const params = {
      ids: entries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };
    await fetchAllEntities(params);

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenNthCalledWith(5, {
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 0,
      limit: 1,
    });
  });
});
