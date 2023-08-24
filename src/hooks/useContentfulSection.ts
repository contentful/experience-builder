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
  SectionStyleVariableName,
} from '../types'

export const useContentfulSection = () => {
  const { defineComponent } = useComponents()

  const variables: Record<
    SectionStyleVariableName,
    ComponentDefinitionVariable<'Text' | 'Boolean'>
  > = {
    cfVerticalAlignment: {
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
    cfHorizontalAlignment: {
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
    cfMargin: {
      displayName: 'Margin',
      type: 'Text',
      group: 'style',
      description: 'The margin of the section',
      defaultValue: 0,
    },
    cfPadding: {
      displayName: 'Padding',
      type: 'Text',
      group: 'style',
      description: 'The padding of the section',
      defaultValue: 0,
    },
    cfBackgroundColor: {
      displayName: 'Background',
      type: 'Text',
      group: 'style',
      description: 'The background color of the section',
      defaultValue: 'rgba(255, 255, 255, 1)',
    },
    cfWidth: {
      displayName: 'Width',
      type: 'Text',
      group: 'style',
      description: 'The width of the section',
      defaultValue: 'fill',
    },
    cfHeight: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the section',
      defaultValue: 'fill',
    },
    cfMaxWidth: {
      displayName: 'Max Width',
      type: 'Text',
      group: 'style',
      description: 'The max-width of the section',
      defaultValue: 'fill',
    },
    cfFlexDirection: {
      displayName: 'Direction',
      type: 'Text',
      group: 'style',
      description: 'The orientation of the section',
      defaultValue: 'row',
    },
    cfFlexWrap: {
      displayName: 'Wrap objects',
      type: 'Text',
      group: 'style',
      description: 'Wrap objects',
      defaultValue: 'nowrap',
    },
    cfBorder: {
      displayName: 'Border',
      type: 'Text',
      group: 'style',
      description: 'The border of the section',
      defaultValue: '0',
    },
    cfGap: {
      displayName: 'Gap',
      type: 'Text',
      group: 'style',
      description: 'The spacing between the elements of the section',
      defaultValue: '0px',
    },
    cfBackgroundImageUrl: {
      displayName: 'Background Image',
      type: 'Text',
      description: 'Background image for section or container',
    },
    cfBackgroundImageScaling: {
      displayName: 'Image Scaling',
      type: 'Text',
      group: 'style',
      description: 'Adjust background image to fit, fill or tile the container',
      defaultValue: 'fit',
      validations: {
        in: [
          {
            value: 'fill',
            displayName: 'Fill',
          },
          {
            value: 'fit',
            displayName: 'Fit',
          },
          {
            value: 'tile',
            displayName: 'Tile',
          },
        ],
      },
    },
    cfBackgroundImageAlignment: {
      displayName: 'Alignment',
      type: 'Text',
      group: 'style',
      description: 'Align background image to the edges of the container',
      defaultValue: 'left',
      validations: {
        in: [
          {
            value: 'left',
            displayName: 'Left',
          },
          {
            value: 'right',
            displayName: 'Right',
          },
          {
            value: 'top',
            displayName: 'Top',
          },
          {
            value: 'bottom',
            displayName: 'Bottom',
          },
        ],
      },
    },
    cfHyperlink: {
      displayName: 'Hyperlink',
      type: 'Text',
      defaultValue: '',
      validations: {
        format: 'URL',
      },
      description: 'hyperlink for section or container',
    },
    cfOpenInNewTab: {
      displayName: 'Hyperlink behaviour',
      type: 'Boolean',
      defaultValue: false,
      description: 'To open hyperlink in new Tab or not',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
