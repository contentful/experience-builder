import { PostMessageMethods } from '@contentful/visual-sdk'
import { OutgoingExperienceBuilderEvent } from '../types'

export const sendMessage = (eventType: OutgoingExperienceBuilderEvent | PostMessageMethods, data: any) => {
  console.debug('data sent', {
    source: 'customer-app',
    eventType,
    payload: data,
  })
  if (typeof window !== 'undefined') {
    window.parent?.postMessage(
      {
        source: 'customer-app',
        eventType,
        payload: data,
      },
      '*'
    )
  }
}
