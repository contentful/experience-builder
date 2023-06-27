import React, { useEffect, useState } from 'react'
import { EmptyDeliveryContainer } from './EmptyDeliveryContainer'
import { useValidatedExperienceConfig } from '../hooks/useValidatedExperienceConfig'
import { useCompositionContext } from '../connection/CompositionContext'
import { CompositionRootProps } from './CompositionRoot'
import { Composition } from '../types'

export const DeliveryRoot = ({ slug }: CompositionRootProps) => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const { experience, client } = useCompositionContext()

  useValidatedExperienceConfig(experience)

  useEffect(() => {
    if (!client) return
    // fetch composition by slug
    client
      .getEntries({ content_type: 'layout', 'fields.slug': slug })
      .then((response) => {
        if (response.items.length === 0) {
          throw new Error(`No composition with slug: ${slug} exists`)
        }
        if (response.items.length > 1) {
          throw new Error(`More than one composition with slug: ${slug} was found`)
        }
        setComposition(response.items[0].fields as Composition)
      })
      .catch(console.error)
  }, [client, slug])

  if (!composition) {
    return React.createElement(EmptyDeliveryContainer)
  }

  console.log('Render Delivery Composition', composition)
  // TODO: implement preview page
  return <div>Delivery {slug}</div>
}
