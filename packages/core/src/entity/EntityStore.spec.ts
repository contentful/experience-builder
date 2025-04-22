import type { Asset, Entry } from 'contentful';
import { entities, entityIds, entries } from '../test/__fixtures__/entities';
import { experienceEntry } from '../test/__fixtures__/experience';
import { describe, it, expect } from 'vitest';

import { EntityStore } from './EntityStore';

const locale = 'en-US';

describe('EntityStore', () => {
  it('should be defined', () => {
    expect(EntityStore).toBeDefined();
  });

  it('should throw an error if provided experienceEntry is not an experience entry', () => {
    try {
      new EntityStore({ experienceEntry: entries[0], entities: [], locale });
      throw new Error('Should not reach this point');
    } catch (e) {
      expect((e as Error).message).toEqual('Provided entry is not an experience entry');
    }
  });

  it('should create a new instance', () => {
    const store = new EntityStore({
      experienceEntry: experienceEntry as unknown as Entry,
      entities: [],
      locale,
    });
    expect(store).toBeDefined();
    expect(store.entities).toEqual([]);
    expect(store.experienceEntryFields).toEqual(experienceEntry.fields);
    expect(store.schemaVersion).toEqual(experienceEntry.fields.componentTree.schemaVersion);
    expect(store.breakpoints).toEqual(experienceEntry.fields.componentTree.breakpoints);
    expect(store.dataSource).toEqual(experienceEntry.fields.dataSource);
    expect(store.unboundValues).toEqual(experienceEntry.fields.unboundValues);
    expect(store.getCurrentLocale()).toBe(locale);
  });

  it('should create a new instance with initial state', () => {
    const store = new EntityStore({
      experienceEntry: experienceEntry as unknown as Entry,
      entities,
      locale,
    });
    expect(store).toBeDefined();
    expect(store.entities).toEqual(entities);
    expect(store.experienceEntryFields).toEqual(experienceEntry.fields);
    expect(store.schemaVersion).toEqual(experienceEntry.fields.componentTree.schemaVersion);
    expect(store.breakpoints).toEqual(experienceEntry.fields.componentTree.breakpoints);
    expect(store.dataSource).toEqual(experienceEntry.fields.dataSource);
    expect(store.unboundValues).toEqual(experienceEntry.fields.unboundValues);
    expect(store.getCurrentLocale()).toBe(locale);
  });

  describe('getValue', () => {
    it('should return the value based on entityId and path', () => {
      const store = new EntityStore({
        experienceEntry: experienceEntry as unknown as Entry,
        entities,
        locale,
      });
      expect(store).toBeDefined();

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'title',
        ]),
      ).toEqual('Entry 1');

      expect(
        store.getValue({ sys: { id: entityIds.ASSET1, linkType: 'Asset', type: 'Link' } }, [
          'fields',
          'title',
        ]),
      ).toEqual('Asset 1');
    });

    it('should return undefined if entity id does not exist', () => {
      const store = new EntityStore({
        experienceEntry: experienceEntry as unknown as Entry,
        entities,
        locale,
      });
      expect(store).toBeDefined();

      expect(
        store.getValue({ sys: { id: 'test', linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'title',
        ]),
      ).toBeUndefined();
    });

    it("should return undefined if field doesn't exist", () => {
      const store = new EntityStore({
        experienceEntry: experienceEntry as unknown as Entry,
        entities,
        locale,
      });
      expect(store).toBeDefined();

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'description',
        ]),
      ).toBeUndefined();
    });

    it('should return undefined if entity type does not match', () => {
      const store = new EntityStore({
        experienceEntry: experienceEntry as unknown as Entry,
        entities,
        locale,
      });
      expect(store).toBeDefined();

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Asset', type: 'Link' } }, [
          'fields',
          'title',
        ]),
      ).toBeUndefined();
    });

    it('should url if given path to the asset file and entityType is Asset', () => {
      const store = new EntityStore({
        experienceEntry: experienceEntry as unknown as Entry,
        entities: [
          {
            sys: {
              id: 'assetId',
              type: 'Asset',
            },
            fields: {
              title: 'assetTitle',
              file: {
                url: 'assetFileUrl',
                description: 'assetFileDescription',
              },
            },
          } as unknown as Asset,
        ],
        locale,
      });

      expect(
        store.getValue({ sys: { id: 'assetId', linkType: 'Asset', type: 'Link' } }, [
          'fields',
          'file',
        ]),
      ).toBe('assetFileUrl');
    });
  });
});
