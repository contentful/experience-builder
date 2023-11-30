import React, { ReactElement, useEffect, useRef, useState } from 'react';

import { sendMessage } from '../../communication/sendMessage';
import { EditorModeEntityStore } from '../../core/EditorModeEntityStore';
import {
  Breakpoint,
  CompositionComponentNode,
  CompositionComponentPropValue,
  CompositionDataSource,
  CompositionTree,
  CompositionUnboundValues,
  InternalSDKMode,
  Link,
} from '@contentful/experience-builder-core';
import {
  ComponentRegistration,
  INCOMING_EVENTS,
  OUTGOING_EVENTS,
  SCROLL_STATES,
  doesMismatchMessageSchema,
  tryParseMessage,
} from '@contentful/experience-builder-core';
import { getDataFromTree } from '../../utils/utils';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';
import dragState from '@/core/dragState';

// import { Entry } from 'contentful';
// import { DesignComponent } from '../../components/DesignComponent';

export type VisualEditorContextType = {
  tree: CompositionTree | undefined;
  dataSource: CompositionDataSource;
  isDragging: boolean;
  locale: string | null;
  dragItem: string;
  setDragItem: (item: string) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string) => void;
  unboundValues: CompositionUnboundValues;
  breakpoints: Breakpoint[];
  entityStore: React.MutableRefObject<EditorModeEntityStore>;
  bundleUrl: string | null;
  stylesUrl: string | null;
  componentRegistry: Map<string, ComponentRegistration>;
};

export const VisualEditorContext = React.createContext<VisualEditorContextType>({
  tree: undefined,
  dataSource: {},
  unboundValues: {},
  isDragging: false,
  dragItem: '',
  setDragItem: () => {},
  selectedNodeId: null,
  setSelectedNodeId: () => {
    /* noop */
  },
  locale: null,
  breakpoints: [],
  bundleUrl: null,
  stylesUrl: null,
  entityStore: {} as React.MutableRefObject<EditorModeEntityStore>,
  componentRegistry: new Map(),
});

type VisualEditorContextProviderProps = {
  initialLocale: string;
  initialComponentRegistry: Map<string, ComponentRegistration>;
  mode: InternalSDKMode;
  children: ReactElement;
};

export const designComponentsRegistry = new Map<string, Link<'Entry'>>([]);
export const setDesignComponents = (designComponents: Link<'Entry'>[]) => {
  for (const designComponent of designComponents) {
    designComponentsRegistry.set(designComponent.sys.id, designComponent);
  }
};

export function VisualEditorContextProvider({
  initialLocale,
  initialComponentRegistry,
  mode,
  children,
}: VisualEditorContextProviderProps) {
  const [tree, setTree] = useState<CompositionTree>();
  const [dragItem, setDragItem] = useState<string>('');

  const [componentRegistry, setComponentRegistry] =
    useState<Map<string, ComponentRegistration>>(initialComponentRegistry);
  const [dataSource, setDataSource] = useState<CompositionDataSource>({});
  const [unboundValues, setUnboundValues] = useState<CompositionUnboundValues>({});
  const [isDragging, setIsDragging] = useState(false);
  const selectedNodeId = useRef<string>('');
  const [locale, setLocale] = useState<string>(initialLocale);

  const [bundleUrl, setBundleUrl] = useState<string | null>(null);
  const [stylesUrl, setStylesUrl] = useState<string | null>(null);

  const entityStore = useRef<EditorModeEntityStore>(
    new EditorModeEntityStore({
      entities: [],
      locale: locale,
    })
  );

  const reloadApp = () => {
    sendMessage(OUTGOING_EVENTS.CanvasReload, {});
    // Wait a moment to ensure that the message was sent
    setTimeout(() => {
      // Received a hot reload message from webpack dev server -> reload the canvas
      window.location.reload();
    }, 50);
  };

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    sendMessage(OUTGOING_EVENTS.RequestComponentTreeUpdate);
  }, []);

  useEffect(() => {
    // We only care about this communication when in editor mode
    if (mode !== 'editor') return;
    const onMessage = (event: MessageEvent) => {
      let reason;
      if ((reason = doesMismatchMessageSchema(event))) {
        if (
          event.origin.startsWith('http://localhost') &&
          `${event.data}`.includes('webpackHotUpdate')
        ) {
          reloadApp();
        } else {
          console.warn(
            `[exp-builder.sdk::onMessage] Ignoring alien incoming message from origin [${event.origin}], due to: [${reason}]`,
            event
          );
        }
        return;
      }

      const eventData = tryParseMessage(event);

      console.debug(
        `[exp-builder.sdk::onMessage] Received message [${eventData.eventType}]`,
        eventData
      );

      const { payload } = eventData;

      switch (eventData.eventType) {
        case INCOMING_EVENTS.CompositionUpdated: {
          const {
            tree,
            locale,
            changedNode,
            changedValueType,
            designComponents,
          }: {
            tree: CompositionTree;
            designComponents: Link<'Entry'>[];
            locale: string;
            changedNode?: CompositionComponentNode;
            changedValueType?: CompositionComponentPropValue['type'];
          } = payload;
          setTree(tree);
          setLocale(locale);
          designComponents && setDesignComponents(designComponents);

          if (changedNode) {
            /**
             * On single node updates, we want to skip the process of getting the data (datasource and unbound values)
             * from tree. Since we know the updated node, we can skip that recursion everytime the tree updates and
             * just update the relevant data we need from the relevant node.
             *
             * We still update the tree here so we don't have a stale "tree"
             */
            changedValueType === 'BoundValue' &&
              setDataSource((dataSource) => ({ ...dataSource, ...changedNode.data.dataSource }));
            changedValueType === 'UnboundValue' &&
              setUnboundValues((unboundValues) => ({
                ...unboundValues,
                ...changedNode.data.unboundValues,
              }));
          } else {
            const { dataSource, unboundValues } = getDataFromTree(tree);
            setDataSource(dataSource);
            setUnboundValues(unboundValues);
          }
          break;
        }
        // case INCOMING_EVENTS.DesignComponentsAdded: {
        //   const {
        //     tree,
        //     designComponent,
        //     designComponentDefinition,
        //   }: {
        //     tree: CompositionTree;
        //     designComponent: Entry;
        //     designComponentDefinition: ComponentRegistration['definition'];
        //   } = payload;
        //   if (designComponent) {
        //     entityStore.current.updateEntity(designComponent);
        //     // Using a Map here to avoid setting state and rerending all existing design components when a new design component is added
        //     // TODO: Figure out if we can extend this love to data source and unbound values. Maybe that'll solve the blink
        //     // of all bound and unbound values when new values are added
        //     designComponentsRegistry.set(designComponent.sys.id, {
        //       sys: { id: designComponent.sys.id, linkType: 'Entry', type: 'Link' },
        //     } as Link<'Entry'>);
        //     designComponentDefinition &&
        //       addComponentRegistration({
        //         component: DesignComponent,
        //         definition: designComponentDefinition,
        //       });
        //     setTree(tree);
        //   }
        //   break;
        // }
        // case INCOMING_EVENTS.CanvasResized:
        // case INCOMING_EVENTS.SelectComponent: {
        //   const { selectedNodeId: nodeId } = payload;
        //   selectedNodeId.current = nodeId;
        //   sendSelectedComponentCoordinates(nodeId);
        //   break;
        // }
        // case INCOMING_EVENTS.HoverComponent: {
        //   const { hoveredNodeId } = payload;
        //   sendHoveredComponentCoordinates(hoveredNodeId);
        //   break;
        // }
        case INCOMING_EVENTS.ComponentDraggingChanged: {
          const { isDragging } = payload;
          setIsDragging(isDragging);
          break;
        }
        case INCOMING_EVENTS.UpdatedEntity: {
          const { entity } = payload;
          entity && entityStore.current.updateEntity(entity);
          break;
        }
        case INCOMING_EVENTS.InitEditor: {
          const { bundleUrl, stylesUrl } = payload;
          setBundleUrl(bundleUrl);
          setStylesUrl(stylesUrl);
          break;
        }
        case INCOMING_EVENTS.RequestEditorMode: {
          break;
        }
        case INCOMING_EVENTS.ComponentDragStarted: {
          dragState.updateIsDragStartedOnParent(true);
          setDragItem(payload.id || 'Heading');
          break;
        }
        case INCOMING_EVENTS.ComponentDragEnded: {
          dragState.updateIsDragStartedOnParent(false);
          setDragItem('');
          break;
        }
        case INCOMING_EVENTS.SelectComponent: {
          const { selectedNodeId: nodeId } = payload;
          selectedNodeId.current = nodeId;
          sendSelectedComponentCoordinates(nodeId);
          break;
        }
        default:
          console.error(
            `[exp-builder.sdk::onMessage] Logic error, unsupported eventType: [${eventData.eventType}]`
          );
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [mode]);

  /*
   * Handles on scroll business
   */
  useEffect(() => {
    // We only care about this communication when in editor mode
    if (mode !== 'editor') return;
    let timeoutId = 0;
    let isScrolling = false;

    const onScroll = () => {
      if (isScrolling === false) {
        sendMessage(OUTGOING_EVENTS.CanvasScroll, SCROLL_STATES.Start);
      }

      sendMessage(OUTGOING_EVENTS.CanvasScroll, SCROLL_STATES.IsScrolling);
      isScrolling = true;

      clearTimeout(timeoutId);

      timeoutId = window.setTimeout(() => {
        if (isScrolling === false) {
          return;
        }

        isScrolling = false;
        sendMessage(OUTGOING_EVENTS.CanvasScroll, SCROLL_STATES.End);

        /**
         * On scroll end, send new co-ordinates of selected node
         */
      }, 150);
    };

    window.addEventListener('scroll', onScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, [mode]);

  const setSelectedNodeId = (nodeId: string) => {
    selectedNodeId.current = nodeId;
  };

  return (
    <VisualEditorContext.Provider
      value={{
        tree,
        dataSource,
        unboundValues,
        dragItem,
        setDragItem,
        bundleUrl,
        stylesUrl,
        isDragging,
        selectedNodeId: selectedNodeId.current,
        setSelectedNodeId,
        locale,
        breakpoints: tree?.root?.data?.breakpoints ?? [],
        entityStore,
        componentRegistry,
      }}>
      {children}
    </VisualEditorContext.Provider>
  );
}
