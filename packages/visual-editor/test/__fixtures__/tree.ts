import { ExperienceTree } from '../../../core/src/types';

export const tree: ExperienceTree = {
  root: {
    children: [
      {
        children: [],
        type: 'block',
        data: {
          breakpoints: [],
          dataSource: {},
          id: 'component-1',
          props: {},
          unboundValues: {},
          blockId: 'component-1',
        },
      },
      {
        type: 'assembly',
        data: {
          breakpoints: [],
          dataSource: {},
          id: 'assembly-id',
          props: {},
          unboundValues: {},
          blockId: 'assembly-id',
          assembly: {
            id: 'assembly-id',
            componentId: 'assembly-id',
            nodeLocation: '0',
          },
        },
        children: [
          {
            type: 'assemblyBlock',
            data: {
              breakpoints: [],
              dataSource: {},
              id: 'component-2',
              props: {},
              unboundValues: {},
              blockId: 'component-2',
              assembly: {
                id: 'assembly-id',
                componentId: 'assembly-id',
                nodeLocation: '0_0',
              },
            },
            children: [],
          },
        ],
      },
    ],
    type: 'root',
    data: {
      breakpoints: [],
      dataSource: {},
      id: 'root',
      props: {},
      unboundValues: {},
    },
  },
};
