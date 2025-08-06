import type { ExperienceTreeNode } from '@contentful/experiences-core/types';

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
