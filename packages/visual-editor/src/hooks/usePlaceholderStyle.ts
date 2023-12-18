import { useCallback } from 'react';
import { DragStart, DragUpdate } from '@hello-pangea/dnd';
import { ROOT_ID } from '../types/constants';
import { usePlaceholderStyleStore } from '@/store/placeholderStyle';
import { useZoneStore } from '@/store/zone';

export const usePlaceholderStyle = () => {
  const queryAttr = 'data-rfd-drag-handle-draggable-id';

  const updateStyle = usePlaceholderStyleStore((state) => state.updateStyle);
  const zones = useZoneStore((state) => state.zones);

  const onDragStartOrUpdate = useCallback(
    (draggedItem: DragStart & Partial<DragUpdate>) => {
      const draggableId = draggedItem.draggableId;
      const destinationIndex = (draggedItem.destination || draggedItem.source).index;
      const droppableId = (draggedItem.destination || draggedItem.source).droppableId;

      const domQuery = `[${queryAttr}='${draggableId}']`;
      const draggedDOM = document.querySelector(domQuery);

      const direction = zones[droppableId]?.direction || 'vertical';

      if (!draggedDOM) {
        return;
      }

      const targetListElement = document.querySelector(`[data-rfd-droppable-id='${droppableId}']`);

      const { clientHeight, clientWidth } = draggedDOM;

      if (!targetListElement) {
        return;
      }

      let clientY = 0;
      let clientX = 0;

      const isRoot = draggedItem.destination?.droppableId === ROOT_ID;

      const isSameDroppable =
        draggedItem.source.droppableId === draggedItem.destination?.droppableId;

      const children = Array.from(targetListElement.children).filter(
        (item) =>
          item !== draggedDOM &&
          item.getAttributeNames().indexOf('data-ctfl-placeholder') === -1 &&
          item.getAttributeNames().indexOf('data-rfd-placeholder-context-id') === -1
      );

      if (destinationIndex > 0 && direction === 'vertical' && isRoot) {
        const end =
          destinationIndex > draggedItem.source.index && isSameDroppable
            ? destinationIndex + 1
            : destinationIndex;

        const rootChildren = children.slice(0, end);

        clientY = rootChildren.reduce(
          (total, item) =>
            total +
            item.clientHeight +
            parseInt(window.getComputedStyle(item).marginTop.replace('px', '')) +
            parseInt(window.getComputedStyle(item).marginBottom.replace('px', '')),

          0
        );
      }

      if (direction === 'vertical' && !isRoot) {
        let index = destinationIndex;

        if (destinationIndex >= children.length) {
          index = children.length - 1;
        }

        const isEnd = destinationIndex === children.length;

        const destinationChild = children[index];

        const [offsetChild, offsetParent] = destinationChild
          ? [
              destinationChild.getBoundingClientRect(),
              destinationChild.parentElement?.getBoundingClientRect(),
            ]
          : [null, null];

        const offsetTop =
          (offsetChild?.y || 0) - (offsetParent?.y || 0) + (isEnd ? offsetChild?.height || 0 : 0);

        const translateStyle = destinationChild
          ? window.getComputedStyle(destinationChild).transform
          : '';

        let translateValue = 0;
        const translateParts = translateStyle.split(', ');

        if (translateParts.length === 6) {
          translateValue = Number(translateParts[5].replace(')', ''));
        }
        clientY = offsetTop - translateValue;
      }

      if (direction === 'horizontal') {
        let index = destinationIndex;

        if (destinationIndex >= children.length) {
          index = children.length - 1;
        }

        const isEnd = destinationIndex === children.length;

        const destinationChild = children[index];

        const [offsetChild, offsetParent] = destinationChild
          ? [
              destinationChild.getBoundingClientRect(),
              destinationChild.parentElement?.getBoundingClientRect(),
            ]
          : [null, null];

        const offsetLeft =
          (offsetChild?.x || 0) - (offsetParent?.x || 0) + (isEnd ? offsetChild?.width || 0 : 0);

        const translateStyle = destinationChild
          ? window.getComputedStyle(destinationChild).transform
          : '';

        let translateValue = 0;
        const translateParts = translateStyle.split(', ');

        if (translateParts.length === 6) {
          translateValue = Number(translateParts[4]);
        }

        clientX = offsetLeft - translateValue;
      }

      updateStyle({
        position: 'absolute',
        top: clientY,
        left: clientX,
        height: direction === 'horizontal' ? '100%' : clientHeight,
        width: direction === 'horizontal' ? clientWidth : '100%',
        zIndex: 0,
        opacity: 0.4,
        backgroundColor: 'var(--exp-builder-blue200)',
        outline: '1px dashed var(--exp-builder-blue600)',
        outlineOffset: -1,
      });
    },
    [zones]
  );

  return { onDragStartOrUpdate };
};
