import { useComponents } from './useComponents'
import { ContentfulSection } from '../blocks/ContentfulSection'
import { CONTENTFUL_SECTION_ID } from '../constants'
import { useEffect } from 'react'
import { ContentfulSectionType } from '../types'

export const useContentfulSection = () => {
  const { defineComponent } = useComponents()

  const definition: ContentfulSectionType = {
    id: CONTENTFUL_SECTION_ID,
    name: 'Contentful Section',
    variables: {
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
        type: 'Text',
        group: 'style',
        description: 'The max width of the section',
        defaultValue: 'fill',
      },
      flexDirection: {
        displayName: 'Flex Direction',
        type: 'Text',
        group: 'style',
        description: 'The orientation of the section',
        defaultValue: 'row',
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
    },
    children: true,
  }
  useEffect(() => {
    defineComponent(ContentfulSection, definition)
  }, [])
}
