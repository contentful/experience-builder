import { onComponentMoved } from '@/communication/onComponentMoved';
import { useTreeStore } from '@/store/tree';
import { ROOT_ID } from '@/types/constants';
import { createTreeNode } from '@/utils/createTreeNode';
import { onDrop } from '@/utils/onDrop';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { DropResult } from '@hello-pangea/dnd';
import { parseZoneId } from '@/utils/zone';

export default function useCanvasInteractions() {
  const tree = useTreeStore((state) => state.tree);
  const reorderChildren = useTreeStore((state) => state.reorderChildren);
  const reparentChild = useTreeStore((state) => state.reparentChild);
  const addChild = useTreeStore((state) => state.addChild);

  const onAddComponent = (droppedItem: DropResult) => {
    const { destination, draggableId } = droppedItem;

    if (!destination) {
      return;
    }

    const [blockId, isAssembly] = draggableId.split(':');

    const { nodeId: parentId, slotId } = parseZoneId(destination.droppableId);

    const droppingOnRoot = parentId === ROOT_ID;
    const isValidRootComponent = blockId === CONTENTFUL_COMPONENTS.container.id;

    let node = createTreeNode({ blockId: blockId, parentId, slotId });

    if (droppingOnRoot && !isValidRootComponent) {
      const wrappingContainer = createTreeNode({
        blockId: CONTENTFUL_COMPONENTS.container.id,
        parentId,
      });
      const childNode = createTreeNode({
        blockId: blockId,
        parentId: wrappingContainer.data.id,
      });

      node = wrappingContainer;
      node.children = [childNode];
    }

    if (!isAssembly) {
      addChild(destination.index, parentId, node);
    }

    onDrop({
      data: tree,
      componentType: blockId,
      destinationIndex: destination.index,
      destinationZoneId: parentId,
      slotId,
    });
  };

  const onMoveComponent = (droppedItem: DropResult) => {
    const { destination, source, draggableId } = droppedItem;

    if (!destination || !source) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      reorderChildren(destination.index, destination.droppableId, source.index);
    }

    if (destination.droppableId !== source.droppableId) {
      reparentChild(destination.index, destination.droppableId, source.index, source.droppableId);
    }

    onComponentMoved({
      nodeId: draggableId,
      destinationIndex: destination.index,
      destinationParentId: destination.droppableId,
      sourceIndex: source.index,
      sourceParentId: source.droppableId,
    });
  };

  return { onAddComponent, onMoveComponent };
}
