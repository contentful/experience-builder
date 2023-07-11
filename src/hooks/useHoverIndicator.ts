import { useCallback, useState } from 'react'
const EDGE_SIZE = 10

export const useHoverIndicator = ({
  direction,
  isTopLevel,
  componentId,
  isDragging,
}: {
  direction: 'vertical' | 'horizontal'
  componentId: string
  isTopLevel: boolean
  isDragging: boolean
}) => {
  const [currentHoveredElement, setCurrentHoveredElement] = useState<HTMLElement | null>(null)
  const [hoveredParentId, setHoveredParentId] = useState<undefined | string>(undefined)
  const [hoveredParentBlockId, setHoveredParentBlockId] = useState<undefined | string>(undefined)
  const [hoveredInsertIndex, setHoveredInsertIndex] = useState<number>(-1)
  const removeHoverIndicator = () => {
    // Remove the previously added sibling div (if any)
    const previousSiblingDiv = document.getElementById('hover-indicator')
    if (previousSiblingDiv) {
      previousSiblingDiv.remove()
    }
  }

  const lineStyles = direction === 'vertical' ? 'lineVertical' : 'lineHorizontal'
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isTopLevel || !isDragging) return
      const hoveredElement = e.target as HTMLElement

      if (hoveredElement.dataset.cfNodeId && hoveredElement.dataset.cfNodeId === componentId) {
        setCurrentHoveredElement(null)
        removeHoverIndicator()
        return
      }

      const hoverIndicator = document.getElementById('hover-indicator')
      const parentId = hoveredElement.parentElement?.dataset.cfNodeId
      const isEditorTool = hoveredElement.dataset.cfEditorTool

      if (
        // Already hovering over the element or its sibling, no action needed
        currentHoveredElement === hoveredElement ||
        hoveredElement === hoverIndicator ||
        // if the parent is not a section we don't want to allow to drop for now
        !parentId ||
        // if the hovered element is an editor tool and not an element inside the tree
        isEditorTool
      ) {
        return
      }

      removeHoverIndicator()

      const { left, width, top, height } = hoveredElement.getBoundingClientRect()
      const offsetX = e.clientX - left
      const offsetY = e.clientY - top
      const isHoveredOnLeft = offsetX < EDGE_SIZE
      const isHoveredOnRight = offsetX > width - EDGE_SIZE
      const isHoveredOnTheTop = offsetY < EDGE_SIZE
      const isHoveredOnTheBottom = offsetY > height - EDGE_SIZE
      // if it is not hovered on some of the edges, remove the hover indicator
      if (!isHoveredOnLeft && !isHoveredOnRight && !isHoveredOnTheTop && !isHoveredOnTheBottom) {
        setCurrentHoveredElement(null)
        removeHoverIndicator()
        return
      }

      // Add a new sibling div to the hovered element
      const siblingDiv = document.createElement('div')
      siblingDiv.id = 'hover-indicator'
      siblingDiv.classList.add('hovered-sibling')

      siblingDiv.classList.add(lineStyles)

      let childIndex = -1

      if (hoveredElement.parentElement?.children && hoveredElement !== hoverIndicator) {
        const childArr = Array.from(hoveredElement.parentElement.children)
        childIndex = childArr.findIndex((child) => child === hoveredElement)
        if (hoveredElement !== hoverIndicator && parentId && childIndex !== -1) {
          const parentBlockId = hoveredElement.parentElement?.dataset.cfNodeBlockId
          setHoveredParentId(parentId)
          setHoveredParentBlockId(parentBlockId)
          setHoveredInsertIndex(
            direction === 'horizontal'
              ? isHoveredOnTheTop
                ? childIndex
                : childIndex + 1
              : isHoveredOnLeft
              ? childIndex
              : childIndex + 1
          )
        }
      }

      if (direction === 'horizontal') {
        hoveredElement.insertAdjacentElement(
          isHoveredOnTheTop ? 'beforebegin' : 'afterend',
          siblingDiv
        )
      } else {
        hoveredElement.insertAdjacentElement(
          isHoveredOnLeft ? 'beforebegin' : 'afterend',
          siblingDiv
        )
      }

      // Update the currently hovered element state
      setCurrentHoveredElement(hoveredElement)
    },
    [direction, isTopLevel, isDragging]
  )

  return {
    onMouseMove,
    removeHoverIndicator,
    hoveredParentId,
    hoveredParentBlockId,
    hoveredInsertIndex,
  }
}
