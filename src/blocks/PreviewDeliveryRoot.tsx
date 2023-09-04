import React, { useEffect } from 'react'
import { Experience } from '../types'
import { CompositionBlock } from './CompositionBlock'
import { LATEST_SCHEMA_VERSION } from '../constants'
import { useBreakpoints } from '../hooks'
import { usePrevious } from '../hooks/usePrevious'

type DeliveryRootProps = {
  experience: Experience
  locale: string
  slug: string
}

export const PreviewDeliveryRoot = ({ locale, slug, experience }: DeliveryRootProps) => {
  const previousLocale = usePrevious(locale)

  useEffect(() => {
    // TODO: Test it, it is crucial
    const shouldFetch = !experience.store.composition || previousLocale !== locale
    // this useEffect is meant to trigger fetching for the first time if it hasn't been done earlier
    // if not yet fetched and not fetchin at the moment
    if (shouldFetch && !experience.store.isLoading && slug) {
      experience.store.fetchBySlug({
        experienceTypeId: experience.experienceTypeId,
        localeCode: locale,
        slug,
      })
    }
  }, [experience, slug, locale, previousLocale])

  const { resolveDesignValue } = useBreakpoints(experience.store.breakpoints)

  if (!experience.store.composition) {
    return null
  }

  if (experience.store.schemaVersion !== LATEST_SCHEMA_VERSION) {
    console.warn(
      `[exp-builder.sdk] Contenful composition schema version: ${experience.store.schemaVersion} does not match the latest schema version: ${LATEST_SCHEMA_VERSION}. Aborting.`
    )
    return null
  }

  return (
    <>
      {experience.store.children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          locale={locale}
          entityStore={experience.store.entityStore}
          dataSource={experience.store.dataSource}
          unboundValues={experience.store.unboundValues}
          breakpoints={experience.store.breakpoints}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  )
}
