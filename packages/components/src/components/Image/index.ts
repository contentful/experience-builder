import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';
import { constants } from '@/utils/constants';

export * from './Image';

export const ImageComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.image.id,
  name: CONTENTFUL_COMPONENTS.image.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: [
    'cfMargin',
    'cfPadding',
    'cfImageAsset',
    'cfImageWidth',
    'cfImageHeight',
    'cfImageFormat',
    'cfImageObjectFit',
    'cfImageObjectPosition',
    'cfImageQuality',
    'cfImageSizes',
  ],
  thumbnailUrl: constants.thumbnails.image,
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
      description: 'Alternative text for the image',
    },
  },
};
