import type { ComponentDefinition } from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';

export * from './Heading';

export const HeadingComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.heading.id,
  name: CONTENTFUL_COMPONENTS.heading.name,
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
    'cfWidth',
    'cfMaxWidth',
    'cfBackgroundColor',
    'cfBorder',
    'cfBorderRadius',
  ],
  tooltip: {
    description: 'Drop onto the canvas to add a heading.',
  },
  variables: {
    // Built-in style variables with default values changed
    cfHeight: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the heading.',
      defaultValue: 'fit-content',
    },
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
      displayName: 'Text',
      type: 'Text',
      description: 'The text to display in the heading.',
      defaultValue: 'Heading',
    },
    type: {
      displayName: 'HTML tag',
      type: 'Text',
      defaultValue: 'h1',
      group: 'style',
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
