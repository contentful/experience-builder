import React, { CSSProperties, useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Dropzone } from '../Dropzone/Dropzone';
import DraggableContainer from '../Draggable/DraggableComponentList';
import type { ExperienceTree } from '@contentful/experiences-core/types';

import { DRAGGABLE_HEIGHT, ROOT_ID } from '@/types/constants';
import { useTreeStore } from '@/store/tree';
import { useDraggedItemStore } from '@/store/draggedItem';
import styles from './render.module.css';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEditorSubscriber } from '@/hooks/useEditorSubscriber';
import { DNDProvider } from './DNDProvider';
import { sendMessage } from '@contentful/experiences-core';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { useEditorStore } from '@/store/editor';
import html2canvas from 'html2canvas';

interface Props {
  onChange?: (data: ExperienceTree) => void;
}

export const RootRenderer: React.FC<Props> = ({ onChange }) => {
  useEditorSubscriber();

  const dragItem = useDraggedItemStore((state) => state.componentId);
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const breakpoints = useTreeStore((state) => state.breakpoints);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolveDesignValue } = useBreakpoints(breakpoints);
  const [containerStyles, setContainerStyles] = useState<CSSProperties>({});
  const tree = useTreeStore((state) => state.tree);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const element = e.target as HTMLElement;

      const isRoot = element.getAttribute('data-ctfl-zone-id') === ROOT_ID;
      const clickedOnCanvas = element.closest(`[data-ctfl-root]`);

      if (clickedOnCanvas && !isRoot) {
        return;
      }

      sendMessage(OUTGOING_EVENTS.OutsideCanvasClick, {
        outsideCanvasClick: true,
      });
      sendMessage(OUTGOING_EVENTS.ComponentSelected, {
        selectedId: '',
      });
      setSelectedNodeId('');
    },
    [setSelectedNodeId],
  );

  const handleResizeCanvas = useCallback(() => {
    const parentElement = containerRef.current?.parentElement;
    if (!parentElement) {
      return;
    }

    let siblingHeight = 0;

    for (const child of parentElement.children) {
      if (!child.hasAttribute('data-ctfl-root')) {
        siblingHeight += child.getBoundingClientRect().height;
      }
    }

    if (!siblingHeight) {
      /**
       * DRAGGABLE_HEIGHT is subtracted here due to an uninteded scrolling effect
       * when dragging a new component onto the canvas
       *
       * The DRAGGABLE_HEIGHT is then added as margin bottom to offset this value
       * so that visually there is no difference to the user.
       */
      setContainerStyles({
        minHeight: `${window.innerHeight - DRAGGABLE_HEIGHT}px`,
      });
      return;
    }

    setContainerStyles({
      minHeight: `${window.innerHeight - siblingHeight}px`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  useEffect(() => {
    if (onChange) onChange(tree);
  }, [tree, onChange]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    handleResizeCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  useEffect(() => {
    setTimeout(() => {
      html2canvas(document.documentElement, {
        logging: true,
        allowTaint: false,
        useCORS: true,
      }).then(function (canvas) {
        const scrollCroppedCanvas = document.createElement('canvas');
        const cropScrollLeft = document.documentElement.scrollLeft;
        const cropScrollTop = document.documentElement.scrollTop;

        scrollCroppedCanvas.width = canvas.width - cropScrollLeft;
        scrollCroppedCanvas.height = canvas.height - cropScrollTop;

        scrollCroppedCanvas
          ?.getContext('2d')
          ?.drawImage(
            canvas,
            cropScrollLeft,
            cropScrollTop,
            scrollCroppedCanvas.width,
            scrollCroppedCanvas.height,
            0,
            0,
            scrollCroppedCanvas.width,
            scrollCroppedCanvas.height,
          );

        // Convert the cropped canvas to base64 string
        const base64String = scrollCroppedCanvas.toDataURL().split(',')[1];

        sendMessage(OUTGOING_EVENTS.UpdateThumbnail, { base64String });

        // Now you have the base64 string, you can use it as needed.
        // For example, you can send it to a server or manipulate it further.

        // var filename = 'canvas_image.png';
        // saveCanvasImage(scrollCroppedCanvas.toDataURL(), filename);
        // document.body.appendChild(canvas);
      });
    }, 2000);
  }, []);

  return (
    <DNDProvider>
      {dragItem && <DraggableContainer id={dragItem} />}
      <div data-ctfl-root className={styles.container} ref={containerRef} style={containerStyles}>
        {userIsDragging && <div data-ctfl-zone-id={ROOT_ID} className={styles.hitbox} />}
        <Dropzone zoneId={ROOT_ID} resolveDesignValue={resolveDesignValue} />
        {userIsDragging && <div data-ctfl-zone-id={ROOT_ID} className={styles.hitboxLower} />}
      </div>
      <div data-ctfl-hitboxes />
    </DNDProvider>
  );
};
