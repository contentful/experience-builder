import type { ComponentRegistration } from '@contentful/experiences-sdk-react';
import { StudioCollection as SimpleCollection } from './Simple';
import { StudioCollection as UsingUtilityCollection } from './UsingUtility';

const simpleRegistration: ComponentRegistration = {
  component: SimpleCollection,
  definition: {
    name: 'Simple Collection',
    id: 'examples-simple-collection',
    category: 'Reference Documentation',

    variables: {
      items: {
        type: 'Array',
      },
    },
  },
};

const usingUtilityRegistration: ComponentRegistration = {
  component: UsingUtilityCollection,
  definition: {
    name: 'Using Utility Collection',
    id: 'examples-using-utility',
    category: 'Reference Documentation',

    variables: {
      items: {
        type: 'Array',
      },
    },
  },
};

export const allExampleRegistrations = [
  simpleRegistration,
  usingUtilityRegistration,
];
