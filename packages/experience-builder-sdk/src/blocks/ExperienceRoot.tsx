import React from 'react'

import { supportedModes } from '../constants'
import { Experience } from '../types'
import { validateExperienceBuilderConfig } from '../validation'
import { ErrorBoundary } from './ErrorBoundary'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { VisualEditorRoot } from './VisualEditorRoot'

type ExperienceRootProps = {
  experience: Experience
  locale: string
  slug: string
}

export const ExperienceRoot = ({ locale, experience, slug }: ExperienceRootProps) => {
  const { mode } = experience

  validateExperienceBuilderConfig({
    client: experience.client,
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
