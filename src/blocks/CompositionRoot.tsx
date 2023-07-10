import React from 'react'
import { Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot'
import { useContentfulSection } from '../hooks/useContentfulSection'

type CompositionRootProps = {
  experience: Experience
  locale: string
  slug?: string
}

const MODE_ROOT_MAP = {
  editor: VisualEditorRoot,
  preview: PreviewDeliveryRoot,
  delivery: PreviewDeliveryRoot,
}

export const CompositionRoot = (props: CompositionRootProps) => {
  const { mode } = props.experience
	
	useContentfulSection()

  if (!mode) return null

  const Root = MODE_ROOT_MAP[mode]
  return <Root {...props} />
}
