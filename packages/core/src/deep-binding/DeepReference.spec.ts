import { describe, it, expect } from 'vitest';
import { experienceEntry } from '../test/__fixtures__/experience';
import { entities } from '../test/__fixtures__/entities';
import { DeepReference, gatherDeepReferencesFromExperienceEntry } from './DeepReference';
import { EntityFromLink } from '..';
import { Asset, Entry, UnresolvedLink } from 'contentful';

const entry = entities[0];
const PATH = '/uuid2/fields/logo/~locale/fields/file/~locale';

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
