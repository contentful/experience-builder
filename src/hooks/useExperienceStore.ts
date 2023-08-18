import { ContentfulClientApi } from 'contentful'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { EntityStore } from '../core/EntityStore'
import { Composition, Experience, } from '../types'

interface FetchCompositionProps {
  experienceTypeId: string
  slug: string
  localeCode?: string
}

type UseExperienceStoreProps = {
  locale: string;
  client: ContentfulClientApi<undefined>;
};

export const useExperienceStore = ({ locale, client }: UseExperienceStoreProps): Experience => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const [entityStore, setEntityStore] = useState<EntityStore>()
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const children = composition?.componentTree?.children ?? []
  const breakpoints = composition?.componentTree?.breakpoints ?? []
  const schemaVersion = composition?.componentTree?.schemaVersion
  const dataSource = composition?.dataSource ?? {}
  const unboundValues = composition?.unboundValues ?? {}

  const handleError = useCallback((generalMessage: string, error: unknown) => {
    const message = error instanceof Error ? error.message : `Unknown error: ${error}`
    console.error(`${generalMessage} with error: ${message}`)
    setError(message)
    setIsLoading(false)
  }, []);

  /**
   * Fetch experience entry using slug as the identifier
   * @param {string} experienceTypeId - id of the content type associated with the experience
   * @param {string} slug - slug of the experience (defined in entry settings)
   * @param {string} [localeCode] - optional locale code to fetch the experience. Falls back to the currently active locale in the state
   */
  const fetchExperienceBySlug = useCallback(async ({ experienceTypeId, slug, localeCode }: FetchCompositionProps) => {
    try {
      const response = await client.getEntries({
        content_type: experienceTypeId,
        'fields.slug': slug,
        locale: localeCode || locale,
      })
      if (response.items.length === 0) {
        throw new Error(`No composition with slug: ${slug} exists`)
      }
      if (response.items.length > 1) {
        throw new Error(`More than one composition with slug: ${slug} was found`)
      }
      setComposition(response.items[0].fields as unknown as Composition)
    } catch (e: any) {
      handleError('Failed to fetch composition', e)
    }
  }, [locale, client, handleError]);

  useEffect(() => {
    // fetch bound entries
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

    const fetchEntities = async () => {
      try {
        // TODO: investigate why this is being fetched multiple twice
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
        setIsLoading(false)
      } catch (e: any) {
        handleError('Failed to fetch composition entities', e)
      }
    }

    fetchEntities()
  }, [composition, client, locale, handleError])

  return useMemo<Experience>(
    () => ({
      composition,
      children,
      breakpoints,
      schemaVersion,
      dataSource,
      unboundValues,
      entityStore,
      fetchExperienceBySlug,
      error,
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
      error,
      isLoading,
      fetchExperienceBySlug
    ]
  )
}
