import { useCallback, useEffect, useMemo, useState } from 'react'
import { Experience, ExternalSDKMode, InternalSDKMode } from '../types'
import { supportedModes } from '../constants'
import type { ContentfulClientApi } from 'contentful'
import { defineComponents } from '../core/componentRegistry'
import { EntityStore } from '../core/EntityStore'

type UseExperienceBuilderProps = {
  /**
   * Id of the content type of the target experience
   */
  experienceTypeId: string
  client: ContentfulClientApi<undefined>
  /**
   *  Mode defines the behaviour of the sdk.
   * - `preview` - fetching and rendering draft data. Will automatically switch to `editor` mode if open from contentful web app.
   * - `delivery` - fetching and rendering of published data. Can not be switched to `editor` mode. */
  mode?: ExternalSDKMode
  ssr?: {
    entityStore: EntityStore
    experienceEntryId: string
  }
}

export const useExperienceBuilder = ({
  experienceTypeId,
  client,
  mode = 'delivery',
  ssr,
}: UseExperienceBuilderProps) => {
  const [activeMode, setMode] = useState<InternalSDKMode>(() => {
    if (supportedModes.includes(mode)) {
      return mode
    }

    throw new Error(`Unsupported mode provided: ${mode}. Supported values: ${supportedModes}`)
  })

  const [entityStore, setEntityStore] = useState(ssr?.entityStore)

  useEffect(() => {
    if (supportedModes.includes(mode)) {
      setMode(mode)
    }
  }, [mode])

  const switchToEditorMode = useCallback(() => {
    setMode('editor')
  }, [])

  const experience = useMemo<Experience>(
    () => ({
      client,
      entityStore,
      experienceTypeId,
      mode: activeMode,
      switchToEditorMode,
      setEntityStore,
    }),
    [activeMode, experienceTypeId, client, switchToEditorMode, setEntityStore, entityStore]
  )

  return {
    experience,
    defineComponents,
  }
}
