import React from 'react'
import { renderHook } from '@testing-library/react'
import {
  applyBuiltInStyleDefinitions,
  applyComponentDefinitionFallbacks,
  getDefinedComponent,
  resetDefinedComponentsMap,
  useComponents,
} from './useComponents'
import { ComponentDefinition, OutgoingExperienceBuilderEvent } from '../types'
import { sendMessage } from '../communication/sendMessage'

jest.mock('../communication/sendMessage')

const TestComponent = () => {
  return <div data-test-id="test">Test</div>
}

const definitionId = 'TestComponent'
const testComponentDefinition: ComponentDefinition = {
  id: definitionId,
  name: 'TestComponent',
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
}

describe('ComponentDefinitions', () => {
  afterEach(() => {
    resetDefinedComponentsMap()
  })

  it('should apply fallback to group: content for variables that have it undefined', () => {
    const { result } = renderHook(() => useComponents({ mode: 'editor' }))

    result.current.defineComponent(TestComponent, testComponentDefinition)

    const definition = getDefinedComponent(definitionId)
    expect(definition).toBeDefined()
    expect(definition!.componentDefinition.variables.isChecked.group).toBe('content')
  })

  it('should add default built-in style variables', () => {
    const { result } = renderHook(() => useComponents({ mode: 'editor' }))

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

    const definition = getDefinedComponent(definitionId)
    expect(definition).toBeDefined()

    const variableKeys = Object.keys(definition!.componentDefinition.variables)
    expect(variableKeys).toContain('cfMargin')
  })

  it('should return undefined if requested id is not registered', () => {
    expect(getDefinedComponent('random-str')).toBe(undefined)
  })

  it('should overwrite existing definitions if registered a component with the existing id', () => {
    const { result } = renderHook(() => useComponents({ mode: 'editor' }))

    result.current.defineComponent(TestComponent, testComponentDefinition)

    expect(getDefinedComponent(testComponentDefinition.id)).toEqual({
      component: TestComponent,
      componentDefinition: applyBuiltInStyleDefinitions(
        applyComponentDefinitionFallbacks(testComponentDefinition)
      ),
    })

    result.current.defineComponent(TestComponent, {
      ...testComponentDefinition,
      variables: {
        ...testComponentDefinition.variables,
        newVariable: {
          displayName: 'New Variable',
          type: 'Boolean',
          defaultValue: true,
        },
      },
    })
    const newComponentDefinition = getDefinedComponent(testComponentDefinition.id)
    expect(newComponentDefinition).not.toEqual({
      component: TestComponent,
      componentDefinition: applyBuiltInStyleDefinitions(
        applyComponentDefinitionFallbacks(testComponentDefinition)
      ),
    })
    expect(newComponentDefinition?.componentDefinition.variables).toHaveProperty('newVariable')
    expect(newComponentDefinition?.componentDefinition.variables.newVariable).toEqual({
      displayName: 'New Variable',
      type: 'Boolean',
      group: 'content',
      defaultValue: true,
    })
  })

  it('should add specified built-in style variables', () => {
    const { result } = renderHook(() => useComponents({ mode: 'editor' }))

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

    const definition = getDefinedComponent(definitionId)
    expect(definition).toBeDefined()

    const variableKeys = Object.keys(definition!.componentDefinition.variables)
    expect(variableKeys).toContain('cfPadding')
    expect(variableKeys).toContain('cfBorder')
    expect(variableKeys).not.toContain('cfMargin')
  })

  it('should call sendMessage in editor mode', () => {
    const { result } = renderHook(() => useComponents({ mode: 'editor' }))

    result.current.defineComponent(TestComponent, testComponentDefinition)

    expect(sendMessage).toHaveBeenCalledWith(
      OutgoingExperienceBuilderEvent.REGISTERED_COMPONENTS,
      applyBuiltInStyleDefinitions(applyComponentDefinitionFallbacks(testComponentDefinition))
    )
  })

  it('should not call sendMessage in preview mode', () => {
    const { result } = renderHook(() => useComponents({ mode: 'preview' }))

    result.current.defineComponent(TestComponent, testComponentDefinition)

    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('should not call sendMessage in delivery mode', () => {
    const { result } = renderHook(() => useComponents({ mode: 'delivery' }))

    result.current.defineComponent(TestComponent, testComponentDefinition)

    expect(sendMessage).not.toHaveBeenCalled()
  })
})
