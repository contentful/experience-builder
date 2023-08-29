import { ElementType, useCallback } from 'react'

import { ComponentDefinition, CompositionMode, OutgoingExperienceBuilderEvent } from '../types'
import { builtInStyles as builtInStyleDefinitions } from '../core/definitions/variables'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { sendMessage } from '../communication/sendMessage'

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

const registeredComponentDefinitions: Map<string, ComponentDefinitionWithComponentType> = new Map()

type UseComponentsProps = {
  mode: CompositionMode
}

export const useComponents = ({ mode }: UseComponentsProps) => {
  const defineComponent = useCallback(
    (component: ElementType, parameters: ComponentDefinition) => {
      const definitionWithFallbacks = applyFallbacks(parameters)
      const definitionWithBuiltInStyles = applyBuiltInStyleDefinitions(definitionWithFallbacks)

      registeredComponentDefinitions.set(definitionWithFallbacks.id, {
        component,
        componentDefinition: definitionWithBuiltInStyles,
      })

      if (mode === 'editor') {
        sendMessage(
          OutgoingExperienceBuilderEvent.REGISTERED_COMPONENTS,
          definitionWithBuiltInStyles
        )
      }
    },
    [mode]
  )

  return {
    defineComponent,
  }
}

export const getDefinedComponent = (id: string) => {
  return registeredComponentDefinitions.get(id)
}
