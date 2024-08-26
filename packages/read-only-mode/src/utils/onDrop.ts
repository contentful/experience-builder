import { onComponentDropped } from '@/communication/onComponentDrop';
import { getItem } from './getItem';
import type { ExperienceTreeNode, ExperienceTree } from '@contentful/experiences-core/types';
import { generateId } from './generate-id';
import { ROOT_ID } from '../types/constants';

interface OnDropParams {
  data: ExperienceTree;
  componentType: string;
  destinationZoneId: string;
  destinationIndex: number;
  slotId?: string;
}
export const onDrop = ({
  destinationIndex,
  componentType,
  destinationZoneId,
  data,
  slotId,
}: OnDropParams) => {
  const parentId = destinationZoneId;

  const parentNode = getItem({ id: parentId }, data);

  const parentIsRoot = parentId === ROOT_ID;

  const emptyComponentData: ExperienceTreeNode = {
    type: 'block',
    parentId,
    children: [],
    data: {
      blockId: componentType,
      id: generateId(componentType),
      slotId,
      breakpoints: [],
      dataSource: {},
      props: {},
      unboundValues: {},
    },
  };

  onComponentDropped({
    node: emptyComponentData,
    index: destinationIndex,
    parentType: parentIsRoot ? 'root' : parentNode?.type,
    parentBlockId: parentNode?.data.blockId,
    parentId: parentIsRoot ? 'root' : parentId,
  });
};
