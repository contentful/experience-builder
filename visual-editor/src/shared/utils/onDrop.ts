import { onComponentDropped } from '@/communication/onComponentDrop';
import { getItem } from './getItem';
import { CompositionComponentNode, CompositionTree } from '@contentful/experience-builder-core';
import { generateId } from './generate-id';
import { ROOT_ID } from './constants';

interface OnDropParams {
  data: CompositionTree;
  componentType: string;
  destinationZoneId: string;
  destinationIndex: number;
}
export const onDrop = ({
  destinationIndex,
  componentType,
  destinationZoneId,
  data,
}: OnDropParams) => {
  const parentId = destinationZoneId;

  const parentNode = getItem({ id: parentId }, data);

  const parentIsRoot = parentId === ROOT_ID;

  const emptyComponentData: CompositionComponentNode = {
    type: 'block',
    parentId,
    children: [],
    data: {
      blockId: componentType,
      id: generateId(componentType),
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
