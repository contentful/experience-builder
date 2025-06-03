import { sendMessage, getElementCoordinates } from '@contentful/experiences-core';
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
  await waitForAllImagesToBeLoaded();
  collectNodeCoordinates(tree.root, nodeToCoordinatesMap);
  sendMessage(OUTGOING_EVENTS.CanvasGeometryUpdated, {
    size: {
      width: document.documentElement.offsetWidth,
      height: document.documentElement.offsetHeight,
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

const waitForAllImagesToBeLoaded = () => {
  // If the document contains an image, wait for this image to be loaded before collecting & sending all geometry data.
  const allImageNodes = document.querySelectorAll('img');
  return Promise.all(
    Array.from(allImageNodes).map((imageNode) => {
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
    }),
  );
};
