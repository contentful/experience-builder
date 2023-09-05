import type { ContentfulClientApi } from 'contentful'
import { useState, useMemo, useCallback } from 'react'
import { EntityStore } from '../core/EntityStore'
import { Composition, ExperienceStore } from '../types'

type UseExperienceStoreProps = {
  client: ContentfulClientApi<undefined>
}

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
}

export const useExperienceStore = ({ client }: UseExperienceStoreProps) => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const [entityStore, setEntityStore] = useState<EntityStore>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const children = composition?.componentTree?.children ?? []
  const breakpoints = composition?.componentTree?.breakpoints ?? []
  const schemaVersion = composition?.componentTree?.schemaVersion
  const dataSource = composition?.dataSource ?? {}
  const unboundValues = composition?.unboundValues ?? {}

  const handleError = useCallback((generalMessage: string, error: unknown) => {
    const message = error instanceof Error ? error.message : `Unknown error: ${error}`
    console.error(`${generalMessage} with error: ${message}`)
  }, [])

  const fetchReferencedEntities = useCallback(
    async ({ composition, locale }: { composition: Composition; locale: string }) => {
      if (!composition || !locale) {
        return
      }

      const entryIds: string[] = [],
        assetIds: string[] = []
      for (const dataBinding of Object.values(composition.dataSource)) {
        if (!('sys' in dataBinding)) {
          continue
        }
        if (dataBinding.sys.linkType === 'Entry') {
          entryIds.push(dataBinding.sys.id)
        }
        if (dataBinding.sys.linkType === 'Asset') {
          assetIds.push(dataBinding.sys.id)
        }
      }

      try {
        const [entriesResponse, assetsResponse] = await Promise.all([
          entryIds.length > 0
            ? client.getEntries({ 'sys.id[in]': entryIds, locale })
            : { items: [] },
          assetIds.length > 0
            ? client.getAssets({ 'sys.id[in]': assetIds, locale })
            : { items: [] },
        ])
        const entities = [...entriesResponse.items, ...assetsResponse.items]
        setEntityStore(new EntityStore({ entities }))
      } catch (e: any) {
        handleError(errorMessagesWhileFetching.experienceReferences, e)
      } finally {
        setIsLoading(false)
      }
    },
    [client, handleError]
  )

  /**
   * Fetch experience entry using slug as the identifier
   * @param {string} experienceTypeId - id of the content type associated with the experience
   * @param {string} slug - slug of the experience (defined in entry settings)
   * @param {string} localeCode - locale code to fetch the experience. Falls back to the currently active locale in the state
   */
  const fetchBySlug: ExperienceStore['fetchBySlug'] = useCallback(
    async ({ experienceTypeId, slug, localeCode }) => {
      if (!slug) {
        const error = new Error(
          'Preview and delivery mode requires a composition slug to be provided'
        )
        handleError(errorMessagesWhileFetching.experience, error)
        return {
          success: false,
          error,
        }
      }

      if (!localeCode) {
        const error = new Error('Preview and delivery mode requires a locale code to be provided')
        handleError(errorMessagesWhileFetching.experience, error)
        return {
          success: false,
          error,
        }
      }

      setIsLoading(true)

      try {
        const response = await client.getEntries({
          content_type: experienceTypeId,
          'fields.slug': slug,
          locale: localeCode,
        })
        if (response.items.length === 0) {
          const error = new Error(`No experience with slug: ${slug} exists`)
          handleError(errorMessagesWhileFetching.experience, error)

          return {
            success: false,
            error,
          }
        }
        if (response.items.length > 1) {
          const error = new Error(`More than one experience with slug: ${slug} was found`)
          handleError(errorMessagesWhileFetching.experience, error)
          return {
            success: false,
            error,
          }
        }
        const experience = response.items[0].fields as unknown as Composition
        setComposition(experience)
        await fetchReferencedEntities({ composition: experience, locale: localeCode })
        return {
          success: true,
        }
      } catch (e: any) {
        handleError(errorMessagesWhileFetching.experience, e)
        return {
          success: false,
          error: e,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [client, handleError, fetchReferencedEntities]
  )

  return useMemo<ExperienceStore>(
    () => ({
      composition,
      children,
      breakpoints,
      schemaVersion,
      dataSource,
      unboundValues,
      entityStore,
      fetchBySlug,
      isLoading,
    }),
    [
      composition,
      children,
      breakpoints,
      schemaVersion,
      dataSource,
      unboundValues,
      entityStore,
      isLoading,
      fetchBySlug,
    ]
  )
}
