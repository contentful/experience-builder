import { Breakpoint, CompositionTree } from '@contentful/experience-builder-core';
import { ROOT_ID } from '@/shared/utils/constants';
import { create } from 'zustand';

export interface TreeStore {
  tree: CompositionTree;
  breakpoints: Breakpoint[];
  updateTree: (tree: CompositionTree) => void;
}

export const useTreeStore = create<TreeStore>((set) => ({
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
  updateTree: (tree) => set({ tree, breakpoints: tree?.root?.data?.breakpoints || [] }),
}));
