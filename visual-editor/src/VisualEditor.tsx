import React, { useEffect, useMemo, useState } from 'react';
// Editor.jsx
import { ComponentConfig, Puck, Config, Data } from './core';

import { ComponentRegistration, CompositionTree } from '@contentful/experience-builder-core';
import { VerticalSpace } from './components/editor-components/VerticalSpace';
import { Flex } from './components/editor-components/Flex';
import { Columns, ColumnsDefinition } from './components/editor-components/Columns';
import { Container } from './components/editor-components/Container';
import { sendMessage } from './communication/sendMessage';
import { OUTGOING_EVENTS } from '@contentful/experience-builder-core';
import { useEditorContext } from '@components/editor/useEditorContext';
import { useBreakpoints } from './hooks/useBreakpoints';
import { ContentfulContainerDefinition } from '@components/editor-components/ContentfulContainer/ContentfulContainer';
import { EditorModeEntityStore } from './core/EditorModeEntityStore';
import dragState from './core/dragState';
import { DRAGGABLE_HEIGHT, DRAGGABLE_WIDTH } from './utils/constants';

const createData = (tree: CompositionTree): Data => {
  return {
    root: {
      title: 'Test',
    },
    children: tree.root.children,
  };
};

function updateDraggableElement(x: number, y: number) {
  const container = document.querySelector('#component-list') as HTMLDivElement;

  if (!container) {
    return;
  }

  container.style.setProperty('top', `${y}px`);
  container.style.setProperty('left', `${x}px`);
}

function simulateMouseEvent(coordX: number, coordY: number) {
  const element = document.querySelector('#item');

  if (!dragState.isDragStart) {
    return;
  }

  let name = 'mousemove';

  if (!dragState.isDragging) {
    updateDraggableElement(coordX, coordY);

    name = 'mousedown';
    dragState.updateIsDragging(true);
  }

  const options = {
    bubbles: true,
    cancelable: true,
    view: window,
    pageX: 0,
    pageY: 0,
    clientX: coordX - DRAGGABLE_WIDTH / 2,
    clientY: coordY - DRAGGABLE_HEIGHT / 2 - window.scrollY,
  };

  if (!element) {
    return;
  }

  const event = new MouseEvent(name, options);
  element.dispatchEvent(event);
}

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
      // Columns,
      // Flex,
      // VerticalSpace,
      // Container,
      [ContentfulContainerDefinition.id]: ContentfulContainerDefinition,
      // [ColumnsDefinition.id]: ColumnsDefinition,
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
