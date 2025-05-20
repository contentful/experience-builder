import type { ComponentRegistration } from '@contentful/experiences-sdk-react';
import { StudioCollection as NaiveCollection } from './Naive';
import { StudioCollection as SimpleCollection } from './Simple';
import { StudioCollection as DummyCollection } from './Dummy';
import { StudioCollection as UsingUtilityCollection } from './UsingUtility';

const naiveRegistration: ComponentRegistration = {
  component: NaiveCollection,
  definition: {
    name: 'Naive Collection',
    id: 'examples-naive-collection',
    category: 'Reference Documentation',
    variables: {
      items: {
        type: 'Array',
      },
    },
  },
};

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

const dummyRegistration: ComponentRegistration = {
  component: DummyCollection,
  definition: {
    name: 'Dummy Collection',
    id: 'examples-dummy-collection',
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
  naiveRegistration,
  simpleRegistration,
  dummyRegistration,
  usingUtilityRegistration,
];
