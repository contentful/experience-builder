import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_DEFAULT_CATEGORY,
  CONTENTFUL_TEXT_ID,
  CONTENTFUL_TEXT_NAME,
} from '@contentful/experience-builder-core/constants';
import constants from '@/utils/constants';

export * from './Text';

export const TextComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_TEXT_ID,
  name: CONTENTFUL_TEXT_NAME,
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
  ],
  thumbnailUrl: constants.thumbnails.text,
  variables: {
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
