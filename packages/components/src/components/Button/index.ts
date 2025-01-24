import type { ComponentDefinition } from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';

export * from './Button';

export const ButtonComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.button.id,
  name: CONTENTFUL_COMPONENTS.button.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: [
    'cfMargin',
    'cfMaxWidth',
    'cfLetterSpacing',
    'cfTextItalic',
    'cfTextUnderline',
    'cfTextBold',
    'cfLineHeight',
    'cfBorder',
    'cfBorderRadius',
  ],
  tooltip: {
    description: 'Drop onto the canvas to add button that can be used to trigger an action.',
  },
  variables: {
    cfFontSize: {
      displayName: 'Font Size',
      type: 'Text',
      group: 'style',
      description: 'The font size of the button.',
      defaultValue: '16px',
    },
    cfFontWeight: {
      displayName: 'Font Weight',
      type: 'Text',
      group: 'style',
      description: 'The font weight of the button.',
      defaultValue: '600',
    },
    cfTextColor: {
      displayName: 'Text Color',
      type: 'Text',
      group: 'style',
      description: 'The text color of the button.',
      defaultValue: 'rgba(255, 255, 255, 1)',
    },
    cfBackgroundColor: {
      displayName: 'Background color',
      type: 'Text',
      group: 'style',
      description: 'The background color of the button.',
      defaultValue: 'rgba(0, 0, 0, 1)',
    },
    cfPadding: {
      displayName: 'Padding',
      type: 'Text',
      group: 'style',
      description: 'The padding of the button.',
      defaultValue: '6px 12px 6px 12px',
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
    cfTextAlign: {
      displayName: 'Text Align',
      type: 'Text',
      group: 'style',
      description: 'The text align of the button.',
      defaultValue: 'center',
    },
    label: {
      displayName: 'Text',
      type: 'Text',
      defaultValue: 'Button',
      validations: {
        bindingSourceType: ['entry', 'manual'],
      },
    },
    url: {
      displayName: 'URL',
      type: 'Hyperlink',
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
