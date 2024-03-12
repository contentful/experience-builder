import { ContentfulClientApi, Entry } from 'contentful';
import { experienceEntry } from '../test/__fixtures__/experience';
import { assets, entries } from '../test/__fixtures__/entities';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { gatherDeepReferencesFromExperienceEntry } from '@/deep-binding/DeepReference';
import { fetchReferencedEntities } from './fetchReferencedEntities';

const mockClient = {
  getAssets: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn(),
  },
} as unknown as ContentfulClientApi<undefined>;

vi.mock('@/deep-binding/DeepReference', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/deep-binding/DeepReference')>();
  return {
    ...mod,
    // don't mock return values here using vi.fn().mockReturnValue([])
    // but mock them in the test cases, as mock-restore will not restore the return values
    gatherDeepReferencesFromExperienceEntry: vi.fn(),
  };
});

beforeEach(() => {
  vi.restoreAllMocks();

  (gatherDeepReferencesFromExperienceEntry as Mock).mockReturnValue([]);
});

describe('fetchReferencedEntities', () => {
  it('should throw an error if client has not been provided', async () => {
    try {
      await fetchReferencedEntities({
        // @ts-expect-error intentionally setting it to undefined
        client: undefined,
        experienceEntry: experienceEntry,
        locale: 'en-US',
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "client" parameter was not provided',
      );
    }
  });

  it('should throw an error if locale has not been provided', async () => {
    try {
      await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: experienceEntry,
        // @ts-expect-error intentionally setting it to undefined
        locale: undefined,
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "locale" parameter was not provided',
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
        'Failed to fetch experience entities. Provided "experienceEntry" does not match experience entry schema',
      );
    }
  });

  it('should fetch referenced entities', async () => {
    (mockClient.getAssets as Mock).mockResolvedValue({ items: assets });

    (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({ items: entries });

    (gatherDeepReferencesFromExperienceEntry as Mock).mockReturnValue([]);

    const res = await fetchReferencedEntities({
      client: mockClient,
      experienceEntry: experienceEntry as unknown as Entry,
      locale: 'en-US',
    });

    expect(mockClient.getAssets).toHaveBeenCalledWith({
      locale: 'en-US',
      'sys.id[in]': assets.map((asset) => asset.sys.id),
    });

    expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledWith({
      locale: 'en-US',
      'sys.id[in]': entries.map((entry) => entry.sys.id),
    });

    expect(res).toEqual({
      assets,
      entries,
    });
  });
});

describe('fetchReferencedEntities handling deep-references', () => {
  it('should call gatherDeepReferencesFromExperienceEntry()', async () => {
    (mockClient.getAssets as Mock).mockResolvedValue({ items: assets });

    (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({ items: entries });

    (gatherDeepReferencesFromExperienceEntry as Mock).mockReturnValue([]);
    fetchReferencedEntities({
      client: mockClient,
      experienceEntry: experienceEntry,
      locale: 'en-US',
    });

    expect(gatherDeepReferencesFromExperienceEntry).toHaveBeenCalledOnce();
    expect(gatherDeepReferencesFromExperienceEntry).toHaveBeenCalledWith(experienceEntry);
  });
});
