import React from 'react'
import contentful from 'contentful'
import { Experience } from '../types'
import { useCheckForExperienceConfig } from '../hooks/useCheckForExperienceConfig'
import { CompositionBlock } from './CompositionBlock'
import { useFetchComposition } from '../hooks/useFetchComposition'

type DeliveryRootProps = {
  experience: Experience
  locale: string
  slug?: string
}

export const PreviewDeliveryRoot = ({ experience, slug }: DeliveryRootProps) => {
  const { spaceId, environmentId, accessToken, locale, host } =
    useCheckForExperienceConfig(experience)

  if (!slug) {
    throw new Error('Preview and delivery mode requires a composition slug to be provided')
  }

  const client = contentful.createClient({
    space: spaceId as string,
    environment: environmentId as string,
    host: host,
    accessToken: accessToken as string,
  })

  const { composition, children, dataSource, entityStore, unboundValues } = useFetchComposition({
    client,
    slug: slug,
    locale: locale as string,
  })

  if (!composition) {
    return null
  }

  return (
    <>
      {children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          locale={locale as string}
          entityStore={entityStore}
          dataSource={dataSource}
          unboundValues={unboundValues}
        />
      ))}
    </>
  )
}
