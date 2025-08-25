import { ContentfulClientApi } from 'contentful';
import { fetchBySlug } from './fetchBySlug';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import {
  createExperienceEntry,
  experienceEntryFieldsWithFilledUsedComponents,
} from '../test/__fixtures__/experience';
import { assets, entries } from '../test/__fixtures__/entities';
import { ExperienceEntry } from '@/types';
import * as sideloadingMock from './shared/sideloading';
import * as fetchers from './fetchReferencedEntities';

let experienceEntry = createExperienceEntry({});
const circularEntry = {
  sys: {
    id: 'circular-entry',
    type: 'Entry',
    locale: 'en-US',
  },
  fields: structuredClone(experienceEntryFieldsWithFilledUsedComponents),
};
const patternLevel1 = circularEntry.fields.usedComponents![0] as ExperienceEntry;
const patternLevel2 = patternLevel1.fields.usedComponents![0] as ExperienceEntry;
patternLevel2.fields.usedComponents = [patternLevel1];

describe('fetchBySlug', () => {
  const mockClient = {
    getAssets: vi.fn(),
    getEntries: vi.fn(),
    withoutLinkResolution: {
      getEntries: vi.fn(),
    },
  } as unknown as ContentfulClientApi<undefined>;

  const experienceTypeId = 'experienceTypeId';
  const slug = 'slug';
  const localeCode = 'en-US';

  beforeEach(() => {
    experienceEntry = createExperienceEntry({});
    vi.mock('./fetchExperienceEntry', () => {
      const fetchExperienceEntry = async (options) => {
        if (options?.identifier?.slug === 'circular-slug') {
          return circularEntry;
        }
        return createExperienceEntry({});
      };
      return {
        fetchExperienceEntry,
      };
    });

    vi.mock('./fetchReferencedEntities', () => {
      const fetchReferencedEntities = vi.fn(async () => {
        return { entries, assets };
      });
      return {
        fetchReferencedEntities,
      };
    });

    vi.mock('./attachPrebindingDefaultValueAsDataSource', () => ({
      attachPrebindingDefaultValueAsDataSource: vi.fn(),
    }));

    vi.mock('./shared/sideloading', () => ({
      sideloadPrebindingDefaultValues: vi.fn(),
    }));
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

    describe('when the API returns an experience with prebinding default value not as a datasource', () => {
      const isEditorMode = false;
      beforeEach(() => {
        vi.clearAllMocks();
      });

      it('should attach prebinding default value as a data source', async () => {
        vi.mocked(sideloadingMock.sideloadPrebindingDefaultValues).mockImplementationOnce(
          (entry: ExperienceEntry): false | number => {
            entry.fields.dataSource = {
              ...entry.fields.dataSource,
              sideloaded_preboundDefaultEntry123: {
                sys: {
                  id: 'preboundDefaultEntry123',
                  type: 'Link',
                  linkType: 'Entry',
                },
              },
            };
            return 1; // Indicating one sideloaded default value
          },
        );

        await fetchBySlug({
          client: mockClient,
          experienceTypeId,
          slug,
          localeCode,
          isEditorMode,
        });

        expect(fetchers.fetchReferencedEntities).toHaveBeenCalledWith(
          expect.objectContaining({
            experienceEntry: expect.objectContaining({
              fields: expect.objectContaining({
                dataSource: expect.objectContaining({
                  ...createExperienceEntry({}).fields.dataSource,
                  sideloaded_preboundDefaultEntry123: {
                    sys: {
                      id: 'preboundDefaultEntry123',
                      type: 'Link',
                      linkType: 'Entry',
                    },
                  },
                }),
              }),
            }),
          }),
        );
      });

      it('should not attach prebinding default value as a data source if attachPrebindingDefaultValueAsDataSource does not populate it', async () => {
        await fetchBySlug({
          client: mockClient,
          experienceTypeId,
          slug,
          localeCode,
          isEditorMode,
        });

        expect(fetchers.fetchReferencedEntities).toHaveBeenCalledWith(
          expect.objectContaining({
            experienceEntry: expect.objectContaining({
              fields: expect.objectContaining({
                dataSource: createExperienceEntry({}).fields.dataSource,
              }),
            }),
          }),
        );
      });
    });
  });
});
