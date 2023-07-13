import { Asset, Entry, createClient } from 'contentful'

import { ContentfulClientEntityStore } from './ContentfulClientEntityStore'
import { assets, entries, entities, entityIds } from '../../test/__fixtures__/entities'
import { compositionEntry } from '../../test/__fixtures__/composition'

jest.mock('contentful')

describe('ContentfulClientEntityStore', () => {
  const getEntries = jest.fn()
  const getAssets = jest.fn()

  const locale = 'en-US'

  function createStore(entities: Array<Asset | Entry> = [], experienceTypeId = 'layout') {
    return new ContentfulClientEntityStore({
      spaceId: 'space',
      environmentId: 'master',
      accessToken: 'SECRET_TOKEN',
      entities,
      locale,
      experienceTypeId,
    })
  }

  beforeEach(() => {
    getEntries.mockResolvedValue({ items: entries })
    getAssets.mockResolvedValue({ items: assets })
    ;(createClient as jest.Mock).mockReturnValue({
      getAssets,
      getEntries,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(ContentfulClientEntityStore).toBeDefined()
  })

  it('initialize the client on creation', () => {
    createStore()

    expect(createClient).toHaveBeenCalledWith({
      space: 'space',
      environment: 'master',
      accessToken: 'SECRET_TOKEN',
    })
  })

  describe('fetchComposition', () => {
    it('should return the composition fields', async () => {
      getEntries.mockResolvedValue({ items: [compositionEntry] })
      const composition = await createStore().fetchComposition('test')

      expect(composition).toEqual(compositionEntry.fields)
      expect(getEntries).toHaveBeenCalledWith({
        content_type: 'layout',
        'fields.slug': 'test',
        locale,
      })
    })

    it('should throw an error if no composition is found', async () => {
      getEntries.mockResolvedValue({ items: [] })
      await expect(createStore().fetchComposition('test')).rejects.toThrowError(
        'No composition with slug: "test" exists'
      )
    })

    it('should throw an error if more than one composition is found', async () => {
      getEntries.mockResolvedValue({ items: [compositionEntry, ...entries] })
      await expect(createStore().fetchComposition('test')).rejects.toThrowError(
        'More than one composition with slug: "test" was found'
      )
    })
  })

  describe('fetchEntries', () => {
    it('should return the requested entries', async () => {
      const ids = entries.map((e) => e.sys.id)
      const result = await createStore().fetchEntries(ids)

      expect(result).toEqual(entries)
      expect(getEntries).toHaveBeenCalledWith({ 'sys.id[in]': ids, locale })
    })

    it('should not make a request if there are no entry ids', async () => {
      const result = await createStore().fetchEntries([])

      expect(result).toEqual([])
      expect(getEntries).not.toHaveBeenCalled()
    })
  })

  describe('fetchAssets', () => {
    it('should return the requested assets', async () => {
      const ids = assets.map((e) => e.sys.id)
      const result = await createStore().fetchAssets(ids)

      expect(result).toEqual(assets)
      expect(getAssets).toHaveBeenCalledWith({ 'sys.id[in]': ids, locale })
    })

    it('should not make a request if there are no asset ids', async () => {
      const result = await createStore().fetchAssets([])

      expect(result).toEqual([])
      expect(getAssets).not.toHaveBeenCalled()
    })
  })

  describe('getValue', () => {
    it('should return the correct value', () => {
      const result = createStore(entities).getValue(
        { sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } },
        ['fields', 'title']
      )

      expect(result).toBe('Entry 1')
    })

    it('should return undefined if entity id does not exist', () => {
      const result = createStore(entities).getValue(
        { sys: { id: 'test', linkType: 'Entry', type: 'Link' } },
        ['fields', 'title']
      )

      expect(result).toBeUndefined()
    })

    it('should return undefined if the field does not exist', () => {
      const result = createStore(entities).getValue(
        { sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } },
        ['fields', 'undefined']
      )

      expect(result).toBeUndefined()
    })

    it('should return undefined if entity type does not match', () => {
      const result = createStore(entities).getValue(
        { sys: { id: entityIds.ENTRY1, linkType: 'Asset', type: 'Link' } },
        ['fields', 'title']
      )

      expect(result).toBeUndefined()
    })
  })
})
