import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experience-builder-core/constants';
import { placeholderImage } from '@/utils/constants';

export * from './Image';

export const ImageComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.image.id,
  name: CONTENTFUL_COMPONENTS.image.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: ['cfMargin', 'cfPadding'],
  tooltip: {
    description: 'Click and drop onto the canvas to upload an image or bind an existing asset.',
  },
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
    },
    src: {
      displayName: 'Image Src',
      type: 'Text',
      defaultValue: placeholderImage,
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
    cfImageAssetOptions: {
      displayName: 'Image Options',
      description: 'Experimenting with options for the image component.',
      type: 'Object',
      group: 'style',
      defaultValue: {
        width: '400px',
        height: '100%',
        objectFit: 'fit',
        objectPosition: 'center center',
        quality: 100,
        sizes: '400px',
      },
    },
  },
};
