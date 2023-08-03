import { useEffect, useRef } from 'react'

import { HoverIndicatorHandler } from '../communication/HoverIndicatorHandler'

export const useHoverIndicator = (): void => {
  const hoverIndicatorHandler = useRef<HoverIndicatorHandler>(new HoverIndicatorHandler())

  useEffect(() => {
    hoverIndicatorHandler.current.attachEvent()

    return () => {
      hoverIndicatorHandler.current.detachEvent()
    }
  }, [])
}
