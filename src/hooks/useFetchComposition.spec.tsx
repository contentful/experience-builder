import React from 'react'
import { useFetchComposition } from './useFetchComposition'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { EntityStore } from '../core/EntityStore'
import { compositionEntry } from './__fixtures__/composition'
import { entries, assets, entityIds } from './__fixtures__/entities'
import { debug } from 'console'

jest.mock('../core/EntityStore')

const TestComponent = ({ client, slug, locale }: { client: any; slug: string; locale: string }) => {
  const { composition, children, entityStore, error } = useFetchComposition({
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
        content_type: 'layout',
        'fields.slug': 'test',
        locale: 'en-US',
      })
      await waitFor(() => {
        expect(screen.findByText('Test Composition')).toBeTruthy()
      })
    })

    it('should fetch bound entries', async () => {
      await screen.findByText('Entities fetched!!')

      expect(client.getEntries).toHaveBeenCalledWith({
        'sys.id[in]': [entityIds.ENTRY1, entityIds.ENTRY2],
        locale: 'en-US',
      })
    })

    it('should fetch bound assets', async () => {
      await screen.findByText('Entities fetched!!')

      expect(client.getAssets).toHaveBeenCalledWith({
        'sys.id[in]': [entityIds.ASSET1],
        locale: 'en-US',
      })
    })

    it('should set entities in entityStore', async () => {
      await screen.findByText('Entities fetched!!')

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
      await screen.findByText('Error!!')

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

      await screen.findByText('Error!!')
      expect(err).toBeCalledWith(
        'Failed to fetch composition with error: More than one composition with slug: test was found'
      )
    })
  })
})
