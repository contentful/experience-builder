import React from 'react'
import { Experience } from '../types'
import { useCheckForExperienceConfig } from '../hooks/useCheckForExperienceConfig'
import { CompositionBlock } from './CompositionBlock'
import { useFetchComposition } from '../hooks/useFetchComposition'
import { LATEST_SCHEMA_VERSION } from '../constants'
import { useBreakpoints } from '../hooks'

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

  const {
    composition,
    children,
    dataSource,
    entityStore,
    unboundValues,
    isLoadingData,
    schemaVersion,
    breakpoints,
  } = useFetchComposition({
    accessToken: accessToken as string,
    environmentId: environmentId as string,
    experienceTypeId: experience.experienceTypeId,
    host: host,
    locale: locale as string,
    slug: slug,
    spaceId: spaceId as string,
  })

  const { resolveDesignValue } = useBreakpoints(breakpoints)

  if (!composition || isLoadingData) {
    return null
  }

  if (schemaVersion !== LATEST_SCHEMA_VERSION) {
    console.warn(
      `[exp-builder.sdk] Contenful composition schema version: ${schemaVersion} does not match the latest schema version: ${LATEST_SCHEMA_VERSION}. Aborting.`
    )
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
          breakpoints={breakpoints}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  )
}
