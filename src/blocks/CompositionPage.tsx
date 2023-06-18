import type { Composition, CompositionDataSource, CompositionNode } from '../types'
import react, { useEffect, useState } from 'react'
import { CompositionBlock } from './CompositionBlock'
import contentful, { Asset, Entry, Link } from 'contentful'

type CompositionPageProps = {
  locale: string
  accessToken: string
  spaceId: string
  environmentId: string
  slug: string
}
export const CompositionPage = ({
  locale,
  accessToken,
  spaceId,
  environmentId,
  slug,
}: CompositionPageProps) => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const [children, setChildren] = useState<CompositionNode[]>([])
  const [dataSource, setDataSource] = useState<CompositionDataSource>({})
  const [entries, setEntries] = useState<Entry[]>([])
  const [assets, setAssets] = useState<Asset[]>([])

  useEffect(() => {
    setChildren(composition?.children || [])
    setDataSource(composition?.dataSource || {})
  }, [composition, setChildren, setDataSource])

  const client = contentful.createClient({
    space: spaceId,
    environment: environmentId,
    host: 'cdn.flinkly.com',
    accessToken,
  })

  useEffect(() => {
    // fetch composition by slug
    client
      .getEntries({ content_type: 'layout', 'fields.slug': slug })
      .then((response) => {
        if (response.items.length === 0) {
          throw new Error(`No composition with slug: ${slug} exists`)
        }
        if (response.items.length > 1) {
          throw new Error(`More than one composition with slug: ${slug} was found`)
        }
        setComposition(response.items[0].fields as Composition)
      })
      .catch(console.error)
  }, [slug])

  useEffect(() => {
    // fetch bound entries
    let entryIds = [],
      assetIds = []
    for (const dataBinding of Object.values(dataSource)) {
      // @ts-expect-error
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

    if (entryIds) {
      client
        .getEntries({ 'sys.id[in]': entryIds })
        .then((response) => {
          setEntries(response.items ? response.items : [])
        })
        .catch(console.error)
    }
    if (assetIds) {
      client
        .getAssets({ 'sys.id[in]': assetIds })
        .then((response) => {
          setAssets(response.items ? response.items : [])
        })
        .catch(console.error)
    }
  }, [dataSource])

  if (!composition) {
    return null
  }

  return (
    <>
      {children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          locale={locale}
          entries={entries}
          assets={assets}
          dataSource={dataSource}
        />
      ))}
    </>
  )
}
