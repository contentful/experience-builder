import { ExperienceTreeNode, ExperienceTree } from '@contentful/experiences-core/types';

import { getItem } from './getItem';
import { isEqual } from 'lodash-es';
import { TreeAction } from '@/types/constants';
import { TreeDiff } from '@/types/treeActions';

interface MissingNodeActionParams {
  index: number;
  nodeAdded: boolean;
  tree: ExperienceTree;
  child: ExperienceTreeNode;
  currentNode: ExperienceTreeNode;
  parentNodeId: string;
}

function missingNodeAction({
  index,
  nodeAdded,
  child,
  tree,
  parentNodeId,
  currentNode,
}: MissingNodeActionParams): TreeDiff | null {
  if (nodeAdded) {
    return { type: TreeAction.ADD_NODE, indexToAdd: index, nodeToAdd: child, parentNodeId };
  }

  const item = getItem({ id: child.data.id }, tree);

  if (item) {
    const parentNode = getItem({ id: item.parentId! }, tree);

    if (!parentNode) {
      return null;
    }
    const sourceIndex = parentNode.children.findIndex((c) => c.data.id === child.data.id);

    return { type: TreeAction.MOVE_NODE, sourceIndex, destinationIndex: index, parentNodeId };
  }

  return {
    type: TreeAction.REPLACE_NODE,
    originalId: currentNode.children[index].data.id,
    indexToReplace: index,
    node: child,
  };
}

interface MatchingNodeActionParams {
  index: number;
  originalIndex: number;
  nodeAdded: boolean;
  nodeRemoved: boolean;
  parentNodeId: string;
}

function matchingNodeAction({
  index,
  originalIndex,
  nodeRemoved,
  nodeAdded,
  parentNodeId,
}: MatchingNodeActionParams): TreeDiff | null {
  if (index !== originalIndex && !nodeRemoved && !nodeAdded) {
    return {
      type: TreeAction.REORDER_NODE,
      sourceIndex: originalIndex,
      destinationIndex: index,
      parentNodeId,
    };
  }

  return null;
}

interface CompareNodeParams {
  currentNode?: ExperienceTreeNode;
  updatedNode?: ExperienceTreeNode;
  originalTree: ExperienceTree;
  differences: Array<TreeDiff | null>;
}

function compareNodes({
  currentNode,
  updatedNode,
  originalTree,
  differences = [],
}: CompareNodeParams): Array<TreeDiff | null> {
  // In the end, this map contains the list of nodes that are not present
  // in the updated tree and must be removed
  const map = new Map<string, number>();

  if (!currentNode || !updatedNode) {
    return differences;
  }

  // On each tree level, consider only the children of the current node to differentiate between added, removed, or replaced case
  const currentNodeCount = currentNode.children.length;
  const updatedNodeCount = updatedNode.children.length;
  const nodeRemoved = currentNodeCount > updatedNodeCount;
  const nodeAdded = currentNodeCount < updatedNodeCount;
  const parentNodeId = updatedNode.data.id;

  /**
   * The data of the current node has changed, we need to update
   * this node to reflect the data change. (design, content, unbound values)
   */
  if (!isEqual(currentNode.data, updatedNode.data)) {
    differences.push({
      type: TreeAction.UPDATE_NODE,
      nodeId: currentNode.data.id,
      node: updatedNode,
    });
  }

  // Map children of the first tree by their ID
  currentNode.children.forEach((child, index) => map.set(child.data.id, index));

  // Compare with the second tree
  updatedNode.children.forEach((child, index) => {
    const childId = child.data.id;
    // The original tree does not have this node in the updated tree.
    if (!map.has(childId)) {
      const diff = missingNodeAction({
        index,
        child,
        nodeAdded,
        parentNodeId,
        tree: originalTree,
        currentNode,
      });
      if (diff?.type === TreeAction.REPLACE_NODE) {
        // Remove it from the deletion map to avoid adding another REMOVE_NODE action
        map.delete(diff.originalId);
      }
      return differences.push(diff);
    }

    const originalIndex = map.get(childId)!;

    const diff = matchingNodeAction({
      index,
      originalIndex,
      nodeAdded,
      nodeRemoved,
      parentNodeId,
    });

    differences.push(diff);
    map.delete(childId);

    compareNodes({
      currentNode: currentNode.children[originalIndex],
      updatedNode: child,
      originalTree,
      differences,
    });
  });

  map.forEach((index, key) => {
    // Remaining nodes in the map are removed in the second tree
    differences.push({
      type: TreeAction.REMOVE_NODE,
      indexToRemove: index,
      parentNodeId,
      idToRemove: key,
    });
  });

  return differences;
}

export function getTreeDiffs(
  tree1: ExperienceTreeNode,
  tree2: ExperienceTreeNode,
  originalTree: ExperienceTree,
): TreeDiff[] {
  const differences: TreeDiff[] = [];

  compareNodes({
    currentNode: tree1,
    updatedNode: tree2,
    originalTree,
    differences,
  });

  return differences.filter((diff) => diff) as TreeDiff[];
}
