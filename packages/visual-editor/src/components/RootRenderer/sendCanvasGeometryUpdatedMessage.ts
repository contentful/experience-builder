import {
  sendMessage,
  getElementCoordinates,
  isElementHidden,
  debug,
} from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import {
  CanvasGeometryUpdateSourceEvent,
  ExperienceTree,
  ExperienceTreeNode,
} from '@contentful/experiences-core/types';

type NodeToCoordinatesMap = Record<
  string,
  { coordinates: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> }
>;

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app.
 */
export const sendCanvasGeometryUpdatedMessage = async (
  tree: ExperienceTree,
  sourceEvent: CanvasGeometryUpdateSourceEvent,
) => {
  const nodeToCoordinatesMap: NodeToCoordinatesMap = {};
  collectNodeCoordinates(tree.root, nodeToCoordinatesMap);

  const rootRect = document.documentElement.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const width = Math.max(document.documentElement.offsetWidth, rootRect.width, bodyRect.width);
  const height = Math.max(
    document.documentElement.offsetHeight,
    rootRect.height,
    bodyRect.height,
    measureBodyContentHeight(),
  );

  sendMessage(OUTGOING_EVENTS.CanvasGeometryUpdated, {
    size: {
      width,
      height,
    },
    nodes: nodeToCoordinatesMap,
    sourceEvent,
  });
};

const collectNodeCoordinates = (
  node: ExperienceTreeNode,
  nodeToCoordinatesMap: NodeToCoordinatesMap,
) => {
  const selectedElement = document.querySelector(`[data-cf-node-id="${node.data.id}"]`);
  if (selectedElement) {
    const rect = getElementCoordinates(selectedElement);

    if (isElementHidden(rect)) {
      return;
    }

    nodeToCoordinatesMap[node.data.id] = {
      coordinates: {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height,
      },
    };
  }
  node.children.forEach((child) => collectNodeCoordinates(child, nodeToCoordinatesMap));
};

export function waitForImageToBeLoaded(imageNode: HTMLImageElement) {
  if (imageNode.complete && (imageNode.naturalWidth > 0 || imageNode.naturalHeight > 0)) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const handleImageLoad = (event: Event | ErrorEvent) => {
      imageNode.removeEventListener('load', handleImageLoad);
      imageNode.removeEventListener('error', handleImageLoad);
      if (event.type === 'error') {
        debug.warn(
          '[experiences-visual-editor-react::canvasGeometry] Image failed to load:',
          imageNode,
        );
        reject();
      } else {
        resolve();
      }
    };
    imageNode.addEventListener('load', handleImageLoad);
    imageNode.addEventListener('error', handleImageLoad);
  });
}

// calculates the content height by finding the deepest node in the first 2 levels of the body
function measureBodyContentHeight(depth = 2, node: Element = document.body): number {
  if (depth <= 0) return 0;

  let height = 0;

  for (const element of node.children) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    const isHidden =
      (rect.width === 0 && rect.height === 0) ||
      style.display === 'none' ||
      style.visibility === 'hidden';

    // ignore relative positioned elements that are anchored to the bottom,
    // as this can cause infinite height
    const isBottomAnchored =
      (style.position === 'fixed' ||
        style.position === 'absolute' ||
        style.position === 'relative' ||
        style.position === 'sticky') &&
      parseFloat(style.bottom) < 0;

    if (isHidden || isBottomAnchored) {
      continue;
    }

    height = Math.max(height, Math.ceil(rect.bottom), measureBodyContentHeight(depth - 1, element));
  }

  return height;
}
