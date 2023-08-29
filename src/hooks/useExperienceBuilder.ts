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

  const experience = useExperienceStore({
    client,
    locale,
  })

  const { defineComponent } = useComponents({ mode: activeMode });

  const settings = useMemo<ExperienceBuilderSettings>(
    () => ({
      experienceTypeId,
      locale,
      mode: activeMode,
      client,
      setLocale: (localeCode: string) => setLocale(localeCode)
    }),
    [
      locale,
      activeMode,
      experienceTypeId,
      client
    ]
  )

  return {
    experience,
    settings,
    defineComponent
  }
}
