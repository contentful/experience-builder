import React from 'react'
import { Experience } from '../types'
import { EmptyDeliveryContainer } from './EmptyDeliveryContainer'
import { useCheckForExperienceConfig } from '../hooks/useCheckForExperienceConfig'

type PreviewRootProps = {
  experience: Experience
  locale: string
}

export const PreviewRoot = ({ experience }: PreviewRootProps) => {
  const { tree } = experience
  useCheckForExperienceConfig(experience)

  if (!tree?.root.children.length) {
    return React.createElement(EmptyDeliveryContainer)
  }

  // Todo implement preview page
  return <div>Preview</div>
}
