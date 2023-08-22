import { ElementType, useCallback } from 'react'

import {
  ComponentDefinition,
  ComponentDefinitionVariable,
  OutgoingExperienceBuilderEvent,
} from '../types'
import { sendMessage } from '../sendMessage'
import { builtInStyles as builtInStyleDefinitions } from '../core/definitions/variables'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'

export type ComponentDefinitionWithComponentType = {
  component: ElementType
  componentDefinition: ComponentDefinition
}

const cloneObject = <T>(targetObject: T): T => {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(targetObject)
  }

  return JSON.parse(JSON.stringify(targetObject))
}

const applyFallbacks = (componentDefinition: ComponentDefinition) => {
  const clone = cloneObject(componentDefinition)
  for (const variable of Object.values(clone.variables)) {
    if (!variable.group) {
      variable.group = 'content'
    }
  }
  return clone
}

const applyBuildInStyleDefinitions = (componentDefinition: ComponentDefinition) => {
  if ([CONTENTFUL_SECTION_ID, CONTENTFUL_CONTAINER_ID].includes(componentDefinition.id)) {
    return componentDefinition
  }

  const clone = cloneObject(componentDefinition)

  // set margin and size built-in styles by default
  if (!clone.builtInStyles) {
    clone.builtInStyles = ['cfMargin', 'cfWidth', 'cfHeight', 'cfMaxWidth']
  }

  for (const style of Object.values(clone.builtInStyles || [])) {
    if (builtInStyleDefinitions[style]) {
      clone.variables[style] = builtInStyleDefinitions[style]
    }
  }
  return clone
}

const registeredComponentDefinitions: ComponentDefinitionWithComponentType[] = []

export const useComponents = () => {
  const defineComponent = useCallback((component: ElementType, parameters: ComponentDefinition) => {
    const definitionWithFallbacks = applyFallbacks(parameters)
    const definitionWithBuiltInStyles = applyBuildInStyleDefinitions(definitionWithFallbacks)

    registeredComponentDefinitions.push({
      component,
      componentDefinition: definitionWithBuiltInStyles,
    })
    sendMessage(OutgoingExperienceBuilderEvent.REGISTERED_COMPONENTS, definitionWithBuiltInStyles)
  }, [])

  const getComponent = useCallback((id: string) => {
    return registeredComponentDefinitions.find(
      (definition) => definition.componentDefinition.id === id
    )
  }, [])

  return {
    defineComponent,
    getComponent,
  }
}
