import { useCallback, useEffect, useState } from 'react'
import { OutgoingExperienceBuilderEvent, OutgoingMessageParams } from '../types'
import { useCompositionContext } from '../connection/CompositionContext'

export const useCommunication = () => {
  const { channel } = useCompositionContext()
  // Initially, the channel might not be available yet, so we store the message until
  // the channel is ready
  const [buffer, setBuffer] = useState<
    Array<[OutgoingExperienceBuilderEvent, OutgoingMessageParams]>
  >([])

  const sendMessage = useCallback(
    (eventType: OutgoingExperienceBuilderEvent, params: OutgoingMessageParams) => {
      if (!channel) {
        setBuffer((buffer) => [...buffer, [eventType, params]])
      } else {
        channel.send(eventType, params)
      }
    },
    []
  )

  useEffect(() => {
    if (channel) {
      buffer.forEach(([eventType, params]) => {
        channel.send(eventType, params)
      })
      setBuffer([])
    }
  }, [channel])

  return {
    sendMessage,
  }
}
