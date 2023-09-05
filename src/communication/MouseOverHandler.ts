import { HoveredElement, OutgoingExperienceBuilderEvent } from '../types'
import { sendMessage } from './sendMessage'

export class MouseOverHandler {
  private currentHoveredElementId: string | null = null

  private getFullCoordinates = (element: HTMLElement) => {
    // const elementId = (element as HTMLElement).dataset.cfNodeId || element.id

    const validChildren = Array.from(element.children).filter(
      (child) => child instanceof HTMLElement && child.dataset.cfNodeBlockType === 'block'
    )

    const { left, top, width, height } = element.getBoundingClientRect()

    const childrenCoordinates = validChildren.map((child) => {
      const { left, top, width, height } = child.getBoundingClientRect()

      return { left, top, width, height }
    })

    return {
      left,
      top,
      width,
      height,
      childrenCoordinates,
    }
  }

  private getClosestComponentInformation = (
    element: HTMLElement | null
  ): [HTMLElement | null, HoveredElement] | undefined => {
    let target = element

    // If the target is outside on the root or anywhere else on the iframes body
    if (target?.id === 'VisualEditorRoot' || target?.tagName === 'BODY') {
      const rootElement = document.getElementById('VisualEditorRoot')
      const hoveredRootElement = {
        nodeId: 'root',
        blockType: 'root',
        blockId: 'root',
      }
      return [rootElement, hoveredRootElement]
    }
    // Find the closest contentful container or direct parent that is a contentful container
    while (target) {
      if (
        // is itself a section?
        target.dataset.cfNodeId ||
        // Or a direct child of a section
        (target.parentElement && target.parentElement.dataset.cfNodeBlockId === 'ContentfulSection')
      ) {
        const sectionId = target.dataset.cfNodeId
        const sectionBlockId = target.dataset.cfNodeBlockId
        const sectionBlockType = target.dataset.cfNodeBlockType

        const hoveredElement = {
          nodeId: sectionId,
          blockId: sectionBlockId,
          blockType: sectionBlockType,
        }

        return [element, hoveredElement]

        break
      }

      target = target.parentElement
    }
  }

  private getHoveredElement = (element: HTMLElement | null) => {
    let parentElement: HoveredElement | null = null

    let parentSectionIndex = -1

    const [hoveredElement, hoveredInfo] = this.getClosestComponentInformation(element) || [
      null,
      null,
    ]

    if (!hoveredElement) return

    // if hovered element is already hovered and the information is already sent
    // ignore the rest and don't proceed.
    if (hoveredInfo.nodeId === this.currentHoveredElementId) return

    let parentHTMLElement: HTMLElement | null = hoveredElement?.parentElement || null

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
          (child) => child === hoveredElement
        )
        break
      }
      parentHTMLElement = parentHTMLElement.parentElement
    }

    const coordinates = this.getFullCoordinates(hoveredElement)

    console.log({ parentElement })

    return { coordinates, hoveredElement: hoveredInfo, parentElement, parentSectionIndex }
  }

  handleMouseMove = (target: HTMLElement | null, x: number, y: number): void => {
    const hoveredElementInfo = this.getHoveredElement(target)

    if (!hoveredElementInfo) {
      // this.currentHoveredElementId = null
      return
    }

    const { coordinates, hoveredElement, parentElement, parentSectionIndex } = hoveredElementInfo
    this.currentHoveredElementId = hoveredElementInfo.hoveredElement.nodeId || null

    sendMessage(OutgoingExperienceBuilderEvent.NEW_HOVERED_COMPONENT, {
      hoveredElement,
      parentElement,
      parentSectionIndex,
      coordinates,
      clientX: x,
      clientY: y,
    })
  }

  onMouseMove = (event: MouseEvent) => {
    const target: HTMLElement | null = event.target as HTMLElement
    const [x, y] = [event.clientX, event.clientY]
    this.handleMouseMove(target, x, y)
  }

  attachEvent(): void {
    document.addEventListener('mousemove', this.onMouseMove)
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.onMouseMove)
  }
}
