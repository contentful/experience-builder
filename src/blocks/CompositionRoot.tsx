import React from 'react'
import { Experience, ExperienceBuilderSettings } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { useContentfulSection } from '../hooks/useContentfulSection'
import { supportedModes } from '../constants'

type CompositionRootProps = {
  settings: ExperienceBuilderSettings;
  experience: Experience;
}

export const CompositionRoot = (props: CompositionRootProps) => {
  const { mode } = props.settings

  useContentfulSection({ mode });

  if (!mode || !supportedModes.includes(mode)) return null

  if (mode === 'editor') {
    return <VisualEditorRoot settings={props.settings} />
  }

  return (
    <PreviewDeliveryRoot settings={props.settings} experience={props.experience} />
  )
}
