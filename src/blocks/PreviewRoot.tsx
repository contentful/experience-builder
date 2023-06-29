import React from 'react'
import contentful from 'contentful'
import { Experience } from '../types'
import { useCheckForExperienceConfig } from '../hooks/useCheckForExperienceConfig'
import { useFetchComposition } from '../hooks/useFetchComposition'
import { CompositionBlock } from './CompositionBlock'

type PreviewRootProps = {
  experience: Experience
  locale: string
  slug?: string
}

export const PreviewRoot = ({ experience, slug }: PreviewRootProps) => {
  const { spaceId, environmentId, accessToken, locale } = useCheckForExperienceConfig(experience)
  if (!slug) {
    throw new Error('Preview mode requires a composition slug to be provided')
  }

  const client = contentful.createClient({
    space: spaceId as string,
    environment: environmentId as string,
    host: 'preview.flinkly.com',
    accessToken: accessToken as string,
  })

  const { composition, children, dataSource, entityStore } = useFetchComposition({
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
        />
      ))}
    </>
  )
}
