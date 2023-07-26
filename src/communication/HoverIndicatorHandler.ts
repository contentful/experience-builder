import {
  Coordinates,
  HoveredElement,
  OutgoingExperienceBuilderEvent,
  RawCoordinates,
} from '../types'
import throttle from 'lodash.throttle'
import { sendMessage } from './sendMessage'

export class HoverIndicatorHandler {
  private getCoordinatesOfElement(element: HTMLElement | Element): RawCoordinates {
    const { left, top, width, height } = element.getBoundingClientRect()
    const { pageXOffset, pageYOffset } = window

    return {
      left: left + pageXOffset,
      top: top + pageYOffset,
      width,
      height,
    }
  }

  private getFullCoordinates = (element: HTMLElement, event: MouseEvent) => {
    const rawCoordinates = this.getCoordinatesOfElement(element)
    const { left, top } = element.getBoundingClientRect()

    const childrenCoordinates: RawCoordinates[] = Array.from(element.children)
      .filter((child) => child.id !== 'SectionTooltip')
      .map((child) => this.getCoordinatesOfElement(child))

    return {
      ...rawCoordinates,
      childrenCoordinates,
    }
  }

  handleMouseMove = (event: MouseEvent): void => {
    let coordinates: Coordinates | null = null
    let parentElement: HoveredElement | null = null
    let hoveredElement: HoveredElement | null = null
    let parentSectionIndex: number = -1
    let mousePosInTarget: { x: number; y: number } = { x: 0, y: 0 }

    let target = event.target as HTMLElement | null

    if (target?.id === 'VisualEditorRoot' || target?.tagName === 'BODY') {
      const rootElement = document.getElementById('VisualEditorRoot')
      hoveredElement = {
        nodeId: 'root',
        blockType: 'root',
        blockId: 'root',
      }
      if (rootElement) {
        coordinates = this.getFullCoordinates(rootElement, event)
      }
    } else {
      // Find the closest contentful container or direct parent that is a contentful container
      while (target) {
        if (
          // is itself a section?
          target.dataset.cfNodeId ||
          // Or a direct child of a section
          (target.parentElement && target.parentElement.dataset.cfNodeBlockType === 'block')
        ) {
          coordinates = this.getFullCoordinates(target, event)
          mousePosInTarget.x = event.clientX - coordinates.left
          mousePosInTarget.y = event.clientY - coordinates.top

          const sectionId = target.dataset.cfNodeId
          const sectionBlockId = target.dataset.cfNodeBlockId
          const sectionBlockType = target.dataset.cfNodeBlockType

          let parentHTMLElement: HTMLElement | null = target.parentElement

          // find the next parent that is a section
          while (parentHTMLElement) {
            const parentIsRoot = parentHTMLElement.id === 'VisualEditorRoot'
            if (parentHTMLElement.dataset.cfNodeId || parentIsRoot) {
              parentElement = {
                nodeId: parentIsRoot ? 'root' : parentHTMLElement.dataset.cfNodeId,
                blockType: parentHTMLElement.dataset.cfNodeBlockType,
                blockId: parentHTMLElement.dataset.cfNodeBlockId,
              }
              const parentChildrenElements = parentHTMLElement.children
              parentSectionIndex = Array.from(parentChildrenElements).findIndex(
                (child) => child === target
              )
              break
            }
            parentHTMLElement = parentHTMLElement.parentElement
          }

          hoveredElement = {
            nodeId: sectionId,
            blockId: sectionBlockId,
            blockType: sectionBlockType,
          }

          break
        }

        target = target.parentElement
      }
    }

    sendMessage(OutgoingExperienceBuilderEvent.MOUSE_MOVE, {
      hoveredElement,
      parentElement,
      parentSectionIndex,
      mousePosInTarget,
      coordinates,
      clientX: event.clientX,
      clientY: event.clientY,
    })
  }

  throttledMouseMove = (e: MouseEvent) => {}

  attachEvent(): void {
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }
}
