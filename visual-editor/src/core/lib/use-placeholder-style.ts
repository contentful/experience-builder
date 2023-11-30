import { CSSProperties, useCallback, useState } from 'react';
import { DragStart, DragUpdate } from '@hello-pangea/dnd';
import { useAppContext } from '../components/Puck/context';
import { DRAGGABLE_WIDTH } from '@/utils/constants';
import { rootDroppableId } from './root-droppable-id';

export const usePlaceholderStyle = () => {
  const queryAttr = 'data-rfd-drag-handle-draggable-id';
  const {
    state: { dropZones },
  } = useAppContext();

  const [placeholderStyle, setPlaceholderStyle] = useState<CSSProperties>();

  const onDragStartOrUpdate = useCallback(
    (draggedItem: DragStart & Partial<DragUpdate>) => {
      const draggableId = draggedItem.draggableId;
      const destinationIndex = (draggedItem.destination || draggedItem.source).index;
      const droppableId = (draggedItem.destination || draggedItem.source).droppableId;

      const domQuery = `[${queryAttr}='${draggableId}']`;
      const draggedDOM = document.querySelector(domQuery);

      const direction = dropZones.get(droppableId)?.direction || 'vertical';

      if (!draggedDOM) {
        return;
      }

      const targetListElement = document.querySelector(`[data-rfd-droppable-id='${droppableId}']`);

      const { clientHeight } = draggedDOM;

      if (!targetListElement) {
        return;
      }

      let clientY = 0;
      let clientX = 0;

      const isRoot = draggedItem.destination?.droppableId === rootDroppableId;

      // console.log('IS ROOT', draggedItem.destination?.droppableId, rootDroppableId);
      const isSameDroppable =
        draggedItem.source.droppableId === draggedItem.destination?.droppableId;

      if (destinationIndex > 0 && direction === 'vertical' && isRoot) {
        const end =
          destinationIndex > draggedItem.source.index && isSameDroppable
            ? destinationIndex + 1
            : destinationIndex;

        const children = Array.from(targetListElement.children)
          .filter(
            (item) =>
              item !== draggedDOM &&
              item.getAttributeNames().indexOf('data-puck-placeholder') === -1 &&
              item.getAttributeNames().indexOf('data-rfd-placeholder-context-id') === -1
          )
          .slice(0, end);

        clientY = children.reduce(
          (total, item) =>
            total +
            item.clientHeight +
            parseInt(window.getComputedStyle(item).marginTop.replace('px', '')) +
            parseInt(window.getComputedStyle(item).marginBottom.replace('px', '')),

          0
        );
      }

      if (direction === 'vertical' && !isRoot) {
        const children = Array.from(targetListElement.children).filter(
          (item) =>
            item.getAttributeNames().indexOf('data-puck-placeholder') === -1 &&
            item.getAttributeNames().indexOf('data-rfd-placeholder-context-id') === -1
        );

        let index = destinationIndex;

        if (destinationIndex >= children.length) {
          index = children.length - 1;
        }

        const destinationChild = children[index];

        const [offsetChild, offsetParent] = destinationChild
          ? [
              destinationChild.getBoundingClientRect(),
              destinationChild.parentElement?.getBoundingClientRect(),
            ]
          : [null, null];

        const offsetTop = (offsetChild?.y || 0) - (offsetParent?.y || 0);
        const offsetHeight = destinationIndex >= children.length ? offsetChild?.height || 0 : 0;

        const translateValue = destinationChild?.children?.[0]
          ? window.getComputedStyle(destinationChild.children[0]).transform
          : '';

        const hasTranslationApplied = translateValue.includes(DRAGGABLE_WIDTH.toString());

        // const translationOffset = hasTranslationApplied ? 0 : DRAGGABLE_WIDTH;
        const translationOffset = 0;
        const paddingTop = parseInt(
          window.getComputedStyle(targetListElement).paddingTop.replace('px', '')
        );

        clientY = offsetTop + offsetHeight - translationOffset;
      }

      if (direction === 'horizontal') {
        const children = Array.from(targetListElement.children).filter(
          (item) =>
            item.getAttributeNames().indexOf('data-puck-placeholder') === -1 &&
            item.getAttributeNames().indexOf('data-rfd-placeholder-context-id') === -1
        );

        let index = destinationIndex;

        if (destinationIndex >= children.length) {
          index = children.length - 1;
        }

        const destinationChild = children[index];

        const [offsetChild, offsetParent] = destinationChild
          ? [
              destinationChild.getBoundingClientRect(),
              destinationChild.parentElement?.getBoundingClientRect(),
            ]
          : [null, null];

        const offsetLeft = (offsetChild?.x || 0) - (offsetParent?.x || 0);
        const offsetWidth = destinationIndex >= children.length ? offsetChild?.width || 0 : 0;

        const translateValue = destinationChild?.children?.[0]
          ? window.getComputedStyle(destinationChild.children[0]).transform
          : '';

        const hasTranslationApplied = translateValue.includes(DRAGGABLE_WIDTH.toString());

        // const translationOffset = hasTranslationApplied ? 0 : DRAGGABLE_WIDTH;
        const translationOffset = 0;

        clientX = offsetLeft + offsetWidth - translationOffset;
      }

      setPlaceholderStyle({
        position: 'absolute',
        top: clientY,
        left: clientX,
        height: direction === 'horizontal' ? '100%' : clientHeight,
        width: direction === 'horizontal' ? DRAGGABLE_WIDTH : '100%',
        zIndex: 0,
        opacity: 0.4,
        backgroundColor: '#0059C8',
      });
    },
    [dropZones]
  );

  return { onDragStartOrUpdate, placeholderStyle };
};
