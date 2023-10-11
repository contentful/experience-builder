import React, { useRef } from 'react'
import { Experience, InternalSDKMode } from '../types'
import { CompositionBlock } from './CompositionBlock'
import { compatibleVersions } from '../constants'
import { useBreakpoints, useEditorModeSwitch, useClientSideFetch } from '../hooks'
// import { usePrevious } from '../hooks/usePrevious'

type DeliveryRootProps = {
  experience: Experience
  locale: string
  mode: InternalSDKMode;
  switchToEditorMode: () => void;
  // slug: string
}

export const PreviewDeliveryRoot = ({ locale, mode, switchToEditorMode, /* slug, */ experience }: DeliveryRootProps) => {
  // const attemptedToFetch = useRef<boolean>(false)
  // const previousLocale = usePrevious(locale)

  const { entityStore } = experience

  useEditorModeSwitch({
    mode,
    switchToEditorMode,
  })

  // const { fetchBySlug, isFetching } = useClientSideFetch({ setEntityStore: experience.setEntityStore })

  // useEffect(() => {
  //   // TODO: Test it, it is crucial
  //   // will make it fetch on each locale change as well as if experience entry hasn't been fetched yet at least once
  //   const shouldFetch = client && (!entityStore && !attemptedToFetch.current) || previousLocale !== locale
  //   // this useEffect is meant to trigger fetching for the first time if it hasn't been done earlier
  //   // if not yet fetched and not fetchin at the moment
  //   if (shouldFetch && !isFetching && slug) {
  //     attemptedToFetch.current = true
  //     fetchBySlug({
  //       client,
  //       experienceTypeId,
  //       localeCode: locale,
  //       slug,
  //     })
  //   }
  // }, [
  //   experienceTypeId,
  //   entityStore,
  //   isFetching,
  //   fetchBySlug,
  //   client,
  //   slug,
  //   locale,
  //   previousLocale,
  // ])

  const { resolveDesignValue } = useBreakpoints(entityStore?.breakpoints ?? [])

  if (!entityStore?.experienceEntry || !entityStore?.schemaVersion) {
    return null
  }

  if (!compatibleVersions.includes(entityStore.schemaVersion)) {
    console.warn(
      `[exp-builder.sdk] Contenful composition schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`
    )
    return null
  }

  return (
    <>
      {entityStore.experienceEntry.componentTree.children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          locale={locale}
          entityStore={entityStore}
          dataSource={entityStore.dataSource}
          unboundValues={entityStore.unboundValues}
          breakpoints={entityStore.breakpoints}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  )
}
