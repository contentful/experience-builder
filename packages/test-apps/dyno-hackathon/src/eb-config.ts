import {
  defineComponents,
  defineBehaviors,
  defineBreakpoints,
} from '@contentful/experiences-sdk-react';
import { consoleLogBehavior } from './StudioExperiences/behaviors/consoleLogBehavior';
import { ShoppingCartButton } from './StudioExperiences/customComponents';
1;
defineBehaviors([
  {
    definition: {
      id: 'test-behavior',
      name: 'Test Behavior',
      description: 'Test behavior for the custom component',
      eventType: 'onClick',
    },
    behavior: consoleLogBehavior,
  },
]);

defineComponents([
  {
    component: ShoppingCartButton,
    definition: {
      id: 'shopping-cart-button',
      name: 'Shopping cart button',
      variables: {
        text: {
          displayName: 'Text',
          type: 'Text',
        },
      },
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
