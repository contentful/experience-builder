import { ContentfulClientApi } from 'contentful';
import { fetchById } from './fetchById';
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

describe('fetchById', () => {
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
      const id = 'abc123';
      const localeCode = 'en-US';

      const result = await fetchById({
        client: mockClient,
        experienceTypeId,
        id,
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
      const id = 'abc123';
      const localeCode = 'en-US';

      const result = await fetchById({
        client: mockClient,
        experienceTypeId,
        id,
        localeCode,
        isEditorMode,
      });
      expect(result?.entityStore?.experienceEntryFields?.slug).toEqual(experienceEntry.fields.slug);
    });
  });
});
