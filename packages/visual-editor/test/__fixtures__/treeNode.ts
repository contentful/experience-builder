import { ExperienceTreeNode } from '@contentful/experiences-core/types';

export const treeNode = {
  type: 'block',
  data: {
    id: 'block-1',
    blockId: 'block-1',
    props: {
      title: {
        type: 'DesignValue',
        valuesByBreakpoint: { mobile: 'Block 1' },
      },
    },
    unboundValues: {},
    dataSource: {},
    breakpoints: [
      {
        id: 'mobile',
        displayName: 'Mobile',
        query: '>400px',
        displayIcon: 'mobile',
        previewSize: '320px',
      },
    ],
  },
  children: [],
} as ExperienceTreeNode;
