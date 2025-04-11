import { ContentfulClientApi } from 'contentful';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { experienceEntry } from '../test/__fixtures__/experience';
import { entries } from '../test/__fixtures__/entities';
import { describe, it, expect, vi, Mock } from 'vitest';

const mockClient = {
  getEntries: vi.fn(),
  getAssets: vi.fn(),
} as unknown as ContentfulClientApi<undefined>;

describe('fetchExperienceEntry', () => {
  it('should throw and error if client has not been provided', () => {
    expect(
      fetchExperienceEntry({
        // @ts-expect-error intentionally setting it to undefined
        client: undefined,
        experienceTypeId: 'books',
        locale: 'en-US',
        identifier: { slug: 'slug' },
      }),
    ).rejects.toThrow(
      'Failed to fetch experience entities. Required "client" parameter was not provided',
    );
  });

  it('should not throw an error if locale has not been provided', () => {
    (mockClient.getEntries as Mock).mockResolvedValue({ items: [experienceEntry] });

    expect(
      fetchExperienceEntry({
        client: mockClient as unknown as ContentfulClientApi<'WITH_ALL_LOCALES'>,
        experienceTypeId: 'books',
        identifier: { slug: 'slug' },
      }),
    ).resolves.not.toThrow();
  });

  it('should throw an error if experienceId has not been provided', () => {
    expect(
      fetchExperienceEntry({
        client: mockClient,
        // @ts-expect-error intentionally setting it to undefined
        experienceTypeId: undefined,
        locale: 'en-US',
        identifier: { slug: 'slug' },
      }),
    ).rejects.toThrow(
      'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided',
    );
  });

  it('should throw and error if neither id nor slug identifier has been provided', () => {
    expect(
      fetchExperienceEntry({
        client: mockClient,
        experienceTypeId: 'books',
        locale: 'en-US',
        // @ts-expect-error intentionally setting it to an invalid value
        identifier: {},
      }),
    ).rejects.toThrow(
      'Failed to fetch experience entities. At least one identifier must be provided. Received: {}',
    );
  });

  it('should call client.getEntries with given parameters', async () => {
    (mockClient.getEntries as Mock).mockResolvedValue({ items: [experienceEntry] });

    const fetchedExperience = await fetchExperienceEntry({
      client: mockClient,
      experienceTypeId: 'books',
      locale: 'en-US',
      identifier: { slug: 'slug' },
    });

    expect(fetchedExperience).toEqual(experienceEntry);

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      content_type: 'books',
      locale: 'en-US',
      include: 3,
      'fields.slug': 'slug',
    });

    const expEntry = await fetchExperienceEntry({
      client: mockClient,
      experienceTypeId: 'books',
      locale: 'en-US',
      identifier: { id: 'entry-id' },
    });

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      content_type: 'books',
      locale: 'en-US',
      include: 3,
      'sys.id': 'entry-id',
    });

    expect(expEntry).toEqual(experienceEntry);
  });

  it('should throw and error if getEntries call returns more than one entry', () => {
    (mockClient.getEntries as Mock).mockResolvedValue({
      items: [experienceEntry, entries[0]],
    });

    expect(
      fetchExperienceEntry({
        client: mockClient,
        experienceTypeId: 'books',
        locale: 'en-US',
        identifier: { slug: 'slug' },
      }),
    ).rejects.toThrow('More than one experience with identifier: {"slug":"slug"} was found');
  });
});
