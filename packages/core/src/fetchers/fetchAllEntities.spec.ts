import { entries } from '../test/__fixtures__/entities';
import { fetchAllEntities } from './fetchAllEntities';

import { describe, afterEach, it, expect, vi, Mock } from 'vitest';
import { ContentfulClientApi } from 'contentful';

const mockClient = {
  getAssets: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn(),
  },
} as unknown as ContentfulClientApi<undefined>;

describe('fetchAllEntities', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all entities', async () => {
    (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({
      items: [...entries],
      total: 100,
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
    (mockClient.withoutLinkResolution.getEntries as Mock)
      .mockRejectedValueOnce(new Error('Response size too big'))
      .mockResolvedValue({
        items: [...entries],
        total: 100,
      });

    const params = {
      ids: entries.map((entry) => entry.sys.id),
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    await fetchAllEntities(params);

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenLastCalledWith({
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 90,
      limit: 10,
    });
    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledTimes(11);
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

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenLastCalledWith({
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 0,
      limit: 1,
    });
    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledTimes(5);
  });
});
