import { createAsset, createEntry } from '../test/__fixtures__/entities';
import { fetchAllAssets, fetchAllEntries } from './fetchAllEntities';

import { describe, afterEach, it, expect, vi, Mock } from 'vitest';
import { ContentfulClientApi } from 'contentful';

const mockClient = {
  getAssets: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn(),
  },
} as unknown as ContentfulClientApi<undefined>;

const testEntries = [...Array(100).keys()].map((i) => createEntry(`some-entry-id-${i}`));
const testAssets = [...Array(100).keys()].map((i) => createAsset(`some-asset-id-${i}`));

describe('fetchAllEntries', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all entities', async () => {
    (mockClient.withoutLinkResolution.getEntries as Mock).mockImplementation((query) => {
      const { limit, skip } = query;
      const result = {
        items: [...testEntries.slice(skip, skip + limit)],
        includes: {
          Entry: [createEntry('some-entry-id'), createEntry(`some-entry-id-${skip}`)],
          Asset: [],
        },
        skip,
        limit,
        total: testEntries.length,
      };
      return result;
    });

    const params = {
      ids: testEntries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    const result = await fetchAllEntries(params);

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledTimes(5);
    // Five pages will return those values of `includes.Entry[]`:
    // Page 1 : `some-entry-id` , `some-entry-id-0`
    // Page 2: `some-entry-id` , `some-entry-id-20`
    // Page 3: `some-entry-id` , `some-entry-id-40`
    // Page 4: `some-entry-id` , `some-entry-id-60`
    // Page 5: `some-entry-id` , `some-entry-id-80`
    // But the `result.includes.Entry` is expected to only return unique entries
    // And there are only 6 uniques, as duplicates of `some-entry-id` are not returned or counted
    expect(result.includes.Entry).toHaveLength(6);
    expect(result.includes.Asset).toHaveLength(0);
    expect(result.items).toHaveLength(100);
  });

  it('should reduce limit and refetch all entities if response error is gotten', async () => {
    (mockClient.withoutLinkResolution.getEntries as Mock)
      .mockRejectedValueOnce(new Error('Response size too big'))
      .mockImplementation((query) => {
        const { limit, skip } = query;
        const result = {
          items: [...testEntries.slice(skip, skip + limit)],
          skip,
          limit,
          total: testEntries.length,
        };
        return result;
      });

    const params = {
      ids: testEntries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    const result = await fetchAllEntries(params);

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenNthCalledWith(11, {
      include: 2,
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 90,
      limit: 10,
    });
    expect(result.items).toHaveLength(100);
  });

  it('should never reduce limit to less than MIN_FETCH_LIMIT', async () => {
    (mockClient.withoutLinkResolution.getEntries as Mock).mockRejectedValue(
      new Error('Response size too big'),
    );

    const params = {
      ids: testEntries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };
    try {
      await fetchAllEntries(params);
    } catch (e) {
      expect((e as Error).message).toEqual('Response size too big');
    }

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenNthCalledWith(5, {
      include: 2,
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 0,
      limit: 1,
    });
  });
});

describe('fetchAllAssets', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all assets', async () => {
    (mockClient.getAssets as Mock).mockImplementation((query) => {
      const { limit, skip } = query;
      const result = {
        items: [...testAssets.slice(skip, skip + limit)],
        skip,
        limit,
        total: testAssets.length,
      };
      return result;
    });

    const params = {
      ids: testAssets.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    const result = await fetchAllAssets(params);

    expect(mockClient.getAssets).toHaveBeenCalledTimes(5);
    expect(result.items).toHaveLength(100);
  });

  it('should reduce limit and refetch all entities if response error is gotten', async () => {
    (mockClient.getAssets as Mock)
      .mockRejectedValueOnce(new Error('Response size too big'))
      .mockImplementation((query) => {
        const { limit, skip } = query;
        const result = {
          items: [...testAssets.slice(skip, skip + limit)],
          skip,
          limit,
          total: testAssets.length,
        };
        return result;
      });

    const params = {
      ids: testAssets.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    const result = await fetchAllAssets(params);

    expect(mockClient.getAssets).toHaveBeenNthCalledWith(11, {
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 90,
      limit: 10,
    });
    expect(result.items).toHaveLength(100);
  });

  it('should never reduce limit to less than MIN_FETCH_LIMIT', async () => {
    (mockClient.getAssets as Mock).mockRejectedValue(new Error('Response size too big'));

    const params = {
      ids: testAssets.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    try {
      await fetchAllAssets(params);
    } catch (e) {
      expect((e as Error).message).toEqual('Response size too big');
    }

    expect(mockClient.getAssets).toHaveBeenNthCalledWith(5, {
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 0,
      limit: 1,
    });
  });
});
