import { ContentfulClientApi } from 'contentful';
import { fetchById } from './fetchById';
import { createExperienceEntry, createPatternEntry } from '../test/__fixtures__/experience';
import { assets, createEntry, entries } from '../test/__fixtures__/entities';
import { describe, beforeEach, it, expect, vi } from 'vitest';

let experienceEntry = createExperienceEntry({});

describe('fetchById', () => {
  const mockClient = {
    getAssets: vi.fn(),
    getEntries: vi.fn(),
    withoutLinkResolution: {
      getEntries: vi.fn(),
    },
  } as unknown as ContentfulClientApi<undefined>;

  const experienceTypeId = 'experienceTypeId';
  const id = 'abc123';
  const localeCode = 'en-US';

  beforeEach(() => {
    experienceEntry = createExperienceEntry({});
    vi.mock('./fetchExperienceEntry', () => {
      const fetchExperienceEntry = async (options) => {
        if (options?.identifier?.id === 'experience-entry-with-prebinding') {
          const experienceEntryWithNestedPattern = createExperienceEntry({
            id: options?.identifier?.id,
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
                      passToNodes: [],
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
      const fetchReferencedEntities = vi.fn(async ({ experienceEntry }) => {
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

  describe('when the API returns an experience with prebinding default value not as a datasource', () => {
    const isEditorMode = false;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should attach prebinding default value as a data source', async () => {
      const result = await fetchById({
        client: mockClient,
        experienceTypeId,
        id: 'experience-entry-with-prebinding',
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
