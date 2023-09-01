import React from 'react'
import { useComponents } from './hooks'

const TestComponent = () => {
  return null
}

export const Test = () => {
  const { registerComponents } = useComponents()

  registerComponents([
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
