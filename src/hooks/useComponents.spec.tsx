import React from 'react'
import { renderHook } from '@testing-library/react'
import { useComponents } from './useComponentDefinition'

const TestComponent = () => {
  return <div data-test-id="test">Test</div>
}

// TODO: Rewrite test to work with new `useComponentDefinition` or remove
xdescribe('ComponentDefinitions', () => {
  it('should apply fallback to group: content for variables that have it undefined', () => {
    const { result } = renderHook(() => useComponents())

    const definitionId = 'TestComponent'

    result.current.defineComponent(TestComponent, {
      id: definitionId,
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

    const definition = result.current.getComponent(definitionId)
    expect(definition).toBeDefined()

    for (const variable of Object.values(definition!.componentDefinition.variables)) {
      expect(variable.group).toBe('content')
    }
  })
})
