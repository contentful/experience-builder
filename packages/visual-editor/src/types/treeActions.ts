import { CompositionComponentNode } from '@contentful/experience-builder-core/types';

export type TreeDiffType =
  | 'remove_node'
  | 'add_node'
  | 'move_node'
  | 'update_node'
  | 'reorder_node'
  | 'replace_node';

interface DiffBase {
  type: TreeDiffType;
}

export interface RemoveNode extends DiffBase {
  type: 'remove_node';
  indexToRemove: number;
  parentNodeId: string;
}

export interface AddNode extends DiffBase {
  type: 'add_node';
  indexToAdd: number;
  nodeToAdd: CompositionComponentNode;
  parentNodeId: string;
}

export interface ReplaceNode extends DiffBase {
  type: 'replace_node';
  originalId: string;
  node: CompositionComponentNode;
}

export interface UpdateNode extends DiffBase {
  type: 'update_node';
  nodeId: string;
  node: CompositionComponentNode;
}

export interface MoveNode extends DiffBase {
  type: 'move_node';
  sourceIndex: number;
  destinationIndex: number;
  parentNodeId: string;
}

export interface ReorderNode extends DiffBase {
  type: 'reorder_node';
  sourceIndex: number;
  destinationIndex: number;
  parentNodeId: string;
}

export type TreeDiff = RemoveNode | AddNode | MoveNode | ReorderNode | ReplaceNode | UpdateNode;
