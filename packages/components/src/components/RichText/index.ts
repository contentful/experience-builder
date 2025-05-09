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
    'cfFontWeight',
    'cfLetterSpacing',
    'cfTextTransform',
    'cfMaxWidth',
    'cfBackgroundColor',
    'cfBorder',
    'cfBorderRadius',
    'cfTextColor',
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
      description: 'The line height of the Rich text.',
      defaultValue: '24px',
    },
    cfTextAlign: {
      displayName: 'Text Align',
      type: 'Text',
      group: 'style',
      description: 'The text alignment of the Rich text.',
      defaultValue: 'center',
    },
    cfWidth: {
      displayName: 'Width',
      type: 'Text',
      group: 'style',
      description: 'The width of the Rich text.',
      defaultValue: 'fit-content',
    },
    cfHeight: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the Rich text.',
      defaultValue: 'fit-content',
    },
    value: {
      displayName: 'Text',
      description: 'The text to display.',
      type: 'RichText',
      validations: {
        bindingSourceType: ['entry', 'manual'],
      },
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
