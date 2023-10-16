import { EntityStore } from './EntityStore'
import { entities, entityIds, entries } from '../../test/__fixtures__/entities'
import { compositionEntry } from '../../test/__fixtures__/composition'
import type { Entry } from 'contentful'

const locale = 'en-US'

jest.mock('../core/constants', () => ({
  SDK_VERSION: '0.0.0-test',
  __esModule: true,
}))

describe('EntityStore', () => {
  it('should be defined', () => {
    expect(EntityStore).toBeDefined()
  })

  it('should throw an error if provided experienceEntry is not an experience entry', () => {
    try {
      new EntityStore({ experienceEntry: entries[0], entities: [], locale })
      throw new Error('Should not reach this point')
    } catch (e) {
      expect((e as Error).message).toEqual('Provided entry is not experience entry')
    }
  })

  it('should create a new instance', () => {
    const store = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [],
      locale,
    })
    expect(store).toBeDefined()
    expect(store.entities).toEqual([])
    expect(store.experienceEntryFields).toEqual(compositionEntry.fields)
    expect(store.schemaVersion).toEqual(compositionEntry.fields.componentTree.schemaVersion)
    expect(store.breakpoints).toEqual(compositionEntry.fields.componentTree.breakpoints)
    expect(store.dataSource).toEqual(compositionEntry.fields.dataSource)
    expect(store.unboundValues).toEqual(compositionEntry.fields.unboundValues)
    expect(store.getCurrentLocale()).toBe(locale)
  })

  it('should create a new instance with initial state', () => {
    const store = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities,
      locale,
    })
    expect(store).toBeDefined()
    expect(store.entities).toEqual(entities)
    expect(store.experienceEntryFields).toEqual(compositionEntry.fields)
    expect(store.schemaVersion).toEqual(compositionEntry.fields.componentTree.schemaVersion)
    expect(store.breakpoints).toEqual(compositionEntry.fields.componentTree.breakpoints)
    expect(store.dataSource).toEqual(compositionEntry.fields.dataSource)
    expect(store.unboundValues).toEqual(compositionEntry.fields.unboundValues)
    expect(store.getCurrentLocale()).toBe(locale)
  })

  describe('getValue', () => {
    it('should return the value based on entityId and path', () => {
      const store = new EntityStore({
        experienceEntry: compositionEntry as unknown as Entry,
        entities,
        locale,
      })
      expect(store).toBeDefined()

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toEqual('Entry 1')
      expect(
        store.getValue({ sys: { id: entityIds.ASSET1, linkType: 'Asset', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toEqual('Asset 1')
    })

    it('should return undefined if entity id does not exist', () => {
      const store = new EntityStore({
        experienceEntry: compositionEntry as unknown as Entry,
        entities,
        locale,
      })
      expect(store).toBeDefined()

      expect(
        store.getValue({ sys: { id: 'test', linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toBeUndefined()
    })

    it("should return undefined if field doesn't exist", () => {
      const store = new EntityStore({
        experienceEntry: compositionEntry as unknown as Entry,
        entities,
        locale,
      })
      expect(store).toBeDefined()

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'description',
        ])
      ).toBeUndefined()
    })

    it('should return undefined if entity type does not match', () => {
      const store = new EntityStore({
        experienceEntry: compositionEntry as unknown as Entry,
        entities,
        locale,
      })
      expect(store).toBeDefined()

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Asset', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toBeUndefined()
    })
  })
})
