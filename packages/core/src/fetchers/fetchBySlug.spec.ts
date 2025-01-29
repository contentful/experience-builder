import { ContentfulClientApi } from 'contentful';
import { fetchBySlug } from './fetchBySlug';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import {
  experienceEntry,
  experienceEntryFieldsWithFilledUsedComponents,
} from '../test/__fixtures__/experience';
import { assets, entries } from '../test/__fixtures__/entities';
import { ExperienceEntry } from '@/types';

const circularEntry = {
  sys: {
    id: 'circular-entry',
    type: 'Entry',
  },
  fields: structuredClone(experienceEntryFieldsWithFilledUsedComponents),
};
const patternLevel1 = circularEntry.fields.usedComponents![0] as ExperienceEntry;
const patternLevel2 = patternLevel1.fields.usedComponents![0] as ExperienceEntry;
patternLevel2.fields.usedComponents = [patternLevel1];

const mockClient = {
  getAssets: vi.fn(),
  getEntries: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn(),
  },
} as unknown as ContentfulClientApi<undefined>;

describe('fetchBySlug', () => {
  const experienceTypeId = 'experienceTypeId';
  const slug = 'slug';
  const localeCode = 'en-US';

  beforeEach(() => {
    vi.mock('./fetchExperienceEntry', () => {
      const fetchExperienceEntry = async (options) => {
        if (options?.identifier?.slug === 'circular-slug') {
          return circularEntry;
        }
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
      const result = await fetchBySlug({
        client: mockClient,
        experienceTypeId,
        slug,
        localeCode,
        isEditorMode,
      });
      expect(result?.entityStore?.experienceEntryFields?.slug).toEqual(experienceEntry.fields.slug);
    });

    describe('when the API returns an object with circular references', () => {
      const slug = 'circular-slug';

      it('replace circular entries with links', async () => {
        const result = await fetchBySlug({
          client: mockClient,
          experienceTypeId,
          slug,
          localeCode,
          isEditorMode,
        });
        const entryFields = result!.entityStore!.experienceEntryFields!;
        const patternLevel1 = entryFields.usedComponents![0] as ExperienceEntry;
        const patternLevel2 = patternLevel1.fields.usedComponents![0] as ExperienceEntry;

        expect(patternLevel2.fields.usedComponents).not.toEqual([patternLevel1]);
        expect(patternLevel2.fields.usedComponents).toEqual([
          {
            sys: {
              id: patternLevel1.sys.id,
              linkType: 'Entry',
              type: 'Link',
            },
          },
        ]);
      });
    });
  });
});
