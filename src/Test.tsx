import React from 'react'
import { useComponents } from './hooks'

const TestComponent = () => {
  return null
}

// TODO: Rewrite this to work with new way of storing definitions (passing via context)
export const Test = () => {
  const { defineComponent } = useComponents()

  defineComponent(TestComponent, {
    id: 'TestComponent',
    name: 'TestComponent',
    variables: {
      name: {
        type: 'Link',
        linkType: 'Asset',
      },
      isChecked: {
        type: 'Boolean',
      },
      elements: {
        type: 'Array',
        items: {
          linkType: 'Entry',
          type: 'Link',
        },
      },
      elementsSymbol: {
        type: 'Array',
        items: {
          type: 'Symbol',
        },
      },
      elementsComponent: {
        type: 'Array',
        items: {
          type: 'Component',
        },
      },
    },
  })
  return <div data-test-id="test">Test</div>
}
