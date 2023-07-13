import { useEffect, useRef, useState } from 'react'
import { EntityStore } from '@contentful/visual-sdk'
import { Composition } from '../types'
import { ContentfulClientEntityStore } from '../core/ContentfulClientEntityStore'

interface FetchCompositionProps {
  experienceTypeId: string
  slug: string
  locale: string
  spaceId: string
  environmentId: string
  host?: string
  accessToken: string
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
  schemaVersion: Composition['componentTree']['schemaVersion'] | undefined
}

export const useFetchComposition = ({
  experienceTypeId,
  slug,
  locale,
  spaceId,
  environmentId,
  host,
  accessToken,
}: FetchCompositionProps): FetchedCompositionData => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const entityStore = useRef<ContentfulClientEntityStore>(
    new ContentfulClientEntityStore({
      experienceTypeId,
      spaceId,
      environmentId,
      host,
      accessToken,
      entities: [],
      locale,
    })
  )
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchComposition = async () => {
      try {
        // fetch composition by slug
        const composition = await entityStore.current.fetchComposition(slug)
        setComposition(composition)

        // resolve data for the composition
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

        await Promise.all([
          entityStore.current.fetchEntries(entryIds),
          entityStore.current.fetchAssets(assetIds),
        ])
      } catch (e: any) {
        console.error(`Failed to fetch composition with error: ${e.message}`)
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComposition()
  }, [slug])

  const children = composition?.componentTree?.children ?? []
  const breakpoints = composition?.componentTree?.breakpoints ?? []
  const schemaVersion = composition?.componentTree?.schemaVersion
  const unboundValues = composition?.unboundValues ?? {}
  const dataSource = composition?.dataSource ?? {}

  return {
    composition,
    children,
    breakpoints,
    schemaVersion,
    dataSource,
    unboundValues,
    entityStore: entityStore.current,
    error,
    isLoadingData: isLoading,
  }
}
