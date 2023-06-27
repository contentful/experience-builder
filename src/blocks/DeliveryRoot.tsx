import React, { useEffect, useState } from 'react'
import { EmptyDeliveryContainer } from './EmptyDeliveryContainer'
import { useValidatedExperienceConfig } from '../hooks/useValidatedExperienceConfig'
import { useCompositionContext } from '../connection/CompositionContext'
import { CompositionRootProps } from './CompositionRoot'
import { Composition } from '../types'

export const DeliveryRoot = ({ slug }: CompositionRootProps) => {
  const [composition, setComposition] = useState<Composition | undefined>()
  const { experience, client, mode } = useCompositionContext()
  const isPreview = mode === 'preview'

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

  // TODO: implement preview page
  console.debug('Render Delivery Composition', mode, composition)
  if (isPreview) {
    return <div>Preview {slug}</div>
  } else {
    return <div>Delivery {slug}</div>
  }
}
