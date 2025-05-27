import React, { useEffect } from 'react';
import {
  type InMemoryEntitiesStore,
  inMemoryEntitiesStore as defaultInMemoryEntitiesStore,
  EntityStore,
  sendMessage,
} from '@contentful/experiences-core';
import { RootRenderer } from './RootRenderer/RootRenderer';
import SimulateDnD from '@/utils/simulateDnD';
import { OUTGOING_EVENTS } from '@contentful/experiences-core/constants';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import { useZoneStore } from '@/store/zone';
import { CTFL_ZONE_ID, NEW_COMPONENT_ID } from '@/types/constants';
import { useDraggedItemStore } from '@/store/draggedItem';
import type { Experience } from '@contentful/experiences-core/types';
import { useEditorStore } from '@/store/editor';

export const VisualEditorRoot = ({
  experience,
  inMemoryEntitiesStore = defaultInMemoryEntitiesStore,
}: {
  experience?: Experience<EntityStore>;
  inMemoryEntitiesStore?: InMemoryEntitiesStore;
}) => {
  const initialized = useInitializeEditor(inMemoryEntitiesStore);
  const setHyperLinkPattern = useEditorStore((state) => state.setHyperLinkPattern);

  const setMousePosition = useDraggedItemStore((state) => state.setMousePosition);
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
        clientX: e.pageX - window.scrollX,
        clientY: e.pageY - window.scrollY,
      });
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [setHoveringZone, setMousePosition]);

  if (!initialized) return null;

  return <RootRenderer inMemoryEntitiesStore={inMemoryEntitiesStore} />;
};
