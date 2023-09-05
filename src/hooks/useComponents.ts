import { ElementType, useCallback } from 'react'

import {
  ComponentRegistration,
  ComponentDefinition,
  OutgoingExperienceBuilderEvent,
} from '../types'
import { sendMessage } from '../sendMessage'
import { builtInStyles as builtInStyleDefinitions } from '../core/definitions/variables'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from '../blocks/ContentfulSection'
import { containerDefinition, sectionDefinition } from '../core/definitions/components'
import { SDK_VERSION } from '../core/constants'
import debounce from 'lodash.debounce'

const cloneObject = <T>(targetObject: T): T => {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(targetObject)
  }

  return JSON.parse(JSON.stringify(targetObject))
}

const applyFallbacks = (componentDefinition: ComponentDefinition) => {
  const clone = cloneObject(componentDefinition)
  for (const variable of Object.values(clone.variables)) {
    variable.group = variable.group ?? 'content'
  }
  return clone
}

const applyBuiltInStyleDefinitions = (componentDefinition: ComponentDefinition) => {
  if ([CONTENTFUL_SECTION_ID, CONTENTFUL_CONTAINER_ID].includes(componentDefinition.id)) {
    return componentDefinition
  }

  const clone = cloneObject(componentDefinition)

  // set margin built-in style by default
  if (!clone.builtInStyles) {
    clone.builtInStyles = ['cfMargin']
  }

  for (const style of Object.values(clone.builtInStyles || [])) {
    if (builtInStyleDefinitions[style]) {
      clone.variables[style] = builtInStyleDefinitions[style]
    }
  }
  return clone
}

const enrichComponentDefinition = ({
  component,
  definition,
}: ComponentRegistration): ComponentRegistration => {
  const definitionWithFallbacks = applyFallbacks(definition)
  const definitionWithBuiltInStyles = applyBuiltInStyleDefinitions(definitionWithFallbacks)
  return {
    component,
    definition: definitionWithBuiltInStyles,
  }
}

const sendConnectedMessage = (registeredDefinitions: Array<ComponentDefinition>) => {
  sendMessage(OutgoingExperienceBuilderEvent.CONNECTED, {
    definitions: registeredDefinitions,
    sdkVersion: SDK_VERSION,
  })
}

const DEFAULT_COMPONENT_REGISTRATIONS = {
  section: {
    component: ContentfulSection,
    definition: sectionDefinition,
  },
  container: {
    component: ContentfulSection,
    definition: containerDefinition,
  },
} satisfies Record<string, ComponentRegistration>

// pre-filling with the default component registrations
const componentRegistry = new Map<string, ComponentRegistration>([
  [DEFAULT_COMPONENT_REGISTRATIONS.section.definition.id, DEFAULT_COMPONENT_REGISTRATIONS.section],
  [
    DEFAULT_COMPONENT_REGISTRATIONS.container.definition.id,
    DEFAULT_COMPONENT_REGISTRATIONS.container,
  ],
])

const debouncedExecuteBatch = debounce(() => {
  const registeredDefinitions = Array.from(componentRegistry.values()).map(
    ({ definition }) => definition
  )
  sendConnectedMessage(registeredDefinitions)
}, 50)

export const useComponents = () => {
  const defineComponents = useCallback((componentRegistrations: Array<ComponentRegistration>) => {
    for (const registration of componentRegistrations) {
      // Fill definitions with fallbacks values
      const enrichedComponentRegistration = enrichComponentDefinition(registration)
      componentRegistry.set(
        enrichedComponentRegistration.definition.id,
        enrichedComponentRegistration
      )
    }
    // Send the definitions (without components) via the connection message to the experience builder
    const registeredDefinitions = Array.from(componentRegistry.values()).map(
      ({ definition }) => definition
    )
    sendConnectedMessage(registeredDefinitions)
  }, [])

  const defineComponent = useCallback((component: ElementType, definition: ComponentDefinition) => {
    const enrichedComponentConfig = enrichComponentDefinition({ component, definition })
    componentRegistry.set(enrichedComponentConfig.definition.id, enrichedComponentConfig)
    debouncedExecuteBatch()
  }, [])

  const getComponentRegistration = useCallback((id: string) => {
    return componentRegistry.get(id)
  }, [])

  return {
    defineComponent,
    /**
     * Call this method only once to register all components. Any subsequent calls will override
     * the previously registered components.
     */
    defineComponents,
    getComponentRegistration,
  }
}

/**
 * use this function only in tests
 */
export const resetComponentRegistry = () => {
  componentRegistry.clear()
  for (const registration of Object.values(DEFAULT_COMPONENT_REGISTRATIONS)) {
    componentRegistry.set(registration.definition.id, registration)
  }
}
