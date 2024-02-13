import React, { useEffect } from 'react';
import { sendMessage } from '@contentful/experience-builder-core';
import dragState from '@/utils/dragState';
import { RootRenderer } from './RootRenderer/RootRenderer';
import { simulateMouseEvent } from '@/utils/simulateMouseEvent';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';
import { useInitializeEditor } from '@/hooks/useInitializeEditor';
import { useEntityStore } from '@/store/entityStore';
import { useEditorStore } from '@/store/editor';

export const VisualEditorRoot = () => {
  const initialized = useInitializeEditor();
  const locale = useEditorStore((state) => state.locale);
  const entityStore = useEntityStore((state) => state.entityStore);
  const resetEntityStore = useEntityStore((state) => state.resetEntityStore);

  useEffect(() => {
    if (!locale) {
      return;
    }
    if (entityStore.locale === locale) {
      return;
    }

    resetEntityStore(locale);
  }, [locale, resetEntityStore, entityStore.locale]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
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
