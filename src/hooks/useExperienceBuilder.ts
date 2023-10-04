import { useCallback, useEffect, useMemo, useState } from 'react'
import { Experience, ExternalSDKMode, InternalSDKMode } from '../types'
import { useExperienceStore } from './useExperienceStore'
import { supportedModes } from '../constants'
import type { ContentfulClientApi } from 'contentful'
import { defineComponents } from '../core/componentRegistry'

type UseExperienceBuilderProps = {
  /**
   * Id of the content type of the target experience
   */
  experienceTypeId: string
  /**
   * Instance of a Delivery or Preview client from "contentful" package
   */
  client: ContentfulClientApi<undefined>
  /**
   *  Mode defines the behaviour of the sdk.
   * - `preview` - fetching and rendering draft data. Will automatically switch to `editor` mode if open from contentful web app.
   * - `delivery` - fetching and rendering of published data. Can not be switched to `editor` mode. */
  mode?: ExternalSDKMode
}

export const useExperienceBuilder = ({
  experienceTypeId,
  client,
  mode = 'delivery',
}: UseExperienceBuilderProps) => {
  const [activeMode, setMode] = useState<InternalSDKMode>(() => {
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

  const store = useExperienceStore({ client })

  const switchToEditorMode = useCallback(() => {
    setMode('editor')
  }, [])

  const experience = useMemo<Experience>(
    () => ({
      store,
      client,
      experienceTypeId,
      mode: activeMode,
      switchToEditorMode,
    }),
    [activeMode, client, experienceTypeId, store, switchToEditorMode]
  )

  return {
    experience,
    defineComponents,
  }
}
