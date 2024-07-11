import {
  defineComponents,
  defineBreakpoints,
  defineBehaviors,
} from '@contentful/experiences-sdk-react';
import { Cart } from './components/Cart';
import { shoppingCartBehavior } from '@/StudioExperiences/behaviors/ShoppingCartBehavior';

defineBehaviors([
  {
    definition: {
      id: 'cart',
      name: 'Dyno Shopping Cart Test Behavior',
      description:
        'Dyno hackathon project for injecting behaviors into studio experiences components',
      eventType: 'onClick',
    },
    behavior: shoppingCartBehavior,
  },
]);

defineComponents([
  {
    component: Cart,
    definition: {
      id: 'cart',
      children: true,
      name: 'Cart',
      category: 'Custom Components',
      builtInStyles: [],
      variables: {
        heading: {
          displayName: 'What is this for?',
          type: 'Text',
          defaultValue: 'Lorem ipsum',
        },
      },
    },
    options: {
      wrapComponent: false,
    },
  },
]);

defineBreakpoints([
  {
    id: 'test-desktop',
    query: '*',
    displayName: 'All Sizes',
    previewSize: '100%',
  },
  {
    id: 'test-tablet',
    query: '<982px',
    displayName: 'Tablet',
    previewSize: '820px',
  },
  {
    id: 'test-mobile',
    query: '<360px',
    displayName: 'Mobile',
    previewSize: '390px',
  },
]);
