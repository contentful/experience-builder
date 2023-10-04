import { CONTENTFUL_COMPONENT_CATEGORY, CONTENTFUL_CONTAINER_ID } from '../../constants'
import { ComponentDefinition } from '../../types'
import { containerBuiltInStyles } from './variables'

export const containerDefinition: ComponentDefinition = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
}
