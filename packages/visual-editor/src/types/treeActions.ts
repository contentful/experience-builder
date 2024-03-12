import { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { TreeAction } from './constants';

interface DiffBase {
  type: TreeAction;
}

export interface RemoveNode extends DiffBase {
  type: TreeAction.REMOVE_NODE;
  indexToRemove: number;
  idToRemove: string;
  parentNodeId: string;
}

export interface AddNode extends DiffBase {
  type: TreeAction.ADD_NODE;
  indexToAdd: number;
  nodeToAdd: ExperienceTreeNode;
  parentNodeId: string;
}

export interface ReplaceNode extends DiffBase {
  type: TreeAction.REPLACE_NODE;
  originalId: string;
  node: ExperienceTreeNode;
  indexToReplace: number;
}

export interface UpdateNode extends DiffBase {
  type: TreeAction.UPDATE_NODE;
  nodeId: string;
  node: ExperienceTreeNode;
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
