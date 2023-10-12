import React from 'react'
import { Experience, InternalSDKMode } from '../types'
import { CompositionBlock } from './CompositionBlock'
import { compatibleVersions } from '../constants'
import { useBreakpoints, useEditorModeSwitch } from '../hooks'

type DeliveryRootProps = {
  experience: Experience
  locale: string
  mode: InternalSDKMode;
  switchToEditorMode: () => void;
}

export const PreviewDeliveryRoot = ({ locale, mode, switchToEditorMode, experience }: DeliveryRootProps) => {
  const { entityStore } = experience

  useEditorModeSwitch({
    mode,
    switchToEditorMode,
  })

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
