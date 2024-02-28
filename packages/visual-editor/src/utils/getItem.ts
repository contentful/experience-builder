import type {
  CompositionComponentNode,
  CompositionTree,
} from '@contentful/experience-builder-core/types';
import { ROOT_ID } from '../types/constants';

export type ItemSelector = {
  id: string;
};

function getItemFromTree(
  id: string,
  node: CompositionComponentNode,
): CompositionComponentNode | undefined {
  // Check if the current node's id matches the search id

  if (node.data.id === id) {
    return node;
  }

  // Recursively search through each child
  for (const child of node.children) {
    const foundNode = getItemFromTree(id, child);
    if (foundNode) {
      // Node found in children
      return foundNode;
    }
  }

  // If the node is not found in this branch of the tree, return undefined
  return undefined;
}

export const getChildFromTree = (
  parentId: string,
  index: number,
  node: CompositionComponentNode,
): CompositionComponentNode | undefined => {
  // Check if the current node's id matches the search id

  if (node.data.id === parentId) {
    return node.children[index];
  }

  // Recursively search through each child
  for (const child of node.children) {
    const foundNode = getChildFromTree(parentId, index, child);
    if (foundNode) {
      // Node found in children
      return foundNode;
    }
  }

  // If the node is not found in this branch of the tree, return undefined
  return undefined;
};

export const getItem = (
  selector: ItemSelector,
  tree: CompositionTree,
): CompositionComponentNode | undefined => {
  return getItemFromTree(selector.id, {
    type: 'block',
    data: {
      id: ROOT_ID,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    children: tree.root.children,
  });
};
