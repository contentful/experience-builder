import React from 'react'

import { defineComponents } from './core/componentRegistry'

const TestComponent = () => {
  return null
}

export const Test = () => {
  defineComponents([
    {
      component: TestComponent,
      definition: {
        id: 'TestComponent',
        name: 'TestComponent',
        variables: {
          isChecked: {
            type: 'Boolean',
          },
        },
      },
    },
  ])
  return <div data-test-id="test">Test</div>
}
