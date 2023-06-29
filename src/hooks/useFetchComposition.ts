import { ContentfulClientApi } from 'contentful'
import { useEffect, useState } from 'react'
import { EntityStore } from '../core/EntityStore'
import { Composition, CompositionDataSource, CompositionNode } from '../types'

interface FetchCompositionProps {
  client: ContentfulClientApi<undefined>
  slug: string
  locale: string
}

export const useFetchComposition = ({ client, slug, locale }: FetchCompositionProps) => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const [children, setChildren] = useState<CompositionNode[]>([])
  const [dataSource, setDataSource] = useState<CompositionDataSource>({})
  const [entityStore, setEntityStore] = useState<EntityStore>()

  useEffect(() => {
    setChildren(composition?.children || [])
    setDataSource(composition?.dataSource || {})
  }, [composition, setChildren, setDataSource])

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
      }
    }

    fetchComposition()
  }, [slug, locale])

  useEffect(() => {
    // fetch bound entries
    const entryIds: string[] = [],
      assetIds: string[] = []
    for (const dataBinding of Object.values(dataSource)) {
      // @ts-expect-error TS thinks sys is undefined
      const sys = dataBinding.sys
      if (!sys) {
        continue
      }
      if (sys.linkType === 'Entry') {
        entryIds.push(sys.id)
      }
      if (sys.linkType === 'Asset') {
        assetIds.push(sys.id)
      }
    }

    const fetchEntities = async () => {
      if (entryIds || assetIds) {
        try {
          const [entriesResponse, assetsResponse] = await Promise.all([
            client.getEntries({ 'sys.id[in]': entryIds, locale }),
            client.getAssets({ 'sys.id[in]': assetIds, locale }),
          ])
          const entities = [...entriesResponse.items, ...assetsResponse.items]
          setEntityStore(new EntityStore({ entities }))
        } catch (e) {
          console.error('Failed to fetch entities with error: ', e)
        }
      }
    }

    fetchEntities()
  }, [dataSource])

  return {
    composition,
    children,
    dataSource,
    entityStore,
  }
}
