import type { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { isEqual } from 'lodash-es';
import { getChildFromTree } from './getItem';
import { getElementCoordinates } from '@contentful/experiences-core';

export function updateNode(
  nodeId: string,
  updatedNode: ExperienceTreeNode,
  node: ExperienceTreeNode,
) {
  if (node.data.id === nodeId) {
    node.data = updatedNode.data;
    return;
  }

  node.children.forEach((childNode) => updateNode(nodeId, updatedNode, childNode));
}

export function replaceNode(
  indexToReplace: number,
  updatedNode: ExperienceTreeNode,
  node: ExperienceTreeNode,
) {
  if (node.data.id === updatedNode.parentId) {
    node.children = [
      ...node.children.slice(0, indexToReplace),
      updatedNode,
      ...node.children.slice(indexToReplace + 1),
    ];
    return;
  }

  node.children.forEach((childNode) => replaceNode(indexToReplace, updatedNode, childNode));
}

export function reorderChildrenNodes(
  nodeId: string,
  updatedChildren: ExperienceTreeNode[],
  node: ExperienceTreeNode,
) {
  if (node.data.id === nodeId) {
    node.children = updatedChildren;
    return;
  }

  node.children.forEach((childNode) => reorderChildrenNodes(nodeId, updatedChildren, childNode));
}

export function addChildToNode(
  nodeId: string,
  oldChildren: ExperienceTreeNode[],
  updatedChildren: ExperienceTreeNode[],
  node: ExperienceTreeNode,
) {
  if (node.data.id !== nodeId) {
    node.children.forEach((childNode) =>
      addChildToNode(nodeId, oldChildren, updatedChildren, childNode),
    );
  }

  let changed = false;

  oldChildren.forEach((child, i) => {
    if (isEqual(child, updatedChildren[i])) {
      return;
    }

    changed = true;
    addChildNode(i, node.data.id, updatedChildren[i], node);
  });

  if (!changed) {
    // we iterated over the old children and didn't introduce a change.
    // that means the child node is added to the end of the array.
    addChildNode(
      oldChildren.length,
      node.data.id,
      updatedChildren[updatedChildren.length - 1],
      node,
    );
  }
}

export function removeChildNode(
  indexToRemove: number,
  nodeId: string,
  parentNodeId: string,
  node: ExperienceTreeNode,
) {
  if (node.data.id === parentNodeId) {
    const childIndex = node.children.findIndex((child) => child.data.id === nodeId);

    node.children.splice(childIndex === -1 ? indexToRemove : childIndex, 1);
    return;
  }

  node.children.forEach((childNode) =>
    removeChildNode(indexToRemove, nodeId, parentNodeId, childNode),
  );
}

export function addChildNode(
  indexToAdd: number,
  parentNodeId: string,
  nodeToAdd: ExperienceTreeNode,
  node: ExperienceTreeNode,
) {
  if (node.data.id === parentNodeId) {
    node.children = [
      ...node.children.slice(0, indexToAdd),
      nodeToAdd,
      ...node.children.slice(indexToAdd),
    ];

    return;
  }

  node.children.forEach((childNode) =>
    addChildNode(indexToAdd, parentNodeId, nodeToAdd, childNode),
  );
}

export function reorderChildNode(
  oldIndex: number,
  newIndex: number,
  parentNodeId: string,
  node: ExperienceTreeNode,
) {
  if (node.data.id === parentNodeId) {
    // Remove the child from the old position
    const [childToMove] = node.children.splice(oldIndex, 1);

    // Insert the child at the new position
    node.children.splice(newIndex, 0, childToMove);
    return;
  }

  node.children.forEach((childNode) =>
    reorderChildNode(oldIndex, newIndex, parentNodeId, childNode),
  );
}

export function reparentChildNode(
  oldIndex: number,
  newIndex: number,
  sourceNodeId: string,
  destinationNodeId: string,
  node: ExperienceTreeNode,
) {
  const nodeToMove = getChildFromTree(sourceNodeId, oldIndex, node);

  if (!nodeToMove) {
    return;
  }

  removeChildNode(oldIndex, nodeToMove.data.id, sourceNodeId, node);
  addChildNode(newIndex, destinationNodeId, nodeToMove, node);
}

// export function updateNodeCoordinates(node: ExperienceTreeNode) {
//   if (node.data.id !== 'root') {
//     const element = document.querySelector(`[data-cf-node-id="${node.data.id}"]`);
//     if (element) {
//       node.data.coords = getElementCoordinates(element);
//     }
//   }
//   node.children.forEach((childNode) => updateNodeCoordinates(childNode));
// }

// function getNodePosition(node: ExperienceTreeNode) {
//   const element = document.querySelector(`[data-cf-node-id="${node.data.id}"]`);
//   return getElementCoordinates(element);
// }

export function updateNodeCoordinates(node: ExperienceTreeNode): Record<string, DOMRect> {
  let coordinates: Record<string, DOMRect> = {};

  if (node.data.id !== 'root') {
    const element = document.querySelector(`[data-cf-node-id="${node.data.id}"]`);
    if (element) {
      // const start = performance.now();
      coordinates[node.data.id] = getElementCoordinates(element);
      // const end = performance.now();
      // console.log(
      //   `[DEBUG] getElementCoordinates | took ${end - start}ms for node ${node.data.id}`, // ${JSON.stringify(coordinates[node.data.id])}
      // );
    }
  }

  node.children.forEach((childNode) => {
    coordinates = { ...coordinates, ...updateNodeCoordinates(childNode) };
  });

  return coordinates;
}
