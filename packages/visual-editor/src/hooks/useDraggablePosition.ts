import { useDraggedItemStore } from '@/store/draggedItem';
import { DraggablePosition } from '@/types/constants';
import { MutableRefObject, useEffect } from 'react';

interface Params {
  draggableRef: MutableRefObject<HTMLElement | null | undefined>;
  draggableId: string;
  position: DraggablePosition;
}

export default function useDraggablePosition({ draggableId, draggableRef, position }: Params) {
  const isDraggingOnCanvas = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const draggingId = useDraggedItemStore((state) => state.onBeforeCaptureId);
  const preDragDomRect = useDraggedItemStore((state) => state.domRect);

  useEffect(() => {
    const el: HTMLElement | undefined | null = draggableRef?.current;

    if (!isDraggingOnCanvas || draggingId !== draggableId || !el) {
      return;
    }

    const isCentered = position === DraggablePosition.CENTERED || !preDragDomRect;

    const domRect = isCentered ? el.getBoundingClientRect() : preDragDomRect;

    const { mouseX, mouseY } = useDraggedItemStore.getState();

    const top = isCentered ? mouseY - domRect.height / 2 : domRect.top;
    const left = isCentered ? mouseX - domRect.width / 2 : domRect.left;

    el.style.position = 'fixed';
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.width = `${domRect.width}px`;
    el.style.height = `${domRect.height}px`;
  }, [draggableRef, draggableId, isDraggingOnCanvas, draggingId, position, preDragDomRect]);
}
