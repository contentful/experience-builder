import React from 'react'
import { Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewRoot } from './PreviewRoot'
import { DeliveryRoot } from './DeliveryRoot'
import { useContentfulSection } from '../hooks/useContentfulSection'

type CompositionRootProps = {
  experience: Experience
  locale: string
  slug?: string
}

const MODE_ROOT_MAP = {
  editor: VisualEditorRoot,
  preview: PreviewRoot,
  delivery: DeliveryRoot,
}

export const CompositionRoot = (props: CompositionRootProps) => {
  const { mode } = props.experience
  if (!mode) return null

  useContentfulSection()

  const Root = MODE_ROOT_MAP[mode]
  return <Root {...props} />
}
