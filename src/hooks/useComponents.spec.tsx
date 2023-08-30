import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import {
  resetComponentRegistry,
  useComponents,
  getComponentRegistration,
  enrichComponentDefinition,
} from './useComponents'
import { ComponentDefinition, OutgoingExperienceBuilderEvent } from '../types'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { sendMessage } from '../communication/sendMessage'

jest.mock('../core/constants', () => ({
  SDK_VERSION: '0.0.0-test',
  __esModule: true,
}))

jest.mock('../communication/sendMessage')

const TestComponent = () => {
  return <div data-test-id="test">Test</div>
}

const definitionId = 'TestComponent'
const testComponentDefinition: ComponentDefinition = {
  id: definitionId,
  name: 'TestComponent',
  variables: {
    isChecked: {
      type: 'Boolean',
    },
  },
}

describe('component registration', () => {
  afterEach(() => {
    resetComponentRegistry()
  })

  describe('getComponentRegistration', () => {
    it('should return undefined if requested id is not registered', () => {
      expect(getComponentRegistration('random-str')).toBe(undefined)
    })
  })

  describe('defineComponents (many at once)', () => {
    it('should send the component definition via postMessage', () => {
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

      expect(sendMessage).toBeCalledTimes(1)
      const sendMessageArgs = (sendMessage as jest.Mock).mock.calls[0]

      expect(sendMessageArgs[0]).toBe(OutgoingExperienceBuilderEvent.CONNECTED)
      expect(sendMessageArgs[1].definitions).toHaveLength(3) // 2 default components (Section, Container) + this new one
      expect(
        sendMessageArgs[1].definitions.find(
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

    it('should call sendMessage in editor mode', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      result.current.defineComponents([{ component: TestComponent, definition: testComponentDefinition }])

      const enrichedTestComponentDefinition = enrichComponentDefinition({
        component: TestComponent,
        definition: testComponentDefinition,
      }).definition

      expect(sendMessage).toHaveBeenCalledWith(OutgoingExperienceBuilderEvent.CONNECTED, {
        definitions: [
          getComponentRegistration(CONTENTFUL_SECTION_ID)?.definition,
          getComponentRegistration(CONTENTFUL_CONTAINER_ID)?.definition,
          enrichedTestComponentDefinition,
        ],
        sdkVersion: '0.0.0-test',
      })
    })

    it('should not call sendMessage in preview mode', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'preview' }))

      result.current.defineComponents([{ component: TestComponent, definition: testComponentDefinition }])

      expect(sendMessage).not.toHaveBeenCalled()
    })

    it('should not call sendMessage in delivery mode', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'delivery' }))

      result.current.defineComponents([{ component: TestComponent, definition: testComponentDefinition }])

      expect(sendMessage).not.toHaveBeenCalled()
    })
  })
  describe('defineComponent (one at a time - batched via debounce)', () => {
    it('should send the component definition via postMessage', async () => {
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
      // not called cause it's debounced
      expect(sendMessage).not.toHaveBeenCalled()

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
      // not  called cause it's debounced
      expect(sendMessage).not.toHaveBeenCalled()

      expect(getComponentRegistration(definitionId)).toBeDefined()
      expect(getComponentRegistration('test-div-component')).toBeDefined()

      // waiting for 50ms until the debounced call gets triggered
      await waitFor(() => expect(sendMessage).toHaveBeenCalled())

      expect(sendMessage).toHaveBeenCalledTimes(1)
      const sendMessageArgs = (sendMessage as jest.Mock).mock.calls[0]

      expect(sendMessageArgs[0]).toBe(OutgoingExperienceBuilderEvent.CONNECTED)
      expect(sendMessageArgs[1].definitions).toHaveLength(4) // 2 default components (Section, Container) + 2 new ones
      expect(sendMessageArgs[1].sdkVersion).toBe('0.0.0-test')
      expect(
        sendMessageArgs[1].definitions.map((definition: ComponentDefinition) => definition.id)
      ).toEqual([
        CONTENTFUL_SECTION_ID,
        CONTENTFUL_CONTAINER_ID,
        definitionId,
        'test-div-component',
      ])
    })

    it('should overwrite existing definitions if registered a component with the existing id', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      result.current.defineComponent(TestComponent, testComponentDefinition)

      expect(getComponentRegistration(testComponentDefinition.id)).toEqual(
        enrichComponentDefinition({
          component: TestComponent,
          definition: testComponentDefinition,
        })
      )

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

      const newComponentRegistration = getComponentRegistration(testComponentDefinition.id)
      expect(newComponentRegistration).not.toEqual(
        enrichComponentDefinition({ component: TestComponent, definition: testComponentDefinition })
      )
      expect(newComponentRegistration?.definition.variables).toHaveProperty('newVariable')
      expect(newComponentRegistration?.definition.variables.newVariable).toEqual({
        displayName: 'New Variable',
        type: 'Boolean',
        group: 'content',
        defaultValue: true,
      })
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

    it('should call sendMessage in editor mode', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'editor' }))

      result.current.defineComponent(TestComponent, testComponentDefinition)

      const enrichedTestComponentDefinition = enrichComponentDefinition({
        component: TestComponent,
        definition: testComponentDefinition,
      }).definition

      // async cause sendMessage in this case is debounced
      await waitFor(() => expect(sendMessage).toHaveBeenCalled())

      expect(sendMessage).toHaveBeenCalledWith(OutgoingExperienceBuilderEvent.CONNECTED, {
        definitions: [
          getComponentRegistration(CONTENTFUL_SECTION_ID)?.definition,
          getComponentRegistration(CONTENTFUL_CONTAINER_ID)?.definition,
          enrichedTestComponentDefinition,
        ],
        sdkVersion: '0.0.0-test',
      })
    })

    it('should not call sendMessage in preview mode', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'preview' }))

      result.current.defineComponent(TestComponent, testComponentDefinition)

      try {
        // async cause sendMessage in this case is debounced
        await waitFor(() => expect(sendMessage).toHaveBeenCalled())
      } catch (e) {
        // noop
      }
      expect(sendMessage).not.toHaveBeenCalled()
    })

    it('should not call sendMessage in delivery mode', async () => {
      const { result } = renderHook(() => useComponents({ mode: 'delivery' }))

      result.current.defineComponent(TestComponent, testComponentDefinition)

      try {
        // async cause sendMessage in this case is debounced
        await waitFor(() => expect(sendMessage).toHaveBeenCalled())
      } catch (e) {
        // noop
      }
      expect(sendMessage).not.toHaveBeenCalled()
    })
  })
})
