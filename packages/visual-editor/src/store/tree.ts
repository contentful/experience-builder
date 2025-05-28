import type {
  Breakpoint,
  ExperienceTreeNode,
  ExperienceTree,
} from '@contentful/experiences-core/types';
import { ROOT_ID, TreeAction } from '@/types/constants';
import { create } from 'zustand';
import { produce } from 'immer';
import { addChildNode, removeChildNode, replaceNode, updateNode } from '@/utils/treeHelpers';
import { getTreeDiffs } from '@/utils/getTreeDiff';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { treeVisit } from '@contentful/experiences-core';
import { isEqual } from 'lodash-es';
export interface TreeStore {
  tree: ExperienceTree;
  breakpoints: Breakpoint[];
  updateTree: (tree: ExperienceTree) => void;
  updateNodesByUpdatedEntity: (entityId: string) => void;
}

export const useTreeStore = create<TreeStore>((set, get) => ({
  tree: {
    root: {
      children: [],
      type: 'root' as const,
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
      }),
    );
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
    const didBreakpointsChange = hasBreakpointDiffs(currentTree, tree);

    // The current and updated tree are the same, no tree update required.
    // Special case: Breakpoints changed (e.g. empty experience gets reloaded or breakpoints updated)
    if (!treeDiff.length && !didBreakpointsChange) {
      console.debug(
        `[exp-builder.visual-editor::updateTree()]: During smart-diffing no diffs. Skipping tree update.`,
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
                state.tree.root,
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
      }),
    );
  },
}));

const hasBreakpointDiffs = (currentTree: ExperienceTree, newTree: ExperienceTree) => {
  const currentBreakpoints = currentTree?.root?.data?.breakpoints ?? [];
  const newBreakpoints = newTree?.root?.data?.breakpoints ?? [];
  // Consider any difference as a change (id, name, previewSize).
  // Even the order of breakpoints matters as it affects the rendering in useBreakpoints.
  return !isEqual(currentBreakpoints, newBreakpoints);
};

const isAssemblyNode = (node: ExperienceTreeNode) => {
  return node.type === ASSEMBLY_NODE_TYPE;
};

// Serialize and deserialize an object again to remove all functions and references.
// Some people refer to this as "Plain Old JavaScript Object" (POJO) as it solely contains plain data.
const cloneDeepAsPOJO = (obj: unknown) => {
  return JSON.parse(JSON.stringify(obj));
};
