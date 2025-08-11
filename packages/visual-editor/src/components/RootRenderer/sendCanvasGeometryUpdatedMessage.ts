import { sendMessage, getElementCoordinates, isElementHidden } from '@contentful/experiences-core';
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
  const height = Math.max(document.documentElement.offsetHeight, rootRect.height, bodyRect.height);

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
  if (imageNode.complete) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve, reject) => {
    const handleImageLoad = (event: Event | ErrorEvent) => {
      imageNode.removeEventListener('load', handleImageLoad);
      imageNode.removeEventListener('error', handleImageLoad);
      if (event.type === 'error') {
        console.warn('Image failed to load:', imageNode);
        reject();
      } else {
        resolve();
      }
    };
    imageNode.addEventListener('load', handleImageLoad);
    imageNode.addEventListener('error', handleImageLoad);
  });
}
