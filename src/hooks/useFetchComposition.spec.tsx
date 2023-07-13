import { useFetchComposition } from './useFetchComposition'
import { renderHook, waitFor } from '@testing-library/react'
import { compositionEntry } from '../../test/__fixtures__/composition'
import { entries, assets, entityIds } from '../../test/__fixtures__/entities'
import { ContentfulClientEntityStore } from '../core/ContentfulClientEntityStore'

jest.mock('../core/ContentfulClientEntityStore')

const sharedProps = {
  accessToken: 'SECRET_TOKEN',
  environmentId: 'master',
  spaceId: 'SPACE_ID',
  experienceTypeId: 'layout',
}

const render = async (props: { slug: string; locale: string; experienceTypeId?: string }) => {
  const { result } = renderHook(() =>
    useFetchComposition({
      ...sharedProps,
      ...props,
      experienceTypeId: props.experienceTypeId ?? sharedProps.experienceTypeId,
    })
  )

  await waitFor(async () => {
    expect(result.current.isLoadingData).toBeFalsy()
  })

  return result
}

describe('useFetchComposition', () => {
  const locale = 'en-US'
  const composition = compositionEntry.fields

  const fetchEntries = jest.fn()
  const fetchAssets = jest.fn()
  const fetchComposition = jest.fn()

  describe('success', () => {
    beforeEach(async () => {
      fetchEntries.mockResolvedValue(entries)
      fetchAssets.mockResolvedValue(assets)
      fetchComposition.mockResolvedValue(composition)
      ;(ContentfulClientEntityStore as jest.Mock).mockReturnValue({
        fetchEntries,
        fetchAssets,
        fetchComposition,
      })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should be defined', () => {
      expect(useFetchComposition).toBeDefined()
    })

    it('should fetch composition by slug', async () => {
      const result = await render({ slug: 'test', locale })

      expect(ContentfulClientEntityStore).toHaveBeenCalledWith({
        spaceId: 'SPACE_ID',
        environmentId: 'master',
        accessToken: 'SECRET_TOKEN',
        experienceTypeId: 'layout',
        entities: [],
        locale,

      })
      expect(fetchComposition).toHaveBeenCalledWith('test')

      expect(result.current.composition).toEqual(composition)
    })

    it('should fetch bound entries', async () => {
      await render({ slug: 'test', locale })

      expect(fetchEntries).toHaveBeenCalledWith([entityIds.ENTRY1, entityIds.ENTRY2])
    })

    it('should fetch bound assets', async () => {
      await render({ slug: 'test', locale })

      expect(fetchAssets).toHaveBeenCalledWith([entityIds.ASSET1])
    })

    it('should setup entity store with respect to the given experienceTypeId', async () => {
      const slug = 'hello-world'
      const locale = 'en-US'

      renderHook((props) => useFetchComposition({ ...sharedProps, ...props }), {
        initialProps: { slug, experienceTypeId: 'custom-exp-type', locale },
      })

      expect(ContentfulClientEntityStore).toHaveBeenCalledWith({
        accessToken: 'SECRET_TOKEN',
        entities: [],
        environmentId: 'master',
        experienceTypeId: 'custom-exp-type',
        locale: 'en-US',
        spaceId: 'SPACE_ID',
      })
    })
  })

  describe('failures', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should log an error if composition was not found', async () => {
      const err = jest.spyOn(console, 'error')
      fetchComposition.mockRejectedValue(new Error('No composition with slug: "test" exists'))
      ;(ContentfulClientEntityStore as jest.Mock).mockReturnValue({
        fetchEntries,
        fetchAssets,
        fetchComposition,
      })

      const result = await render({ slug: 'test', locale })

      expect(result.current.error).toBe('No composition with slug: "test" exists')

      expect(err).toBeCalledWith(
        'Failed to fetch composition with error: No composition with slug: "test" exists'
      )
    })
  })
})
