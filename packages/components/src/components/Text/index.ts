import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';
import { constants } from '@/utils/constants';

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
    'cfWidth',
    'cfMaxWidth',
  ],
  thumbnailUrl: constants.thumbnails.text,
  variables: {
    cfHeight: {
      displayName: 'Height',
      type: 'Text',
      group: 'style',
      description: 'The height of the button.',
      defaultValue: 'fit-content',
    },
    value: {
      displayName: 'Value',
      description: 'The text to display. If not provided, children will be used instead.',
      type: 'Text',
      defaultValue: 'Text',
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
    url: {
      displayName: 'URL',
      type: 'Text',
      defaultValue: '',
    },
    target: {
      displayName: 'Target',
      type: 'Text',
      defaultValue: '',
    },
  },
};
