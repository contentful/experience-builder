import { Asset, ContentfulClientApi, Entry } from 'contentful';
import { createPatternEntry, experienceEntry } from '../test/__fixtures__/experience';
import { assets, entityIds, entries } from '../test/__fixtures__/entities';
import { describe, it, expect, vi, beforeEach, Mock, MockInstance } from 'vitest';
import * as deepBindingModule from '@/deep-binding';
import * as utilsModule from '@/utils';
import { fetchReferencedEntities } from './fetchReferencedEntities';
import { ComponentTreeNode, ExperienceEntry } from '@/types';
import { LATEST_SCHEMA_VERSION } from '@/constants';

const mockClient = {
  getAssets: vi.fn(),
  withoutLinkResolution: {
    getEntries: vi.fn(),
  },
} as unknown as ContentfulClientApi<undefined>;

let gatherDeepReferencesFromExperienceEntrySpy: MockInstance;
let extractPrebindingDataSpy: MockInstance;
let gatherDeepPrebindingReferencesFromExperienceEntrySpy: MockInstance;
let gatherDeepPrebindingReferencesFromPatternEntrySpy: MockInstance;

describe('fetchReferencedEntities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    gatherDeepReferencesFromExperienceEntrySpy = vi
      .spyOn(deepBindingModule, 'gatherDeepReferencesFromExperienceEntry')
      .mockReturnValue([]);
    gatherDeepPrebindingReferencesFromExperienceEntrySpy = vi.spyOn(
      deepBindingModule,
      'gatherDeepPrebindingReferencesFromExperienceEntry',
    );
    gatherDeepPrebindingReferencesFromPatternEntrySpy = vi.spyOn(
      deepBindingModule,
      'gatherDeepPrebindingReferencesFromPatternEntry',
    );

    extractPrebindingDataSpy = vi.spyOn(utilsModule, 'extractPrebindingDataByPatternId');
  });

  it('should throw an error if client has not been provided', async () => {
    try {
      await fetchReferencedEntities({
        // @ts-expect-error intentionally setting it to undefined
        client: undefined,
        experienceEntry: experienceEntry,
        locale: 'en-US',
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Required "client" parameter was not provided',
      );
    }
  });

  it('should throw an error if Provided entry is not an experience entry', async () => {
    try {
      await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: entries[0],
        locale: 'en-US',
      });
    } catch (e) {
      expect((e as Error).message).toBe(
        'Failed to fetch experience entities. Provided "experienceEntry" does not match experience entry schema',
      );
    }
  });

  describe('when fetching without errors', () => {
    beforeEach(() => {
      (mockClient.getAssets as Mock).mockResolvedValue({ items: assets });
      (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({ items: entries });
      (gatherDeepReferencesFromExperienceEntrySpy as Mock).mockReturnValue([]);
    });

    it('should fetch referenced entities', async () => {
      const res = await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: experienceEntry,
        locale: 'en-US',
      });

      expect(mockClient.getAssets).toHaveBeenCalledWith({
        limit: 100,
        skip: 0,
        locale: 'en-US',
        'sys.id[in]': [entityIds.ASSET1],
      });

      expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledWith({
        locale: 'en-US',
        include: 2,
        'sys.id[in]': [entityIds.ENTRY1, entityIds.ENTRY2],
        limit: 100,
        skip: 0,
      });

      expect(res).toEqual({
        assets,
        entries,
      });
    });

    it('should fetch entities only once when they occurr multiple times', async () => {
      const testExperienceEntry = structuredClone(experienceEntry);
      // Create a new data source with the same entry link as uuid3
      testExperienceEntry.fields.dataSource['uuid3_duplicate'] =
        testExperienceEntry.fields.dataSource['uuid3'];

      await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: testExperienceEntry,
        locale: 'en-US',
      });

      expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledWith(
        expect.objectContaining({
          'sys.id[in]': [entityIds.ENTRY1, entityIds.ENTRY2],
        }),
      );
    });

    it('should not throw an error if locale has not been provided', async () => {
      await expect(
        fetchReferencedEntities({
          client: mockClient as unknown as ContentfulClientApi<'WITH_ALL_LOCALES'>,
          experienceEntry: experienceEntry,
        }),
      ).resolves.not.toThrow();
    });
  });

  describe('deep-references', () => {
    it('should call gatherDeepReferencesFromExperienceEntry()', async () => {
      (mockClient.getAssets as Mock).mockResolvedValue({ items: assets });

      (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({ items: entries });

      await fetchReferencedEntities({
        client: mockClient,
        experienceEntry: experienceEntry,
        locale: 'en-US',
      });

      expect(gatherDeepReferencesFromExperienceEntrySpy).toHaveBeenCalledOnce();
      expect(gatherDeepReferencesFromExperienceEntrySpy).toHaveBeenCalledWith(experienceEntry);
    });

    describe('with pre-binding', () => {
      describe('when the entry is an Experience', () => {
        const experienceEntry: ExperienceEntry = {
          // @ts-expect-error don't care about it being accurate
          sys: {
            id: 'experience-entry-id',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'experience-content-type-id',
                type: 'Link',
                linkType: 'ContentType',
              },
            },
          },
          fields: {
            componentTree: {
              breakpoints: [],
              children: [],
              schemaVersion: LATEST_SCHEMA_VERSION,
            },
            dataSource: {},
            slug: 'slug',
            title: 'Experience Entry',
            unboundValues: {},
            usedComponents: [],
          },
        };

        const simplePatternEntry = createPatternEntry({
          id: 'simple-pattern-entry-id',
          prebindingDefinitions: [
            {
              id: 'simple-pattern-prebinding-definition-id',
              parameterDefinitions: {
                nativeParamId: {
                  contentTypes: ['ct1', 'ct2'],
                  defaultSource: {
                    type: 'Entry',
                    contentTypeId: 'ct1',
                    link: {
                      sys: {
                        id: 'default-entry-id-1',
                        linkType: 'Entry',
                        type: 'Link',
                      },
                    },
                  },
                },
              },
              variableMappings: {
                var1: {
                  type: 'ContentTypeMapping',
                  parameterId: 'nativeParamId',
                  pathsByContentType: {
                    ct1: {
                      path: '/fields/image/~locale/fields/file/~locale',
                    },
                    ct2: {
                      path: '/fields/url/~locale',
                    },
                  },
                },
              },
            },
          ],
        });

        const parentPatternEntry = createPatternEntry({
          id: 'parent-pattern-entry-id',
          prebindingDefinitions: [
            {
              id: 'parent-pattern-entry-prebinding-definition-id',
              parameterDefinitions: {
                nativeParamId: {
                  contentTypes: ['ct1', 'ct2'],
                  defaultSource: {
                    type: 'Entry',
                    contentTypeId: 'ct1',
                    link: {
                      sys: {
                        id: 'default-entry-id-1',
                        linkType: 'Entry',
                        type: 'Link',
                      },
                    },
                  },
                },
                hoistedParamId1: {
                  ...simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0]
                    .parameterDefinitions!.nativeParamId,
                  passToNodes: [
                    {
                      nodeId: 'nested-pattern-node-id-1',
                      parameterId: 'nativeParamId',
                      prebindingId:
                        simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].id,
                    },
                  ],
                },
                hoistedParamId2: {
                  ...simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0]
                    .parameterDefinitions!.nativeParamId,
                  passToNodes: [
                    {
                      nodeId: 'nested-pattern-node-id-2',
                      parameterId: 'nativeParamId',
                      prebindingId:
                        simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].id,
                    },
                  ],
                },
              },
              variableMappings: {
                var1: {
                  type: 'ContentTypeMapping',
                  parameterId: 'nativeParamId',
                  pathsByContentType: {
                    ct1: {
                      path: '/fields/image/~locale/fields/url/~locale',
                    },
                    ct2: {
                      path: '/fields/description/~locale',
                    },
                  },
                },
              },
            },
          ],
        });

        const defaultEntryFixture: Entry = {
          // @ts-expect-error don't care about it being accurate
          sys: {
            id: 'default-entry-id-1',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'ct1',
                type: 'Link',
                linkType: 'ContentType',
              },
            },
          },
          fields: {
            title: 'Default Entry',
            description: 'This is a default entry.',
            slug: 'default-entry',
            image: {
              sys: {
                id: 'default-asset-id-1',
                type: 'Link',
                linkType: 'Asset',
              },
            },
          },
        };

        const defaultAssetFixture: Asset = {
          // @ts-expect-error don't care about it being accurate
          sys: {
            id: 'default-asset-id-1',
            type: 'Asset',
          },
          fields: {
            title: 'Default Asset',
            file: {
              // @ts-expect-error don't care about it being accurate
              url: 'https://www.contentful.com/default-asset.jpg',
            },
          },
        };

        const defaultEntryOverwriteFixture: Entry = {
          // @ts-expect-error don't care about it being accurate
          sys: {
            id: 'default-entry-overwrite',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'ct1',
                type: 'Link',
                linkType: 'ContentType',
              },
            },
          },
          fields: {
            title: 'Default Entry Overwrite',
            description: 'This is an overwrite for the default entry.',
            slug: 'default-entry-overwrite',
            image: {
              sys: {
                id: 'default-asset-id-1',
                type: 'Link',
                linkType: 'Asset',
              },
            },
          },
        };

        it('should fetch overwrites and default prebinding sources defined on the experience', async () => {
          const nestedPatternNode1: ComponentTreeNode = {
            children: [],
            definitionId: simplePatternEntry.sys.id,
            variables: {},
            id: 'nested-pattern-node-id-1',
            parameters: {
              nativeParamId: {
                type: 'BoundValue',
                path: '/uuid1',
              },
            },
            prebindingId: simplePatternEntry.fields.componentSettings?.prebindingDefinitions![0].id,
          };

          const nestedPatternNode2: ComponentTreeNode = {
            children: [],
            definitionId: simplePatternEntry.sys.id,
            variables: {},
            id: 'nested-pattern-node-id-2',
            parameters: {
              nativeParamId: {
                type: 'BoundValue',
                path: '/uuid2',
              },
            },
            prebindingId: simplePatternEntry.fields.componentSettings?.prebindingDefinitions![0].id,
          };

          const experience = structuredClone(experienceEntry);

          experience.fields.componentTree.children.push(nestedPatternNode1, nestedPatternNode2);
          experience.fields.usedComponents = [simplePatternEntry];
          experience.fields.dataSource = {
            uuid1: {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: 'default-entry-link-1',
              },
            },
            uuid2: {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: 'default-entry-link-1',
              },
            },
          };

          (mockClient.getAssets as Mock).mockResolvedValue({ items: [] });
          (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({
            items: [defaultEntryFixture],
            includes: {
              Asset: [defaultAssetFixture],
            },
          });

          const { entries, assets } = await fetchReferencedEntities({
            client: mockClient,
            experienceEntry: experience,
            locale: 'en-US',
          });

          expect(extractPrebindingDataSpy).toHaveBeenCalledWith([simplePatternEntry]);
          expect(gatherDeepPrebindingReferencesFromExperienceEntrySpy).toHaveBeenCalledWith({
            experienceEntry: experience,
            fetchedPatterns: [simplePatternEntry],
            prebindingDataByPatternId: utilsModule.extractPrebindingDataByPatternId([
              simplePatternEntry,
            ]),
            fetchedLevel1Entries: [defaultEntryFixture],
          });

          expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledOnce();
          expect(entries).toEqual([defaultEntryFixture, simplePatternEntry]);
          expect(assets).toEqual([defaultAssetFixture]);
        });

        it('should extract deep pre-binding references from experience entry with a parent pattern', async () => {
          const nestedParentPatternNode: ComponentTreeNode = {
            children: [],
            definitionId: parentPatternEntry.sys.id,
            variables: {},
            id: 'nested-parent-pattern-node-id-1',
            parameters: {
              hoistedParamId1: {
                type: 'BoundValue',
                path: '/uuid1',
              },
              hoistedParamId2: {
                type: 'BoundValue',
                path: '/uuid2',
              },
              nativeParamId: {
                type: 'BoundValue',
                path: '/uuid3',
              },
            },
            prebindingId: parentPatternEntry.fields.componentSettings?.prebindingDefinitions![0].id,
          };

          const parentPatternEntryClone = structuredClone(parentPatternEntry);
          parentPatternEntryClone.fields.usedComponents = [simplePatternEntry];
          parentPatternEntryClone.fields.componentTree.children = [
            {
              children: [],
              definitionId: simplePatternEntry.sys.id,
              id: 'nested-pattern-node-id-1',
              variables: {},
            },
            {
              children: [],
              definitionId: simplePatternEntry.sys.id,
              id: 'nested-pattern-node-id-2',
              variables: {},
            },
          ];

          const experienceEntryClone = structuredClone(experienceEntry);

          experienceEntryClone.fields.componentTree.children.push(nestedParentPatternNode);
          experienceEntryClone.fields.usedComponents = [parentPatternEntryClone];
          experienceEntryClone.fields.dataSource = {
            uuid1: {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: defaultEntryOverwriteFixture.sys.id,
              },
            },
            uuid2: {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: defaultEntryOverwriteFixture.sys.id,
              },
            },
            uuid3: {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: defaultEntryFixture.sys.id,
              },
            },
          };

          (mockClient.getAssets as Mock).mockResolvedValue({ items: [] });
          (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({
            items: [defaultEntryFixture, defaultEntryOverwriteFixture],
            includes: {
              Asset: [defaultAssetFixture],
            },
          });

          const { entries, assets } = await fetchReferencedEntities({
            client: mockClient,
            experienceEntry: experienceEntryClone,
            locale: 'en-US',
          });

          expect(extractPrebindingDataSpy).toHaveBeenCalledWith([
            parentPatternEntryClone,
            simplePatternEntry,
          ]);
          expect(gatherDeepPrebindingReferencesFromExperienceEntrySpy).toHaveBeenCalledWith({
            experienceEntry: experienceEntryClone,
            fetchedPatterns: [parentPatternEntryClone, simplePatternEntry],
            prebindingDataByPatternId: utilsModule.extractPrebindingDataByPatternId([
              parentPatternEntryClone,
              simplePatternEntry,
            ]),
            fetchedLevel1Entries: [defaultEntryFixture, defaultEntryOverwriteFixture],
          });

          expect(entries).toEqual([
            defaultEntryFixture,
            defaultEntryOverwriteFixture,
            parentPatternEntryClone,
          ]);
          expect(assets).toEqual([defaultAssetFixture]);
        });
      });

      describe('when the entry is a Pattern', () => {
        const simplePatternEntry = createPatternEntry({
          id: 'simple-pattern-entry-id',
          prebindingDefinitions: [
            {
              id: 'simple-pattern-prebinding-definition-id',
              parameterDefinitions: {
                nativeParamId: {
                  contentTypes: ['ct1', 'ct2'],
                  defaultSource: {
                    type: 'Entry',
                    contentTypeId: 'ct1',
                    link: {
                      sys: {
                        id: 'default-entry-id-1',
                        linkType: 'Entry',
                        type: 'Link',
                      },
                    },
                  },
                },
              },
              variableMappings: {
                var1: {
                  type: 'ContentTypeMapping',
                  parameterId: 'nativeParamId',
                  pathsByContentType: {
                    ct1: {
                      path: '/fields/image/~locale/fields/file/~locale',
                    },
                    ct2: {
                      path: '/fields/url/~locale',
                    },
                  },
                },
              },
            },
          ],
        });

        const parentPatternEntry = createPatternEntry({
          id: 'parent-pattern-entry-id',
          prebindingDefinitions: [
            {
              id: 'parent-pattern-entry-prebinding-definition-id',
              parameterDefinitions: {
                nativeParamId: {
                  contentTypes: ['ct1', 'ct2'],
                  defaultSource: {
                    type: 'Entry',
                    contentTypeId: 'ct1',
                    link: {
                      sys: {
                        id: 'default-entry-id-1',
                        linkType: 'Entry',
                        type: 'Link',
                      },
                    },
                  },
                },
                hoistedParamId1: {
                  ...simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0]
                    .parameterDefinitions!.nativeParamId,
                  passToNodes: [
                    {
                      nodeId: 'nested-pattern-node-id-1',
                      parameterId: 'nativeParamId',
                      prebindingId:
                        simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].id,
                    },
                  ],
                },
                hoistedParamId2: {
                  ...simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0]
                    .parameterDefinitions!.nativeParamId,
                  passToNodes: [
                    {
                      nodeId: 'nested-pattern-node-id-2',
                      parameterId: 'nativeParamId',
                      prebindingId:
                        simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].id,
                    },
                  ],
                },
              },
              variableMappings: {
                var1: {
                  type: 'ContentTypeMapping',
                  parameterId: 'nativeParamId',
                  pathsByContentType: {
                    ct1: {
                      path: '/fields/image/~locale/fields/url/~locale',
                    },
                    ct2: {
                      path: '/fields/description/~locale',
                    },
                  },
                },
              },
            },
          ],
        });

        const defaultEntryFixture: Entry = {
          // @ts-expect-error don't care about it being accurate
          sys: {
            id: 'default-entry-id-1',
            type: 'Entry',
            contentType: {
              sys: {
                id: 'ct1',
                type: 'Link',
                linkType: 'ContentType',
              },
            },
          },
          fields: {
            title: 'Default Entry',
            description: 'This is a default entry.',
            slug: 'default-entry',
            image: {
              sys: {
                id: 'default-asset-id-1',
                type: 'Link',
                linkType: 'Asset',
              },
            },
          },
        };

        const defaultAssetFixture: Asset = {
          // @ts-expect-error don't care about it being accurate
          sys: {
            id: 'default-asset-id-1',
            type: 'Asset',
          },
          fields: {
            title: 'Default Asset',
            file: {
              // @ts-expect-error don't care about it being accurate
              url: 'https://www.contentful.com/default-asset.jpg',
            },
          },
        };

        it('should extract deep pre-binding references from a simple pattern entry', async () => {
          (mockClient.getAssets as Mock).mockResolvedValue({ items: [] });
          (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({
            items: [defaultEntryFixture],
            includes: {
              Asset: [defaultAssetFixture],
            },
          });

          const { entries, assets } = await fetchReferencedEntities({
            client: mockClient,
            experienceEntry: simplePatternEntry,
            locale: 'en-US',
          });

          expect(extractPrebindingDataSpy).toHaveBeenCalledWith([simplePatternEntry]);
          expect(gatherDeepPrebindingReferencesFromPatternEntrySpy).toHaveBeenCalledWith({
            patternEntry: simplePatternEntry,
            fetchedPatterns: [simplePatternEntry],
            prebindingDataByPatternId: utilsModule.extractPrebindingDataByPatternId([
              simplePatternEntry,
            ]),
            fetchedLevel1Entries: [defaultEntryFixture],
          });

          expect(mockClient.withoutLinkResolution.getEntries).toHaveBeenCalledOnce();
          expect(entries).toEqual([defaultEntryFixture]);
          expect(assets).toEqual([defaultAssetFixture]);
        });

        it('should extract deep pre-binding references from a parent pattern entry nesting a simple pattern', async () => {
          const parentPatternEntryClone = structuredClone(parentPatternEntry);
          parentPatternEntryClone.fields.usedComponents = [simplePatternEntry];
          parentPatternEntryClone.fields.componentTree.children = [
            {
              children: [],
              definitionId: simplePatternEntry.sys.id,
              id: 'nested-pattern-node-id-1',
              variables: {},
            },
            {
              children: [],
              definitionId: simplePatternEntry.sys.id,
              id: 'nested-pattern-node-id-2',
              variables: {},
            },
          ];

          (mockClient.getAssets as Mock).mockResolvedValue({ items: [] });
          (mockClient.withoutLinkResolution.getEntries as Mock).mockResolvedValue({
            items: [defaultEntryFixture],
            includes: {
              Asset: [defaultAssetFixture],
            },
          });

          const { entries, assets } = await fetchReferencedEntities({
            client: mockClient,
            experienceEntry: parentPatternEntryClone,
            locale: 'en-US',
          });

          expect(extractPrebindingDataSpy).toHaveBeenCalledWith([
            simplePatternEntry,
            parentPatternEntryClone,
          ]);
          expect(gatherDeepPrebindingReferencesFromPatternEntrySpy).toHaveBeenCalledWith({
            patternEntry: parentPatternEntryClone,
            fetchedPatterns: [simplePatternEntry, parentPatternEntryClone],
            prebindingDataByPatternId: utilsModule.extractPrebindingDataByPatternId([
              simplePatternEntry,
              parentPatternEntryClone,
            ]),
            fetchedLevel1Entries: [defaultEntryFixture],
          });

          expect(entries).toEqual([defaultEntryFixture, simplePatternEntry]);
          expect(assets).toEqual([defaultAssetFixture]);
        });
      });
    });
  });
});
