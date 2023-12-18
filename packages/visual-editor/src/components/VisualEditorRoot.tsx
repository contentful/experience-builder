import React, { useEffect, useState } from 'react';
import { useEditorSubscriber } from '@/hooks/useEditorSubscriber';
import { EditorModeEntityStore, sendMessage } from '@contentful/experience-builder-core';
import dragState from '@/utils/dragState';
import { RootRenderer } from './RootRenderer/RootRenderer';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEditorStore } from '@/store/editor';
import { useTreeStore } from '@/store/tree';
import { simulateMouseEvent } from '@/utils/simulateMouseEvent';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core/constants';

export const VisualEditorRoot = () => {
  const initialized = useEditorSubscriber();

  const dataSource = useEditorStore((state) => state.dataSource);
  const locale = useEditorStore((state) => state.locale);
  const breakpoints = useTreeStore((state) => state.breakpoints);
  const entityStore = useEditorStore((state) => state.entityStore);
  const setEntityStore = useEditorStore((state) => state.setEntityStore);

  const [areEntitiesFetched, setEntitiesFetched] = useState(false);

  const { resolveDesignValue } = useBreakpoints(breakpoints);

  useEffect(() => {
    if (!locale) return;
    setEntityStore(
      new EditorModeEntityStore({
        entities: [],
        locale: locale,
      })
    );
  }, [locale]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if ((e.target as any)?.id === 'item') {
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

    const onMouseUp = () => {
      sendMessage(OUTGOING_EVENTS.MouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  useEffect(() => {
    const resolveEntities = async () => {
      setEntitiesFetched(false);
      const dataSourceEntityLinks = Object.values(dataSource || {});
      await entityStore?.fetchEntities([
        ...dataSourceEntityLinks,
        // ...(designComponentsRegistry.values() || []),
      ]);
      setEntitiesFetched(true);
    };

    resolveEntities();
  }, [dataSource, entityStore, locale]);

  if (!initialized || !entityStore) return null;

  return (
    <RootRenderer resolveDesignValue={resolveDesignValue} areEntitiesFetched={areEntitiesFetched} />
  );
};
