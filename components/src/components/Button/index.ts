import { ComponentDefinition } from '@contentful/experience-builder-types';
import constants from '@/utils/constants';

export * from './Button';

export const ButtonComponentDefinition: ComponentDefinition = {
  id: 'button',
  name: 'Button',
  category: 'Contentful',
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
      displayName: 'URL',
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
