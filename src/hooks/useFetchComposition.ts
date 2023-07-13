import { ContentfulClientApi } from 'contentful'
import { useEffect, useState } from 'react'
import { EntityStore } from '../core/EntityStore'
import { Composition } from '../types'

interface FetchCompositionProps {
  client: ContentfulClientApi<undefined>
  slug: string
  locale: string
}

interface FetchedCompositionData {
  composition: Composition | undefined
  entityStore: EntityStore | undefined
  error: string | undefined
  isLoadingData: boolean
  children: Composition['componentTree']['children']
  breakpoints: Composition['componentTree']['breakpoints']
  dataSource: Composition['dataSource']
  unboundValues: Composition['unboundValues']
}

export const useFetchComposition = ({
  client,
  slug,
  locale,
}: FetchCompositionProps): FetchedCompositionData => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const [entityStore, setEntityStore] = useState<EntityStore>()
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const children = composition?.componentTree?.children ?? []
  const breakpoints = composition?.componentTree?.breakpoints ?? []
  const dataSource = composition?.dataSource ?? {}
  const unboundValues = composition?.unboundValues ?? {}

  useEffect(() => {
    // fetch composition by slug
    const fetchComposition = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'layout',
          'fields.slug': slug,
          locale,
        })
        if (response.items.length === 0) {
          throw new Error(`No composition with slug: ${slug} exists`)
        }
        if (response.items.length > 1) {
          throw new Error(`More than one composition with slug: ${slug} was found`)
        }
        setComposition(response.items[0].fields as Composition)
      } catch (e: any) {
        console.error(`Failed to fetch composition with error: ${e.message}`)
        setError(e.message)
        setIsLoading(false)
      }
    }

    fetchComposition()
  }, [slug, locale])

  useEffect(() => {
    // fetch bound entries
    if (!composition || !locale) {
      return
    }

    const entryIds: string[] = [],
      assetIds: string[] = []
    for (const dataBinding of Object.values(dataSource)) {
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
        console.error('Failed to fetch composition entities with error: ', e)
        setError(e.message)
        setIsLoading(false)
      }
    }

    fetchEntities()
  }, [composition, locale])

  return {
    composition,
    children,
    breakpoints,
    dataSource,
    unboundValues,
    entityStore,
    error,
    isLoadingData: isLoading,
  }
}
