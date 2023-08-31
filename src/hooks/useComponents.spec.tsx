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

    result.current.registerComponents([
      {
        component: TestComponent,
        definition: {
          id: definitionId,
          name: 'TestComponent',
          builtInStyles: [],
          variables: {
            isChecked: {
              type: 'Boolean',
            },
          },
        },
      },
    ])

    const componentConfig = result.current.getComponentConfig(definitionId)
    expect(componentConfig).toBeDefined()

    for (const variable of Object.values(componentConfig!.definition.variables)) {
      expect(variable.group).toBe('content')
    }
  })

  it('should add default built-in style variables', () => {
    const { result } = renderHook(() => useComponents())

    const definitionId = 'TestComponent-1'

    result.current.registerComponents([
      {
        component: TestComponent,
        definition: {
          id: definitionId,
          name: 'TestComponent',
          variables: {
            isChecked: {
              type: 'Boolean',
            },
          },
        },
      },
    ])

    const componentConfig = result.current.getComponentConfig(definitionId)
    expect(componentConfig).toBeDefined()

    const variableKeys = Object.keys(componentConfig!.definition.variables)
    expect(variableKeys).toContain('cfMargin')
  })

  it('should add specified built-in style variables', () => {
    const { result } = renderHook(() => useComponents())

    const definitionId = 'TestComponent-2'

    result.current.registerComponents([
      {
        component: TestComponent,
        definition: {
          id: definitionId,
          name: 'TestComponent',
          builtInStyles: ['cfPadding', 'cfBorder'],
          variables: {
            isChecked: {
              type: 'Boolean',
            },
          },
        },
      },
    ])

    const componentConfig = result.current.getComponentConfig(definitionId)
    expect(componentConfig).toBeDefined()

    const variableKeys = Object.keys(componentConfig!.definition.variables)
    expect(variableKeys).toContain('cfPadding')
    expect(variableKeys).toContain('cfBorder')
    expect(variableKeys).not.toContain('cfMargin')
  })
})
