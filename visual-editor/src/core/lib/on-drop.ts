import { onComponentDropped } from '@/communication/onComponentDrop';
import { getZoneId } from './get-zone-id';
import { getItem } from './get-item';
import { Data } from '../types/Config';
import { rootDroppableId } from './root-droppable-id';
import { CompositionComponentNode } from '@contentful/experience-builder-core';
import { generateId } from './generate-id';

interface OnDropParams {
  data: Data;
  componentType: string;
  destinationZone: string;
  destinationIndex: number;
}
export const onDrop = ({
  destinationIndex,
  componentType,
  destinationZone,
  data,
}: OnDropParams) => {
  const [areaId, zoneId] = getZoneId(destinationZone);

  const parentId = zoneId || areaId;

  const parentNode = getItem({ id: parentId }, data);

  const parentIsRoot = parentId === rootDroppableId;

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
