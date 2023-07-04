import { Asset, Entry } from 'contentful'
import { EntityStore } from './EntityStore'
import { entities, entityIds } from '../../test/__fixtures__/entities'

describe('EntityStore', () => {
  it('should be defined', () => {
    expect(EntityStore).toBeDefined()
  })

  it('should create a new instance', () => {
    const store = new EntityStore({ entities: [] })
    expect(store).toBeDefined()
  })

  it('should create a new instance with initial state', () => {
    const store = new EntityStore({ entities })
    expect(store).toBeDefined()
    expect(store.entities).toEqual(entities)
    expect(store.entitiesById).toEqual(
      entities.reduce((acc: Record<string, Entry | Asset>, entity) => {
        acc[entity.sys.id] = entity
        return acc
      }, {})
    )
  })

  describe('getValue', () => {
    it('should return the value based on entityId and path', () => {
      const store = new EntityStore({ entities })
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
      const store = new EntityStore({ entities })
      expect(store).toBeDefined()

      expect(
        store.getValue({ sys: { id: 'test', linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toBeUndefined()
    })

    it("should return undefined if field doesn't exist", () => {
      const store = new EntityStore({ entities })
      expect(store).toBeDefined()

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'description',
        ])
      ).toBeUndefined()
    })

    it('should return undefined if entity type does not match', () => {
      const store = new EntityStore({ entities })
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
