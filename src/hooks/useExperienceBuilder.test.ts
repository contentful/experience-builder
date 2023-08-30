import { act, renderHook } from '@testing-library/react'
import { useExperienceBuilder } from './useExperienceBuilder'
import { createClient } from 'contentful'
import { CompositionMode } from '../types'
import { supportedHosts, supportedModes } from '../constants'

jest.mock('contentful', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      getEntries: jest.fn(),
      getAssets: jest.fn(),
    }),
  }
})

const spaceId = 'space-id'
const environmentId = 'master'
const accessToken = 'CFFakeToken'
const experienceTypeId = 'books'
const defaultLocale = 'en-US'
const slug = 'hello-world'

describe('useExperienceBuilder', () => {
  it('should return settings, experience and defineComponent and set delivery mode by default', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
      },
    })

    expect(createClient).toHaveBeenCalledWith({
      space: spaceId,
      environment: environmentId,
      host: 'cdn.contentful.com',
      accessToken,
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

  it('should throw an error if unsupported host was provided', () => {
    try {
      renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          accessToken: accessToken,
          defaultLocale,
          environmentId,
          spaceId,
          slug,
          host: 'random-string',
        },
      })
    } catch (error) {
      expect((error as Error).message).toBe(
        `Unsupported host provided: random-string. Supported values: ${supportedHosts}`
      )
    }
  })

  it('should allow to set production host', () => {
    renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
        host: 'cdn.contentful.com',
      },
    })

    expect(createClient).toHaveBeenCalledWith({
      space: spaceId,
      environment: environmentId,
      host: 'cdn.contentful.com',
      accessToken,
    })
  })

  it('should allow to set preview host', () => {
    renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
        host: 'preview.contentful.com',
      },
    })

    expect(createClient).toHaveBeenCalledWith({
      space: spaceId,
      environment: environmentId,
      host: 'preview.contentful.com',
      accessToken,
    })
  })

  it('should allow to set the preview mode', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
        mode: 'preview' as CompositionMode,
      },
    })

    const output = res.result.current

    expect(output.settings.mode).toBe('preview')
  })

  it('should allow to set the editor mode', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
        mode: 'editor' as CompositionMode,
      },
    })

    const output = res.result.current

    expect(output.settings.mode).toBe('editor')
  })

  it('should allow to set the delivery mode', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
        mode: 'delivery' as CompositionMode,
      },
    })

    const output = res.result.current

    expect(output.settings.mode).toBe('delivery')
  })

  it('should throw an error if passed incorrect mode', () => {
    try {
      renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          accessToken: accessToken,
          defaultLocale,
          environmentId,
          spaceId,
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
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
        mode: 'editor' as CompositionMode,
      },
    })

    expect(res.result.current.settings.mode).toBe('editor')

    res.rerender({
      experienceTypeId,
      accessToken: accessToken,
      defaultLocale,
      environmentId,
      spaceId,
      slug,
      mode: 'delivery' as CompositionMode,
    })

    expect(res.result.current.settings.mode).toBe('delivery')
  })

  it.only('changes the locale and DOES NOT trigger fetch of entity for the new locale in editor mode', async () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        accessToken: accessToken,
        defaultLocale,
        environmentId,
        spaceId,
        slug,
        mode: 'editor' as CompositionMode,
      },
    })

    const fetchSpy = jest.spyOn(res.result.current.experience, 'fetchBySlug');

    expect(res.result.current.settings.locale).toBe(defaultLocale);

    await act(() => res.result.current.settings.setLocale('de'))

    expect(res.result.current.settings.locale).toBe('de');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  (['preview', 'delivery'] as CompositionMode[]).forEach((mode) => {
    it.only(`changes the locale and triggers fetch of entity for the new locale in ${mode} mode`, async () => {
      const res = renderHook((props) => useExperienceBuilder(props), {
        initialProps: {
          experienceTypeId,
          accessToken: accessToken,
          defaultLocale,
          environmentId,
          spaceId,
          slug,
          mode
        },
      })
  
      const fetchSpy = jest.spyOn(res.result.current.experience, 'fetchBySlug');
      fetchSpy.mockResolvedValue(undefined);
  
      expect(res.result.current.settings.locale).toBe(defaultLocale);
  
      await act(() => res.result.current.settings.setLocale('de'))
  
      expect(res.result.current.settings.locale).toBe('de');
      expect(fetchSpy).toHaveBeenCalledWith({ experienceTypeId, slug, localeCode: 'de' });
    });
  })
})
