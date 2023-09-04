import { useEffect, useMemo, useState } from 'react'
import { CompositionMode, Experience } from '../types'
import { useExperienceStore } from './useExperienceStore'
import { useComponents } from './useComponents'
import { supportedModes } from '../constants'
import type { ContentfulClientApi } from 'contentful'

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
   * `editor` - active messaging with the web app.
   * `preview` - fetching and rendering draft data.
   * `delivery` - fetching and rendering of published data. */
  mode?: CompositionMode
}

export const useExperienceBuilder = ({
  experienceTypeId,
  client,
  mode = 'delivery',
}: UseExperienceBuilderProps) => {
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

  const store = useExperienceStore({ client })

  const { defineComponent } = useComponents({ mode: activeMode })

  const experience = useMemo<Experience>(
    () => ({
      store,
      client,
      experienceTypeId,
      mode: activeMode,
    }),
    [activeMode, client, experienceTypeId, store]
  )

  return {
    experience,
    defineComponent,
  }
}
