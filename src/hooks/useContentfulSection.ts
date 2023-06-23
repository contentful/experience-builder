import { useComponents } from './useComponents'
import { ContentfulSection } from '../blocks/ContentfulSection'
import {
  CONTENTFUL_COMPONENT_CATEGORY,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
} from '../constants'
import { useEffect } from 'react'
import {
  ComponentDefinitionVariable,
  ContentfulSectionType,
  SECTION_STYLE_ATTRIBUTE_KEY,
} from '../types'

export const useContentfulSection = () => {
  const { defineComponent } = useComponents()

  const variables: Record<SECTION_STYLE_ATTRIBUTE_KEY, ComponentDefinitionVariable<'Text'>> = {
    verticalAlignment: {
      validations: {
        in: [
          {
            value: 'start',
            displayName: 'Align left',
          },
          {
            value: 'center',
            displayName: 'Align center',
          },
          {
            value: 'end',
            displayName: 'Align right',
          },
        ],
      },
      type: 'Text',
      group: 'style',
      description: 'The horizontal alignment of the section',
      defaultValue: 'center',
      displayName: 'Vertical alignment',
    },
    horizontalAlignment: {
      validations: {
        in: [
          {
            value: 'start',
            displayName: 'Align top',
          },
          {
            value: 'center',
            displayName: 'Align center',
          },
          {
            value: 'end',
            displayName: 'Align bottom',
          },
        ],
      },
      type: 'Text',
      group: 'style',
      description: 'The horizontal alignment of the section',
      defaultValue: 'center',
      displayName: 'Horizontal alignment',
    },
    distribution: {
      type: 'Text',
      validations: {
        in: [
          {
            value: 'stacked',
            displayName: 'Stacked',
          },
          {
            value: 'absolute',
            displayName: 'Absolute',
          },
        ],
      },
      group: 'style',
      description: 'Layout distribution',
      defaultValue: 'stacked',
      displayName: 'Distribution',
    },
    margin: {
      displayName: 'Margin',
      type: 'Text',
      group: 'style',
      description: 'The margin of the section',
      defaultValue: '0',
    },
    padding: {
      displayName: 'Padding',
      type: 'Text',
      group: 'style',
      description: 'The padding of the section',
      defaultValue: '0',
    },
    backgroundColor: {
      displayName: 'Background',
      type: 'Text',
      group: 'style',
      description: 'The background color of the section',
      defaultValue: 'transparent',
    },
    width: {
      displayName: 'Width',
      type: 'Text',
      group: 'style',
      description: 'The width of the section',
      defaultValue: 'fill',
    },
    height: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the section',
      defaultValue: 'fill',
    },
    maxWidth: {
      displayName: 'Max Width',
      type: 'Text',
      group: 'style',
      description: 'The max-width of the section',
      defaultValue: 'fill',
    },
    flexDirection: {
      displayName: 'Direction',
      type: 'Text',
      group: 'style',
      description: 'The orientation of the section',
      defaultValue: 'row',
    },
    flexWrap: {
      displayName: 'Wrap objects',
      type: 'Text',
      group: 'style',
      description: 'Wrap objects',
      defaultValue: 'nowrap',
    },
    border: {
      displayName: 'Border',
      type: 'Text',
      group: 'style',
      description: 'The border of the section',
      defaultValue: '0',
    },
    gap: {
      displayName: 'Gap',
      type: 'Text',
      group: 'style',
      description: 'The spacing between the elements of the section',
      defaultValue: '0px',
    },
  }

  const sectionDefinition: ContentfulSectionType = {
    id: CONTENTFUL_SECTION_ID,
    name: 'Section',
    category: CONTENTFUL_COMPONENT_CATEGORY,
    children: true,
    variables,
  }

  const containerDefinition: ContentfulSectionType = {
    id: CONTENTFUL_CONTAINER_ID,
    name: 'Container',
    category: CONTENTFUL_COMPONENT_CATEGORY,
    children: true,
    variables,
  }
  useEffect(() => {
    defineComponent(ContentfulSection, sectionDefinition)
    defineComponent(ContentfulSection, containerDefinition)
  }, [])
}
