import { ComponentDefinition } from '@contentful/experience-builder-types';
import constants from '@/utils/constants';

export * from './Image';

export const ImageComponentDefinition: ComponentDefinition = {
  id: 'Image',
  name: 'Image',
  category: 'Contentful',
  builtInStyles: ['cfMargin', 'cfPadding'],
  thumbnailUrl: constants.thumbnails.image,
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
    },
    url: {
      displayName: 'Image Url',
      type: 'Text',
      defaultValue: constants.placeholderImage,
    },
    width: {
      displayName: 'Width',
      type: 'Number',
      group: 'style',
    },
    classes: {
      displayName: 'Classes',
      description: 'Additional CSS classes to apply to the component.',
      type: 'Text',
      defaultValue: 'cf-image',
      group: 'style',
    },
  },
};
