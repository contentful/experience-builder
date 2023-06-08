import { useCallback, useState } from 'react'
import { useCommunication } from './useCommunication'
import { CompositionComponentNode, NodeInsertType, OutgoingExperienceBuilderEvent } from '../types'

export const useInteraction = () => {
  const { sendMessage } = useCommunication()
  const [isMouseOver, setMouseOver] = useState(false)

  const onMouseOver = useCallback(() => {
    setMouseOver(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseOver(false)
  }, [])

  const onComponentDropped = useCallback(
    ({
      node,
      template,
      index,
      insertType,
    }: {
      node: any
      template?: any
      index: number
      insertType?: NodeInsertType
    }) => {
      sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_DROPPED, {
        node,
        template,
        index,
        insertType,
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
    onMouseOver,
    onMouseLeave,
    onComponentDropped,
    onComponentRemoved,
  }
}
