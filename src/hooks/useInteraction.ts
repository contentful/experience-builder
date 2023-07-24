import { useCallback } from 'react'
import { useCommunication } from './useCommunication'
import { CompositionComponentNode, OutgoingExperienceBuilderEvent } from '../types'

export const useInteraction = () => {
  const { sendMessage } = useCommunication()

  const onComponentDropped = useCallback(
    ({ node, index }: { node: CompositionComponentNode; index?: number }) => {
      sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_DROPPED, {
        node,
        index: index ?? node.children.length,
      })
    },
    [sendMessage]
  )

  return {
    onComponentDropped,
  }
}
