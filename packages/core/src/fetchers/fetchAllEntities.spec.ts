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
    (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({
      items: testEntries,
      total: 100,
    });

    const params = {
      ids: testEntries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    await fetchAllEntries(params);

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledTimes(5);
  });

  it('should reduce limit and refetch all entities if response error is gotten', async () => {
    (mockClient.withoutLinkResolution.getEntries as Mock)
      .mockRejectedValueOnce(new Error('Response size too big'))
      .mockResolvedValue({
        items: testEntries,
        total: 100,
      });

    const params = {
      ids: testEntries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    await fetchAllEntries(params);

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
    (mockClient.getAssets as Mock).mockResolvedValue({
      items: testAssets,
      total: 100,
    });

    const params = {
      ids: testAssets.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    await fetchAllAssets(params);

    expect(mockClient.getAssets).toHaveBeenCalledTimes(5);
  });

  it('should reduce limit and refetch all entities if response error is gotten', async () => {
    (mockClient.getAssets as Mock)
      .mockRejectedValueOnce(new Error('Response size too big'))
      .mockResolvedValue({
        items: testAssets,
        total: 100,
      });

    const params = {
      ids: testAssets.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    await fetchAllAssets(params);

    expect(mockClient.getAssets).toHaveBeenNthCalledWith(11, {
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 90,
      limit: 10,
    });
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
