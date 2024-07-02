import { useDraggedItemStore } from '@/store/draggedItem';
import { useResizeStore } from '@/store/resizeItem';
import React, { useEffect, useRef } from 'react';

interface Props {
  componentId: string;
  element: HTMLElement | null;
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const ResizeHandlers: React.FC<Props> = ({ element, componentId }) => {
  const setResizingComponent = useResizeStore((state) => state.setResizingComponent);
  const resizingComponentId = useResizeStore((state) => state.resizingComponentId);
  const setInitialCoords = useResizeStore((state) => state.setInitialCoords);
  const setInitialSize = useResizeStore((state) => state.setInitialSize);
  const initialHeight = useResizeStore((state) => state.initialHeight);
  const initialWidth = useResizeStore((state) => state.initialWidth);
  const initialX = useResizeStore((state) => state.initialX);
  const initialY = useResizeStore((state) => state.initialY);
  const mouseX = useDraggedItemStore((state) => state.mouseX);
  const mouseY = useDraggedItemStore((state) => state.mouseY);

  const isResizing = resizingComponentId === componentId;

  useEffect(() => {
    if (!isResizing || !element) {
      return;
    }

    const deltaX = initialWidth + initialX - mouseX;
    // const deltaY = initialHeight + initialY + mouseY;

    element.style.width = `${deltaX}px`;
    // element.style.height = `${deltaY}px`;
  }, [initialY, initialX, mouseX, mouseY, initialHeight, initialWidth, isResizing, element]);
  return (
    <>
      <div
        data-ctfl-resize
        onMouseDown={(e) => {
          setResizingComponent(componentId);
          const width = element?.getBoundingClientRect()?.width || 0;
          const height = element?.getBoundingClientRect()?.height || 0;
          setInitialCoords({ x: e.pageX, y: e.pageY });
          setInitialSize({ width, height });
          e.stopPropagation();
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 15,
          height: '100%',
          cursor: 'ew-resize',
          zIndex: 100,
          pointerEvents: 'all',
        }}
      />
      <div
        data-ctfl-resize
        onMouseDown={(e) => {
          const width = element?.getBoundingClientRect()?.width || 0;
          const height = element?.getBoundingClientRect()?.height || 0;
          setResizingComponent(componentId);
          setInitialCoords({ x: e.pageX, y: e.pageY });
          setInitialSize({ width, height });
          e.stopPropagation();
        }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 15,
          height: '100%',
          cursor: 'ew-resize',
          zIndex: 100,
          pointerEvents: 'all',
        }}
      />
    </>
  );
};

export default ResizeHandlers;
