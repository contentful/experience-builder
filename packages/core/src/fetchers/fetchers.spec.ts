import type { ContentfulClientApi } from 'contentful';
import * as fetchers from './fetchers';
import * as fetchExperienceEntryModule from './fetchExperienceEntry';
import * as fetchReferencedEntitiesModule from './fetchReferencedEntities';
import { experienceEntry } from '../test/__fixtures__/experience';
import { assets, entries } from '../test/__fixtures__/entities';
import { describe, beforeEach, it, expect, vi, Mock } from 'vitest';

const mockClient = {
  getAssets: vi.fn(),
  getEntries: vi.fn(),
} as unknown as ContentfulClientApi<undefined>;

describe('fetchExperience', () => {
  beforeEach(() => {
    // used by fetchExperience()->fetchExperienceEntry()
    (mockClient.getEntries as Mock).mockResolvedValueOnce({
      items: [experienceEntry],
    });

    // used by fetchExperience()->fetchReferencedEntities()
    (mockClient.getAssets as Mock).mockResolvedValue({ items: assets });
    (mockClient.getEntries as Mock).mockResolvedValueOnce({
      items: entries,
      includes: { Asset: assets },
    });
  });

  it('should call fetchExperienceEntry and fetchReferencedEntities with given parameters', async () => {
    const fetchEntrySpy = vi.spyOn(fetchExperienceEntryModule, 'fetchExperienceEntry');
    const fetchReferencesSpy = vi.spyOn(fetchReferencedEntitiesModule, 'fetchReferencedEntities');

    await fetchers.fetchExperience({
      client: mockClient,
      experienceTypeId: 'books',
      locale: 'en-US',
      identifier: { slug: 'slug' },
    });

    expect(fetchEntrySpy).toHaveBeenCalledWith({
      client: mockClient,
      experienceTypeId: 'books',
      locale: 'en-US',
      identifier: { slug: 'slug' },
    });

    expect(fetchReferencesSpy).toHaveBeenCalledWith({
      client: mockClient,
      experienceEntry,
      locale: 'en-US',
    });
  });
});
