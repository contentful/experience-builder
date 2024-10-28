import { sendMessage, getElementCoordinates } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import {
  ExperienceTree,
  ExperienceTreeNode,
  NodeCoordinates,
} from '@contentful/experiences-core/types';

/**
 * This function gets the element co-ordinates of a specified component in the DOM and its parent
 * and sends the DOM Rect to the client app
 */
export const sendComponentCoordinates = (tree: ExperienceTree) => {
  console.log('sending...');

  const nodes = new Map<string, NodeCoordinates>();

  const getNodeCoordinates = (node: ExperienceTreeNode) => {
    const selectedElement = document.querySelector(`[data-cf-node-id="${node.data.id}"]`);

    if (selectedElement) {
      const rect = getElementCoordinates(selectedElement);

      nodes.set(node.data.id, {
        coordinates: rect,
        blockId: node.data.blockId || '',
        id: node.data.id,
      });
    }

    if (node.children.length) {
      for (const child of node.children) {
        getNodeCoordinates(child);
      }
    }
  };

  getNodeCoordinates(tree.root);

  const nodeRecords = {};

  nodes.forEach((value, key) => {
    nodeRecords[key] = value;
  });

  sendMessage(OUTGOING_EVENTS.ComponentCoordinates, {
    nodes: nodeRecords,
  });
};
