import { ContentfulClientApi } from 'contentful';
import { fetchBySlug } from './fetchBySlug';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import {
  createExperienceEntry,
  createPatternEntry,
  experienceEntryFieldsWithFilledUsedComponents,
} from '../test/__fixtures__/experience';
import { assets, createEntry, entries } from '../test/__fixtures__/entities';
import { ExperienceEntry } from '@/types';

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
        } else if (options?.identifier?.slug === 'prebinding-slug') {
          const experienceEntryWithNestedPattern = createExperienceEntry({
            id: 'experience-entry-with-prebinding',
          });
          // injecting the nested pattern node
          experienceEntryWithNestedPattern.fields.componentTree.children.push({
            children: [],
            definitionId: 'nested-pattern-entry-id',
            id: 'nested-instance-id',
            parameters: {
              param1: {
                type: 'BoundValue',
                path: '/uuid1',
              },
            },
            variables: {},
          });

          experienceEntryWithNestedPattern.fields.usedComponents = [
            createPatternEntry({
              id: 'nested-pattern-entry-id',
              prebindingDefinitions: [
                {
                  id: 'prebinding-definition-id',
                  parameterDefinitions: {
                    param1: {
                      contentTypes: ['a', 'b'],
                      defaultSource: {
                        type: 'Entry',
                        contentTypeId: 'a',
                        link: {
                          sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: 'default-prebinding-entry-id',
                          },
                        },
                      },
                    },
                  },
                  variableMappings: {
                    var1: {
                      parameterId: 'param1',

                      type: 'ContentTypeMapping',
                      pathsByContentType: {
                        a: { path: '/fields/title' },
                        b: { path: '/fields/name' },
                      },
                    },
                  },
                },
              ],
            }),
          ];

          return experienceEntryWithNestedPattern;
        }
        return createExperienceEntry({});
      };
      return {
        fetchExperienceEntry,
      };
    });

    vi.mock('./fetchReferencedEntities', () => {
      const fetchReferencedEntities = vi.fn(async ({ client, experienceEntry }) => {
        if (experienceEntry.sys.id === 'experience-entry-with-prebinding') {
          return {
            entries: [...entries, createEntry('default-prebinding-entry-id')],
            assets,
          };
        }
        return { entries, assets };
      });
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

    describe('when the API returns an experience with prebinding default value not as a datasource', () => {
      const isEditorMode = false;
      beforeEach(() => {
        vi.clearAllMocks();
      });

      it('should attach prebinding default value as a data source', async () => {
        const result = await fetchBySlug({
          client: mockClient,
          experienceTypeId,
          slug: 'prebinding-slug',
          localeCode,
          isEditorMode,
        });

        expect(result?.entityStore?.entities).toEqual([
          ...entries,
          createEntry('default-prebinding-entry-id'),
          ...assets,
        ]);
      });
    });
  });
});
