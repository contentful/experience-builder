import React, { useEffect, useState } from 'react';

import { VisualEditorBlock } from './VisualEditorBlock';
import { EmptyEditorContainer } from './EmptyEditorContainer';
import '../styles/VisualEditorRoot.css';
import { onComponentDropped } from '../communication/onComponentDrop';
import { EditorModeEntityStore } from '../core/EditorModeEntityStore';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { useHoverIndicator } from '../hooks/useHoverIndicator';
import { ComponentRegistration, InternalSDKMode } from '../types';
import { useEditorContext } from './useEditorContext';
import { VisualEditorContextProvider } from './VisualEditorContext';
import { getDesignComponentRegistration } from '../designComponentUtils';

type VisualEditorRootProps = {
  initialLocale: string;
  mode: InternalSDKMode;
};

const DesignComponent = ({ ...props }) => {
  return <div {...props} />;
};

export const VisualEditorRoot = ({ initialLocale, mode }: VisualEditorRootProps) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  return (
    <VisualEditorContextProvider mode={mode} initialLocale={initialLocale}>
      <VisualEditorRootComponents />
    </VisualEditorContextProvider>
  );
};

const VisualEditorRootComponents = () => {
  const {
    tree,
    dataSource,
    isDragging,
    locale,
    unboundValues,
    breakpoints,
    entityStore,
    designComponents,
  } = useEditorContext();

  // We call it here instead of on block-level to avoid registering too many even listeners for media queries
  const { resolveDesignValue } = useBreakpoints(breakpoints);
  useHoverIndicator(isDragging);
  const [areEntitiesFetched, setEntitiesFetched] = useState(false);
  const [designComponentsDefinitions, setDesignComponentsDefinitions] = useState<
    ComponentRegistration[]
  >([]);

  useEffect(() => {
    if (!locale) return;
    entityStore.current = new EditorModeEntityStore({
      entities: [],
      locale: locale,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    if (!tree || !tree?.root.children.length || !isDragging) return;
    const onMouseUp = () => {
      onComponentDropped({ node: tree.root });
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [tree, isDragging]);

  useEffect(() => {
    const resolveEntities = async () => {
      setEntitiesFetched(false);
      const datasourceEntityLinks = Object.values(dataSource || {});
      await entityStore.current.fetchEntities([
        ...datasourceEntityLinks,
        ...(designComponents || []),
      ]);
      setEntitiesFetched(true);
    };

    resolveEntities();
  }, [dataSource, entityStore, designComponents, locale]);

  useEffect(() => {
    if (!areEntitiesFetched || !designComponents) return;
    const designComponentsDefinitions = getDesignComponentRegistration({
      component: DesignComponent,
      designComponents: designComponents ?? [],
      entityStore: entityStore.current,
    });

    setDesignComponentsDefinitions(designComponentsDefinitions);
  }, [areEntitiesFetched, entityStore, designComponents]);

  if (!tree?.root.children.length) {
    return React.createElement(EmptyEditorContainer, { isDragging }, []);
  }
  return (
    <div id="VisualEditorRoot" className="root" data-type="root">
      {tree.root.children.map((node: any) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          dataSource={dataSource}
          designComponents={designComponents}
          designComponentsDefinitions={designComponentsDefinitions}
          unboundValues={unboundValues}
          resolveDesignValue={resolveDesignValue}
          entityStore={entityStore}
          areEntitiesFetched={areEntitiesFetched}
        />
      ))}
    </div>
  );
};
