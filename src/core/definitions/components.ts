import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
} from '../../constants'
import { ContentfulSectionType } from '../../types'
import { containerBuiltInStyles } from './variables'

export const sectionDefinition: ContentfulSectionType = {
  id: CONTENTFUL_SECTION_ID,
  name: 'Section',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
}

export const containerDefinition: ContentfulSectionType = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: containerBuiltInStyles,
}
