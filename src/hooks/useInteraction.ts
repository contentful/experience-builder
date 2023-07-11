import { useCallback, useState } from 'react'
import { useCommunication } from './useCommunication'
import {
  CompositionComponentNode,
  DroppedNodeParent,
  OutgoingExperienceBuilderEvent,
} from '../types'

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
    ({ index, parent }: { index?: number; parent: DroppedNodeParent }) => {
      sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_DROPPED, {
        index: index ?? 0,
        parent,
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
