import { useEffect, useMemo, useState } from 'react'
import { CompositionMode, ExperienceBuilderConfig, ExperienceBuilderSettings } from '../types'
import { useExperienceStore } from './useExperienceStore'
import { validateExperienceBuilderConfig } from '../validation'
import { useComponents } from './useComponents'
import { supportedModes } from '../constants'

type UseExperienceBuilderProps = {
  /**
   * Id of the content type of the target experience
   */
  experienceTypeId: string
  slug: string
  /**
   *  Mode defines the behaviour of the sdk.
   * `editor` - active messaging with the web app.
   * `preview` - fetching and rendering draft data.
   * `delivery` - fetching and rendering of published data. */
  mode?: CompositionMode
} & ExperienceBuilderConfig

export const useExperienceBuilder = ({
  experienceTypeId,
  client,
  defaultLocale,
  slug,
  mode = 'delivery',
}: UseExperienceBuilderProps) => {
  const [locale, setLocale] = useState<string>(defaultLocale)
  const [activeMode, setMode] = useState<CompositionMode>(() => {
    if (supportedModes.includes(mode)) {
      return mode
    }

    throw new Error(`Unsupported mode provided: ${mode}. Supported values: ${supportedModes}`)
  })

  useEffect(() => {
    if (supportedModes.includes(mode)) {
      setMode(mode)
    }
  }, [mode])

  validateExperienceBuilderConfig({
    client,
    defaultLocale,
    mode: activeMode,
  })

  const experience = useExperienceStore({ client })
  const { fetchBySlug } = experience

  const { defineComponent } = useComponents({ mode: activeMode })

  const settings = useMemo<ExperienceBuilderSettings>(
    () => ({
      experienceTypeId,
      locale,
      slug,
      mode: activeMode,
      setLocale: async (localeCode: string) => {
        // if nothing changed
        if (locale === localeCode) {
          return
        }

        setLocale(localeCode)
        if (activeMode !== 'editor') {
          // refetching everything for the new locale if locale changes dynamically
          // TODO: caching potential
          await fetchBySlug({ experienceTypeId, slug, localeCode })
        }
      },
    }),
    [locale, activeMode, experienceTypeId, fetchBySlug, slug]
  )

  return {
    experience,
    settings,
    defineComponent,
  }
}
