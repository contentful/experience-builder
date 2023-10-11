import React from 'react'
import { Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { supportedModes } from '../constants'
import { validateExperienceBuilderConfig } from '../validation'
import { ErrorBoundary } from './ErrorBoundary'

type ExperienceRootProps = {
  experience: Experience
  locale: string
  slug: string
}

export const ExperienceRoot = ({ locale, experience, slug }: ExperienceRootProps) => {
  const { mode } = experience

  validateExperienceBuilderConfig({
    locale,
    mode,
  })

  if (!mode || !supportedModes.includes(mode)) return null

  if (mode === 'editor') {
    return (
      <ErrorBoundary>
        <VisualEditorRoot initialLocale={locale} mode={mode} />
      </ErrorBoundary>
    )
  }

  return <PreviewDeliveryRoot locale={locale} slug={slug} experience={experience} />
}
