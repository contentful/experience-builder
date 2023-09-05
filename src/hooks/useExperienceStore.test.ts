import { useExperienceStore } from './useExperienceStore'
import { act, renderHook } from '@testing-library/react'
import { EntityStore } from '../core/EntityStore'
import { compositionEntry } from '../../test/__fixtures__/composition'
import { entries, assets } from '../../test/__fixtures__/entities'
import type { ContentfulClientApi } from 'contentful'
import { ExperienceStore } from '../types'

jest.mock('../core/EntityStore')

const experienceTypeId = 'layout'
const localeCode = 'en-US'
const slug = 'hello-world'

let clientMock: ContentfulClientApi<undefined>

describe('useFetchComposition', () => {
  beforeEach(() => {
    clientMock = {
      getEntries: jest.fn().mockImplementation((data) => {
        if ('sys.id[in]' in data) {
          return Promise.resolve({ items: entries })
        }

        return Promise.resolve({ items: [compositionEntry] })
      }),
      getAssets: jest.fn().mockResolvedValue({ items: assets }),
    } as unknown as ContentfulClientApi<undefined>
  })

  it('should be defined', () => {
    const res = renderHook((props) => useExperienceStore(props), {
      initialProps: { client: clientMock },
    })

    const store = res.result.current

    expect(store).toEqual({
      composition: undefined,
      children: [],
      breakpoints: [],
      schemaVersion: undefined,
      dataSource: {},
      unboundValues: {},
      entityStore: undefined,
      isLoading: false,
      fetchBySlug: store.fetchBySlug,
    } as ExperienceStore)
  })

  it('should fetch the experience by slug with bound entities', async () => {
    const res = renderHook((props) => useExperienceStore(props), {
      initialProps: { client: clientMock },
    })

    const store = res.result.current

    expect(store).toEqual({
      composition: undefined,
      children: [],
      breakpoints: [],
      schemaVersion: undefined,
      dataSource: {},
      unboundValues: {},
      entityStore: undefined,
      isLoading: false,
      fetchBySlug: store.fetchBySlug,
    } as ExperienceStore)

    await act(() => store.fetchBySlug({ experienceTypeId, localeCode, slug }))

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(1, {
      content_type: experienceTypeId,
      'fields.slug': slug,
      locale: localeCode,
    })

    expect(clientMock.getEntries).toHaveBeenNthCalledWith(2, {
      'sys.id[in]': entries.map((entry) => entry.sys.id),
      locale: localeCode,
    })

    expect(clientMock.getAssets).toHaveBeenCalledWith({
      'sys.id[in]': assets.map((asset) => asset.sys.id),
      locale: localeCode,
    })

    expect(EntityStore).toHaveBeenCalledWith({ entities: [...entries, ...assets] })

    expect(res.result.current).toEqual({
      composition: compositionEntry.fields,
      children: compositionEntry.fields.componentTree.children,
      breakpoints: compositionEntry.fields.componentTree.breakpoints,
      schemaVersion: compositionEntry.fields.componentTree.schemaVersion,
      dataSource: compositionEntry.fields.dataSource,
      unboundValues: compositionEntry.fields.unboundValues,
      entityStore: res.result.current.entityStore,
      isLoading: false,
      fetchBySlug: store.fetchBySlug,
    } as ExperienceStore)
  })

  it('should throw an error if composition was not found', async () => {
    clientMock.getEntries = jest.fn().mockResolvedValue({ items: [] })

    const res = renderHook((props) => useExperienceStore(props), {
      initialProps: { client: clientMock },
    })

    try {
      await act(() => res.result.current.fetchBySlug({ experienceTypeId, slug, localeCode }))
    } catch (e) {
      expect((e as Error).message).toBe(`No composition with slug: ${slug} exists`)
    }
  })

  it('should throw an error if multiple compositions were found', async () => {
    clientMock.getEntries = jest
      .fn()
      .mockResolvedValue({ items: [compositionEntry, compositionEntry] })

    const res = renderHook((props) => useExperienceStore(props), {
      initialProps: { client: clientMock },
    })

    try {
      await act(() => res.result.current.fetchBySlug({ experienceTypeId, slug, localeCode }))
    } catch (e) {
      expect((e as Error).message).toBe(`More than one composition with slug: ${slug} was found`)
    }
  })

  it('should throw an error if slug is not defined', async () => {
    const res = renderHook((props) => useExperienceStore(props), {
      initialProps: { client: clientMock },
    })

    try {
      await act(() =>
        // @ts-expect-error undefined is not alloed through types, but it can still happen if invoked from a plain js
        res.result.current.fetchBySlug({ experienceTypeId, slug: undefined, localeCode })
      )
    } catch (e) {
      expect((e as Error).message).toBe(
        'Preview and delivery mode requires a composition slug to be provided'
      )
    }
  })

  it('should throw an error if localeCode is not defined', async () => {
    const res = renderHook((props) => useExperienceStore(props), {
      initialProps: { client: clientMock },
    })

    try {
      await act(() =>
        // @ts-expect-error undefined is not alloed through types, but it can still happen if invoked from a plain js
        res.result.current.fetchBySlug({ experienceTypeId, slug, localeCode: undefined })
      )
    } catch (e) {
      expect((e as Error).message).toBe(
        'Preview and delivery mode requires a locale code to be provided'
      )
    }
  })
})
