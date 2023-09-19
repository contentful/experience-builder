import { ElementType } from 'react'

import {
  ComponentRegistration,
  ComponentDefinition,
  OutgoingExperienceBuilderEvent,
} from '../types'
import { builtInStyles as builtInStyleDefinitions } from './definitions/variables'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from '../blocks/ContentfulSection'
import { containerDefinition, sectionDefinition } from './definitions/components'
import { SDK_VERSION } from './constants'
import { sendMessage } from '../communication/sendMessage'

const cloneObject = <T>(targetObject: T): T => {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(targetObject)
  }

  return JSON.parse(JSON.stringify(targetObject))
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

const applyComponentDefinitionFallbacks = (componentDefinition: ComponentDefinition) => {
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

export const enrichComponentDefinition = ({
  component,
  definition,
}: ComponentRegistration): ComponentRegistration => {
  const definitionWithFallbacks = applyComponentDefinitionFallbacks(definition)
  const definitionWithBuiltInStyles = applyBuiltInStyleDefinitions(definitionWithFallbacks)
  return {
    component,
    definition: definitionWithBuiltInStyles,
  }
}

export const sendConnectedMessage = () => {
  // Send the definitions (without components) via the connection message to the experience builder
  const registeredDefinitions = Array.from(componentRegistry.values()).map(
    ({ definition }) => definition
  )

  sendMessage(OutgoingExperienceBuilderEvent.CONNECTED, {
    definitions: registeredDefinitions,
    sdkVersion: SDK_VERSION,
  })
}

/**
 * Registers multiple components and their component definitions at once
 * @param componentRegistrations - Array<{ component: ReactElement, definition: ComponentDefinition }>
 * @returns void
 */
export const defineComponents = (componentRegistrations: Array<ComponentRegistration>) => {
  for (const registration of componentRegistrations) {
    // Fill definitions with fallbacks values
    const enrichedComponentRegistration = enrichComponentDefinition(registration)
    componentRegistry.set(
      enrichedComponentRegistration.definition.id,
      enrichedComponentRegistration
    )
  }
}

/**
 * @deprecated please use `defineComponents` function instead
 * @param component - your react component
 * @param definition - the component definition
 * @returns void
 */
export const defineComponent = (component: ElementType, definition: ComponentDefinition) => {
  const enrichedComponentConfig = enrichComponentDefinition({ component, definition })
  componentRegistry.set(enrichedComponentConfig.definition.id, enrichedComponentConfig)
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

export const getComponentRegistration = (id: string) => {
  return componentRegistry.get(id)
}
