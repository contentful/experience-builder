import { assets, createEntry } from '@/test/__fixtures__/entities';
import { EntityStoreBase } from './EntityStoreBase';

const entityIds = {
  ENTRY1: 'entry1',
  ENTRY2: 'entry2',
  ENTRY3: 'entry3',
  ENTRY4: 'entry4',
  ASSET1: 'asset1',
};
const entities = [
  createEntry(entityIds.ENTRY1, {
    fields: {
      title: 'Entry 1',
      logo: { sys: { id: entityIds.ASSET1, linkType: 'Asset', type: 'Link' } },
    },
  }),
  createEntry(entityIds.ENTRY2, {
    fields: {
      title: 'Entry 2',
      reference1: { sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } },
      reference2: { sys: { id: entityIds.ENTRY3, linkType: 'Entry', type: 'Link' } },
    },
  }),
  ...assets,
];

const LOCALE = 'en-US';
class TestEntityStore extends EntityStoreBase {}

describe('EntityStoreBase', () => {
  let store: TestEntityStore;
  beforeEach(() => {
    store = new TestEntityStore({
      entities,
      locale: LOCALE,
    });
  });
  describe('getEntryOrAsset', () => {
    it('should return the entity based on entityId and path', () => {
      expect(
        store.getEntryOrAsset(
          { sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } },
          '/some-uuid/fields/title/~locale',
        ),
      ).toEqual(entities[0]);

      expect(
        store.getEntryOrAsset(
          { sys: { id: entityIds.ASSET1, linkType: 'Asset', type: 'Link' } },
          '/some-uuid/fields/file/~locale',
        ),
      ).toEqual(entities[2]);
    });

    it('should return undefined if entity id does not exist', () => {
      expect(
        store.getEntryOrAsset(
          { sys: { id: 'test', linkType: 'Entry', type: 'Link' } },
          '/some-uuid/fields/title/~locale',
        ),
      ).toBeUndefined();
    });

    it('should return the entity unchanged if argument is not a link', () => {
      expect(store).toBeDefined();

      expect(store.getEntryOrAsset(entities[0], '/some-uuid/fields/title/~locale')).toEqual(
        entities[0],
      );
    });

    describe('when path is a deep path', () => {
      it('should return the referenced entity', () => {
        expect(
          store.getEntryOrAsset(
            { sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } },
            '/some-uuid/fields/logo/~locale/fields/file/~locale',
          ),
        ).toEqual(assets[0]);

        expect(
          store.getEntryOrAsset(
            { sys: { id: entityIds.ENTRY2, linkType: 'Entry', type: 'Link' } },
            '/some-uuid/fields/reference1/~locale/fields/logo/~locale/fields/file/~locale',
          ),
        ).toEqual(assets[0]);
      });

      it('should return undefined if field does not exist', () => {
        expect(
          store.getEntryOrAsset(
            { sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } },
            '/some-uuid/fields/nonexisting/~locale/fields/file/~locale',
          ),
        ).toBeUndefined();
      });
    });
  });
});
