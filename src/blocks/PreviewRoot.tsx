import React from 'react'
import { Experience } from '../types'
import { useCheckForExperienceConfig } from '../hooks/useCheckForExperienceConfig'

type PreviewRootProps = {
  experience: Experience
  locale: string
}

export const PreviewRoot = ({ experience }: PreviewRootProps) => {
  const { tree } = experience
  useCheckForExperienceConfig(experience)

  if (!tree?.root.children.length) {
    return null
  }

  // Todo implement preview page
  return <div>Preview</div>
}
