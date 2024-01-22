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
import { intersection } from '@/utils/intersection';
import { entityIdsOfDataSource } from '@/utils/other';
export interface TreeStore {
  tree: CompositionTree;
  breakpoints: Breakpoint[];
  updateTree: (tree: CompositionTree) => void;
  updateTreeForced: (tree: CompositionTree) => void;
  updateEmbedNodesOfAssemblies: (assemblies: string[]) => void;
  updateReferentNodesOfEntities: (entityIds: string[]) => void;
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

  updateEmbedNodesOfAssemblies: (assemblies) => {
    if (!assemblies.length) return;
    console.log(`:::updateEmbedNodesOfAssemblies()`);

    set(
      produce((draftState: TreeStore) => {
        const currentTree = draftState.tree;
        const embedNodes: Array<[string, CompositionComponentNode]> = [];

        treeVisit(currentTree.root, (node) => {
          if (!isAssemblyNode(node)) return;
          const { id, blockId } = node.data;

          assemblies.forEach((assemblyId) => {
            if (blockId !== assemblyId) return;
            console.log(
              `::: updateEmbedNodesOfAssemblies() found an embed node(${id}) for <embed block=${assemblyId}>`,
              node
            );
            embedNodes.push([id, node]);
          });
        });
        console.log(
          `:::updateEmbedNodesOfAssemblies() found ${embedNodes.length} embed nodes to update`,
          embedNodes
        );

        for (const [nodeId, node] of embedNodes) {
          // Just need dumb clone via JSON.parse(JSON.stringify(node)) to
          // produce a new object with new referential equality
          // Keep in mind that structuredClone() won't work because the node
          // has reference to Window somewhere in it's graph
          updateNode(nodeId, cloneDeepAsPOJO(node), draftState.tree.root); // but this node, will be exactly the same in terms of data? :/
        }
      })
    );
  },

  updateReferentNodesOfEntities: (updatedEntities: string[]) => {
    const isNodeAbleToUseDataSource = (node: CompositionComponentNode) => {
      return Boolean(node.data.dataSource);
    };

    if (!updatedEntities.length) return;

    console.log(`:::updateReferentNodesOfEntities(${updatedEntities.join(', ')})`);
    set(
      produce((draftState: TreeStore) => {
        const currentTree = draftState.tree;
        const referentNodes: Array<[string, CompositionComponentNode]> = [];
        treeVisit(currentTree.root, (node) => {
          if (!isNodeAbleToUseDataSource(node)) return;

          const intersectElements = intersection(
            updatedEntities,
            entityIdsOfDataSource(node.data.dataSource)
          );
          if (intersectElements.length) {
            console.log(
              `:::updateReferentNodesOfEntities() found an referent node(${node.data.id}) for <${
                node.data.blockId
              } dataSourceIntersection=${intersectElements.join(', ')}>`,
              node
            );
            referentNodes.push([node.data.id, node]);
          }
        });
        console.log(
          `:::updateReferentNodesOfEntities() found ${referentNodes.length} dataSource referent nodes to update`,
          referentNodes
        );
        for (const [nodeId, node] of referentNodes) {
          updateNode(nodeId, cloneDeepAsPOJO(node), draftState.tree.root);
        }
      })
    );
  },

  /**
   * Force updates entire tree. Usually shouldn't be used as updateTree()
   * uses smart update algorithm based on diffs. But for troubleshooting
   * you may want to force update the tree so leaving this in.
   */
  updateTreeForced: (tree) => {
    console.info('::: updateTreeForced!', tree);
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
      console.warn(`:::no tree diff found, skipping updateTree()`);
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

function cloneDeepAsPOJO(obj) {
  return JSON.parse(JSON.stringify(obj));
}
