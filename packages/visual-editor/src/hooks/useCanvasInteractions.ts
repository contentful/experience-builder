import { onComponentMoved } from '@/communication/onComponentMoved';
import { useTreeStore } from '@/store/tree';
import { ROOT_ID } from '@/types/constants';
import { createTreeNode } from '@/utils/createTreeNode';
import { onDrop } from '@/utils/onDrop';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { DropResult } from '@hello-pangea/dnd';

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

    const droppingOnRoot = destination.droppableId === ROOT_ID;
    const isValidRootComponent = draggableId === CONTENTFUL_COMPONENTS.container.id;

    let node = createTreeNode({ blockId: draggableId, parentId: destination.droppableId });

    if (droppingOnRoot && !isValidRootComponent) {
      const wrappingContainer = createTreeNode({
        blockId: CONTENTFUL_COMPONENTS.container.id,
        parentId: destination.droppableId,
      });
      const childNode = createTreeNode({
        blockId: draggableId,
        parentId: wrappingContainer.data.id,
      });

      node = wrappingContainer;
      node.children = [childNode];
    }

    addChild(destination.index, destination.droppableId, node);

    onDrop({
      data: tree,
      componentType: draggableId,
      destinationIndex: destination.index,
      destinationZoneId: destination.droppableId,
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
