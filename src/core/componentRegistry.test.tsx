import React from 'react'
import {
  resetComponentRegistry,
  defineComponents,
  defineComponent,
  getComponentRegistration,
  enrichComponentDefinition,
} from './componentRegistry'
import { ComponentDefinition } from '../types'

jest.mock('../core/constants', () => ({
  SDK_VERSION: '0.0.0-test',
  __esModule: true,
}))

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
    it('should not send the component definition via postMessage', () => {
      const definitionId = 'TestComponent'

      defineComponents([
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
    })

    it('should apply fallback to group: content for variables that have it undefined', () => {
      const definitionId = 'TestComponent'

      defineComponents([
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
      expect(componentRegistration!.definition.variables.isChecked.group).toBe('content')
    })

    it('should add default built-in style variables', () => {
      const definitionId = 'TestComponent-1'

      defineComponents([
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
      const definitionId = 'TestComponent-2'

      defineComponents([
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
      const definitionId = 'TestComponent'

      defineComponents([
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

  describe('defineComponent (one at a time - batched via debounce)', () => {
    it('should send the component definition via postMessage', async () => {
      const definitionId = 'TestComponent'

      defineComponent(TestComponent, {
        id: definitionId,
        name: 'TestComponent',
        builtInStyles: [],
        variables: {
          isChecked: {
            type: 'Boolean',
          },
        },
      })

      defineComponent(() => <div></div>, {
        id: 'test-div-component',
        name: 'TestDivComponent',
        builtInStyles: [],
        variables: {
          isChecked: {
            type: 'Boolean',
          },
        },
      })

      expect(getComponentRegistration(definitionId)).toBeDefined()
      expect(getComponentRegistration('test-div-component')).toBeDefined()
    })

    it('should overwrite existing definitions if registered a component with the existing id', () => {
      defineComponent(TestComponent, testComponentDefinition)

      expect(getComponentRegistration(testComponentDefinition.id)).toEqual(
        enrichComponentDefinition({
          component: TestComponent,
          definition: testComponentDefinition,
        })
      )

      defineComponent(TestComponent, {
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
      const definitionId = 'TestComponent'

      defineComponent(TestComponent, {
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
      const definitionId = 'TestComponent-1'

      defineComponent(TestComponent, {
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
      const definitionId = 'TestComponent-2'

      defineComponent(TestComponent, {
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
  })
})
