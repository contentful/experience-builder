import type { ContentfulClientApi, Entry } from 'contentful';
import * as fetchers from './fetchers';
import { compositionEntry } from '../../test/__fixtures__/composition';
import { assets, entries } from '../../test/__fixtures__/entities';

const mockClient = {
  getEntries: jest.fn(),
  getAssets: jest.fn(),
} as unknown as ContentfulClientApi<undefined>;

describe('fetchExperienceEntry', () => {
  it('should throw and error if client has not been provided', async () => {
    try {
      await fetchers.fetchExperienceEntry({
        // @ts-expect-error intentionally setting it to undefined
        client: undefined,
        experienceTypeId: 'books',
        locale: 'en-US',
        identifier: { slug: 'slug' },
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "client" parameter was not provided'
      );
    }
  });

  it('should throw an error if locale has not been provided', async () => {
    try {
      await fetchers.fetchExperienceEntry({
        client: mockClient,
        experienceTypeId: 'books',
        // @ts-expect-error intentionally setting it to undefined
        locale: undefined,
        identifier: { slug: 'slug' },
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "locale" parameter was not provided'
      );
    }
  });

  it('should throw an error if experienceId has not been provided', async () => {
    try {
      await fetchers.fetchExperienceEntry({
        client: mockClient,
        // @ts-expect-error intentionally setting it to undefined
        experienceTypeId: undefined,
        locale: 'en-US',
        identifier: { slug: 'slug' },
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided'
      );
    }
  });

  it('should throw and error if neither id nor slug identifier has been provided', async () => {
    try {
      await fetchers.fetchExperienceEntry({
        client: mockClient,
        experienceTypeId: 'books',
        locale: 'en-US',
        identifier: {},
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. At least one identifier must be provided. Received: {}'
      );
    }
  });

  it('should call client.getEntries with given parameters', async () => {
    (mockClient.getEntries as jest.Mock).mockResolvedValue({ items: [compositionEntry] });

    const experienceEntry = await fetchers.fetchExperienceEntry({
      client: mockClient,
      experienceTypeId: 'books',
      locale: 'en-US',
      identifier: { slug: 'slug' },
    });

    expect(experienceEntry).toEqual(compositionEntry);

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      content_type: 'books',
      locale: 'en-US',
      'fields.slug': 'slug',
    });

    const expEntry = await fetchers.fetchExperienceEntry({
      client: mockClient,
      experienceTypeId: 'books',
      locale: 'en-US',
      identifier: { id: 'entry-id' },
    });

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      content_type: 'books',
      locale: 'en-US',
      'sys.id': 'entry-id',
    });

    expect(expEntry).toEqual(compositionEntry);
  });

  it('should throw and error if getEntries call returns more than one entry', async () => {
    (mockClient.getEntries as jest.Mock).mockResolvedValue({
      items: [compositionEntry, entries[0]],
    });

    try {
      await fetchers.fetchExperienceEntry({
        client: mockClient,
        experienceTypeId: 'books',
        locale: 'en-US',
        identifier: { slug: 'slug' },
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'More than one experience with identifier: {"slug":"slug"} was found'
      );
    }
  });
});

describe('fetchReferencedEntities', () => {
  it('should throw an error if client has not been provided', async () => {
    try {
      await fetchers.fetchReferencedEntities({
        // @ts-expect-error intentionally setting it to undefined
        client: undefined,
        experienceEntry: compositionEntry as unknown as Entry,
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
      await fetchers.fetchReferencedEntities({
        client: mockClient,
        experienceEntry: compositionEntry as unknown as Entry,
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
      await fetchers.fetchReferencedEntities({
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
    (mockClient.getAssets as jest.Mock).mockResolvedValue({ items: assets });

    (mockClient.getEntries as jest.Mock).mockResolvedValue({ items: entries });

    const res = await fetchers.fetchReferencedEntities({
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

describe('fetchExperience', () => {
  beforeEach(() => {
    (mockClient.getEntries as jest.Mock).mockResolvedValueOnce({
      items: [compositionEntry],
    });
    (mockClient.getAssets as jest.Mock).mockResolvedValue({ items: assets });
    (mockClient.getEntries as jest.Mock).mockResolvedValue({ items: entries });
  });

  it('should call fetchExperienceEntry and fetchReferencedEntities with given parameters', async () => {
    const fetchEntrySpy = jest.spyOn(fetchers, 'fetchExperienceEntry');
    const fetchReferencesSpy = jest.spyOn(fetchers, 'fetchReferencedEntities');

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
      experienceEntry: compositionEntry,
      locale: 'en-US',
    });
  });
});
