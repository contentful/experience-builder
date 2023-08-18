import React, { useEffect } from 'react'
import { Experience, ExperienceBuilderSettings } from '../types'
import { CompositionBlock } from './CompositionBlock'
import { LATEST_SCHEMA_VERSION } from '../constants'
import { useBreakpoints } from '../hooks'

type DeliveryRootProps = {
  settings: ExperienceBuilderSettings
  experience: Experience
}

export const PreviewDeliveryRoot = ({ settings, experience }: DeliveryRootProps) => {
  useEffect(() => {
    if (!experience.composition && settings.slug) {
      experience.fetchCompositionBySlug({
        experienceTypeId: settings.experienceTypeId,
        slug: settings.slug
      });
    }
  }, [experience, settings.experienceTypeId, settings.slug])

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
