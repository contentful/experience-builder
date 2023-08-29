import { useEffect, useMemo, useState } from 'react'
import contentful from 'contentful'
import {
  CompositionMode,
  ExperienceBuilderConfig,
  ExperienceBuilderSettings,
} from '../types'
import { useExperienceStore } from './useExperienceStore'
import { validateExperienceBuilderConfig } from '../validation'
import { useComponents } from './useComponents'

type UseExperienceBuilderProps = {
  /**
   * Id of the content type of the target experience
   */
  experienceTypeId: string
  slug: string;
  /**
   *  Mode defines the behaviour of the sdk.
   * `editor` - active messaging with the web app.
   * `preview` - fetching and rendering draft data.
   * `delivery` - fetching and rendering of published data. */
  mode?: CompositionMode

} & ExperienceBuilderConfig

export const useExperienceBuilder = ({
  experienceTypeId,
  accessToken,
  defaultLocale,
  environmentId,
  spaceId,
  slug,
  host,
  mode = 'delivery',
}: UseExperienceBuilderProps) => {
  const [locale, setLocale] = useState<string>(defaultLocale)
  const [activeMode, setMode] = useState<CompositionMode>(mode)

  useEffect(() => {
    setMode(mode);
  }, [mode])

  const defaultHost = activeMode === 'preview' ? 'preview.contentful.com' : 'cdn.contentful.com'
  const ctflApi = host || defaultHost

  validateExperienceBuilderConfig({
    accessToken,
    spaceId,
    defaultLocale,
    environmentId,
    mode: activeMode,
    host: ctflApi
  });

  const client = useMemo(
    () =>
      contentful.createClient({
        space: spaceId as string,
        environment: environmentId as string,
        host: ctflApi,
        accessToken: accessToken as string,
      }),
    [spaceId, environmentId, ctflApi, accessToken]
  )

  const experience = useExperienceStore({ client })
  const { fetchBySlug } = experience;

  const { defineComponent } = useComponents({ mode: activeMode });

  const settings = useMemo<ExperienceBuilderSettings>(
    () => ({
      experienceTypeId,
      locale,
      slug,
      mode: activeMode,
      client,
      setLocale: async (localeCode: string) => {
        // if nothing changed
        if (locale === localeCode) {
          return;
        }

        setLocale(localeCode)
        if (activeMode !== 'editor') {
          // refetching everything for the new locale if locale changes dynamically
          // TODO: caching potential
          await fetchBySlug({ experienceTypeId, slug, localeCode });
        }
      }
    }),
    [
      locale,
      activeMode,
      experienceTypeId,
      fetchBySlug,
      slug,
      client
    ]
  )

  return {
    experience,
    settings,
    defineComponent
  }
}
