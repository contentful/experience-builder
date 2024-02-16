import type { CompositionComponentNode } from '@contentful/experiences-core/types';
import { isEqual } from 'lodash-es';

export function updateNode(
  nodeId: string,
  updatedNode: CompositionComponentNode,
  node: CompositionComponentNode,
) {
  if (node.data.id === nodeId) {
    node.data = updatedNode.data;
    return;
  }

  node.children.forEach((childNode) => updateNode(nodeId, updatedNode, childNode));
}
export function replaceNode(
  indexToReplace: number,
  updatedNode: CompositionComponentNode,
  node: CompositionComponentNode,
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
  updatedChildren: CompositionComponentNode[],
  node: CompositionComponentNode,
) {
  if (node.data.id === nodeId) {
    node.children = updatedChildren;
    return;
  }

  node.children.forEach((childNode) => reorderChildrenNodes(nodeId, updatedChildren, childNode));
}

export function addChildToNode(
  nodeId: string,
  oldChildren: CompositionComponentNode[],
  updatedChildren: CompositionComponentNode[],
  node: CompositionComponentNode,
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
  node: CompositionComponentNode,
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
  nodeToAdd: CompositionComponentNode,
  node: CompositionComponentNode,
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
  node: CompositionComponentNode,
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
