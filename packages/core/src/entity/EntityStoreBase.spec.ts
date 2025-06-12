import { assets, createAsset, createEntry } from '@/test/__fixtures__/entities';
import { EntityStoreBase } from './EntityStoreBase';
import { Asset, Entry } from 'contentful';

const entityIds = {
  ENTRY1: 'entry1',
  ENTRY2: 'entry2',
  ENTRY3: 'entry3',
  ASSET1: 'asset1',
};
const entities = [
  createEntry(entityIds.ENTRY1, {
    fields: {
      title: 'Entry 1',
      logo: { sys: { id: entityIds.ASSET1, linkType: 'Asset', type: 'Link' } },
      // Since [SPA-2697], reference fields might already be resolved entities
      thumbnail: assets[0],
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

const entitiesBy = (id: string) => entities.find((e) => e.sys.id === id);

const LOCALE = 'en-US';
class TestEntityStore extends EntityStoreBase {
  constructor(...args: ConstructorParameters<typeof EntityStoreBase>) {
    super(...args);
  }
  // make protected method public for testing
  public $addEntity: EntityStoreBase['addEntity'] = (...args) => super.addEntity(...args);
}

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

      describe('when the referenced entity is already resolved', () => {
        it('should return the referenced entity', () => {
          expect(
            store.getEntryOrAsset(
              { sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } },
              '/some-uuid/fields/thumbnail/~locale/fields/file/~locale',
            ),
          ).toEqual(assets[0]);
        });

        it('should return the two levels deep referenced entity', () => {
          expect(
            store.getEntryOrAsset(
              { sys: { id: entityIds.ENTRY2, linkType: 'Entry', type: 'Link' } },
              '/some-uuid/fields/reference1/~locale/fields/thumbnail/~locale/fields/file/~locale',
            ),
          ).toEqual(assets[0]);
        });
      });
    });
  });

  describe('addEntity() when adding entity to store', () => {
    it('should have added a copy of the Entry, not the original', () => {
      const newEntry = createEntry('newEntry', { fields: { title: 'New Entry' } });
      store.$addEntity(newEntry);
      expect(store.entities).toContainEqual(newEntry); // equal by all the contents, not by reference

      // should NOT have referential equality to the original entity
      const foundEntry = store.entities.find((e) => e.sys.id === newEntry.sys.id);
      expect(foundEntry).not.toBe(newEntry);
    });

    it('should have added a copy of the Asset, not the original', () => {
      const newAsset = createAsset('newAsset', { fields: { title: 'New Asset' } });
      store.$addEntity(newAsset);
      expect(store.entities).toContainEqual(newAsset); // equal by all the contents, not by reference

      // should NOT have referential equality to the original entity
      const foundAsset = store.entities.find((e) => e.sys.id === newAsset.sys.id);
      expect(foundAsset).not.toBe(newAsset);
    });

    it('should not freeze the original Entry argument', () => {
      const newEntry = createEntry('newEntry', { fields: { title: 'New Entry' } });
      store.$addEntity(newEntry);
      expect(store.entities).toContainEqual(newEntry); // equal by all the contents, not by reference
      expect(Object.isFrozen(newEntry)).toBe(false);
    });

    it('should not freeze the original Asset argument', () => {
      const newAsset = createAsset('newAsset', { fields: { title: 'New Asset' } });
      store.$addEntity(newAsset);
      expect(store.entities).toContainEqual(newAsset); // equal by all the contents, not by reference
      expect(Object.isFrozen(newAsset)).toBe(false);
    });

    it('should have Entry in the store Object.freezed', () => {
      const newEntry = createEntry('newEntry', { fields: { title: 'New Entry' } });
      store.$addEntity(newEntry);
      const foundEntry: Entry | undefined = store.entities.find(
        (e) => e.sys.id === newEntry.sys.id,
      ) as Entry | undefined;
      expect(foundEntry).toBeDefined();
      expect(Object.isFrozen(foundEntry)).toBe(true);

      // Try to mutate a properties of recurisvely frozen object and expect it to throw in strict mode

      expect(() => {
        foundEntry!.fields.title = 'Should throw';
      }).toThrow("Cannot assign to read only property 'title' of object '#<Object>'");

      expect(() => {
        (foundEntry as unknown as { newProp: number })!.newProp = 123;
      }).toThrow('Cannot add property newProp, object is not extensible');

      expect(() => {
        delete foundEntry!.fields.title;
      }).toThrow("Cannot delete property 'title' of #<Object>");

      expect(() => {
        foundEntry!.fields['anotherField'] = 'Should throw';
      }).toThrow('Cannot add property anotherField, object is not extensible');

      // Try to mutate sys property and expect it to throw
      expect(() => {
        foundEntry!.sys.id = 'mutated';
      }).toThrow("Cannot assign to read only property 'id' of object '#<Object>'");
    });

    it('should have Asset in the store Object.freezed', () => {
      const newAsset = createAsset('newAsset', { fields: { title: 'New Asset' } });
      store.$addEntity(newAsset);

      // should NOT have referential equality to the original entity
      const foundAsset: Asset | undefined = store.entities.find(
        (e) => e.sys.id === newAsset.sys.id,
      ) as Asset;
      expect(foundAsset).toBeDefined();
      expect(Object.isFrozen(foundAsset)).toBe(true);
      // Try to mutate a properties of recurisvely frozen object and expect it to throw in strict mode
      expect(() => {
        foundAsset!.fields.title = 'Should throw';
      }).toThrow("Cannot assign to read only property 'title' of object '#<Object>'");
      expect(() => {
        (foundAsset as unknown as { newProp: number })!.newProp = 123;
      }).toThrow('Cannot add property newProp, object is not extensible');
      expect(() => {
        delete foundAsset!.fields.title;
      }).toThrow("Cannot delete property 'title' of #<Object>");
      expect(() => {
        foundAsset!.fields['anotherField'] = 'Should throw';
      }).toThrow('Cannot add property anotherField, object is not extensible');
      // Try to mutate sys property and expect it to throw
      expect(() => {
        foundAsset!.sys.id = 'mutated';
      }).toThrow("Cannot assign to read only property 'id' of object '#<Object>'");
    });

    it('should update an existing Entry in the store', () => {
      const entry1 = entitiesBy(entityIds.ENTRY1);
      expect(store.entities).toContainEqual(entry1);

      const updatedEntry = createEntry(entityIds.ENTRY1, {
        fields: { title: 'Updated Entry 1' },
      });
      store.$addEntity(updatedEntry);
      expect(store.entities).toContainEqual(updatedEntry);
    });

    it('should update an existing Asset in the store', () => {
      const asset1 = entitiesBy(entityIds.ASSET1);
      expect(store.entities).toContainEqual(asset1);

      const updatedAsset = createAsset(entityIds.ASSET1, {
        fields: { title: 'Updated Asset 1' },
      });
      store.$addEntity(updatedAsset);
      expect(store.entities).toContainEqual(updatedAsset);
    });
  });

  describe('getAssetById', () => {
    it('should return the Asset by id', () => {
      const asset = store.getAssetById(entityIds.ASSET1);
      expect(asset).toBeDefined();
      expect(asset!.sys.id).toBe(entityIds.ASSET1);
    });
    it('should return undefined if Asset does not exist', () => {
      const asset = store.getAssetById('non-existing-asset');
      expect(asset).toBeUndefined();
    });
    it('should return undefined if id is not an Asset', () => {
      const asset = store.getAssetById(entityIds.ENTRY1);
      expect(asset).toBeUndefined();
    });
    it('should return undefined if id is not provided', () => {
      const asset = store.getAssetById('');
      expect(asset).toBeUndefined();
    });
  });

  describe('getEntryById', () => {
    it('should return the Entry by id', () => {
      const entry = store.getEntryById(entityIds.ENTRY1);
      expect(entry).toBeDefined();
      expect(entry!.sys.id).toBe(entityIds.ENTRY1);
    });

    it('should return undefined if Entry does not exist', () => {
      const entry = store.getEntryById('non-existing-entry');
      expect(entry).toBeUndefined();
    });

    it('should return undefined if id is not an Entry', () => {
      const entry = store.getEntryById(entityIds.ASSET1);
      expect(entry).toBeUndefined();
    });

    it('should return undefined if id is not provided', () => {
      const entry = store.getEntryById('');
      expect(entry).toBeUndefined();
    });
  });

  describe('getAssetById', () => {
    it('should return the Asset by id', () => {
      const asset = store.getAssetById(entityIds.ASSET1);
      expect(asset).toBeDefined();
      expect(asset!.sys.id).toBe(entityIds.ASSET1);
    });
    it('should return undefined if Asset does not exist', () => {
      const asset = store.getAssetById('non-existing-asset');
      expect(asset).toBeUndefined();
    });
    it('should return undefined if id is not an Asset', () => {
      const asset = store.getAssetById(entityIds.ENTRY1);
      expect(asset).toBeUndefined();
    });
    it('should return undefined if id is not provided', () => {
      const asset = store.getAssetById('');
      expect(asset).toBeUndefined();
    });
  });

  describe('toJSON', () => {
    it('should return a JSON representation of the store', () => {
      const json = store.toJSON();
      expect(json).toEqual({
        entryMap: {
          [entityIds.ENTRY1]: entitiesBy(entityIds.ENTRY1),
          [entityIds.ENTRY2]: entitiesBy(entityIds.ENTRY2),
        },
        assetMap: {
          [entityIds.ASSET1]: entitiesBy(entityIds.ASSET1),
        },
        locale: LOCALE,
      });
    });
  });
});
