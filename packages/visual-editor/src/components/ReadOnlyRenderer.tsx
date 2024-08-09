import React from 'react';
import { useReadOnlySubscriber } from '@/hooks/useReadOnlySubscriber';
import { useTreeStore } from '@/store/tree';

import { useEditorStore } from '@/store/editor';
import { ReadOnlyEditorBlock } from '@components/ReadOnlyEditorBlock';
import { useBreakpoints } from '@/hooks/useBreakpoints';

export function ReadOnlyRenderer() {
  useReadOnlySubscriber();

  const breakpoints = useTreeStore((state) => state.breakpoints);
  const { resolveDesignValue } = useBreakpoints(breakpoints);

  const locale = useEditorStore((state) => state.locale);

  const tree = useTreeStore();

  if (!locale) return null;

  return (
    <>
      {tree.tree.root.children.map((childNode) => (
        <ReadOnlyEditorBlock
          key={childNode.data.id}
          node={childNode}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  );
}
