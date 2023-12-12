import { ComponentDefinition } from '@contentful/experience-builder-core';
import constants from '@/utils/constants';

export * from './RichText';

export const RichTextComponentDefinition: ComponentDefinition = {
  id: 'richText',
  name: 'RichText',
  category: 'Contentful',
  builtInStyles: ['cfMargin', 'cfPadding'],
  thumbnailUrl: constants.thumbnails.richText,
  variables: {
    value: {
      displayName: 'Value',
      description: 'The text to display.',
      type: 'RichText',
      defaultValue: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
    classes: {
      displayName: 'Classes',
      description: 'Additional CSS classes to apply to the component.',
      type: 'Text',
      defaultValue: 'cf-richtext',
      group: 'style',
    },
  },
};
