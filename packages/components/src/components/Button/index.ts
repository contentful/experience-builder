import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_BUTTON_ID,
  CONTENTFUL_BUTTON_NAME,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';
import constants from '@/utils/constants';

export * from './Button';

export const ButtonComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_BUTTON_ID,
  name: CONTENTFUL_BUTTON_NAME,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: ['cfMargin', 'cfPadding'],
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
