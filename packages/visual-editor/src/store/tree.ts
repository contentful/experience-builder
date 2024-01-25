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
import { treeVisit } from '@/utils/treeTraversal';
import {
  ASSEMBLY_NODE_TYPE,
  DESIGN_COMPONENT_NODE_TYPE,
} from '@contentful/experience-builder-core/constants';
export interface TreeStore {
  tree: CompositionTree;
  breakpoints: Breakpoint[];
  updateTree: (tree: CompositionTree) => void;
  updateTreeForced: (tree: CompositionTree) => void;
  updateNodesByUpdatedEntity: (entityId: string) => void;
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

const isAssemblyNode = (node: CompositionComponentNode) => {
  return node.type === DESIGN_COMPONENT_NODE_TYPE || node.type === ASSEMBLY_NODE_TYPE;
};

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

  updateNodesByUpdatedEntity: (entityId: string) => {
    set(
      produce((draftState: TreeStore) => {
        treeVisit(draftState.tree.root, (node) => {
          if (isAssemblyNode(node) && node.data.blockId === entityId) {
            // Cannot use `structuredClone()` as node is probably a Proxy object with weird references
            updateNode(node.data.id, cloneDeepAsPOJO(node), draftState.tree.root);
            return;
          }
          const dataSourceIds = Object.values(node.data.dataSource).map((link) => link.sys.id);
          if (dataSourceIds.includes(entityId)) {
            // Cannot use `structuredClone()` as node is probably a Proxy object with weird references
            updateNode(node.data.id, cloneDeepAsPOJO(node), draftState.tree.root);
          }
        });
      })
    );
  },

  /**
   * NOTE: this is for debugging purposes only as it causes ugly canvas flash.
   *
   * Force updates entire tree. Usually shouldn't be used as updateTree()
   * uses smart update algorithm based on diffs. But for troubleshooting
   * you may want to force update the tree so leaving this in.
   */
  updateTreeForced: (tree) => {
    set({
      tree,
      // Breakpoints must be updated, as we receive completely new tree with possibly new breakpoints
      breakpoints: tree?.root?.data?.breakpoints || [],
    });
  },
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

    // The current and updated tree are the same, no tree update required.
    if (!treeDiff.length) {
      console.debug(
        `[exp-builder.visual-editor::updateTree()]: During smart-diffing no diffs. Skipping tree update.`
      );
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
              replaceNode(diff.indexToReplace, diff.node, state.tree.root);
              break;
            case TreeAction.UPDATE_NODE:
              updateNode(diff.nodeId, diff.node, state.tree.root);
              break;
            case TreeAction.REMOVE_NODE:
              removeChildNode(
                diff.indexToRemove,
                diff.idToRemove,
                diff.parentNodeId,
                state.tree.root
              );
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

// Serialize and deserialize an object again to remove all functions and references.
// Some people refer to this as "Plain Old JavaScript Object" (POJO) as it solely contains plain data.
function cloneDeepAsPOJO(obj) {
  return JSON.parse(JSON.stringify(obj));
}
