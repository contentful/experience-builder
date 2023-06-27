import { useCallback, useState } from 'react'
import { useCommunication } from './useCommunication'
import { CompositionComponentNode, OutgoingExperienceBuilderEvent } from '../types'

export const useInteraction = () => {
  const { sendMessage } = useCommunication()
  const [isMouseOver, setMouseOver] = useState(false)

  const onMouseEnter = useCallback(() => {
    setMouseOver(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseOver(false)
  }, [])

  const onComponentDropped = useCallback(
    ({ node, index }: { node: CompositionComponentNode; index?: number }) => {
      sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_DROPPED, {
        node,
        index: index ?? node.children.length,
      })
    },
    [sendMessage]
  )

  const onComponentRemoved = useCallback(
    (node: CompositionComponentNode) => {
      sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_REMOVED, {
        node,
      })
    },
    [sendMessage]
  )

  return {
    isMouseOver,
    onMouseEnter,
    onMouseLeave,
    onComponentDropped,
    onComponentRemoved,
  }
}
