import React, { useEffect, useState } from 'react';

import { VisualEditorBlock } from './VisualEditorBlock';
import '../../styles/VisualEditorRoot.css';
import { onComponentDropped } from '../../communication/onComponentDrop';
import { EditorModeEntityStore } from '../../core/EditorModeEntityStore';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { CompositionTree, InternalSDKMode } from '@contentful/experience-builder-core';
import { useEditorContext } from './useEditorContext';
import { VisualEditorContextProvider, designComponentsRegistry } from './VisualEditorContext';
import { ComponentRegistration, OUTGOING_EVENTS } from '@contentful/experience-builder-core';
import { sendMessage } from '@/communication/sendMessage';

type VisualEditorRootProps = {
  initialLocale: string;
  initialTree: CompositionTree;
  initialComponentRegistry: Map<string, ComponentRegistration>;
  mode: InternalSDKMode;
};

export const VisualEditorRoot = ({
  initialLocale,
  mode,
  initialTree,
  initialComponentRegistry,
}: VisualEditorRootProps) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale

  return (
    <VisualEditorContextProvider
      initialComponentRegistry={initialComponentRegistry}
      initialTree={initialTree}
      mode={mode}
      initialLocale={initialLocale}>
      <VisualEditorRootComponents />
    </VisualEditorContextProvider>
  );
};

const VisualEditorRootComponents = () => {
  const { tree, dataSource, isDragging, locale, unboundValues, breakpoints, entityStore } =
    useEditorContext();

  // We call it here instead of on block-level to avoid registering too many even listeners for media queries
  const { resolveDesignValue } = useBreakpoints(breakpoints);

  const [areEntitiesFetched, setEntitiesFetched] = useState(false);

  useEffect(() => {
    if (!locale) return;
    entityStore.current = new EditorModeEntityStore({
      entities: [],
      locale: locale,
    });
  }, [locale]);

  useEffect(() => {
    if (!tree) return;

    const onMouseMove = (event: MouseEvent) => {
      // const data = {
      //   name: 'MOUSE_MOVE',
      //   data: {
      //     x: event.pageX,
      //     y: event.pageY,
      //   },
      // };

      sendMessage(OUTGOING_EVENTS.MouseMove, {
        clientX: event.pageX,
        clientY: event.pageY,
      });
    };

    const onMouseUp = () => {
      onComponentDropped({ node: tree.root });
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
      await entityStore.current.fetchEntities([
        ...dataSourceEntityLinks,
        // ...(designComponentsRegistry.values() || []),
      ]);
      setEntitiesFetched(true);
    };

    resolveEntities();
  }, [dataSource, entityStore, locale]);

  if (!tree?.root.children.length) {
    return null;
    // return React.createElement(EmptyEditorContainer, { isDragging }, []);
  }
  return (
    <div id="VisualEditorRoot" className="root" data-type="root">
      {tree.root.children.map((node: any) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          dataSource={dataSource}
          unboundValues={unboundValues}
          resolveDesignValue={resolveDesignValue}
          entityStore={entityStore}
          areEntitiesFetched={areEntitiesFetched}
        />
      ))}
    </div>
  );
};
