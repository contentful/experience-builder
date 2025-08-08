import React from 'react';
import { useTreeStore } from '@/store/tree';
import styles from './RootRenderer.module.css';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEditorSubscriber } from '@/hooks/useEditorSubscriber';
import { EditorBlock } from '@components/EditorBlock';
import { EmptyCanvasMessage } from '@components/EmptyCanvasMessage';
import { ROOT_ID } from '@/types/constants';
import { type InMemoryEntitiesStore } from '@contentful/experiences-core';
import type { StudioCanvasMode } from '@contentful/experiences-core/constants';
import { useCanvasGeometryUpdates } from './useCanvasGeometryUpdates';

type RootRendererProperties = {
  inMemoryEntitiesStore: InMemoryEntitiesStore;
  canvasMode?: StudioCanvasMode;
};

export const RootRenderer = ({ inMemoryEntitiesStore, canvasMode }: RootRendererProperties) => {
  useEditorSubscriber(inMemoryEntitiesStore);
  const tree = useTreeStore((state) => state.tree);
  useCanvasGeometryUpdates({ tree, canvasMode });

  const breakpoints = useTreeStore((state) => state.breakpoints);
  const { resolveDesignValue } = useBreakpoints(breakpoints);
  // If the root blockId is defined but not the default string, it is the entry ID
  // of the experience/ pattern to properly detect circular dependencies.
  const rootBlockId = tree.root.data.blockId ?? ROOT_ID;
  const wrappingPatternIds = rootBlockId !== ROOT_ID ? new Set([rootBlockId]) : new Set<string>();

  const entityStore = inMemoryEntitiesStore((state) => state.entityStore);
  const areEntitiesFetched = inMemoryEntitiesStore((state) => state.areEntitiesFetched);

  return (
    <>
      <div data-ctfl-root className={styles.rootContainer}>
        {!tree.root.children.length ? (
          <EmptyCanvasMessage />
        ) : (
          tree.root.children.map((topLevelChildNode) => (
            <EditorBlock
              key={topLevelChildNode.data.id}
              node={topLevelChildNode}
              resolveDesignValue={resolveDesignValue}
              wrappingPatternIds={wrappingPatternIds}
              entityStore={entityStore}
              areEntitiesFetched={areEntitiesFetched}
            />
          ))
        )}
      </div>
    </>
  );
};
