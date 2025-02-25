import type { ComponentDefinition } from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';

export * from './Text';

export const TextComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.text.id,
  name: CONTENTFUL_COMPONENTS.text.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: [
    'cfMargin',
    'cfPadding',
    'cfFontSize',
    'cfFontWeight',
    'cfLineHeight',
    'cfLetterSpacing',
    'cfTextColor',
    'cfTextAlign',
    'cfTextTransform',
    'cfTextBold',
    'cfTextItalic',
    'cfTextUnderline',
    'cfBackgroundColor',
    'cfBorder',
    'cfBorderRadius',
    'cfWidth',
    'cfMaxWidth',
  ],
  tooltip: {
    description: 'Drop onto the canvas to add plain text.',
  },
  variables: {
    cfHeight: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the text.',
      defaultValue: 'fit-content',
    },
    value: {
      displayName: 'Text',
      description: 'The text to display. If not provided, children will be used instead.',
      type: 'Text',
      defaultValue: 'Text',
      validations: {
        bindingSourceType: ['manual', 'entry'],
      },
    },
    as: {
      displayName: 'HTML tag',
      description: 'Renders the text in a specific HTML tag.',
      type: 'Text',
      defaultValue: 'p',
      group: 'style',
      validations: {
        in: [
          { value: 'p', displayName: 'p' },
          { value: 'span', displayName: 'span' },
          { value: 'div', displayName: 'div' },
          { value: 'label', displayName: 'label' },
          { value: 'caption', displayName: 'caption' },
          { value: 'small', displayName: 'small' },
          { value: 'strong', displayName: 'strong' },
          { value: 'em', displayName: 'em' },
        ],
      },
    },
    url: {
      displayName: 'URL',
      type: 'Text',
      defaultValue: '',
      validations: {
        bindingSourceType: ['entry', 'experience', 'manual'],
      },
    },
    target: {
      displayName: 'URL behavior',
      type: 'Text',
      defaultValue: '',
    },
  },
};
