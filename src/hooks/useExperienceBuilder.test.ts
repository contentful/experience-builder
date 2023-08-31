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
        error: undefined,
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

jest.mock('../core/constants', () => ({
  SDK_VERSION: '0.0.0-test',
  __esModule: true
}))

describe('useExperienceBuilder', () => {
  it('should return settings, experience and defineComponent and set delivery mode by default', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        client: clientMock,
        defaultLocale,
        slug,
      },
    })

    const output = res.result.current

    expect(output.settings).toEqual({
      experienceTypeId,
      locale: defaultLocale,
      slug,
      mode: 'delivery',
      client: output.settings.client,
      setLocale: output.settings.setLocale,
    })
    expect(output.experience).toEqual({
      composition: undefined,
      children: [],
      breakpoints: [],
      schemaVersion: undefined,
      dataSource: {},
      unboundValues: {},
      entityStore: undefined,
      error: undefined,
      isLoading: false,
      fetchBySlug: output.experience.fetchBySlug,
    })

    expect(output.defineComponent).toBeDefined()
  })

  it('should allow to set the editor mode', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        client: clientMock,
        defaultLocale,
        slug,
        mode: 'editor' as CompositionMode,
      },
    })

    const output = res.result.current

    expect(output.settings.mode).toBe('editor')
  })

  it('should throw an error if passed incorrect mode', () => {
    try {
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
        defaultLocale,
        slug,
        mode: 'editor' as CompositionMode,
      },
    })

    expect(res.result.current.settings.mode).toBe('editor')

    res.rerender({
      experienceTypeId,
      client: clientMock,
      defaultLocale,
      slug,
      mode: 'delivery' as CompositionMode,
    })

    expect(res.result.current.settings.mode).toBe('delivery')
  })

  it('changes the locale and DOES NOT trigger fetch of entity for the new locale in editor mode', async () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        client: clientMock,
        defaultLocale,
        slug,
        mode: 'editor' as CompositionMode,
      },
    })

    const fetchSpy = jest.spyOn(res.result.current.experience, 'fetchBySlug')

    expect(res.result.current.settings.locale).toBe(defaultLocale)

    await act(() => res.result.current.settings.setLocale('de'))

    expect(res.result.current.settings.locale).toBe('de')
    expect(fetchSpy).not.toHaveBeenCalled()
  })
  ;(['preview', 'delivery'] as CompositionMode[]).map((mode) => {
    it(`should allow to set the ${mode} mode`, () => {
      const res = renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          client: clientMock,
          defaultLocale,
          slug,
          mode: mode,
        },
      })

      const output = res.result.current

      expect(output.settings.mode).toBe(mode)
    })

    it(`changes the locale and triggers fetch of entity for the new locale in ${mode} mode`, async () => {
      const res = renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          client: clientMock,
          defaultLocale,
          slug,
          mode,
        },
      })

      const output = res.result.current

      expect(output.settings.locale).toBe(defaultLocale)

      await act(() => output.settings.setLocale('de'))

      expect(res.result.current.settings.locale).toBe('de')
      expect(output.experience.fetchBySlug).toHaveBeenCalledWith({
        experienceTypeId,
        slug,
        localeCode: 'de',
      })
    })

    it(`doesnt trigger fetch of entity for locale value that is not different from the current state in ${mode} mode`, async () => {
      const res = renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          client: clientMock,
          defaultLocale,
          slug,
          mode,
        },
      })

      const output = res.result.current

      expect(output.settings.locale).toBe(defaultLocale)

      await act(() => output.settings.setLocale(defaultLocale))

      expect(res.result.current.settings.locale).toBe(defaultLocale)
      expect(output.experience.fetchBySlug).not.toHaveBeenCalled()
    })
  })
})
