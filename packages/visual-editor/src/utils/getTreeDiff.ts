import {
  CompositionComponentNode,
  CompositionTree,
} from '@contentful/experience-builder-core/types';

import { getItem } from './getItem';
import { countNodes } from './treeHelpers';
import { isEqual } from 'lodash-es';
import { ROOT_ID, TreeAction } from '@/types/constants';
import { TreeDiff } from '@/types/treeActions';

interface MissingNodeActionParams {
  index: number;
  nodeAdded: boolean;
  tree: CompositionTree;
  child: CompositionComponentNode;
  currentNode: CompositionComponentNode;
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
  currentNode?: CompositionComponentNode;
  updatedNode?: CompositionComponentNode;
  currentNodeCount: number;
  updatedNodeCount: number;
  originalTree: CompositionTree;
  differences: Array<TreeDiff | null>;
}

function compareNodes({
  currentNode,
  updatedNode,
  currentNodeCount,
  updatedNodeCount,
  originalTree,
  differences = [],
}: CompareNodeParams): Array<TreeDiff | null> {
  const map = new Map<string, number>();

  if (!currentNode || !updatedNode) {
    return differences;
  }

  const parentNodeId = updatedNode.data.id;
  const nodeRemoved = currentNodeCount > updatedNodeCount;
  const nodeAdded = currentNodeCount < updatedNodeCount;
  const isRoot = currentNode.data.id === ROOT_ID;

  /**
   * The data of the current node has changed, we need to update
   * this node to reflect the data change. (design, content, unbound values)
   */
  if (!isRoot && !isEqual(currentNode.data, updatedNode.data)) {
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
      currentNodeCount: currentNodeCount,
      updatedNodeCount: updatedNodeCount,
      originalTree,
      differences,
    });
  });

  map.forEach((index) => {
    // If the node count of the entire tree doesn't signify
    // a node was removed, don't add that as a diff
    if (!nodeRemoved) {
      return;
    }
    // Remaining nodes in the map are removed in the second tree
    differences.push({ type: TreeAction.REMOVE_NODE, indexToRemove: index, parentNodeId });
  });

  return differences;
}

export function getTreeDiffs(
  tree1: CompositionComponentNode,
  tree2: CompositionComponentNode,
  originalTree: CompositionTree
): TreeDiff[] {
  const differences: TreeDiff[] = [];

  const tree1Count = countNodes(tree1);
  const tree2Count = countNodes(tree2);

  compareNodes({
    currentNode: tree1,
    updatedNode: tree2,
    currentNodeCount: tree1Count,
    updatedNodeCount: tree2Count,
    originalTree,
    differences,
  });

  return differences.filter((diff) => diff) as TreeDiff[];
}
