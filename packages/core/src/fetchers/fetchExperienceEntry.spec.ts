import { ContentfulClientApi } from 'contentful';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { experienceEntry as experienceEntryJSON } from '../test/__fixtures__/experience';
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

  it('should throw an error if locale has not been provided', () => {
    expect(
      fetchExperienceEntry({
        client: mockClient,
        experienceTypeId: 'books',
        // @ts-expect-error intentionally setting it to undefined
        locale: undefined,
        identifier: { slug: 'slug' },
      }),
    ).rejects.toThrow(
      'Failed to fetch experience entities. Required "locale" parameter was not provided',
    );
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
        identifier: {},
      }),
    ).rejects.toThrow(
      'Failed to fetch experience entities. At least one identifier must be provided. Received: {}',
    );
  });

  it('should call client.getEntries with given parameters', async () => {
    (mockClient.getEntries as Mock).mockResolvedValue({ items: [experienceEntryJSON] });

    const experienceEntry = await fetchExperienceEntry({
      client: mockClient,
      experienceTypeId: 'books',
      locale: 'en-US',
      identifier: { slug: 'slug' },
    });

    expect(experienceEntry).toEqual(experienceEntry);

    expect(mockClient.getEntries).toHaveBeenCalledWith({
      content_type: 'books',
      locale: 'en-US',
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
      'sys.id': 'entry-id',
    });

    expect(expEntry).toEqual(experienceEntry);
  });

  it('should throw and error if getEntries call returns more than one entry', () => {
    (mockClient.getEntries as Mock).mockResolvedValue({
      items: [experienceEntryJSON, entries[0]],
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
