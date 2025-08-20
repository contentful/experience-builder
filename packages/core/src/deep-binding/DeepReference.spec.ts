import { describe, it, expect, vi } from 'vitest';
import { experienceEntry } from '../test/__fixtures__/experience';
import { entities } from '../test/__fixtures__/entities';
import {
  DeepReference,
  gatherDeepReferencesFromExperienceEntry,
  gatherDeepReferencesFromTree,
} from './DeepReference';
import { EntityFromLink, PreboundVariable } from '..';
import { Asset, Entry, UnresolvedLink } from 'contentful';
import { ExperienceDataSource, ExperienceTreeNode } from '@/types';

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
