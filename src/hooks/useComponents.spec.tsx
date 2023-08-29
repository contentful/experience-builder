import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { resetComponentRegistry, useComponents, getComponentRegistration } from './useComponents'
import { ComponentDefinition, OutgoingExperienceBuilderEvent } from '../types'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'

jest.mock('../core/constants', () => ({
  VITE_SDK_VERSION: '0.0.0-test',
}))

const TestComponent = () => {
  return <div data-test-id="test">Test</div>
}

describe('ComponentDefinitions', () => {
  afterEach(() => {
    resetComponentRegistry()
  })

  describe('defineComponents (many at once)', () => {
    it('should send the component definition via postMessage', () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const postMessageSpy = jest.spyOn(window.parent, 'postMessage')

      const definitionId = 'TestComponent'

      result.current.defineComponents([
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

      const componentRegistration = getComponentRegistration(definitionId)
      expect(componentRegistration).toBeDefined()

      expect(postMessageSpy).toBeCalledTimes(1)
      const eventData = postMessageSpy.mock.calls[0][0]

      expect(eventData.eventType).toBe(OutgoingExperienceBuilderEvent.CONNECTED)
      expect(eventData.payload.definitions).toHaveLength(3) // 2 default components (Section, Container) + this new one
      expect(
        eventData.payload.definitions.find(
          (definition: ComponentDefinition) => definition.id == definitionId
        )
      ).toBeDefined()
    })

    it('should apply fallback to group: content for variables that have it undefined', () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const definitionId = 'TestComponent'

      result.current.defineComponents([
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

      const componentRegistration = getComponentRegistration(definitionId)
      expect(componentRegistration).toBeDefined()

      for (const variable of Object.values(componentRegistration!.definition.variables)) {
        expect(variable.group).toBe('content')
      }
    })

    it('should add default built-in style variables', () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const definitionId = 'TestComponent-1'

      result.current.defineComponents([
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

      const componentRegistration = getComponentRegistration(definitionId)
      expect(componentRegistration).toBeDefined()

      const variableKeys = Object.keys(componentRegistration!.definition.variables)
      expect(variableKeys).toContain('cfMargin')
    })

    it('should add specified built-in style variables', () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const definitionId = 'TestComponent-2'

      result.current.defineComponents([
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

      const componentRegistration = getComponentRegistration(definitionId)
      expect(componentRegistration).toBeDefined()

      const variableKeys = Object.keys(componentRegistration!.definition.variables)
      expect(variableKeys).toContain('cfPadding')
      expect(variableKeys).toContain('cfBorder')
      expect(variableKeys).not.toContain('cfMargin')
    })

    it('should apply fallback to group: content for variables that have it undefined', () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const definitionId = 'TestComponent'

      result.current.defineComponents([
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

      const definition = getComponentRegistration(definitionId)
      expect(definition).toBeDefined()

      for (const variable of Object.values(definition!.definition.variables)) {
        expect(variable.group).toBe('content')
      }
    })
  })
  describe('defineComponent (one at a time - batched)', () => {
    it('should send the component definition via postMessage', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const postMessageSpy = jest.spyOn(window.parent, 'postMessage')

      const definitionId = 'TestComponent'

      result.current.defineComponent(TestComponent, {
        id: definitionId,
        name: 'TestComponent',
        builtInStyles: [],
        variables: {
          isChecked: {
            type: 'Boolean',
          },
        },
      })
      expect(postMessageSpy).not.toHaveBeenCalled()

      result.current.defineComponent(() => <div></div>, {
        id: 'test-div-component',
        name: 'TestDivComponent',
        builtInStyles: [],
        variables: {
          isChecked: {
            type: 'Boolean',
          },
        },
      })
      expect(postMessageSpy).not.toHaveBeenCalled()

      expect(getComponentRegistration(definitionId)).toBeDefined()
      expect(getComponentRegistration('test-div-component')).toBeDefined()

      // waiting cause it is a debounced call
      await waitFor(() => expect(postMessageSpy).toHaveBeenCalled())

      expect(postMessageSpy).toHaveBeenCalledTimes(1)
      const eventData = postMessageSpy.mock.calls[0][0]

      expect(eventData.eventType).toBe(OutgoingExperienceBuilderEvent.CONNECTED)
      expect(eventData.payload.definitions).toHaveLength(4) // 2 default components (Section, Container) + 2 new ones
      expect(
        eventData.payload.definitions.map((definition: ComponentDefinition) => definition.id)
      ).toEqual([
        CONTENTFUL_SECTION_ID,
        CONTENTFUL_CONTAINER_ID,
        definitionId,
        'test-div-component',
      ])
    })

    it('should apply fallback to group: content for variables that have it undefined', () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const definitionId = 'TestComponent'

      result.current.defineComponent(TestComponent, {
        id: definitionId,
        name: 'TestComponent',
        builtInStyles: [],
        variables: {
          isChecked: {
            type: 'Boolean',
          },
        },
      })

      const definition = getComponentRegistration(definitionId)
      expect(definition).toBeDefined()

      for (const variable of Object.values(definition!.definition.variables)) {
        expect(variable.group).toBe('content')
      }
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

      const definition = getComponentRegistration(definitionId)
      expect(definition).toBeDefined()

      const variableKeys = Object.keys(definition!.definition.variables)
      expect(variableKeys).toContain('cfMargin')
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

      const definition = getComponentRegistration(definitionId)
      expect(definition).toBeDefined()

      const variableKeys = Object.keys(definition!.definition.variables)
      expect(variableKeys).toContain('cfPadding')
      expect(variableKeys).toContain('cfBorder')
      expect(variableKeys).not.toContain('cfMargin')
    })

    it('should apply fallback to group: content for variables that have it undefined', () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      const definitionId = 'TestComponent'

      result.current.defineComponent(TestComponent, {
        id: definitionId,
        name: 'TestComponent',
        builtInStyles: [],
        variables: {
          isChecked: {
            type: 'Boolean',
          },
        },
      })

      const definition = getComponentRegistration(definitionId)
      expect(definition).toBeDefined()

      for (const variable of Object.values(definition!.definition.variables)) {
        expect(variable.group).toBe('content')
      }
    })
  })
})
