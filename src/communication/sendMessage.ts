import { OutgoingExperienceBuilderEvent } from '../types'

export const sendMessage = (eventType: OutgoingExperienceBuilderEvent, data: any) => {
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
