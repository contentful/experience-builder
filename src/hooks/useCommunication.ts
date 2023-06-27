import { useCallback } from 'react'
import { OutgoingExperienceBuilderEvent, OutgoingMessageParams } from '../types'
import { useCompositionContext } from '../connection/CompositionContext'

export const useCommunication = () => {
  const { channel } = useCompositionContext()
  const sendMessage = useCallback(
    (eventType: OutgoingExperienceBuilderEvent, params: OutgoingMessageParams) => {
      console.debug('SEND MESSAGE', eventType, params)
      channel?.send(eventType, params)
    },
    []
  )

  return {
    sendMessage,
  }
}
