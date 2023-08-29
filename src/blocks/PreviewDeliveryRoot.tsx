import React, { useEffect } from 'react'
import { Experience, ExperienceBuilderSettings } from '../types'
import { CompositionBlock } from './CompositionBlock'
import { LATEST_SCHEMA_VERSION } from '../constants'
import { useBreakpoints } from '../hooks'

type DeliveryRootProps = {
  settings: ExperienceBuilderSettings
  experience: Experience;
  slug: string;
}

export const PreviewDeliveryRoot = ({ settings, slug, experience }: DeliveryRootProps) => {
  useEffect(() => {
    if (!slug) {
      throw new Error('Preview and delivery mode requires a composition slug to be provided')
    }

    // if not yet fetched and not fetchin at the moment
    if (!experience.composition && !experience.isLoading && slug) {
      experience.fetchBySlug({
        experienceTypeId: settings.experienceTypeId,
        slug
      });
    }
  }, [experience, settings.experienceTypeId, slug])

  const { resolveDesignValue } = useBreakpoints(experience.breakpoints)

  if (!experience.composition || experience.isLoading) {
    return null
  }

  if (experience.schemaVersion !== LATEST_SCHEMA_VERSION) {
    console.warn(
      `[exp-builder.sdk] Contenful composition schema version: ${experience.schemaVersion} does not match the latest schema version: ${LATEST_SCHEMA_VERSION}. Aborting.`
    )
    return null
  }

  return (
    <>
      {experience.children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          locale={settings.locale}
          entityStore={experience.entityStore}
          dataSource={experience.dataSource}
          unboundValues={experience.unboundValues}
          breakpoints={experience.breakpoints}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  )
}
