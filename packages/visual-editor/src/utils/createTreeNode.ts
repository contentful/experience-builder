import { CompositionComponentNode } from '@contentful/experience-builder-core/types';
import { generateId } from './generate-id';

interface Params {
  blockId: string;
  parentId: string;
}

export const createTreeNode = ({ blockId, parentId }: Params) => {
  const node: CompositionComponentNode = {
    type: 'block',
    data: {
      id: generateId(blockId),
      blockId,
      props: {},
      dataSource: {},
      breakpoints: [],
      unboundValues: {},
    },
    parentId,
    children: [],
  };

  return node;
};
