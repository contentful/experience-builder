import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';
import constants from '@/utils/constants';

export * from './RichText';

export const RichTextComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.richText.id,
  name: CONTENTFUL_COMPONENTS.richText.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
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
