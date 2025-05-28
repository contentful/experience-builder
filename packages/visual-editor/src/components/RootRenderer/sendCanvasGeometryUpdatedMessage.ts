import { sendMessage, getElementCoordinates } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { ExperienceTree, ExperienceTreeNode } from '@contentful/experiences-core/types';
/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendCanvasGeometryUpdatedMessage = (tree: ExperienceTree) => {
  console.log('sending...', tree);
  const nodeRecords: Record<
    string,
    { coordinates: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> }
  > = {};
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const getNodeCoordinates = (node: ExperienceTreeNode) => {
    const selectedElement = document.querySelector(`[data-cf-node-id="${node.data.id}"]`);
    console.log({ selectedElement, 'node.data.id': node.data.id });
    if (selectedElement) {
      const rect = getElementCoordinates(selectedElement);
      nodeRecords[node.data.id] = {
        coordinates: {
          x: rect.x + scrollX,
          y: rect.y + scrollY,
          width: rect.width,
          height: rect.height,
        },
        // blockId: node.data.blockId || '',
        // id: node.data.id,
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
  });
};
