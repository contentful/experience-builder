import type { HoveredElement } from '@contentful/experiences-core/types';
import { sendMessage } from '@contentful/experiences-core';
import { ASSEMBLY_NODE_TYPE, OUTGOING_EVENTS } from '@contentful/experiences-core/constants';

export class MouseOverHandler {
  private currentHoveredElementId: string | null = null;

  private getMargins = (element: HTMLElement) => {
    if (typeof window === 'undefined') return undefined;
    const styles = window.getComputedStyle(element);
    const top = parseInt(styles.marginTop);
    const bottom = parseInt(styles.marginBottom);
    const left = parseInt(styles.marginLeft);
    const right = parseInt(styles.marginRight);

    return { top, bottom, left, right };
  };

  private getBoundingClientRect(element: Element) {
    const isAssembly = element.getAttribute('data-cf-node-block-type') === ASSEMBLY_NODE_TYPE;
    if (!isAssembly) {
      return element.getBoundingClientRect();
    } else {
      // As we use `display: contents` for assemblies, there is no real "block"
      // in the DOM and thus the browser fails to calculate the bounding rect.
      // Instead, we calculate it for each child and add it up:
      if (!element.firstElementChild) {
        return { left: 0, top: 0, width: 0, height: 0 };
      }
      const firstChildRect = element.firstElementChild.getBoundingClientRect();
      let fullHeight = firstChildRect.height;
      let nextChild = element.firstElementChild.nextElementSibling;
      while (nextChild) {
        const nextChildRect = nextChild.getBoundingClientRect();
        fullHeight += nextChildRect.height;
        nextChild = nextChild.nextElementSibling;
      }
      // The root of a assembly positions its first level containers vertically.
      // So we just need to add up the height and use the remaining properties from the first child.
      return {
        left: firstChildRect.left,
        top: firstChildRect.top,
        width: firstChildRect.width,
        height: fullHeight,
      };
    }
  }

  private getFullCoordinates = (element: HTMLElement) => {
    const validChildren = Array.from(element.children).filter(
      (child) => child instanceof HTMLElement && child.dataset.cfNodeBlockType === 'block',
    );

    const { left, top, width, height } = this.getBoundingClientRect(element);
    const margins = this.getMargins(element);

    const childrenCoordinates = validChildren.map((child) => {
      const { left, top, width, height } = this.getBoundingClientRect(child);

      return { left, top, width, height, margins };
    });

    return {
      left,
      top,
      width,
      height,
      margins,
      childrenCoordinates,
    };
  };

  private getClosestComponentInformation = (
    element: HTMLElement | null,
  ): [HTMLElement | null, HoveredElement] | undefined => {
    let target = element;

    // If the target is outside on the root or anywhere else on the iframes body
    if (target?.id === 'VisualEditorRoot' || target?.tagName === 'BODY') {
      const rootElement = document.getElementById('VisualEditorRoot');
      const hoveredRootElement = {
        nodeId: 'root',
        blockType: 'root',
        blockId: 'root',
      };
      return [rootElement, hoveredRootElement];
    }
    // Find the closest contentful container or direct parent that is a contentful container
    while (target) {
      if (
        // is itself a section?
        target.dataset.cfNodeId ||
        // Or a direct child of a section
        (target.parentElement && target.parentElement.dataset.cfNodeBlockId === 'ContentfulSection')
      ) {
        const sectionId = target.dataset.cfNodeId;
        const sectionBlockId = target.dataset.cfNodeBlockId;
        const sectionBlockType = target.dataset.cfNodeBlockType;

        const hoveredElement = {
          nodeId: sectionId,
          blockId: sectionBlockId,
          blockType: sectionBlockType,
        };

        return [target, hoveredElement];

        break;
      }

      target = target.parentElement;
    }
  };

  private getNewlyHoveredElement = (element: HTMLElement | null) => {
    let parentElement: HoveredElement | null = null;

    let parentSectionIndex = -1;

    const [hoveredElement, hoveredInfo] = this.getClosestComponentInformation(element) || [
      null,
      null,
    ];

    if (!hoveredElement) return;

    // if hovered element is already hovered and the information is already sent
    // ignore the rest and don't proceed.
    if (hoveredInfo.nodeId === this.currentHoveredElementId) return;

    let parentHTMLElement: HTMLElement | null = hoveredElement?.parentElement || null;

    while (parentHTMLElement) {
      const parentIsRoot = parentHTMLElement.id === 'VisualEditorRoot';
      if (parentHTMLElement.dataset.cfNodeId || parentIsRoot) {
        parentElement = {
          nodeId: parentIsRoot ? 'root' : parentHTMLElement.dataset.cfNodeId,
          blockType: parentHTMLElement.dataset.cfNodeBlockType,
          blockId: parentHTMLElement.dataset.cfNodeBlockId,
        };
        const parentChildrenElements = parentHTMLElement.children;
        parentSectionIndex = Array.from(parentChildrenElements).findIndex(
          (child) => child === hoveredElement,
        );
        break;
      }
      parentHTMLElement = parentHTMLElement.parentElement;
    }

    const coordinates = this.getFullCoordinates(hoveredElement);

    return { coordinates, hoveredElement: hoveredInfo, parentElement, parentSectionIndex };
  };

  handleMouseMove = (target: HTMLElement | null): void => {
    const hoveredElementInfo = this.getNewlyHoveredElement(target);

    if (!hoveredElementInfo) {
      return;
    }

    const { coordinates, hoveredElement, parentElement, parentSectionIndex } = hoveredElementInfo;
    this.currentHoveredElementId = hoveredElementInfo.hoveredElement.nodeId || null;

    sendMessage(OUTGOING_EVENTS.NewHoveredElement, {
      hoveredElement,
      parentElement,
      parentSectionIndex,
      coordinates,
    });
  };

  onMouseMove = (event: MouseEvent) => {
    const target: HTMLElement | null = event.target as HTMLElement;
    this.handleMouseMove(target);
  };

  onMouseLeave = () => {
    this.currentHoveredElementId = null;
  };

  attachEvent(): void {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseout', this.onMouseLeave);
  }

  detachEvent(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseout', this.onMouseLeave);
  }
}
