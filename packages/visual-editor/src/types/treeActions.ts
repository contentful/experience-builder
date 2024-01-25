import { CompositionComponentNode } from '@contentful/experience-builder-core/types';
import { TreeAction } from './constants';

interface DiffBase {
  type: TreeAction;
}

export interface RemoveNode extends DiffBase {
  type: TreeAction.REMOVE_NODE;
  indexToRemove: number;
  parentNodeId: string;
}

export interface AddNode extends DiffBase {
  type: TreeAction.ADD_NODE;
  indexToAdd: number;
  nodeToAdd: CompositionComponentNode;
  parentNodeId: string;
}

export interface ReplaceNode extends DiffBase {
  type: TreeAction.REPLACE_NODE;
  originalId: string;
  node: CompositionComponentNode;
  indexToReplace: number;
}

export interface UpdateNode extends DiffBase {
  type: TreeAction.UPDATE_NODE;
  nodeId: string;
  node: CompositionComponentNode;
}

export interface MoveNode extends DiffBase {
  type: TreeAction.MOVE_NODE;
  sourceIndex: number;
  destinationIndex: number;
  parentNodeId: string;
}

export interface ReorderNode extends DiffBase {
  type: TreeAction.REORDER_NODE;
  sourceIndex: number;
  destinationIndex: number;
  parentNodeId: string;
}

export type TreeDiff = RemoveNode | AddNode | MoveNode | ReorderNode | ReplaceNode | UpdateNode;
