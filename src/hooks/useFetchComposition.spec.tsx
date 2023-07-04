import React from 'react'
import { useFetchComposition } from './useFetchComposition'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { EntityStore } from '../core/EntityStore'
import { compositionEntry } from './__fixtures__/composition'
import { entries, assets, entityIds } from './__fixtures__/entities'

jest.mock('../core/EntityStore')

const TestComponent = ({ client, slug, locale }: { client: any; slug: string; locale: string }) => {
  const { composition, children } = useFetchComposition({
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
    </div>
  )
}

describe('useFetchComposition', () => {
  let client: any
  let container: HTMLDivElement

  describe('success', () => {
    beforeEach(async () => {
      client = {
        getEntries: jest
          .fn()
          .mockReturnValueOnce({ items: [compositionEntry] })
          .mockReturnValue({ items: entries }),

        getAssets: jest.fn().mockResolvedValue({ items: assets }),
      }
      container = document.createElement('div')

      await act(async () => {
        render(<TestComponent client={client} slug="test" locale="en-US" />, { container })
      })
    })

    afterEach(() => {
      container.remove()
      jest.clearAllMocks()
    })

    it('should be defined', () => {
      expect(useFetchComposition).toBeDefined()
    })

    it('should fetch composition by slug', () => {
      expect(client.getEntries).toHaveBeenCalledWith({
        content_type: 'layout',
        'fields.slug': 'test',
        locale: 'en-US',
      })
      expect(screen.findByText('Test Composition')).resolves.toBeTruthy()
    })

    it('should fetch bound entries', async () => {
      expect(client.getEntries).toHaveBeenCalledWith({
        'sys.id[in]': [entityIds.ENTRY1, entityIds.ENTRY2],
        locale: 'en-US',
      })
    })

    it('should fetch bound assets', () => {
      expect(client.getAssets).toHaveBeenCalledWith({
        'sys.id[in]': [entityIds.ASSET1],
        locale: 'en-US',
      })
    })

    it('should set entities in entityStore', () => {
      expect(EntityStore).toHaveBeenCalledWith({ entities: [...entries, ...assets] })
    })
  })

  describe('failures', () => {
    afterEach(() => {
      container.remove()
      jest.clearAllMocks()
    })

    it('should log an error if composition was not found', async () => {
      const err = jest.spyOn(console, 'error')
      client = {
        getEntries: jest.fn().mockReturnValue({ items: [] }),
        getAssets: jest.fn().mockResolvedValue({ items: assets }),
      }
      await act(async () => {
        render(<TestComponent client={client} slug="test" locale="en-US" />, { container })
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
      await act(async () => {
        render(<TestComponent client={client} slug="test" locale="en-US" />, { container })
      })
      expect(err).toBeCalledWith(
        'Failed to fetch composition with error: More than one composition with slug: test was found'
      )
    })
  })
})
