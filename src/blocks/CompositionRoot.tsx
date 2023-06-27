import React from 'react'
import { VisualEditorRoot } from './VisualEditorRoot'
import { PreviewRoot } from './PreviewRoot'
import { DeliveryRoot } from './DeliveryRoot'
import { useCompositionContext } from '../connection/CompositionContext'

export type CompositionRootProps = {
  slug?: string
}

export const CompositionRoot = ({ slug }: CompositionRootProps) => {
  const { mode } = useCompositionContext()
  if (!mode) return null

  if (mode === 'editor') {
    return <VisualEditorRoot />
  } else if (mode === 'delivery') {
    return <DeliveryRoot slug={slug} />
  } else if (mode === 'preview') {
    return <PreviewRoot slug={slug} />
  } else {
    return <div>Unsupported mode {mode}</div>
  }
}
