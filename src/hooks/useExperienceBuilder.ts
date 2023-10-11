import { useCallback, useEffect, useMemo, useState } from 'react'
import { Experience, ExternalSDKMode, InternalSDKMode } from '../types'
import { supportedModes } from '../constants'
import type { ContentfulClientApi } from 'contentful'
import { defineComponents } from '../core/componentRegistry'

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
}

export const useExperienceBuilder = ({
  experienceTypeId,
  client,
  mode = 'delivery'  
}: UseExperienceBuilderProps) => {
  const experience = useMemo<Experience>(
    () => ({
      client,
      entityStore: undefined,
      mode,
    }),
    [client, mode]
  )

  return {
    experience,
    defineComponents,
  }
}
