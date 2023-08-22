import { useEffect, useRef } from 'react'

import { HoverIndicatorHandler } from '../communication/HoverIndicatorHandler'

export const useHoverIndicator = (isDragging: boolean): void => {
  const hoverIndicatorHandler = useRef<HoverIndicatorHandler>(new HoverIndicatorHandler())

  useEffect(() => {
    hoverIndicatorHandler.current.attachEvent()

    return () => {
      hoverIndicatorHandler.current.detachEvent()
    }
  }, [])

	useEffect(() => {
		// Reset cache on drag so we can ensure accuracy of element co-ordinates for the drag and drop indicator
		hoverIndicatorHandler.current.resetCache();
	}, [isDragging])
}
