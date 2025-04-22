import { ContentfulClientApi } from 'contentful';
import { experienceEntry } from '../test/__fixtures__/experience';
import { assets, entityIds, entries } from '../test/__fixtures__/entities';
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

  it('should throw an error if Provided entry is not an experience entry', async () => {
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

  describe('when fetching without errors', () => {
    beforeEach(() => {
      (mockClient.getAssets as Mock).mockResolvedValue({ items: assets });
      (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({ items: entries });
      (gatherDeepReferencesFromExperienceEntry as Mock).mockReturnValue([]);
    });

    it('should fetch referenced entities', async () => {
      const res = await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: experienceEntry,
        locale: 'en-US',
      });

      expect(mockClient.getAssets).toHaveBeenCalledWith({
        limit: 100,
        skip: 0,
        locale: 'en-US',
        'sys.id[in]': [entityIds.ASSET1],
      });

      expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledWith({
        locale: 'en-US',
        include: 2,
        'sys.id[in]': [entityIds.ENTRY1, entityIds.ENTRY2],
        limit: 100,
        skip: 0,
      });

      expect(res).toEqual({
        assets,
        entries,
      });
    });

    it('should fetch entities only once when they occurr multiple times', async () => {
      const testExperienceEntry = structuredClone(experienceEntry);
      // Create a new data source with the same entry link as uuid3
      testExperienceEntry.fields.dataSource['uuid3_duplicate'] =
        testExperienceEntry.fields.dataSource['uuid3'];

      await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: testExperienceEntry,
        locale: 'en-US',
      });

      expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledWith(
        expect.objectContaining({
          'sys.id[in]': [entityIds.ENTRY1, entityIds.ENTRY2],
        }),
      );
    });

    it('should not throw an error if locale has not been provided', async () => {
      expect(
        fetchReferencedEntities({
          client: mockClient as unknown as ContentfulClientApi<'WITH_ALL_LOCALES'>,
          experienceEntry: experienceEntry,
        }),
      ).resolves.not.toThrow();
    });
  });

  describe('deep-references', () => {
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
});
