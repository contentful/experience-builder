import React from 'react';
import { ComponentRegistration } from '../../../core/src/types';

export const componentRegistrations: ComponentRegistration[] = [
  {
    definition: {
      id: 'component-1',
      name: 'Component 1',
      variables: {},
    },
    component: (props) => <div {...props}>Block 1</div>,
    options: {
      wrapComponent: false,
    },
  },
  {
    definition: {
      id: 'component-2',
      name: 'Component 2',
      variables: {},
    },
    component: (props) => <div {...props}>Block 2</div>,
    options: {
      wrapComponent: false,
    },
  },
];
