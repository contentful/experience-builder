import { ElementType, useCallback } from 'react'
import { useCommunication } from './useCommunication'
import { ComponentDefinition } from '../types'

export type ComponentDefinitionWithComponentType = {
  component: ElementType
  componentDefinition: ComponentDefinition
}

const registeredComponentDefinitions: ComponentDefinitionWithComponentType[] = []

export const useComponents = () => {
  const { sendMessage } = useCommunication()

  const defineComponent = useCallback(
    (component: ElementType, parameters: ComponentDefinition) => {
      registeredComponentDefinitions.push({ component, componentDefinition: parameters })
      sendMessage('registeredComponents', parameters)
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
