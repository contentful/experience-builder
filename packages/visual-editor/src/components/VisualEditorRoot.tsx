import React, { useEffect } from 'react';
import { EntityStore, sendMessage } from '@contentful/experiences-core';
import { RootRenderer } from './RootRenderer/RootRenderer';
import SimulateDnD from '@/utils/simulateDnD';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import { useZoneStore } from '@/store/zone';
import { CTFL_RESIZE_ID, CTFL_ZONE_ID, NEW_COMPONENT_ID } from '@/types/constants';
import { useDraggedItemStore } from '@/store/draggedItem';
import type { Experience } from '@contentful/experiences-core/types';
import { useEditorStore } from '@/store/editor';
import { useResizeStore } from '@/store/resizeItem';

export const VisualEditorRoot = ({ experience }: { experience?: Experience<EntityStore> }) => {
  const initialized = useInitializeEditor();
  const setHyperLinkPattern = useEditorStore((state) => state.setHyperLinkPattern);

  const setIsResize = useResizeStore((state) => state.setIsResize);
  const resizingComponentId = useResizeStore((state) => state.resizingComponentId);
  const setResizingComponent = useResizeStore((state) => state.setResizingComponent);
  const setMousePosition = useDraggedItemStore((state) => state.setMousePosition);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);

  useEffect(() => {
    if (experience?.hyperlinkPattern) {
      setHyperLinkPattern(experience.hyperlinkPattern);
    }
  }, [experience?.hyperlinkPattern, setHyperLinkPattern]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition(e.clientX, e.clientY);

      const target = e.target as HTMLElement;
      const zoneId = target.closest(`[${CTFL_ZONE_ID}]`)?.getAttribute(CTFL_ZONE_ID);
      const isResize = target.getAttribute(CTFL_RESIZE_ID);

      setIsResize(!!isResize);

      if (zoneId) {
        setHoveringZone(zoneId);
      }

      if (!SimulateDnD.isDragging) {
        return;
      }

      if (target.id === NEW_COMPONENT_ID) {
        return;
      }

      SimulateDnD.updateDrag(e.clientX, e.clientY);

      sendMessage(OUTGOING_EVENTS.MouseMove, {
        clientX: e.pageX,
        clientY: e.pageY - window.scrollY,
      });
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      const { initialWidth, initialX } = useResizeStore.getState();

      if (resizingComponentId) {
        setResizingComponent('');
        sendMessage(OUTGOING_EVENTS.DesignValueChanged, {
          nodeId: selectedNodeId,
          variableName: 'cfWidth',
          value: `${initialWidth + initialX - e.pageX}px`,
        });
        // sendMessage(OUTGOING_EVENTS.DesignValueChanged, {
        //   nodeId: selectedNodeId,
        //   variableName: 'cfHeight',
        //   value: `${initialHeight + (initialY + e.pageY)}px`,
        // });
      }
    };

    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizingComponentId, selectedNodeId]);

  if (!initialized) return null;

  return <RootRenderer />;
};
