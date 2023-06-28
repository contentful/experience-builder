import { Asset, Entry } from 'contentful'
import { EntityStore } from './EntityStore'

const entities: Array<Entry | Asset> = [
  {
    sys: {
      id: 'foo',
      type: 'Entry',
      contentType: {
        sys: {
          id: 'bar',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
      revision: 10,
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'cfexampleapi',
        },
      },
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      locale: 'en-US',
    },
    fields: {
      title: 'Foo',
    },
    metadata: {
      tags: [],
    },
  },
  {
    sys: {
      id: 'bar',
      type: 'Asset',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
      revision: 10,
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'cfexampleapi',
        },
      },
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      locale: 'en-US',
    },
    fields: { title: 'Bar' },
    metadata: {
      tags: [],
    },
  },
]

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
        store.getValue({ sys: { id: 'foo', linkType: 'Entry', type: 'Link' } }, ['fields', 'title'])
      ).toEqual('Foo')
      expect(
        store.getValue({ sys: { id: 'bar', linkType: 'Asset', type: 'Link' } }, ['fields', 'title'])
      ).toEqual('Bar')
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
        store.getValue({ sys: { id: 'foo', linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'description',
        ])
      ).toBeUndefined()
    })

    it('should return undefined if entity type does not match', () => {
      const store = new EntityStore({ entities })
      expect(store).toBeDefined()

      expect(
        store.getValue({ sys: { id: 'foo', linkType: 'Asset', type: 'Link' } }, ['fields', 'title'])
      ).toBeUndefined()
    })
  })
})
