import React from 'react'
import { renderHook } from '@testing-library/react'
import { useComponents } from './useComponents'

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
      builtInStyles: [],
      variables: {
        // name: {
        //   type: 'Link',
        //   linkType: 'Asset',
        // },
        isChecked: {
          type: 'Boolean',
        },
        // elements: {
        //   type: 'Array',
        //   items: {
        //     linkType: 'Entry',
        //     type: 'Link',
        //   },
        // },
        // elementsSymbol: {
        //   type: 'Array',
        //   items: {
        //     type: 'Symbol',
        //   },
        // },
        // elementsComponent: {
        //   type: 'Array',
        //   items: {
        //     type: 'Component',
        //   },
        // },
      },
    })

    const definition = result.current.getComponent(definitionId)
    expect(definition).toBeDefined()

    for (const variable of Object.values(definition!.componentDefinition.variables)) {
      expect(variable.group).toBe('content')
    }
  })

  it('should add default built-in style variables', () => {
    const { result } = renderHook(() => useComponents())

    const definitionId = 'TestComponent-1'

    result.current.defineComponent(TestComponent, {
      id: definitionId,
      name: 'TestComponent',
      variables: {
        isChecked: {
          type: 'Boolean',
        },
      },
    })

    const definition = result.current.getComponent(definitionId)
    expect(definition).toBeDefined()

    const variableKeys = Object.keys(definition!.componentDefinition.variables)
    expect(variableKeys).toContain('cfMargin')
    expect(variableKeys).toContain('cfWidth')
    expect(variableKeys).toContain('cfHeight')
    expect(variableKeys).toContain('cfMaxWidth')
  })

  it('should add specified built-in style variables', () => {
    const { result } = renderHook(() => useComponents())

    const definitionId = 'TestComponent-2'

    result.current.defineComponent(TestComponent, {
      id: definitionId,
      name: 'TestComponent',
      builtInStyles: ['cfPadding', 'cfBorder'],
      variables: {
        isChecked: {
          type: 'Boolean',
        },
      },
    })

    const definition = result.current.getComponent(definitionId)
    expect(definition).toBeDefined()

    const variableKeys = Object.keys(definition!.componentDefinition.variables)
    expect(variableKeys).toContain('cfPadding')
    expect(variableKeys).toContain('cfBorder')
    expect(variableKeys).not.toContain('cfMargin')
  })
})
