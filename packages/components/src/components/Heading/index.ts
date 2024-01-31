import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_DEFAULT_CATEGORY,
  CONTENTFUL_HEADING_ID,
  CONTENTFUL_HEADING_NAME,
} from '@contentful/experience-builder-core/constants';
import constants from '@/utils/constants';

export * from './Heading';

export const HeadingComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_HEADING_ID,
  name: CONTENTFUL_HEADING_NAME,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: [
    'cfMargin',
    'cfPadding',
    'cfFontWeight',
    'cfLetterSpacing',
    'cfTextAlign',
    'cfTextColor',
    'cfTextTransform',
    'cfTextItalic',
    'cfTextUnderline',
    'cfHeight',
    'cfWidth',
    'cfMaxWidth',
    'cfBackgroundColor',
    'cfBorder',
  ],
  thumbnailUrl: constants.thumbnails.heading,
  variables: {
    // Built-in style variables with default values changed
    cfFontSize: {
      displayName: 'Font Size',
      type: 'Text',
      group: 'style',
      description: 'The font size of the heading.',
      defaultValue: '32px',
    },
    cfLineHeight: {
      displayName: 'Line Height',
      type: 'Text',
      group: 'style',
      description: 'The line height of the heading.',
      defaultValue: '48px',
    },
    cfTextBold: {
      displayName: 'Bold',
      type: 'Boolean',
      group: 'style',
      description: 'The text bold of the heading.',
      defaultValue: true,
    },
    // Component specific variables
    text: {
      displayName: 'text',
      type: 'Text',
      description: 'The text to display in the heading.',
      defaultValue: 'Heading',
    },
    type: {
      displayName: 'Type',
      type: 'Text',
      defaultValue: 'h1',
      description:
        'Determines the HTML tag of the heading. Value can be h1, h2, h3, h4, h5, or h6.',
      validations: {
        in: [
          { value: 'h1', displayName: 'H1' },
          { value: 'h2', displayName: 'H2' },
          { value: 'h3', displayName: 'H3' },
          { value: 'h4', displayName: 'H4' },
          { value: 'h5', displayName: 'H5' },
          { value: 'h6', displayName: 'H6' },
        ],
      },
    },
  },
};
