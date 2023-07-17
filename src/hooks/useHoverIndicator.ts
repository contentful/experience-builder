import { useEffect, useRef } from 'react'

import { useCommunication } from './useCommunication'
import { HoverIndicatorHandler } from '../communication/HoverIndicatorHandler'

export const useHoverIndicator = (): void => {
  const { sendMessage } = useCommunication()
  const hoverIndicatorHandler = useRef<HoverIndicatorHandler>(
    new HoverIndicatorHandler(sendMessage)
  )

  useEffect(() => {
    hoverIndicatorHandler.current.attachEvent()

    return () => {
      hoverIndicatorHandler.current.detachEvent()
    }
  }, [])
}
