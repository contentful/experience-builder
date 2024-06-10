import type { ComponentDefinition } from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';

export * from './RichText';

export const RichTextComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.richText.id,
  name: CONTENTFUL_COMPONENTS.richText.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: [
    'cfMargin',
    'cfPadding',
    'cfFontFamily',
    'cfFontWeight',
    'cfLetterSpacing',
    'cfTextTransform',
    'cfMaxWidth',
    'cfBackgroundColor',
    'cfBorder',
    'cfBorderRadius',
  ],
  tooltip: {
    description: 'Drop onto the canvas to add text with Rich text formatting options.',
  },
  variables: {
    // Built-in style variables with default values changed
    cfLineHeight: {
      displayName: 'Line Height',
      type: 'Text',
      group: 'style',
      description: 'The line height of the rich text.',
      defaultValue: '24px',
    },
    cfFontFamily: {
      displayName: 'Font Family',
      type: 'Text',
      group: 'style',
      description: 'The font family of the rich text',
      defaultValue: 'Arial',
    },
    cfTextAlign: {
      displayName: 'Text Align',
      type: 'Text',
      group: 'style',
      description: 'The text alignment of the rich text.',
      defaultValue: 'center',
    },
    cfWidth: {
      displayName: 'Width',
      type: 'Text',
      group: 'style',
      description: 'The width of the rich text.',
      defaultValue: 'fit-content',
    },
    cfHeight: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the rich text.',
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
