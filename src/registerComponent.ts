import { sendMessage } from './sendMessage'
import { RegisteredComponentParameters } from './types'

export type RegisteredComponentData = {
  component: any
} & RegisteredComponentParameters

let registeredComponents: RegisteredComponentData[] = []

export function registerComponent() {
  const register = (component: any, parameters: RegisteredComponentParameters) => {
    registeredComponents.push({ component, ...parameters })
    sendMessage('registeredComponents', parameters)
  }

  const getRegistration = (id: string) => {
    return registeredComponents.find((registration) => registration.id === id)
  }

  const reset = () => {
    registeredComponents = []
  }

  return {
    register,
    getRegistration,
    reset,
  }
}
