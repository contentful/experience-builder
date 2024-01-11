import type {
  Breakpoint,
  CompositionComponentNode,
  CompositionTree,
} from '@contentful/experience-builder-core/types';
import { ROOT_ID, TreeAction } from '@/types/constants';
import { create } from 'zustand';
import { produce } from 'immer';
import {
  addChildNode,
  removeChildNode,
  reorderChildNode,
  replaceNode,
  updateNode,
} from '@/utils/treeHelpers';
import { getTreeDiffs } from '@/utils/getTreeDiff';

export interface TreeStore {
  tree: CompositionTree;
  breakpoints: Breakpoint[];
  updateTree: (tree: CompositionTree) => void;
  addChild: (
    destinationIndex: number,
    destinationParentId: string,
    node: CompositionComponentNode
  ) => void;
  reorderChildren: (
    destinationIndex: number,
    destinationParentId: string,
    sourceIndex: number
  ) => void;
}

export const useTreeStore = create<TreeStore>((set, get) => ({
  tree: {
    root: {
      children: [],
      type: 'root',
      data: {
        breakpoints: [],
        dataSource: {},
        id: ROOT_ID,
        props: {},
        unboundValues: {},
      },
    },
  },
  breakpoints: [],
  updateTree: (tree) => {
    const currentTree = get().tree;

    /**
     * If we simply update the tree as in:
     *
     * `state.tree = tree`
     *
     * we end up causing a lot of unnecesary rerenders which can lead to
     * flickering of the component layout. Instead, we use this function
     * to deteremine exactly which nodes in the tree changed and combined
     * with immer, we end up updating only the changed nodes instead of
     * rerendering the entire tree.
     */
    const treeDiff = getTreeDiffs({ ...currentTree.root }, { ...tree.root }, currentTree);

    console.log('::DIFF', tree);

    // The current and updated tree are the same, no tree update required.
    if (!treeDiff.length) {
      return;
    }

    set(
      produce((state: TreeStore) => {
        treeDiff.map((diff) => {
          switch (diff.type) {
            case TreeAction.ADD_NODE:
              addChildNode(diff.indexToAdd, diff.parentNodeId, diff.nodeToAdd, state.tree.root);
              break;
            case TreeAction.REPLACE_NODE:
              replaceNode(diff.originalId, diff.node, state.tree.root);
              break;
            case TreeAction.UPDATE_NODE:
              updateNode(diff.nodeId, diff.node, state.tree.root);
              break;
            case TreeAction.REMOVE_NODE:
              removeChildNode(diff.indexToRemove, diff.parentNodeId, state.tree.root);
              break;
            case TreeAction.MOVE_NODE:
            case TreeAction.REORDER_NODE:
              state.tree = tree;
              break;
            default:
              break;
          }
        });

        state.breakpoints = tree?.root?.data?.breakpoints || [];
      })
    );
  },
  addChild: (index, parentId, node) => {
    set(
      produce((state: TreeStore) => {
        addChildNode(index, parentId, node, state.tree.root);
      })
    );
  },
  reorderChildren: (destinationIndex, destinationParentId, sourceIndex) => {
    set(
      produce((state: TreeStore) => {
        reorderChildNode(sourceIndex, destinationIndex, destinationParentId, state.tree.root);
      })
    );
  },
}));
