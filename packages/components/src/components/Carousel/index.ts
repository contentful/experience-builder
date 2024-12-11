import {
  CONTENTFUL_COMPONENTS,
  CONTENTFUL_DEFAULT_CATEGORY,
} from '@contentful/experiences-core/constants';
import { ComponentDefinition } from '@contentful/experiences-core/types';

export { Carousel } from './Carousel';

export const carouselDefinition: ComponentDefinition = {
  id: CONTENTFUL_COMPONENTS.carousel.id,
  name: CONTENTFUL_COMPONENTS.carousel.name,
  category: CONTENTFUL_DEFAULT_CATEGORY,
  children: true,
  builtInStyles: [
    'cfPadding',
    'cfMargin',
    'cfHeight',
    'cfWidth',
    'cfMaxWidth',
    'cfBorderRadius',
    'cfBackgroundColor',
    'cfBorder',
  ],
  variables: {},
  tooltip: {
    description: 'Drop onto the canvas to add a carousel.',
  },
};
