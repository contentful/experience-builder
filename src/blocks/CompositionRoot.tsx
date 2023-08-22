import React from 'react'
import { CompositionMode, Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { useContentfulSection } from '../hooks/useContentfulSection'

type CompositionRootProps = {
  experience: Experience
  locale: string
  slug?: string
}

const supportedModes: CompositionMode[] = ['delivery', 'preview', 'editor']

export const CompositionRoot = (props: CompositionRootProps) => {
  const { mode } = props.experience

  useContentfulSection()

  if (!mode || !supportedModes.includes(mode)) return null

  if (mode === 'editor') {
    return <VisualEditorRoot experience={props.experience} locale={props.locale} />
  }

  return (
    <PreviewDeliveryRoot experience={props.experience} locale={props.locale} slug={props.slug} />
  )
}
