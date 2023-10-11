import React, { useCallback, useState } from 'react'
import { Experience, InternalSDKMode } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { supportedModes } from '../constants'
import { validateExperienceBuilderConfig } from '../validation'
import { ErrorBoundary } from './ErrorBoundary'

type ExperienceRootProps = {
  experience: Experience
  locale: string
  // slug: string
}

export const ExperienceRoot = ({ locale, experience /*, slug */ }: ExperienceRootProps) => {
  const [activeMode, setMode] = useState<InternalSDKMode>(() => {
    if (supportedModes.includes(experience.mode)) {
      return experience.mode
    }

    throw new Error(
      `Unsupported mode provided: ${experience.mode}. Supported values: ${supportedModes}`
    )
  })

  const switchToEditorMode = useCallback(() => {
    setMode('editor')
  }, [])

  validateExperienceBuilderConfig({
    locale,
    mode: activeMode,
  })

  if (!activeMode || !supportedModes.includes(activeMode)) return null

  if (activeMode === 'editor') {
    return (
      <ErrorBoundary>
        <VisualEditorRoot initialLocale={locale} mode={activeMode} />
      </ErrorBoundary>
    );
  }

  return (
    <PreviewDeliveryRoot
      locale={locale}
      mode={activeMode}
      switchToEditorMode={switchToEditorMode}
      /* slug={slug} */ experience={experience}
    />
  )
}
