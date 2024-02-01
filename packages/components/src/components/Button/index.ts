import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';
import constants from '@/utils/constants';

export * from './Button';

export const ButtonComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.button.id,
  name: CONTENTFUL_COMPONENTS.button.name,
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
