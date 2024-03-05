import { useDraggedItemStore } from '@/store/draggedItem';
import { MutableRefObject, useEffect } from 'react';

interface Params {
  draggableRef: MutableRefObject<HTMLElement | null | undefined>;
  draggableId: string;
}

export default function useCenterDraggablePosition({ draggableId, draggableRef }: Params) {
  const isDraggingOnCanvas = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const draggingId = useDraggedItemStore((state) => state.onBeforeCaptureId);

  useEffect(() => {
    if (!isDraggingOnCanvas) {
      return;
    }

    if (draggingId !== draggableId) {
      return;
    }

    const el: HTMLElement | undefined | null = draggableRef?.current;

    if (!el) {
      return;
    }

    const { width, height } = el.getBoundingClientRect();

    const { mouseX, mouseY } = useDraggedItemStore.getState();

    const left = `${mouseX - width / 2}px`;
    const top = `${mouseY - height / 2}px`;

    el.style.position = 'fixed';
    el.style.left = left;
    el.style.top = top;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggableRef, draggableId, isDraggingOnCanvas, draggingId]);
}
