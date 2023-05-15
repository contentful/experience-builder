import React from 'react'
import { useComponents } from './hooks'
import { ComponentDefinitionVariableArrayItemType, ComponentDefinitionVariableType } from './types'

const TestComponent = () => {
  return null
}

export const Test = () => {
  const { defineComponent } = useComponents()

  defineComponent(TestComponent, {
    id: 'TestComponent',
    name: 'TestComponent',
    variables: {
      name: {
        type: ComponentDefinitionVariableType.LINK,
        linkType: 'Asset',
      },
      isChecked: {
        type: ComponentDefinitionVariableType.BOOLEAN,
      },
      elements: {
        type: ComponentDefinitionVariableType.ARRAY,
        items: {
          linkType: 'Entry',
          type: ComponentDefinitionVariableArrayItemType.LINK,
        },
      },
      elementsSymbol: {
        type: ComponentDefinitionVariableType.ARRAY,
        items: {
          type: ComponentDefinitionVariableArrayItemType.SYMBOL,
        },
      },
      elementsComponent: {
        type: ComponentDefinitionVariableType.ARRAY,
        items: {
          type: ComponentDefinitionVariableArrayItemType.COMPONENT,
        },
      },
    },
  })
  return <div data-test-id="test">Test</div>
}
