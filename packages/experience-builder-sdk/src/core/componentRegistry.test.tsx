import React from 'react'
import {
  resetComponentRegistry,
  defineComponents,
  getComponentRegistration,
} from './componentRegistry'
import { INTERNAL_EVENTS } from '../constants'
import { CONTENTFUL_SECTION_ID } from '../constants'
import { containerDefinition } from './definitions/components'

jest.mock('../core/constants', () => ({
  SDK_VERSION: '0.0.0-test',
  __esModule: true,
}))

const TestComponent = () => {
  return <div data-test-id="test">Test</div>
}

describe('component registration', () => {
  afterEach(() => {
    resetComponentRegistry()
  })

  describe('getComponentRegistration', () => {
    it('should return undefined if requested id is not registered', () => {
      expect(getComponentRegistration('random-str')).toBe(undefined)
    })

    it('should return container when given a section id', () => {
      expect(getComponentRegistration(CONTENTFUL_SECTION_ID)?.definition).toEqual(
        containerDefinition
      )
    })
  })

  describe('defineComponents (many at once)', () => {
    it('should emit the registered components event', () => {
      jest.spyOn(window, 'dispatchEvent')

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
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        new CustomEvent(INTERNAL_EVENTS.ComponentsRegistered)
      )
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
})
