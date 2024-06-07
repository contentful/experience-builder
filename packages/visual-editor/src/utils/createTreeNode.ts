import { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { generateId } from './generate-id';

interface Params {
  blockId: string;
  parentId: string;
  slotId?: string;
}

export const createTreeNode = ({ blockId, parentId, slotId }: Params) => {
  const node: ExperienceTreeNode = {
    type: 'block',
    data: {
      id: generateId(blockId),
      blockId,
      slotId,
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
