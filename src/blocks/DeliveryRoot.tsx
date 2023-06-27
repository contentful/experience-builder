import React from 'react'
import contentful from 'contentful'
import { Experience } from '../types'
import { useCheckForExperienceConfig } from '../hooks/useCheckForExperienceConfig'
import { CompositionBlock } from './CompositionBlock'
import { useFetchComposition } from '../hooks/useFetchComposition'

type DeliveryRootProps = {
  experience: Experience
  locale: string
}

export const DeliveryRoot = ({ experience }: DeliveryRootProps) => {
  const { slug, spaceId, environmentId, accessToken, locale } =
    useCheckForExperienceConfig(experience)

  const client = contentful.createClient({
    space: spaceId as string,
    environment: environmentId as string,
    host: 'cdn.flinkly.com',
    accessToken: accessToken as string,
  })

  const { composition, children, dataSource, entityStore } = useFetchComposition({
    client,
    slug: slug as string,
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
        />
      ))}
    </>
  )
}
