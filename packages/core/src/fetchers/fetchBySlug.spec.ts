import { ContentfulClientApi } from 'contentful';
import { fetchBySlug } from './fetchBySlug';
import { experienceEntry } from '../test/__fixtures__/experience';
import { assets, entries } from '../test/__fixtures__/entities';
import { describe, beforeEach, it, expect, vi } from 'vitest';

const mockClient = {
  getAssets: vi.fn(),
  getEntries: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn(),
  },
} as unknown as ContentfulClientApi<undefined>;

describe('fetchBySlug', () => {
  beforeEach(() => {
    vi.mock('./fetchExperienceEntry', () => {
      const fetchExperienceEntry = async () => {
        return experienceEntry;
      };
      return {
        fetchExperienceEntry,
      };
    });

    vi.mock('./fetchReferencedEntities', () => {
      const fetchReferencedEntities = async () => {
        return { entries, assets };
      };
      return {
        fetchReferencedEntities,
      };
    });
  });

  describe('when in editor mode', () => {
    const isEditorMode = true;

    it('should returned undefined if in editor mode', async () => {
      const experienceTypeId = 'experienceTypeId';
      const slug = 'slug';
      const localeCode = 'en-US';

      const result = await fetchBySlug({
        client: mockClient,
        experienceTypeId,
        slug,
        localeCode,
        isEditorMode,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('when not in editor mode', () => {
    const isEditorMode = false;

    it('should return an experience entry with the given slug', async () => {
      const experienceTypeId = 'experienceTypeId';
      const slug = 'slug';
      const localeCode = 'en-US';

      const result = await fetchBySlug({
        client: mockClient,
        experienceTypeId,
        slug,
        localeCode,
        isEditorMode,
      });
      expect(result?.entityStore?.experienceEntryFields?.slug).toEqual(experienceEntry.fields.slug);
    });
  });
});
