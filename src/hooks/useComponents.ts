import { useCallback, useRef, useState } from 'react'

import { ComponentConfig, ComponentDefinition, OutgoingExperienceBuilderEvent } from '../types'
import { sendMessage } from '../sendMessage'
import { builtInStyles as builtInStyleDefinitions } from '../core/definitions/variables'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from '../blocks/ContentfulSection'
import { containerDefinition, sectionDefinition } from '../core/definitions/components'

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

const enrichComponentDefinition = ({ component, definition }: ComponentConfig): ComponentConfig => {
  const definitionWithFallbacks = applyFallbacks(definition)
  const definitionWithBuiltInStyles = applyBuiltInStyleDefinitions(definitionWithFallbacks)
  return {
    component,
    definition: definitionWithBuiltInStyles,
  }
}

const sendConnectedMessage = (registeredDefinitions: Array<ComponentDefinition>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore -- this is replaced statically by vite with the env variable (becomes undefined if missing)
  const sdkVersion = import.meta.env.VITE_SDK_VERSION
  sendMessage(OutgoingExperienceBuilderEvent.CONNECTED, {
    definitions: registeredDefinitions,
    sdkVersion,
  })
}

const DEFAULT_COMPONENT_DEFINITIONS = [
  {
    component: ContentfulSection,
    definition: sectionDefinition,
  },
  {
    component: ContentfulSection,
    definition: containerDefinition,
  },
] satisfies Array<ComponentConfig>

let registeredComponentConfigs: Array<ComponentConfig> = []

export const useComponents = () => {
  const registerComponents = useCallback((componentConfigs: Array<ComponentConfig>) => {
    // Fill definitions with fallbacks values
    const enrichedComponentConfigs = componentConfigs.map(enrichComponentDefinition)
    // Add default components section and container
    enrichedComponentConfigs.push(...DEFAULT_COMPONENT_DEFINITIONS)
    registeredComponentConfigs = enrichedComponentConfigs
    // Send the definitions (without components) via the connection message to the experience builder
    const registeredDefinitions = enrichedComponentConfigs.map(({ definition }) => definition)
    sendConnectedMessage(registeredDefinitions)
  }, [])

  // Warning: We don't use React state but a global variable. This will only work if `registerComponents`
  // is guaranteed to be executed before `getComponentConfig` as this hook will never re-render if
  // the list of saved configs changes. Ideally, this would be a context that shares a proper state accross
  // all hook instances.
  const getComponentConfig = useCallback((id: string) => {
    return registeredComponentConfigs.find(({ definition }) => definition.id === id)
  }, [])

  return {
    registerComponents,
    getComponentConfig,
  }
}
