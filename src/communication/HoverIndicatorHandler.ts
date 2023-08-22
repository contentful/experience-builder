import {
  Coordinates,
  HoveredElement,
  OutgoingExperienceBuilderEvent,
  RawCoordinates,
} from '../types'
import { sendMessage } from './sendMessage'

export class HoverIndicatorHandler {
  private elementRectCache: Record<string, Coordinates>
  private elementOffsetCache: Record<string, RawCoordinates>

  constructor() {
    this.elementRectCache = {}
    this.elementOffsetCache = {}
  }

  private getFullCoordinates = (element: HTMLElement) => {
    const elementId = (element as HTMLElement).dataset.cfNodeId || element.id

		const validChildren = Array.from(element.children)
		.filter((child) => child instanceof HTMLElement && child.dataset.cfNodeBlockType === 'block')

		// We cache the element offset and instead of calling getBoundingClientRect function on every mouse move,
		// we check if there's an offset change for the element which could arise from width change, adding margin/padding/border to the element etc.. 
		// Basically if anything causes the offset of the element to change, we recalculate the bounding rect of the element and cache the result, 
		// else we return the cached rect for the element id. 
		// We also check if there was increase or decrease in the number of children. If there's a change in the number of children,
		// we need to recalculate the children coordinates (and we throw in a calculation of the element rect as a bonus too). 

    const elementOffset = {
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    }

    const currentElementOffsetCache = this.elementOffsetCache[elementId]

    const isSameOffset =
      currentElementOffsetCache &&
      currentElementOffsetCache.height === elementOffset.height &&
      currentElementOffsetCache.left === elementOffset.left &&
      currentElementOffsetCache.top === elementOffset.top &&
      currentElementOffsetCache.width === elementOffset.width

    const isSameChildrenLength =
      this.elementRectCache[elementId] &&
      validChildren?.length === this.elementRectCache[elementId].childrenCoordinates?.length

    if (this.elementOffsetCache[elementId] && isSameOffset && isSameChildrenLength) {
      return this.elementRectCache[elementId]
    }

    const { left, top, width, height } = element.getBoundingClientRect()

    const childrenCoordinates = validChildren
      .map((child) => {
        const childId = (child as HTMLElement).dataset.cfNodeId || child.id
        const { left, top, width, height } = child.getBoundingClientRect()

				// You know what they say: A child is their own person (nobody says this 😃)
				// Because a child is an element of their own and can be hovered on, we don't waste this loop calculation.
				// Hence, we store the rect calculation for the id.
				// The benefit: E.g We have a card in a section. When we hover on the section first, we would also calculate the
				// rect for the card in this loop and cache the result. So when you hover on the card,
				// if it passes the offset cache + same children check in line 51, we just return the cached value.
				// Saves us the need to call the getBoundingClientRect one more unnecessary time 😉. 
        this.elementRectCache[childId] = { left, top, width, height, childrenCoordinates: [] }
        this.elementOffsetCache[childId] = {
          left: (child as HTMLElement).offsetLeft,
          top: (child as HTMLElement).offsetTop,
          width: (child as HTMLElement).offsetWidth,
          height: (child as HTMLElement).offsetHeight,
        }

        return { left, top, width, height }
      })

    this.elementOffsetCache[elementId] = elementOffset
    this.elementRectCache[elementId] = {
      left,
      top,
      width,
      height,
      childrenCoordinates,
    }

    return {
      left,
      top,
      width,
      height,
      childrenCoordinates,
    }
  }

  private getHoveredElement = (element: HTMLElement | null) => {
    let coordinates: Coordinates | null = null
    let parentElement: HoveredElement | null = null
    let hoveredElement: HoveredElement | null = null
    let parentSectionIndex = -1
    let target = element

    // If the target is outside on the root or anywhere else on the iframes body
    if (target?.id === 'VisualEditorRoot' || target?.tagName === 'BODY') {
      const rootElement = document.getElementById('VisualEditorRoot')
      hoveredElement = {
        nodeId: 'root',
        blockType: 'root',
        blockId: 'root',
      }
      if (rootElement) {
        coordinates = this.getFullCoordinates(rootElement)
      }
    } else {
      // Find the closest contentful container or direct parent that is a contentful container
      while (target) {
        if (
          // is itself a section?
          target.dataset.cfNodeId ||
          // Or a direct child of a section
          (target.parentElement &&
            target.parentElement.dataset.cfNodeBlockId === 'ContentfulSection')
        ) {
          coordinates = this.getFullCoordinates(target)

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
    return { coordinates, hoveredElement, parentElement, parentSectionIndex }
  }

  handleMouseMove = (target: HTMLElement | null, x: number, y: number): void => {
    const mousePosInTarget: { x: number; y: number } = { x: 0, y: 0 }

    const { coordinates, hoveredElement, parentElement, parentSectionIndex } =
      this.getHoveredElement(target)

    if (coordinates) {
      mousePosInTarget.x = x - coordinates.left
      mousePosInTarget.y = y - coordinates.top
    }

    sendMessage(OutgoingExperienceBuilderEvent.MOUSE_MOVE, {
      hoveredElement,
      parentElement,
      parentSectionIndex,
      mousePosInTarget,
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

  resetCache = () => {
    this.elementRectCache = {}
    this.elementOffsetCache = {}
  }

  attachEvent(): void {
    document.addEventListener('mousemove', this.onMouseMove)
		// On scroll, we reset our cache because the elements rect change and we don't want mismatched lines on scroll.
		// So we don't show any hover lines on scroll.
    document.addEventListener('scroll', this.resetCache)
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('scroll', this.resetCache)
    this.resetCache()
  }
}
