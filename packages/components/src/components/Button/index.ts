import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import constants from '@/utils/constants';

export * from './Button';

export const ButtonComponentDefinition: ComponentDefinition = {
  id: 'button',
  name: 'Button',
  category: 'Contentful',
  builtInStyles: [
    'cfHorizontalAlignment',
    'cfVerticalAlignment',
    'cfMargin',
    'cfPadding',
    'cfBackgroundImageAlignment',
    'cfBackgroundColor',
    'cfWidth',
    'cfHeight',
    'cfMaxWidth',
    'cfFlexDirection',
    'cfFlexWrap',
    'cfBorder',
    'cfGap',
    'cfBackgroundImageUrl',
    'cfBackgroundImageScaling',
    'cfBackgroundImageAlignment',
  ],
  thumbnailUrl: constants.thumbnails.button,
  variables: {
    label: {
      displayName: 'Label',
      type: 'Text',
      defaultValue: 'Lorem ipsum',
    },
    url: {
      displayName: 'URL',
      type: 'Text',
      defaultValue: '/',
    },
    target: {
      displayName: 'Target',
      type: 'Text',
      defaultValue: '',
    },
    classes: {
      displayName: 'Classes',
      type: 'Text',
      defaultValue: 'cf-button',
      group: 'style',
    },
  },
};
