import type { Asset, Entry } from 'contentful';
import { entities, entityIds, entries } from '../test/__fixtures__/entities';
import {
  experienceEntry as baseExperienceEntry,
  createExperienceEntry,
} from '../test/__fixtures__/experience';
import { describe, it, expect } from 'vitest';

import { EntityStore } from './EntityStore';

const locale = 'en-US';

describe('EntityStore', () => {
  let experienceEntry;

  beforeEach(() => {
    experienceEntry = structuredClone(baseExperienceEntry);
    experienceEntry.fields.componentSettings = {
      prebindingDefinitions: [
        {
          id: 'testPrebinding',
          parameterDefinitions: {
            testParam: {
              contentTypes: {
                ct111: {
                  sys: {
                    id: 'ct111',
                    type: 'Link',
                    linkType: 'ContentType',
                  },
                },
              },
            },
          },
          variableMappings: {
            testVariable: {
              type: 'ContentTypeMapping',
              parameterId: 'testParam',
              pathsByContentType: {
                ct111: {
                  path: '/fields/title',
                },
              },
            },
          },
        },
      ],
      variableDefinitions: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        testVariable: {} as any,
      },
    };
  });

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
    expect(store.hoistedParameterDefinitions).toEqual({
      testParam: {
        contentTypes: {
          ct111: {
            sys: {
              id: 'ct111',
              linkType: 'ContentType',
              type: 'Link',
            },
          },
        },
      },
    });
    expect(store.hoistedVariableMappings).toEqual({
      testVariable: {
        parameterId: 'testParam',
        pathsByContentType: {
          ct111: {
            path: '/fields/title',
          },
        },
        type: 'ContentTypeMapping',
      },
    });
    expect(store.locale).toBe(locale);
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
    expect(store.locale).toBe(locale);
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

  describe('serialize/deserialize:', () => {
    it('should have as result of deserialization an instance of the EntityStore identical to the serialized one', () => {
      const experienceEntry = createExperienceEntry({
        id: 'testExperienceEntry',
      });

      const entityStore = new EntityStore({
        experienceEntry: experienceEntry,
        entities,
        locale,
      });
      expect(entityStore).toBeDefined();

      // Seems that during SSR it's the zustand mechanisms wire into NextJS hydration lifecycle
      // and will nest `entityStore` in the hydrated state like this
      // `{ entityStore: { _experienceEntryFields: ..., ... } }`
      const serializedZustandStore = JSON.stringify({ entityStore }, null, 2);
      const deserializedEntityStore = new EntityStore(serializedZustandStore);

      expect(deserializedEntityStore).toEqual(entityStore); // deep equality check of object instances
    });
  });
});
