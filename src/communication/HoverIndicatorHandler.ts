import {
  Coordinates,
  HoveredElement,
  OutgoingExperienceBuilderEvent,
  RawCoordinates,
} from '../types'
import { sendMessage } from './sendMessage'

export class HoverIndicatorHandler {
	private elementRectCache: Record<string, Coordinates>;
	private elementOffsetCache: Record<string, RawCoordinates>

  constructor() {
		this.elementRectCache = {}
		this.elementOffsetCache = {}
  }

  private getFullCoordinates = (element: HTMLElement) => {
		const parentId = (element as HTMLElement).dataset.cfNodeId || element.id

		const elementOffset = {
			left: element.offsetLeft,
			top: element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight
		}

		const currentElementOffsetCache = this.elementOffsetCache[parentId]

		const isSameOffset = currentElementOffsetCache && (
			currentElementOffsetCache.height === elementOffset.height
			&& currentElementOffsetCache.left === elementOffset.left
			&& currentElementOffsetCache.top === elementOffset.top
			&& currentElementOffsetCache.width === elementOffset.width
		)
		const isSameChildrenLength = this.elementRectCache[parentId] && element.children?.length === this.elementRectCache[parentId].childrenCoordinates?.length

		if(this.elementOffsetCache[parentId] && isSameOffset && isSameChildrenLength){
			return this.elementRectCache[parentId]
		}

		const { left, top, width, height } = element.getBoundingClientRect();
	
		const childrenCoordinates = Array.from(element.children)
		.filter((child) => child.id !== 'SectionTooltip')
		.map((child) => {
			const childId = (child as HTMLElement).dataset.cfNodeId || child.id
			const { left, top, width, height } = child.getBoundingClientRect();

			const childOffset = {
				left: (child as HTMLElement).offsetLeft,
				top: (child as HTMLElement).offsetTop,
				width: (child as HTMLElement).offsetWidth,
				height: (child as HTMLElement).offsetHeight
			}
			
			this.elementRectCache[childId] = { left, top, width, height, childrenCoordinates: [] } 
			this.elementOffsetCache[childId] = childOffset

			return { left, top, width, height };
		})

		this.elementOffsetCache[parentId] = elementOffset
		this.elementRectCache[parentId] = {
			left,
			top,
			width,
			height,
			childrenCoordinates
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
		document.addEventListener('scroll', this.resetCache)
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.onMouseMove)
		document.removeEventListener('scroll', this.resetCache)
		this.resetCache();
  }
}
