import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
} from '../../constants'
import { ComponentDefinitionVariable, ContentfulSectionType } from '../../types'
import { builtInStyles } from './variables'

const containerDefaultHeight: ComponentDefinitionVariable<'Text'> = {
	displayName: 'Height',
	type: 'Text' ,
	group: 'style',
	description: 'The height of the section',
	defaultValue: '200px',
}

export const sectionDefinition: ContentfulSectionType = {
  id: CONTENTFUL_SECTION_ID,
  name: 'Section',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: {
		...builtInStyles,
		cfHeight: containerDefaultHeight
	},
}

export const containerDefinition: ContentfulSectionType = {
  id: CONTENTFUL_CONTAINER_ID,
  name: 'Container',
  category: CONTENTFUL_COMPONENT_CATEGORY,
  children: true,
  variables: builtInStyles,
}
