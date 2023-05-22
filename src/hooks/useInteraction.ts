import { useCallback, useState } from 'react'
import { useCommunication } from './useCommunication'
import { OutgoingExperienceBuilderEvent } from '../types'

export const useInteraction = () => {
  const { sendMessage } = useCommunication()
  const [isMouseOver, setMouseOver] = useState(false)

  const onMouseOver = useCallback(() => {
    setMouseOver(true)
  }, [])

  const onMouseLeave = useCallback((e: MouseEvent) => {
    setMouseOver(false)
  }, [])

  const onComponentDropped = useCallback(
    ({ node, template }: { node: any; template?: any }) => {
      sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_DROPPED, {
        node,
        template,
      })
    },
    [sendMessage]
  )

  return {
    isMouseOver,
    onMouseOver,
    onMouseLeave,
    onComponentDropped,
  }
}
