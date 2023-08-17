import {
  Coordinates,
  HoveredElement,
  OutgoingExperienceBuilderEvent,
  RawCoordinates,
} from '../types'
import { sendMessage } from './sendMessage'

const CACHE_TTL = 2000

export class HoverIndicatorHandler {
  private domRectCache: Record<string, { data: RawCoordinates; at: number }>
  private interval: ReturnType<typeof setInterval> | undefined

  constructor() {
    this.domRectCache = {}
  }

  private startInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }

    this.interval = setInterval(() => {
      for (const key of Object.keys(this.domRectCache)) {
        const value = this.domRectCache[key]
        const isStale = !value || Date.now() - value.at >= CACHE_TTL
        if (isStale) {
          delete this.domRectCache[key]
        }
      }
    }, 2500)
  }

  private getCoordinatesOfElement(element: HTMLElement | Element): RawCoordinates {
    const id = (element as HTMLElement).dataset.cfNodeId || element.id
    const key = `${id}-${window.scrollX}-${window.scrollY}`

    let cachedEntry = this.domRectCache[key]

    const isStale = !cachedEntry || Date.now() - cachedEntry.at >= CACHE_TTL

    if (!isStale) {
      return cachedEntry.data
    }

    const { left, top, width, height } = element.getBoundingClientRect()

    cachedEntry = {
      data: {
        left,
        top,
        width,
        height,
      },
      at: Date.now(),
    }

    if (id) {
      this.domRectCache[key] = cachedEntry
    }

    return cachedEntry.data
  }

  private getFullCoordinates = (element: HTMLElement) => {
    const rawCoordinates = this.getCoordinatesOfElement(element)

    const childrenCoordinates: RawCoordinates[] = Array.from(element.children)
      .filter((child) => child instanceof HTMLElement && child.dataset.cfNodeBlockType === 'block')
      .map((child) => this.getCoordinatesOfElement(child))

    return {
      ...rawCoordinates,
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

  attachEvent(): void {
    document.addEventListener('mousemove', this.onMouseMove)
    this.startInterval()
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.onMouseMove)
    this.domRectCache = {}
    clearInterval(this.interval)
  }
}
