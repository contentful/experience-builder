import { ElementType, useCallback } from 'react'
import { useCommunication } from './useCommunication'
import { ComponentDefinition, OutgoingExperienceBuilderEvent } from '../types'

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

const registeredComponentDefinitions: ComponentDefinitionWithComponentType[] = []

export const useComponents = () => {
  const { sendMessage } = useCommunication()

  const defineComponent = useCallback(
    (component: ElementType, parameters: ComponentDefinition) => {
      const definitionWithFallbacks = applyFallbacks(parameters)
      registeredComponentDefinitions.push({
        component,
        componentDefinition: definitionWithFallbacks,
      })
      sendMessage(OutgoingExperienceBuilderEvent.REGISTERED_COMPONENTS, parameters)
    },
    [sendMessage]
  )

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
