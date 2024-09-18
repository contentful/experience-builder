import { createAsset, createEntry } from '../test/__fixtures__/entities';
import { fetchAllAssets, fetchAllEntries } from './fetchAllEntities';

import { describe, afterEach, it, expect, vi, Mock } from 'vitest';
import { ContentfulClientApi } from 'contentful';

const mockClient = {
  getAssets: vi.fn(),
  getEntries: vi.fn(),
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
    (mockClient.getEntries as Mock).mockImplementation((query) => {
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

    expect(mockClient.getEntries).toHaveBeenCalledTimes(5);
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

  it.only('should resolve entries that are embedded into rich text fields', async () => {
    const entryThatsEmbeddedIntoRichText = createEntry('entry-with-embedded-entry', {
      sys: {
        id: 'abc123',
        type: 'Entry',
      },
      fields: { name: { 'en-US': 'A Test entry thats embedded into RT' } },
    });

    const entryWithEmbeddedEntryInRichText = createEntry('some-entry-id', {
      fields: {
        title: { en: 'Entry with embedded entry its RT' },
        //@ts-expect-error types don't line up
        body: {
          'en-US': {
            data: {},
            content: [
              {
                data: {},
                content: [
                  {
                    data: {},
                    marks: [],
                    value: 'Test 123',
                    nodeType: 'text',
                  },
                ],
                nodeType: 'paragraph',
              },
              {
                data: {
                  target: entryThatsEmbeddedIntoRichText,
                },
                content: [],
                nodeType: 'embedded-entry-block',
              },
            ],
            nodeType: 'document',
          },
        },
      },
    });

    (mockClient.getEntries as Mock).mockImplementation(() => {
      const result = {
        items: [entryWithEmbeddedEntryInRichText],
        includes: { Entry: [entryThatsEmbeddedIntoRichText] },
      };
      return result;
    });

    const params = {
      ids: [entryWithEmbeddedEntryInRichText.sys.id],
      entityType: 'Entry' as 'Entry' | 'Asset',
      client: mockClient,
      locale: 'en-US',
      limit: 20,
    };

    const result = await fetchAllEntries(params);

    //important that `getEntries` is called and not client.withoutLinkResolution.getEntries so the entities are resolved
    expect(mockClient.getEntries).toHaveBeenCalledOnce();
    //This call is the actual test, verify `getEntries` was called and not `withoutLinkResolution.getEntries`
    expect(mockClient.withoutLinkResolution.getEntries).not.toHaveBeenCalled();
    expect(result.includes.Entry).toHaveLength(1);
    expect(result.items).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entry = result.items[0] as any;

    expect(entry.fields.body['en-US'].content[1].data.target.sys.id).toEqual(
      entryThatsEmbeddedIntoRichText.sys.id,
    );

    expect(entry.fields.body['en-US'].content[1].data.target.fields.name['en-US']).toEqual(
      entryThatsEmbeddedIntoRichText.fields.name!['en-US'],
    );
  });

  it('should reduce limit and refetch all entities if response error is gotten', async () => {
    (mockClient.getEntries as Mock)
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

    expect(mockClient.getEntries).toHaveBeenNthCalledWith(11, {
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 90,
      limit: 10,
      include: 10,
    });
    expect(result.items).toHaveLength(100);
  });

  it('should never reduce limit to less than MIN_FETCH_LIMIT', async () => {
    (mockClient.getEntries as Mock).mockRejectedValue(new Error('Response size too big'));

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

    expect(mockClient.getEntries).toHaveBeenNthCalledWith(5, {
      'sys.id[in]': params.ids,
      locale: 'en-US',
      skip: 0,
      limit: 1,
      include: 10,
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
      include: 10,
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
