import React from 'react'
import { CompositionMode, Experience, ExperienceBuilderSettings } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { useContentfulSection } from '../hooks/useContentfulSection'

type CompositionRootProps = {
  settings: ExperienceBuilderSettings;
  experience: Experience;
  slug: string;
}

const supportedModes: CompositionMode[] = ['delivery', 'preview', 'editor']

export const CompositionRoot = (props: CompositionRootProps) => {
  const { mode } = props.settings

  useContentfulSection()

  if (!mode || !supportedModes.includes(mode)) return null

  if (mode === 'editor') {
    return <VisualEditorRoot settings={props.settings} />
  }

  return (
    <PreviewDeliveryRoot settings={props.settings} experience={props.experience} slug={props.slug} />
  )
}
