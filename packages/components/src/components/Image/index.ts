import type { ComponentDefinition } from '@contentful/experiences-core/types';
import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';

export * from './Image';

export const ImageComponentDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.image.id,
  name: CONTENTFUL_COMPONENTS.image.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  builtInStyles: ['cfMargin', 'cfPadding', 'cfImage'],
  tooltip: {
    description: 'Drop onto the canvas to upload an image.',
  },
  variables: {
    alt: {
      displayName: 'Alt',
      type: 'Text',
      description: 'Alternative text for the image',
    },
  },
};
