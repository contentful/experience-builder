import React, { useRef } from 'react';
import { useTreeStore } from '@/store/tree';
import styles from './RootRenderer.module.css';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useEditorSubscriber } from '@/hooks/useEditorSubscriber';
import { EditorBlock } from '@components/EditorBlock';
import { EmptyCanvasMessage } from '@components/EmptyCanvasMessage';
import { ROOT_ID } from '@/types/constants';
import { useCanvasGeometryUpdates } from './useCanvasGeometryUpdates';

export const RootRenderer = () => {
  const rootContainerRef = useRef<HTMLDivElement>(null);
  const tree = useTreeStore((state) => state.tree);
  useCanvasGeometryUpdates({ tree, rootContainerRef });
  useEditorSubscriber();

  const breakpoints = useTreeStore((state) => state.breakpoints);
  const { resolveDesignValue } = useBreakpoints(breakpoints);
  // If the root blockId is defined but not the default string, it is the entry ID
  // of the experience/ pattern to properly detect circular dependencies.
  const rootBlockId = tree.root.data.blockId ?? ROOT_ID;
  const wrappingPatternIds = rootBlockId !== ROOT_ID ? new Set([rootBlockId]) : new Set<string>();

  return (
    <>
      <div data-ctfl-root className={styles.rootContainer} ref={rootContainerRef}>
        {!tree.root.children.length ? (
          <EmptyCanvasMessage />
        ) : (
          tree.root.children.map((topLevelChildNode) => (
            <EditorBlock
              key={topLevelChildNode.data.id}
              node={topLevelChildNode}
              resolveDesignValue={resolveDesignValue}
              wrappingPatternIds={wrappingPatternIds}
            />
          ))
        )}
      </div>
    </>
  );
};
