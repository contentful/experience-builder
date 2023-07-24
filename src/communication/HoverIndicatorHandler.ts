import {
  Coordinates,
  HoveredElement,
  OutgoingExperienceBuilderEvent,
  RawCoordinates,
} from '../types'

export class HoverIndicatorHandler {
  private sendMessage: (event: OutgoingExperienceBuilderEvent, payload: any) => void

  constructor(sendMessage: (event: OutgoingExperienceBuilderEvent, payload: any) => void) {
    this.sendMessage = sendMessage
  }

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

  handleMouseMove = (event: MouseEvent): void => {
    let target = event.target as HTMLElement | null

    while (target) {
      if (
        // is itself a section?
        target.dataset.cfNodeId ||
        // Or a direct child of a section
        (target.parentElement && target.parentElement.dataset.cfNodeBlockType === 'block')
      ) {
        const rawCoordinates = this.getCoordinatesOfElement(target)
        const { left, top } = target.getBoundingClientRect()

        const mouseX = event.clientX - left
        const mouseY = event.clientY - top

        const childrenCoordinates: RawCoordinates[] = Array.from(target.children)
          .filter((child) => child.id !== 'SectionTooltip')
          .map((child) => this.getCoordinatesOfElement(child))

        const coordinates: Coordinates = {
          ...rawCoordinates,
          childrenCoordinates,
          mousePosInTarget: { x: mouseX, y: mouseY },
        }

        const sectionId = target.dataset.cfNodeId
        const sectionBlockId = target.dataset.cfNodeBlockId
        const sectionBlockType = target.dataset.cfNodeBlockType

        let parentElement: HoveredElement | null = null
        let parentHTMLElement: HTMLElement | null = target.parentElement

        let parentSectionIndex = -1

        while (parentHTMLElement) {
          if (parentHTMLElement.dataset.cfNodeId) {
            parentElement = {
              nodeId: parentHTMLElement.dataset.cfNodeId,
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

        const hoveredElement: HoveredElement = {
          nodeId: sectionId,
          blockId: sectionBlockId,
          blockType: sectionBlockType,
        }

        this.sendMessage(OutgoingExperienceBuilderEvent.HOVERED_SECTION, {
          hoveredElement,
          parentElement,
          parentSectionIndex,
          coordinates,
        })

        break
      }

      target = target.parentElement
    }
  }

  attachEvent(): void {
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }
}
