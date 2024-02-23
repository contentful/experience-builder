import React, { useEffect } from 'react';
import { sendMessage } from '@contentful/experience-builder-core';
import dragState from '@/utils/dragState';
import { RootRenderer } from './RootRenderer/RootRenderer';
import { simulateMouseEvent } from '@/utils/simulateMouseEvent';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import { useEntityStore } from '@/store/entityStore';
import { useEditorStore } from '@/store/editor';
import { useZoneStore } from '@/store/zone';
import { CTFL_ZONE_ID } from '@/types/constants';

const findNearestDropzone = (element: HTMLElement) => {
  const zoneId = element.getAttribute(CTFL_ZONE_ID);

  if (!element.parentElement) {
    return '';
  }

  if (element.tagName === 'BODY') {
    return '';
  }

  return zoneId ?? findNearestDropzone(element.parentElement);
};

export const VisualEditorRoot = () => {
  const initialized = useInitializeEditor();
  const locale = useEditorStore((state) => state.locale);
  const setHoveringZone = useZoneStore((state) => state.setHoveringZone);
  const resetEntityStore = useEntityStore((state) => state.resetEntityStore);

  useEffect(() => {
    if (!locale) {
      return;
    }

    resetEntityStore(locale);
  }, [locale, resetEntityStore]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const zoneId = findNearestDropzone(target);

      if (zoneId) {
        setHoveringZone(zoneId);
      }

      if ((e.target as HTMLElement)?.id === 'item') {
        return;
      }

      if (!dragState.isDragStart) {
        return;
      }

      simulateMouseEvent(e.pageX, e.pageY);

      sendMessage(OUTGOING_EVENTS.MouseMove, {
        clientX: e.pageX,
        clientY: e.pageY - window.scrollY,
      });
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  if (!initialized) return null;

  return <RootRenderer />;
};
