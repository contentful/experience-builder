import { OutgoingExperienceBuilderEvent } from '../types'

export const sendMessage = (eventType: OutgoingExperienceBuilderEvent, data: any) => {
  if (typeof window === 'undefined') {
    return
  }

  console.debug('data sent', {
    source: 'customer-app',
    eventType,
    payload: data,
  })

  window.parent?.postMessage(
    {
      source: 'customer-app',
      eventType,
      payload: data,
    },
    '*'
  )
}
