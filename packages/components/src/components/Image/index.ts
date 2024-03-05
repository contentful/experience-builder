import type { ComponentDefinition } from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';
import { placeholderImage } from '@/utils/constants';

export * from './Image';

export const ImageComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.image.id,
  name: CONTENTFUL_COMPONENTS.image.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: ['cfMargin', 'cfPadding'],
  tooltip: {
    description: 'Drop onto the canvas to upload an image.',
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
  },
};
