import React from 'react'
import { Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { useContentfulSection } from '../hooks/useContentfulSection'
import { supportedModes } from '../constants'
import { validateExperienceBuilderConfig } from '../validation'

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

  useContentfulSection({ mode })

  if (!mode || !supportedModes.includes(mode)) return null

  if (mode === 'editor') {
    return <VisualEditorRoot initialLocale={locale} mode={mode} />
  }

  return <PreviewDeliveryRoot locale={locale} slug={slug} experience={experience} />
}
