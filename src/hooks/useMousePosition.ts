import { useEffect, useRef, useState } from 'react'

const BORDER_DETECTION_SPACE = 45

// This hook keeps track of the mouse position on an element
// To use it simply attach the provided componentRef onto an element
export const useMousePosition = (onExternalMouseMove?: (e: MouseEvent) => void) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const [componentHeight, setComponentHeight] = useState<number>(0)
  const [componentWidth, setComponentWidth] = useState<number>(0)
  const [mouseInUpperHalf, setMouseInUpperHalf] = useState<boolean>(false)
  const [mouseInLeftHalf, setMouseInLeftHalf] = useState<boolean>(false)
  const [mouseAtTopBorder, setMouseAtTopBorder] = useState<boolean>(false)
  const [mouseAtBottomBorder, setMouseAtBottomBorder] = useState<boolean>(false)
  const [targetIsComponent, setTargetIsComponent] = useState<boolean>(false)

  useEffect(() => {
    // This code ensures that we can keep track of the real size of the element in the DOM
    const observer = new ResizeObserver((entries) => {
      const newHeight = entries[0].target.clientHeight
      const newWidth = entries[0].target.clientWidth
      if (newHeight !== componentHeight) {
        setComponentHeight(newHeight)
      }
      if (newWidth !== componentWidth) {
        setComponentWidth(newWidth)
      }
    })

    const checkMousePosition = (mouseX: number, mouseY: number) => {
      if (componentRef.current) {
        const { top, height, width } = componentRef.current.getBoundingClientRect()
        // The offset is used to calculate the offset when the element is scrolled
        const offset = mouseY - top

        const isMouseAtTopBorder = offset < BORDER_DETECTION_SPACE
        setMouseAtTopBorder(isMouseAtTopBorder)

        const isMouseAtBottomBorder = offset > height - BORDER_DETECTION_SPACE
        setMouseAtBottomBorder(isMouseAtBottomBorder)

        if (!isMouseAtTopBorder && !isMouseAtBottomBorder) {
          const isMouseInLeftHalf = mouseX < width / 2
          setMouseInLeftHalf(isMouseInLeftHalf)

          const isMouseInUpperHalf = offset < height / 2
          setMouseInUpperHalf(isMouseInUpperHalf)
        } else {
          setMouseInLeftHalf(false)
          setMouseInUpperHalf(false)
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (onExternalMouseMove) {
        onExternalMouseMove(e)
      }
      setTargetIsComponent(e.target === componentRef.current)
      checkMousePosition(e.clientX, e.clientY)
    }

    if (componentRef.current) {
      componentRef.current.addEventListener('mousemove', onMouseMove)
      observer.observe(componentRef.current)
    }

    return () => {
      if (componentRef.current) {
        componentRef.current.removeEventListener('mousemove', onMouseMove)
      }
      observer.disconnect()
    }
  }, [componentHeight, onExternalMouseMove])

  return {
    mouseInUpperHalf,
    mouseInLeftHalf,
    mouseAtBottomBorder,
    mouseAtTopBorder,
    targetIsComponent,
    componentRef,
  }
}
