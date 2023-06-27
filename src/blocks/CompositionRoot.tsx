import React from 'react'
import { VisualEditorRoot } from './VisualEditorRoot'
import { DeliveryRoot } from './DeliveryRoot'
import { useCompositionContext } from '../connection/CompositionContext'

export type CompositionRootProps = {
  slug?: string
}

export const CompositionRoot = ({ slug }: CompositionRootProps) => {
  const { mode, experience } = useCompositionContext()
  if (!mode) return null

  if (!experience) {
    return <div>Loading...</div>
  } else if (mode === 'editor') {
    return <VisualEditorRoot />
  } else if (mode === 'delivery' || mode === 'preview') {
    return <DeliveryRoot slug={slug} />
  } else {
    return <div>Unsupported mode {mode}</div>
  }
}
