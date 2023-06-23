import { useCallback } from 'react'
import { OutgoingExperienceBuilderEvent } from '../types'
import { useCompositionBuilderContext } from '../connection/CompositionProvider'

export const useCommunication = () => {
  const { channel } = useCompositionBuilderContext()
  const sendMessage = useCallback((eventType: OutgoingExperienceBuilderEvent, data: any) => {
    console.log('SEND MESSAGE', eventType, data)
    channel?.send(eventType, data)
  }, [])

  return {
    sendMessage,
  }
}
