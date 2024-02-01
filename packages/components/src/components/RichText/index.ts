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
  builtInStyles: [
    'cfMargin',
    'cfPadding',
    'cfFontWeight',
    'cfLetterSpacing',
    'cfTextTransform',
    'cfMaxWidth',
    'cfBackgroundColor',
    'cfBorder',
  ],
  thumbnailUrl: constants.thumbnails.richText,
  variables: {
    // Built-in style variables with default values changed
    cfLineHeight: {
      displayName: 'Line Height',
      type: 'Text',
      group: 'style',
      description: 'The line height of the heading.',
      defaultValue: '24px',
    },
    cfTextAlign: {
      displayName: 'Text Align',
      type: 'Text',
      group: 'style',
      description: 'The text alignment of the heading.',
      defaultValue: 'center',
    },
    cfWidth: {
      displayName: 'Width',
      type: 'Text',
      group: 'style',
      description: 'The width of the button.',
      defaultValue: 'fit-content',
    },
    cfHeight: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the button.',
      defaultValue: 'fit-content',
    },
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
                value: 'Rich text',
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
  },
};
