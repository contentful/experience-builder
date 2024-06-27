import React, { CSSProperties, useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';
import DraggableContainer from '@/components/DraggableHelpers/DraggableComponentList';
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
import { Dropzone } from '@components/DraggableBlock/Dropzone';

interface Props {
  onChange?: (data: ExperienceTree) => void;
}

export const RootRenderer: React.FC<Props> = ({ onChange }) => {
  useEditorSubscriber();

  const dragItem = useDraggedItemStore((state) => state.componentId);
  const userIsDragging = useDraggedItemStore((state) => state.isDraggingOnCanvas);
  const setHoveredComponentId = useDraggedItemStore((state) => state.setHoveredComponentId);
  const breakpoints = useTreeStore((state) => state.breakpoints);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolveDesignValue } = useBreakpoints(breakpoints);
  const [containerStyles, setContainerStyles] = useState<CSSProperties>({});
  const tree = useTreeStore((state) => state.tree);

  const handleMouseOver = useCallback(() => {
    // Remove hover state set by UI when mouse is over canvas
    setHoveredComponentId();
    // Remove hover styling from components in the layers tab
    sendMessage(OUTGOING_EVENTS.NewHoveredElement, {});
  }, [setHoveredComponentId]);

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
        nodeId: '',
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
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [handleMouseOver]);

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
