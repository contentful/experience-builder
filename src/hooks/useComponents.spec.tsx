import React from 'react'
import { renderHook } from '@testing-library/react'
import { useComponents } from './useComponents'

import { ComponentDefinitionVariableArrayItemType, ComponentDefinitionVariableType } from '../types'

const TestComponent = () => {
  return <div data-test-id="test">Test</div>
}

describe('ComponentDefinitions', () => {
  it('should apply fallback to group: content for variables that have it undefined', () => {
    const { result } = renderHook(() => useComponents())

    const definitionId = 'TestComponent'

    result.current.defineComponent(TestComponent, {
      id: definitionId,
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

    const definition = result.current.getComponent(definitionId)
    expect(definition).toBeDefined()

    for (const variable of Object.values(definition!.componentDefinition.variables)) {
      expect(variable.group).toBe('content')
    }
  })
})
