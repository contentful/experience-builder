import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import constants from '@/utils/constants';

export * from './Text';

export const TextComponentDefinition: ComponentDefinition = {
  id: 'text',
  name: 'Text',
  category: 'Contentful',
  builtInStyles: [
    'cfMargin',
    'cfPadding',
    'cfFontSize',
    'cfLineHeight',
    'cfLetterSpacing',
    'cfTextColor',
    'cfTextAlign',
    'cfTextTransform',
    'cfTextBold',
    'cfTextItalic',
    'cfTextUnderline',
  ],
  thumbnailUrl: constants.thumbnails.text,
  variables: {
    // Override Font Weight options
    cfFontWeight: {
      validations: {
        in: [
          {
            value: '400',
            displayName: 'Normal',
          },
          {
            value: '500',
            displayName: 'Medium',
          },
          {
            value: '600',
            displayName: 'Semi Bold',
          },
        ],
      },
      displayName: 'Font Weight',
      type: 'Text',
      group: 'style',
      defaultValue: '400',
    },
    value: {
      displayName: 'Value',
      description: 'The text to display. If not provided, children will be used instead.',
      type: 'Text',
      defaultValue: 'Lorem ipsum',
    },
    as: {
      displayName: 'As',
      description: 'Renders the text in a specific HTML tag.',
      type: 'Text',
      defaultValue: 'p',
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
    classes: {
      displayName: 'Classes',
      description: 'Additional CSS classes to apply to the component.',
      type: 'Text',
      defaultValue: 'cf-text',
      group: 'style',
    },
  },
};
