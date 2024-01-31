import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_IMAGE_ID,
  CONTENTFUL_IMAGE_NAME,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';
import constants from '@/utils/constants';

export * from './Image';

export const ImageComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_IMAGE_ID,
  name: CONTENTFUL_IMAGE_NAME,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: ['cfMargin', 'cfPadding'],
  thumbnailUrl: constants.thumbnails.image,
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
    },
    src: {
      displayName: 'Image Src',
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
