import { describe, it, expect, vi } from 'vitest';
import { createPatternEntry, experienceEntry } from '../test/__fixtures__/experience';
import { entities } from '../test/__fixtures__/entities';
import {
  DeepReference,
  gatherDeepPrebindingReferencesFromExperienceEntry,
  gatherDeepPrebindingReferencesFromPatternEntry,
  gatherDeepReferencesFromExperienceEntry,
  gatherDeepReferencesFromTree,
} from './DeepReference';
import { EntityFromLink, extractPrebindingDataByPatternId, PreboundVariable } from '..';
import { Asset, Entry, UnresolvedLink } from 'contentful';
import {
  ComponentTreeNode,
  ExperienceDataSource,
  ExperienceEntry,
  ExperienceTreeNode,
} from '@/types';
import { LATEST_SCHEMA_VERSION } from '@/constants';

const entry = entities[0];
const PATH = '/uuid2/fields/logo/~locale/fields/file/~locale';

const getPrebindingSubTree = ({ withFullPath }: { withFullPath: boolean }) => {
  const childNodeWithprebinding: ExperienceTreeNode = {
    type: 'block',
    data: {
      id: 'node-2',
      unboundValues: {},
      dataSource: {
        uuid2: {
          sys: {
            id: 'entry2',
            linkType: 'Entry',
            type: 'Link',
          },
        },
      },
      props: {
        prop2: {
          type: 'BoundValue',
          path: withFullPath ? '/uuid2/fields/productPhoto/~locale/fields/file/~locale' : '/uuid2',
          // @ts-expect-error not typed. see below
          isPrebound: true,
          pathsByContentType: {
            contentTypeId2: {
              path: '/uuid2/fields/logo/~locale/fields/file/~locale',
            },
            contentTypeId3: {
              path: '/uuid2/fields/productPhoto/~locale/fields/file/~locale',
            },
          },
        },
      },
    },
    children: [],
  };
  const subtreeWithPrebinding: ExperienceTreeNode = {
    type: 'block',
    data: {
      id: 'node-1',
      unboundValues: {},
      dataSource: {
        uuid1: {
          sys: {
            id: 'entry1',
            linkType: 'Entry',
            type: 'Link',
          },
        },
      },
      props: {
        prop1: {
          type: 'BoundValue',
          path: withFullPath ? '/uuid1/fields/imageRef/~locale/fields/file/~locale' : '/uuid1',
          // @ts-expect-error not typed, since prebound variable is not serialized
          // hence, only possible in the editor mode
          isPrebound: true,
          pathsByContentType: {
            contentTypeId1: {
              path: '/uuid1/fields/imageRef/~locale/fields/file/~locale',
            },
            contentTypeId2: {
              path: '/uuid1/fields/logo/~locale/fields/file/~locale',
            },
          } as unknown as PreboundVariable,
        },
      },
    },
    parentId: 'root',
    children: [childNodeWithprebinding],
  };

  const getEntityFromLinkStub = vi.fn().mockImplementation((link) => {
    const result: Entry = {
      // @ts-expect-error we don't care of the accuracy here
      sys: {
        id: link.sys.id,
        type: link.sys.linkType,
      },
    };

    if (link.sys.id === 'entry1') {
      (result.sys.contentType = {
        sys: {
          id: 'contentTypeId1',
          type: 'Link',
          linkType: 'ContentType',
        },
      }),
        (result.fields = {
          imageRef: {
            sys: {
              id: 'asset1',
              type: 'Link',
              linkType: 'Asset',
            },
          },
        });
    } else if (link.sys.id === 'entry2') {
      (result.sys.contentType = {
        sys: {
          id: 'contentTypeId3',
          type: 'Link',
          linkType: 'ContentType',
        },
      }),
        (result.fields = {
          productPhoto: {
            sys: {
              id: 'asset2',
              type: 'Link',
              linkType: 'Asset',
            },
          },
        });
    } else if (link.sys.linkType === 'Asset') {
      result.fields = {
        file: {
          url: `https://contentful.com/${link.sys.id}.jpg`,
        },
      };
    }

    return result;
  });

  return { subtreeWithPrebinding, getEntityFromLinkStub };
};

class MockEntityStore implements EntityFromLink {
  private entities: Array<Entry | Asset>;
  constructor(entities: Array<Entry | Asset>) {
    this.entities = [...entities];
  }
  getEntityFromLink(link: UnresolvedLink<'Entry' | 'Asset'>): Asset | Entry | undefined {
    return this.entities.find((entity) => entity.sys.id === link.sys.id);
  }
}

describe('DeepReference', () => {
  it('should create deep reference', () => {
    const deepReference = new DeepReference({
      path: PATH,
      dataSource: experienceEntry.fields.dataSource,
    });

    expect(deepReference).toEqual({
      originalPath: PATH,
      entityId: 'entry1',
      entityLink: {
        sys: {
          id: 'entry1',
          linkType: 'Entry',
          type: 'Link',
        },
      },
      field: 'logo',
      referentField: 'file',
    });
  });

  it('throws an error if path is malformed', () => {
    expect(
      () =>
        new DeepReference({
          path: '/uuid2/logo/~locale/file/~locale',
          dataSource: experienceEntry.fields.dataSource,
        }),
    ).toThrowError("Cannot parse path '/uuid2/logo/~locale/file/~locale' as deep path");
  });

  describe('.extractReferent', () => {
    it('extracts the referent successfully', () => {
      const deepReference = new DeepReference({
        path: PATH,
        dataSource: experienceEntry.fields.dataSource,
      });

      const referent = deepReference.extractReferent(new MockEntityStore([entry]));

      expect(referent).toEqual({
        sys: {
          id: 'asset1',
          type: 'Link',
          linkType: 'Asset',
        },
      });
    });

    it('returns undefined if entity not in store', () => {
      const deepReference = new DeepReference({
        path: '/uuid2/fields/logo/~locale/fields/file/~locale',
        dataSource: experienceEntry.fields.dataSource,
      });

      const entityStore = new MockEntityStore([]);
      const referent = deepReference.extractReferent(entityStore);

      expect(referent).toBeUndefined();
    });

    it('returns undefined if field not in entity', () => {
      const deepReference = new DeepReference({
        path: '/uuid2/fields/nonexisting/~locale/fields/file/~locale',
        dataSource: experienceEntry.fields.dataSource,
      });

      const entityStore = new MockEntityStore([entry]);
      const referent = deepReference.extractReferent(entityStore);

      expect(referent).toBeUndefined();
    });

    it('returns undefined if field is not a reference field', () => {
      const deepReference = new DeepReference({
        path: '/uuid2/fields/title/~locale/fields/file/~locale',
        dataSource: experienceEntry.fields.dataSource,
      });

      const entityStore = new MockEntityStore([entry]);
      const referent = deepReference.extractReferent(entityStore);

      expect(referent).toBeUndefined();
    });
  });
});

describe('gatherDeepReferencesFromExperienceEntry', () => {
  it('should gather deep references from experience entry', () => {
    const deepReferences = gatherDeepReferencesFromExperienceEntry(experienceEntry);

    expect(deepReferences[0]).toEqual({
      originalPath: PATH,
      entityId: 'entry1',
      entityLink: {
        sys: {
          id: 'entry1',
          linkType: 'Entry',
          type: 'Link',
        },
      },
      field: 'logo',
      referentField: 'file',
    });
  });
});

describe('gatherDeepReferencesFromTree', () => {
  it('should include deep prebindings in the main path', () => {
    const dataSource: ExperienceDataSource = {
      uuid1: {
        sys: {
          id: 'entry1',
          linkType: 'Entry',
          type: 'Link',
        },
      },
      uuid2: {
        sys: {
          id: 'entry2',
          linkType: 'Entry',
          type: 'Link',
        },
      },
    };

    const { subtreeWithPrebinding, getEntityFromLinkStub } = getPrebindingSubTree({
      withFullPath: true,
    });
    const deepReferences = gatherDeepReferencesFromTree(
      subtreeWithPrebinding,
      dataSource,
      getEntityFromLinkStub,
    );
    expect(deepReferences).toHaveLength(2);
    expect(deepReferences[0].headEntityId).toBe('entry1');
    expect(deepReferences[0].originalPath).toBe(
      '/uuid1/fields/imageRef/~locale/fields/file/~locale',
    );
    expect(deepReferences[1].headEntityId).toBe('entry2');
    expect(deepReferences[1].originalPath).toBe(
      '/uuid2/fields/productPhoto/~locale/fields/file/~locale',
    );
  });

  it('should include deep prebindings in the pathsByContentType with source entry assigned', () => {
    const dataSource: ExperienceDataSource = {
      uuid1: {
        sys: {
          id: 'entry1',
          linkType: 'Entry',
          type: 'Link',
        },
      },
      uuid2: {
        sys: {
          id: 'entry2',
          linkType: 'Entry',
          type: 'Link',
        },
      },
    };

    const { subtreeWithPrebinding, getEntityFromLinkStub } = getPrebindingSubTree({
      withFullPath: false,
    });
    const deepReferences = gatherDeepReferencesFromTree(
      subtreeWithPrebinding,
      dataSource,
      getEntityFromLinkStub,
    );
    expect(deepReferences).toHaveLength(2);
    expect(deepReferences[0].headEntityId).toBe('entry1');
    expect(deepReferences[0].originalPath).toBe(
      '/uuid1/fields/imageRef/~locale/fields/file/~locale',
    );
    expect(deepReferences[1].headEntityId).toBe('entry2');
    expect(deepReferences[1].originalPath).toBe(
      '/uuid2/fields/productPhoto/~locale/fields/file/~locale',
    );
  });

  it('should not include deep prebindings in the pathsByContentType without source entry assigned', () => {
    const dataSource: ExperienceDataSource = {};

    const { subtreeWithPrebinding, getEntityFromLinkStub } = getPrebindingSubTree({
      withFullPath: false,
    });
    const deepReferences = gatherDeepReferencesFromTree(
      subtreeWithPrebinding,
      dataSource,
      getEntityFromLinkStub,
    );
    expect(deepReferences).toHaveLength(0);
  });
});

describe('gatherDeepPrebindingReferencesFromExperienceEntry', () => {
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
                path: '/fields/mainPhoto/~locale/fields/file/~locale',
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

  const defaultEntryFixtureWithoutDeepPrebinding: Entry = {
    // @ts-expect-error don't care about it being accurate
    sys: {
      id: 'default-entry-id-with-ct-pointing-at-shallow-mapping',
      type: 'Entry',
      contentType: {
        sys: {
          id: 'ct2', // here we use a different content type, which should point at a pre-binding without a deep path
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

  it('should return deep prebindings inferred from the content type of the pre-binding source entry', () => {
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

    const result = gatherDeepPrebindingReferencesFromExperienceEntry({
      experienceEntry: experienceEntryClone,
      fetchedPatterns: [parentPatternEntryClone, simplePatternEntry],
      prebindingDataByPatternId: extractPrebindingDataByPatternId([
        parentPatternEntryClone,
        simplePatternEntry,
      ]),
      fetchedLevel1Entries: [defaultEntryFixture, defaultEntryOverwriteFixture],
    });

    expect(result).toEqual([
      DeepReference.from({
        dataSource: experienceEntryClone.fields.dataSource,
        path: `${nestedParentPatternNode.parameters!.hoistedParamId1.path}${simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
      }),
      DeepReference.from({
        dataSource: experienceEntryClone.fields.dataSource,
        path: `${nestedParentPatternNode.parameters!.hoistedParamId2.path}${simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
      }),
      DeepReference.from({
        dataSource: experienceEntryClone.fields.dataSource,
        path: `${nestedParentPatternNode.parameters!.nativeParamId.path}${parentPatternEntryClone.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
      }),
    ]);

    const [firstHoistedParameter, secondHoistedParameter, nativeParameter] = result;
    expect(firstHoistedParameter.entityId).toBe(defaultEntryOverwriteFixture.sys.id);
    expect(firstHoistedParameter.field).toBe('image');
    expect(firstHoistedParameter.originalPath).toBe(
      `${nestedParentPatternNode.parameters!.hoistedParamId1.path}${simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
    );
    expect(firstHoistedParameter.referentField).toBe('file');
    expect(secondHoistedParameter.entityId).toBe(defaultEntryOverwriteFixture.sys.id);
    expect(secondHoistedParameter.field).toBe('image');
    expect(secondHoistedParameter.originalPath).toBe(
      `${nestedParentPatternNode.parameters!.hoistedParamId2.path}${simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
    );
    expect(secondHoistedParameter.referentField).toBe('file');
    expect(nativeParameter.entityId).toBe(defaultEntryFixture.sys.id);
    expect(nativeParameter.field).toBe('mainPhoto');
    expect(nativeParameter.originalPath).toBe(
      `${nestedParentPatternNode.parameters!.nativeParamId.path}${parentPatternEntryClone.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
    );
    expect(nativeParameter.referentField).toBe('file');
  });

  it('should return an empty array if the tree has no deep prebindings', () => {
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
          id: defaultEntryFixtureWithoutDeepPrebinding.sys.id,
        },
      },
      uuid2: {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: defaultEntryFixtureWithoutDeepPrebinding.sys.id,
        },
      },
      uuid3: {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: defaultEntryFixtureWithoutDeepPrebinding.sys.id,
        },
      },
    };

    const result = gatherDeepPrebindingReferencesFromExperienceEntry({
      experienceEntry: experienceEntryClone,
      fetchedPatterns: [parentPatternEntryClone, simplePatternEntry],
      prebindingDataByPatternId: extractPrebindingDataByPatternId([
        parentPatternEntryClone,
        simplePatternEntry,
      ]),
      fetchedLevel1Entries: [defaultEntryFixtureWithoutDeepPrebinding],
    });

    expect(result).toEqual([]);
  });

  it('should not generate new parameters from the pattern configuration if the parameter id is not on the node', () => {
    const nestedParentPatternNode: ComponentTreeNode = {
      children: [],
      definitionId: parentPatternEntry.sys.id,
      variables: {},
      id: 'nested-parent-pattern-node-id-1',
      parameters: {
        // only passing one parameter
        hoistedParamId1: {
          type: 'BoundValue',
          path: '/uuid1',
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
    };

    const result = gatherDeepPrebindingReferencesFromExperienceEntry({
      experienceEntry: experienceEntryClone,
      fetchedPatterns: [parentPatternEntryClone, simplePatternEntry],
      prebindingDataByPatternId: extractPrebindingDataByPatternId([
        parentPatternEntryClone,
        simplePatternEntry,
      ]),
      fetchedLevel1Entries: [defaultEntryFixture, defaultEntryOverwriteFixture],
    });

    expect(result).toEqual([
      DeepReference.from({
        dataSource: experienceEntryClone.fields.dataSource,
        path: `${nestedParentPatternNode.parameters!.hoistedParamId1.path}${simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
      }),
    ]);

    const [firstHoistedParameter] = result;
    expect(firstHoistedParameter.entityId).toBe(defaultEntryOverwriteFixture.sys.id);
    expect(firstHoistedParameter.field).toBe('image');
    expect(firstHoistedParameter.originalPath).toBe(
      `${nestedParentPatternNode.parameters!.hoistedParamId1.path}${simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!.var1.pathsByContentType.ct1.path}`,
    );
    expect(firstHoistedParameter.referentField).toBe('file');
  });
});

describe('gatherDeepPrebindingReferencesFromPatternEntry', () => {
  const defaultSourceEntryUsedInNestedPattern: Entry = {
    // @ts-expect-error don't care about it being accurate
    sys: {
      id: 'child-default-entry-id-1',
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
      title: 'Default source entry of Child Pattern',
      description: 'This is a default source entry of a child pattern.',
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

  const defaultSourceEntryUsedInParentPattern: Entry = {
    // @ts-expect-error don't care about it being accurate
    sys: {
      id: 'parent-default-entry-id-1',
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
      title: 'Default source entry of Parent Pattern',
      description: 'This is a default source entry of a parent pattern.',
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

  const defaultEntryFixtureWithoutDeepPrebinding: Entry = {
    // @ts-expect-error don't care about it being accurate
    sys: {
      id: 'default-entry-id-with-ct-pointing-at-shallow-mapping',
      type: 'Entry',
      contentType: {
        sys: {
          id: 'ct2', // here we use a different content type, which should point at a pre-binding without a deep path
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
                  id: defaultSourceEntryUsedInNestedPattern.sys.id,
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
                  id: defaultSourceEntryUsedInParentPattern.sys.id,
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
                path: '/fields/mainPhoto/~locale/fields/url/~locale',
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

  it('should generate default source entries from the prebindingDefinition of the pattern and return any deep pre-bindings references', () => {
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

    const result = gatherDeepPrebindingReferencesFromPatternEntry({
      patternEntry: parentPatternEntryClone,
      fetchedLevel1Entries: [
        defaultSourceEntryUsedInNestedPattern,
        defaultSourceEntryUsedInParentPattern,
      ],
      fetchedPatterns: [parentPatternEntryClone, simplePatternEntry],
      prebindingDataByPatternId: extractPrebindingDataByPatternId([
        parentPatternEntryClone,
        simplePatternEntry,
      ]),
    });

    const [nativeParameter, firstHoistedParameter, secondHoistedParameter] = result;
    expect(nativeParameter.entityId).toBe(defaultSourceEntryUsedInParentPattern.sys.id);
    expect(nativeParameter.field).toBe('mainPhoto');
    expect(nativeParameter.originalPath).toStrictEqual(
      expect.stringContaining(
        parentPatternEntryClone.fields.componentSettings!.prebindingDefinitions![0]
          .variableMappings!.var1.pathsByContentType.ct1.path,
      ),
    );
    expect(nativeParameter.referentField).toBe('url');

    expect(firstHoistedParameter.entityId).toBe(defaultSourceEntryUsedInNestedPattern.sys.id);
    expect(firstHoistedParameter.field).toBe('image');
    expect(firstHoistedParameter.originalPath).toStrictEqual(
      expect.stringContaining(
        simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!
          .var1.pathsByContentType.ct1.path,
      ),
    );
    expect(firstHoistedParameter.referentField).toBe('file');

    expect(secondHoistedParameter.entityId).toBe(defaultSourceEntryUsedInNestedPattern.sys.id);
    expect(secondHoistedParameter.field).toBe('image');
    // we perform this check, because the defaultSource keys will be generated at runtime and it's complicated and unnecessary to check all of them here
    expect(secondHoistedParameter.originalPath).toStrictEqual(
      expect.stringContaining(
        simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!
          .var1.pathsByContentType.ct1.path,
      ),
    );
    expect(secondHoistedParameter.referentField).toBe('file');
  });

  it('should generate default source entries from the prebindingDefinition of the pattern and skip NOT deep pre-bindings references or parameters without defaultSource', () => {
    const parentPatternEntryClone = structuredClone(parentPatternEntry);
    // pointing the default source at an entry with a content type that points at a mapping without deep reference
    parentPatternEntryClone.fields.componentSettings!.prebindingDefinitions![0].parameterDefinitions.nativeParamId.defaultSource!.link.sys.id =
      defaultEntryFixtureWithoutDeepPrebinding.sys.id;
    // deleting the defaultSource from one of the hoisted parameters from a nested pattern
    // we simulate the situation when a user had unchecked the default mapping
    parentPatternEntryClone.fields.componentSettings!.prebindingDefinitions![0].parameterDefinitions.hoistedParamId1.defaultSource =
      undefined;
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

    const result = gatherDeepPrebindingReferencesFromPatternEntry({
      patternEntry: parentPatternEntryClone,
      fetchedLevel1Entries: [
        defaultSourceEntryUsedInNestedPattern,
        defaultSourceEntryUsedInParentPattern,
      ],
      fetchedPatterns: [parentPatternEntryClone, simplePatternEntry],
      prebindingDataByPatternId: extractPrebindingDataByPatternId([
        parentPatternEntryClone,
        simplePatternEntry,
      ]),
    });

    expect(result).toHaveLength(1);
    const [secondHoistedParameter] = result;
    // we only get 1 parameters out of 3 existing, because we deleted the defaultSource from one of the hoisted parameters and also made the parent pattern point
    // at a mapping without a deep reference
    expect(secondHoistedParameter.entityId).toBe(defaultSourceEntryUsedInNestedPattern.sys.id);
    expect(secondHoistedParameter.field).toBe('image');
    // we perform this check, because the defaultSource keys will be generated at runtime and it's complicated and unnecessary to check all of them here
    expect(secondHoistedParameter.originalPath).toStrictEqual(
      expect.stringContaining(
        simplePatternEntry.fields.componentSettings!.prebindingDefinitions![0].variableMappings!
          .var1.pathsByContentType.ct1.path,
      ),
    );
    expect(secondHoistedParameter.referentField).toBe('file');
  });
});
