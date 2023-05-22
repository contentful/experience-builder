import { useCallback } from 'react'
import { OutgoingExperienceBuilderEvent } from '../types'

export const useCommunication = () => {
  const sendMessage = useCallback((eventType: OutgoingExperienceBuilderEvent, data: any) => {
    console.log('data sent', {
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
  }, [])

  return {
    sendMessage,
  }
}
