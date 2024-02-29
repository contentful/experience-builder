import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';

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
  tooltip: {
    description: 'Click and drop onto the canvas to upload an image or bind an existing asset.',
  },
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
      description: 'Alternative text for the image',
    },
  },
};
