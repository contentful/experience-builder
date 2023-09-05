import { act, renderHook } from '@testing-library/react'
import { useExperienceBuilder } from './useExperienceBuilder'
import { CompositionMode } from '../types'
import { supportedModes } from '../constants'
import type { ContentfulClientApi } from 'contentful'

const clientMock = {
  getEntries: jest.fn(),
  getAssets: jest.fn(),
} as unknown as ContentfulClientApi<undefined>

jest.mock('./useExperienceStore', () => {
  return {
    useExperienceStore: () => {
      return {
        composition: undefined,
        children: [],
        breakpoints: [],
        schemaVersion: undefined,
        dataSource: {},
        unboundValues: {},
        entityStore: undefined,
        isLoading: false,
        fetchBySlug: jest.fn().mockImplementation(() => {
          return Promise.resolve()
        }),
      }
    },
  }
})

const experienceTypeId = 'books'
const defaultLocale = 'en-US'
const slug = 'hello-world'

describe('useExperienceBuilder', () => {
  it('should return experience and defineComponent and set delivery mode by default', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        client: clientMock,
      },
    })

    const output = res.result.current

    expect(output.experience).toEqual({
      store: {
        composition: undefined,
        children: [],
        breakpoints: [],
        schemaVersion: undefined,
        dataSource: {},
        unboundValues: {},
        entityStore: undefined,
        isLoading: false,
        fetchBySlug: output.experience.store.fetchBySlug,
      },
      client: clientMock,
      experienceTypeId,
      mode: 'delivery',
    })

    expect(output.defineComponent).toBeDefined()
  })

  it('should throw an error if passed incorrect mode', () => {
    try {
      // without it a big shabang bong log will be printed to the console and the world will expload
      // jk: you will just have to scroll a lot to find which test file has failed
      jest.spyOn(console, 'error').mockReturnValue()

      renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          client: clientMock,
          defaultLocale,
          slug,
          mode: 'random' as CompositionMode,
        },
      })
    } catch (error) {
      expect((error as Error).message).toBe(
        `Unsupported mode provided: random. Supported values: ${supportedModes}`
      )
    }
  })

  it('reflects the dynamic change of mode', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        client: clientMock,
        mode: 'editor' as CompositionMode,
      },
    })

    expect(res.result.current.experience.mode).toBe('editor')

    res.rerender({
      experienceTypeId,
      client: clientMock,
      mode: 'delivery' as CompositionMode,
    })

    expect(res.result.current.experience.mode).toBe('delivery')
  })
  ;(['editor', 'preview', 'delivery'] as CompositionMode[]).map((mode) => {
    it(`should allow to set the ${mode} mode`, () => {
      const res = renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          client: clientMock,
          mode: mode,
        },
      })

      const output = res.result.current

      expect(output.experience.mode).toBe(mode)
    })
  })
})
