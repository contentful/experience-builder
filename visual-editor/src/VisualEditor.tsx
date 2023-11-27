import React, { useEffect, useMemo, useState } from 'react';
// Editor.jsx
import { ComponentConfig, Puck, Config, Data } from './core';

import { ComponentRegistration, CompositionTree } from './types';
import { VerticalSpace } from './components/editor-components/VerticalSpace';
import { Flex } from './components/editor-components/Flex';
import { Columns } from './components/editor-components/Columns';
import { Container } from './components/editor-components/Container';
import { sendMessage } from './communication/sendMessage';
import { OUTGOING_EVENTS } from '@contentful/experience-builder';
import { useEditorContext } from '@components/editor/useEditorContext';
import { useBreakpoints } from './hooks/useBreakpoints';
import { ContentfulContainerDefinition } from '@components/editor-components/ContentfulContainer/ContentfulContainer';
import { EditorModeEntityStore } from './core/EditorModeEntityStore';
import dragState from './core/dragState';

const createData = (tree: CompositionTree): Data => {
  return {
    root: {
      title: 'Test',
    },
    children: tree.root.children,
  };
};

// Render Puck editor
const VisualEditor: React.FC = () => {
  const {
    tree,
    dataSource,
    isDragging,
    locale,
    unboundValues,
    breakpoints,
    entityStore,
    componentRegistry,
  } = useEditorContext();

  const [areEntitiesFetched, setEntitiesFetched] = useState(false);
  const { resolveDesignValue } = useBreakpoints(breakpoints);

  const components = useMemo(() => {
    const components: ComponentRegistration[] = [];

    componentRegistry.forEach((comp) => components.push(comp));

    return components;
  }, [componentRegistry]);

  useEffect(() => {
    if (!locale) return;
    entityStore.current = new EditorModeEntityStore({
      entities: [],
      locale: locale,
    });
  }, [locale]);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      // const data = {
      //   name: 'MOUSE_MOVE',
      //   data: {
      //     x: event.pageX,
      //     y: event.pageY,
      //   },
      // };

      if (!dragState.isDragging) {
        return;
      }

      sendMessage(OUTGOING_EVENTS.MouseMove, {
        clientX: event.pageX,
        clientY: event.pageY,
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
      await entityStore.current.fetchEntities([
        ...dataSourceEntityLinks,
        // ...(designComponentsRegistry.values() || []),
      ]);
      setEntitiesFetched(true);
    };

    resolveEntities();
  }, [dataSource, entityStore, locale]);

  const config = useMemo<Config>(() => {
    const customComponents = components.reduce((definitions, obj) => {
      const defaultProps = {};

      const component: ComponentConfig<any, any> = {
        defaultProps,
        render: obj.component as any,
        id: obj.definition.id,
      };

      if (obj.definition.category === 'contentful-component') {
        return definitions;
      }

      return { ...definitions, [obj.definition.id]: component };
    }, {});

    const defaultCategories: Record<string, { components: string[] }> = {
      layout: {
        components: ['Container', 'Columns', 'Flex', 'VerticalSpace'],
      },
    };
    const categories = components.reduce((categories, comp) => categories, defaultCategories);

    const builtInComponents = {
      Columns,
      Flex,
      VerticalSpace,
      Container,
      [ContentfulContainerDefinition.id]: ContentfulContainerDefinition,
    };

    return {
      categories,
      components: { ...builtInComponents, ...customComponents },
    } as any;
  }, [components]);

  if (!tree) {
    return;
  }

  return (
    <Puck
      config={config}
      data={createData(tree)}
      dataSource={dataSource}
      unboundValues={unboundValues}
      resolveDesignValue={resolveDesignValue}
      entityStore={entityStore}
      areEntitiesFetched={areEntitiesFetched}
    />
  );
};

export default VisualEditor;
