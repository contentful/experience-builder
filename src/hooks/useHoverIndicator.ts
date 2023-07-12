import { useEffect, useState } from 'react'

import { useCommunication } from './useCommunication'
import { OutgoingExperienceBuilderEvent } from '../types'

interface Coordinates {
  left: number
  top: number
  width: number
  height: number
  mousePosInTarget: { x: number; y: number }
}

export const useHoverIndicator = () => {
  const { sendMessage } = useCommunication()
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent): void => {
      console.log('MOUSE MOVE 2')
      let target = event.target as HTMLElement | null

      while (target) {
        if (
          // is itself a section?
          target.dataset.cfNodeId ||
          // Or a direct child of a section
          (target.parentElement && target.parentElement.dataset.cfNodeId)
        ) {
          const { left, top, width, height } = target.getBoundingClientRect()
          const { pageXOffset, pageYOffset } = window

          const mouseX = event.clientX - left
          const mouseY = event.clientY - top

          const coordinates: Coordinates = {
            left: left + pageXOffset,
            top: top + pageYOffset,
            mousePosInTarget: { x: mouseX, y: mouseY },
            width,
            height,
          }
          const closestSectionId = target.dataset.cfNodeId
          sendMessage(OutgoingExperienceBuilderEvent.HOVERED_SECTION, {
            closestSectionId,
            coordinates,
          })

          break
        }

        target = target.parentElement
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}
