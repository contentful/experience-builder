import React, { useEffect } from 'react';

import { VisualEditorBlock } from './VisualEditorBlock';
import { EmptyEditorContainer } from '../../components/EmptyEditorContainer';
import '../../styles/VisualEditorRoot.css';
import { onComponentDropped } from '../../communication/onComponentDrop';
import { useBreakpoints } from '../../hooks/useBreakpoints';
import { useHoverIndicator } from '../../hooks/useHoverIndicator';
import { CompositionComponentNode, EntityStore, InternalSDKMode } from '../../types';
import { useEditorContext } from './useEditorContext';
import { VisualEditorContextProvider } from './VisualEditorContext';

type VisualEditorRootProps = {
  initialLocale: string;
  mode: InternalSDKMode;
  previousEntityStore?: EntityStore;
};

export const VisualEditorRoot = ({
  initialLocale,
  mode,
  previousEntityStore,
}: VisualEditorRootProps) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <VisualEditorContextProvider
      mode={mode}
      initialLocale={initialLocale}
      previousEntityStore={previousEntityStore}>
      <VisualEditorRootComponents />
    </VisualEditorContextProvider>
  );
};

const VisualEditorRootComponents = () => {
  const {
    tree,
    dataSource,
    isDragging,
    unboundValues,
    breakpoints,
    entityStore,
    areInitialEntitiesFetched,
  } = useEditorContext();

  // We call it here instead of on block-level to avoid registering too many even listeners for media queries
  const { resolveDesignValue } = useBreakpoints(breakpoints);
  useHoverIndicator(isDragging);

  useEffect(() => {
    if (!tree || !tree?.root.children.length || !isDragging) return;
    const onMouseUp = () => {
      onComponentDropped({ node: tree.root });
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [tree, isDragging]);

  if (!tree?.root.children.length) {
    return React.createElement(EmptyEditorContainer, { isDragging }, []);
  }

  return (
    <div id="VisualEditorRoot" className="root" data-type="root">
      {tree.root.children.map((node: CompositionComponentNode) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          dataSource={dataSource}
          unboundValues={unboundValues}
          resolveDesignValue={resolveDesignValue}
          entityStore={entityStore}
          areInitialEntitiesFetched={areInitialEntitiesFetched}
        />
      ))}
    </div>
  );
};
