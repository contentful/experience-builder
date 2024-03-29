import React, { useEffect } from 'react';
import { sendMessage } from '@contentful/experiences-core';
import { RootRenderer } from './RootRenderer/RootRenderer';
import SimulateDnD from '@/utils/simulateDnD';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import { useZoneStore } from '@/store/zone';
import { CTFL_ZONE_ID, NEW_COMPONENT_ID } from '@/types/constants';
import { useDraggedItemStore } from '@/store/draggedItem';

export const VisualEditorRoot = () => {
  const initialized = useInitializeEditor();
  const setMousePosition = useDraggedItemStore((state) => state.setMousePosition);
  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition(e.clientX, e.clientY);

      const target = e.target as HTMLElement;
      const zoneId = target.closest(`[${CTFL_ZONE_ID}]`)?.getAttribute(CTFL_ZONE_ID);

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

  if (!initialized) return null;

  return <RootRenderer />;
};
