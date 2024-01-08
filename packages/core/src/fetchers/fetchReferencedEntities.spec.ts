import { ContentfulClientApi, Entry } from 'contentful';
import { fetchReferencedEntities } from './fetchReferencedEntities';
import { compositionEntry } from '../test/__fixtures__/composition';
import { assets, entries } from '../test/__fixtures__/entities';
import { describe, it, expect, vi, Mock } from 'vitest';

const mockClient = {
  getEntries: vi.fn(),
  getAssets: vi.fn(),
} as unknown as ContentfulClientApi<undefined>;

describe('fetchReferencedEntities', () => {
  it('should throw an error if client has not been provided', async () => {
    try {
      await fetchReferencedEntities({
        // @ts-expect-error intentionally setting it to undefined
        client: undefined,
        experienceEntry: compositionEntry,
        locale: 'en-US',
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "client" parameter was not provided'
      );
    }
  });

  it('should throw an error if locale has not been provided', async () => {
    try {
      await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: compositionEntry,
        // @ts-expect-error intentionally setting it to undefined
        locale: undefined,
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "locale" parameter was not provided'
      );
    }
  });

  it('should throw an error if provided entry is not experience entry', async () => {
    try {
      await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: entries[0],
        locale: 'en-US',
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Provided "experienceEntry" does not match experience entry schema'
      );
    }
  });

  it('should fetch referenced entities', async () => {
    (mockClient.getAssets as Mock).mockResolvedValue({ items: assets });

    (mockClient.getEntries as Mock).mockResolvedValue({ items: entries });

    const res = await fetchReferencedEntities({
      client: mockClient,
      experienceEntry: compositionEntry as unknown as Entry,
      locale: 'en-US',
    });

    expect(mockClient.getAssets).toHaveBeenCalledWith({
      locale: 'en-US',
      'sys.id[in]': assets.map((asset) => asset.sys.id),
    });

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      locale: 'en-US',
      'sys.id[in]': entries.map((entry) => entry.sys.id),
    });

    expect(res).toEqual({
      assets,
      entries,
    });
  });
});
