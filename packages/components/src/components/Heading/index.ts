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
      description: 'The height of the button.',
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
  },
};
