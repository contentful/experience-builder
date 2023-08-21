import { useMemo, useState } from 'react'
import contentful from 'contentful'
import {
  CompositionMode,
  ExperienceBuilderConfig,
  ExperienceBuilderSettings,
} from '../types'
import { isInsideIframe } from '../utils'
import { useExperienceStore } from './useExperienceStore'
import { validateExperienceBuilderConfig } from '../validation'

type UseExperienceBuilderProps = {
  /**
   * Id of the content type of the target experience
   */
  experienceTypeId: string
  /** The mode is automatically set, use this value to manually override this **/
  initialMode?: CompositionMode

} & ExperienceBuilderConfig

export const useExperienceBuilder = ({
  experienceTypeId,
  initialMode,
  accessToken,
  defaultLocale,
  environmentId,
  spaceId,
  host,
}: UseExperienceBuilderProps) => {
  const [locale, setLocale] = useState<string>(defaultLocale)
  const [mode, setMode] = useState<CompositionMode>(() => {
    if (initialMode) return initialMode

    if (isInsideIframe()) {
      return 'editor'
    } else if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const isPreview = urlParams.get('isPreview')
      return isPreview ? 'preview' : 'delivery'
    } else {
      return 'delivery'
    }
  })

  const defaultHost = mode === 'preview' ? 'preview.contentful.com' : 'cdn.contentful.com'
  const ctflApi = host || defaultHost

  validateExperienceBuilderConfig({
    accessToken,
    spaceId,
    defaultLocale,
    environmentId,
    mode,
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

  const settings = useMemo<ExperienceBuilderSettings>(
    () => ({
      experienceTypeId,
      locale,
      mode,
      client,
      setLocale: (localeCode: string) => setLocale(localeCode)
    }),
    [
      locale,
      mode,
      experienceTypeId,
      client
    ]
  )

  return {
    experience,
    settings
  }
}
