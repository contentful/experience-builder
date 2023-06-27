import React from 'react'
import { EmptyDeliveryContainer } from './EmptyDeliveryContainer'
import { useValidatedExperienceConfig } from '../hooks/useValidatedExperienceConfig'
import { useCompositionContext } from '../connection/CompositionContext'
import { CompositionRootProps } from './CompositionRoot'

export const PreviewRoot = ({ slug }: CompositionRootProps) => {
  const { experience } = useCompositionContext()
  useValidatedExperienceConfig(experience)

  if (!experience || !experience.tree?.root.children.length) {
    return React.createElement(EmptyDeliveryContainer)
  }

  // TODO: implement preview page
  return <div>Preview {slug}</div>
}
