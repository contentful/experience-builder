import { sendMessage, getElementCoordinates } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import {
  CanvasGeometryUpdateSourceEvent,
  ExperienceTree,
  ExperienceTreeNode,
} from '@contentful/experiences-core/types';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendCanvasGeometryUpdatedMessage = async (
  tree: ExperienceTree,
  sourceEvent: CanvasGeometryUpdateSourceEvent,
) => {
  const nodeRecords: Record<
    string,
    { coordinates: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> }
  > = {};
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  await waitForAllImagesToBeLoaded();

  const getNodeCoordinates = (node: ExperienceTreeNode) => {
    const selectedElement = document.querySelector(`[data-cf-node-id="${node.data.id}"]`);
    if (selectedElement) {
      const rect = getElementCoordinates(selectedElement);
      nodeRecords[node.data.id] = {
        coordinates: {
          x: rect.x + scrollX,
          y: rect.y + scrollY,
          width: rect.width,
          height: rect.height,
        },
      };
    }
    if (node.children.length) {
      for (const child of node.children) {
        getNodeCoordinates(child);
      }
    }
  };
  getNodeCoordinates(tree.root);
  sendMessage(OUTGOING_EVENTS.CanvasGeometryUpdated, {
    size: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    nodes: nodeRecords,
    sourceEvent,
  });
};

const waitForAllImagesToBeLoaded = () => {
  // If the target contains an image, wait for this image to be loaded before sending the coordinates
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
