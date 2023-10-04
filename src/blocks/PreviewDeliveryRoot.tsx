import React, { useEffect, useRef } from 'react'
import { Experience } from '../types'
import { CompositionBlock } from './CompositionBlock'
import { compatibleVersions } from '../constants'
import { useBreakpoints, useEditorModeSwitch } from '../hooks'
import { usePrevious } from '../hooks/usePrevious'

type DeliveryRootProps = {
  experience: Experience
  locale: string
  slug: string
}

export const PreviewDeliveryRoot = ({ locale, slug, experience }: DeliveryRootProps) => {
  const attemptedToFetch = useRef<boolean>(false)
  const previousLocale = usePrevious(locale)

  const { mode, switchToEditorMode } = experience
  const { composition, isLoading, fetchBySlug, entityStore } = experience.store

  useEditorModeSwitch({
    mode,
    switchToEditorMode,
  })

  useEffect(() => {
    // TODO: Test it, it is crucial
    // will make it fetch on each locale change as well as if composition hasn't been fetched yet at least once
    const shouldFetch = (!composition && !attemptedToFetch.current) || previousLocale !== locale
    // this useEffect is meant to trigger fetching for the first time if it hasn't been done earlier
    // if not yet fetched and not fetchin at the moment
    if (shouldFetch && !isLoading && slug) {
      attemptedToFetch.current = true
      fetchBySlug({
        experienceTypeId: experience.experienceTypeId,
        localeCode: locale,
        slug,
      })
    }
  }, [
    experience.experienceTypeId,
    composition,
    isLoading,
    fetchBySlug,
    slug,
    locale,
    previousLocale,
  ])

  const { resolveDesignValue } = useBreakpoints(experience.store.breakpoints)

  if (!experience.store.composition || !experience.store.schemaVersion) {
    return null
  }

  if (!compatibleVersions.includes(experience.store.schemaVersion)) {
    console.warn(
      `[exp-builder.sdk] Contenful composition schema version: ${experience.store.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`
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
          entityStore={entityStore}
          dataSource={experience.store.dataSource}
          unboundValues={experience.store.unboundValues}
          breakpoints={experience.store.breakpoints}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  )
}
