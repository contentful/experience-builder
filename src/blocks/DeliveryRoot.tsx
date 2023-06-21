import React from 'react'
import { Experience } from '../types'
import { EmptyDeliveryContainer } from './EmptyDeliveryContainer'
import { useCheckForExperienceConfig } from '../hooks/useCheckForExperienceConfig'

type DeliveryRootProps = {
  experience: Experience
  locale: string
}

export const DeliveryRoot = ({ experience }: DeliveryRootProps) => {
  const { tree } = experience
  useCheckForExperienceConfig(experience)

  if (!tree?.root.children.length) {
    return React.createElement(EmptyDeliveryContainer)
  }
  // Todo implement preview page
  return <div>Delivery</div>
}
