import React from 'react'
import { useFetchComposition } from './useFetchComposition'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { EntityStore } from '../core/EntityStore'
import { compositionEntry } from '../../test/__fixtures__/composition'
import { entries, assets, entityIds } from '../../test/__fixtures__/entities'

jest.mock('../core/EntityStore')

const experienceTypeId = 'layout'

const TestComponent = ({ client, slug, locale }: { client: any; slug: string; locale: string }) => {
  const { composition, children, entityStore, error } = useFetchComposition({
    experienceTypeId,
    client,
    slug,
    locale,
  })

  return (
    <div>
      <h1>{composition?.title}</h1>
      <div>
        {children.map((child) => (
          <div key={child.definitionId}>{child.definitionId}</div>
        ))}
      </div>
      <div>
        {entityStore && <span>Entities fetched!!</span>}
        {error && <span>Error!!</span>}
      </div>
    </div>
  )
}

describe('useFetchComposition', () => {
  let client: any

  describe('success', () => {
    beforeEach(async () => {
      client = {
        getEntries: jest
          .fn()
          .mockReturnValueOnce({ items: [compositionEntry] })
          .mockReturnValue({ items: entries }),

        getAssets: jest.fn().mockResolvedValue({ items: assets }),
      }

      render(<TestComponent client={client} slug="test" locale="en-US" />)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should be defined', () => {
      expect(useFetchComposition).toBeDefined()
    })

    it('should fetch composition by slug', async () => {
      expect(client.getEntries).toHaveBeenCalledWith({
        content_type: experienceTypeId,
        'fields.slug': 'test',
        locale: 'en-US',
      })
      await waitFor(async () => {
        expect(await screen.findByText('Test Composition')).toBeInTheDocument()
      })
    })

    it('should fetch bound entries', async () => {
      await waitFor(async () => {
        expect(await screen.findByText('Entities fetched!!')).toBeInTheDocument()
      })

      expect(client.getEntries).toHaveBeenCalledWith({
        'sys.id[in]': [entityIds.ENTRY1, entityIds.ENTRY2],
        locale: 'en-US',
      })
    })

    it('should fetch bound assets', async () => {
      await waitFor(async () => {
        expect(await screen.findByText('Entities fetched!!')).toBeInTheDocument()
      })

      expect(client.getAssets).toHaveBeenCalledWith({
        'sys.id[in]': [entityIds.ASSET1],
        locale: 'en-US',
      })
    })

    it('should set entities in entityStore', async () => {
      await waitFor(async () => {
        expect(await screen.findByText('Entities fetched!!')).toBeInTheDocument()
      })

      expect(EntityStore).toHaveBeenCalledWith({ entities: [...entries, ...assets] })
    })
  })

  describe('failures', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should log an error if composition was not found', async () => {
      const err = jest.spyOn(console, 'error')
      client = {
        getEntries: jest.fn().mockReturnValue({ items: [] }),
        getAssets: jest.fn().mockResolvedValue({ items: assets }),
      }
      render(<TestComponent client={client} slug="test" locale="en-US" />)
      await waitFor(async () => {
        expect(await screen.findByText('Error!!')).toBeInTheDocument()
      })

      expect(err).toBeCalledWith(
        'Failed to fetch composition with error: No composition with slug: test exists'
      )
    })

    it('should log an error if multiple compositions were found', async () => {
      const err = jest.spyOn(console, 'error')
      client = {
        getEntries: jest.fn().mockReturnValue({ items: [compositionEntry, compositionEntry] }),
        getAssets: jest.fn().mockResolvedValue({ items: assets }),
      }
      render(<TestComponent client={client} slug="test" locale="en-US" />)

      await waitFor(async () => {
        expect(await screen.findByText('Error!!')).toBeInTheDocument()
      })
      expect(err).toBeCalledWith(
        'Failed to fetch composition with error: More than one composition with slug: test was found'
      )
    })
  })
})

describe('hook', () => {
  let client: any

  beforeEach(async () => {
    client = {
      getEntries: jest.fn().mockResolvedValue({ items: [compositionEntry] }),
      getAssets: jest.fn().mockResolvedValue({ items: assets }),
    }
  })

  it.only('should fetch composition with respect to the given experienceTypeId', async () => {
    const slug = 'hello-world'
    const locale = 'en-US'

    const res = renderHook((props) => useFetchComposition(props), {
      initialProps: { client, slug, experienceTypeId: 'layout', locale },
    })

    expect(client.getEntries).toHaveBeenCalledWith({
      content_type: 'layout',
      'fields.slug': slug,
      locale,
    })

    res.rerender({
      client,
      slug,
      experienceTypeId: 'custom-exp-type',
      locale,
    })

    expect(client.getEntries).toHaveBeenCalledWith({
      content_type: 'custom-exp-type',
      'fields.slug': slug,
      locale,
    })
  })
})
