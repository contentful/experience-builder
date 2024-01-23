import { useCallback } from 'react';
import { ROOT_ID } from '../types/constants';
import { usePlaceholderStyleStore } from '@/store/placeholderStyle';
import { useZoneStore } from '@/store/zone';
import { DraggedItem } from '@/store/draggedItem';

export const usePlaceholderStyle = () => {
  const queryAttr = 'data-rfd-drag-handle-draggable-id';

  const updateStyle = usePlaceholderStyleStore((state) => state.updateStyle);
  const zones = useZoneStore((state) => state.zones);

  const onDragStartOrUpdate = useCallback(
    (draggedItem: DraggedItem) => {
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

      const children = Array.from(targetListElement.children).filter((item) => {
        return (
          item !== draggedDOM &&
          item.getAttributeNames().indexOf('data-ctfl-placeholder') === -1 &&
          item.getAttributeNames().indexOf('data-rfd-placeholder-context-id') === -1
        );
      });

      if (destinationIndex > 0 && direction === 'vertical' && isRoot) {
        const childrenAbove = children.slice(0, destinationIndex);
        clientY = childrenAbove.reduce((total, item) => {
          const childrenMarginY = Array.from(item.children).reduce(
            (childrenTotal, child) =>
              childrenTotal +
              parseInt(window.getComputedStyle(child).marginTop.replace('px', '')) +
              parseInt(window.getComputedStyle(child).marginBottom.replace('px', '')),
            0
          );

          return (
            total +
            item.clientHeight +
            parseInt(window.getComputedStyle(item).marginTop.replace('px', '')) +
            parseInt(window.getComputedStyle(item).marginBottom.replace('px', '')) +
            childrenMarginY
          );
        }, 0);
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

      const shouldShowBackgroundColor =
        !!draggedItem.source.droppableId.startsWith('component-list');

      const backgroundColor = shouldShowBackgroundColor
        ? 'rgba(var(--exp-builder-blue300-rgb), 0.5)'
        : 'unset';

      updateStyle({
        position: 'absolute',
        top: clientY,
        left: clientX,
        height: direction === 'horizontal' ? '100%' : clientHeight,
        width: direction === 'horizontal' ? clientWidth : '100%',
        zIndex: 0,
        backgroundColor,
        outlineOffset: '-2px',
      });
    },
    [zones, updateStyle]
  );

  return { onDragStartOrUpdate };
};
