import { useEffect, useState } from 'react';
import {
  EditorModeEntityStore,
  sendMessage,
  getDataFromTree,
  doesMismatchMessageSchema,
  tryParseMessage,
} from '@contentful/experience-builder-core';
import {
  OUTGOING_EVENTS,
  INTERNAL_EVENTS,
  VISUAL_EDITOR_EVENTS,
  INCOMING_EVENTS,
  SCROLL_STATES,
} from '@contentful/experience-builder-core/constants';
import {
  CompositionTree,
  CompositionComponentNode,
  CompositionComponentPropValue,
  ComponentRegistration,
  Link,
} from '@contentful/experience-builder-core/types';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';
import dragState from '@/utils/dragState';
import { useTreeStore } from '@/store/tree';
import { useEditorStore } from '@/store/editor';
import { useDraggedItemStore } from '@/store/draggedItem';
import { Entry } from 'contentful';
import { DesignComponent } from '@contentful/experience-builder-components';
import {
  addComponentRegistration,
  designComponentsRegistry,
  setDesignComponents,
} from '@/store/registries';
import { sendHoveredComponentCoordinates } from '@/communication/sendHoveredComponentCoordinates';
import { PostMessageMethods } from '@contentful/visual-sdk';

export function useEditorSubscriber() {
  const updateTree = useTreeStore((state) => state.updateTree);

  const unboundValues = useEditorStore((state) => state.unboundValues);
  const entityStore = useEditorStore((state) => state.entityStore);

  const setLocale = useEditorStore((state) => state.setLocale);
  const setUnboundValues = useEditorStore((state) => state.setUnboundValues);
  const setDataSource = useEditorStore((state) => state.setDataSource);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const initializeEditor = useEditorStore((state) => state.initializeEditor);
  const setComponentId = useDraggedItemStore((state) => state.setComponentId);

  const [initialized, setInitialized] = useState(false);

  const reloadApp = () => {
    sendMessage(OUTGOING_EVENTS.CanvasReload, {});
    // Wait a moment to ensure that the message was sent
    setTimeout(() => {
      // Received a hot reload message from webpack dev server -> reload the canvas
      window.location.reload();
    }, 50);
  };

  useEffect(() => {
    const onVisualEditorInitialize = (event) => {
      if (!event.detail) return;
      const { componentRegistry, locale: initialLocale, entities } = event.detail;

      initializeEditor({
        initialLocale,
        componentRegistry,
        entityStore: new EditorModeEntityStore({
          entities: entities || [],
          locale: initialLocale,
        }),
      });
      setInitialized(true);
    };

    // Listen for VisualEditorComponents internal event
    window.addEventListener(INTERNAL_EVENTS.VisualEditorInitialize, onVisualEditorInitialize);

    // Clean up the event listener
    return () => {
      window.removeEventListener(INTERNAL_EVENTS.VisualEditorInitialize, onVisualEditorInitialize);
    };
  }, []);

  useEffect(() => {
    if (initialized) {
      return;
    }

    // Dispatch Visual Editor Ready event
    window.dispatchEvent(new CustomEvent(VISUAL_EDITOR_EVENTS.Ready));
  }, []);

  useEffect(() => {
    sendMessage(OUTGOING_EVENTS.RequestComponentTreeUpdate);
  }, []);

  useEffect(() => {
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

      if (eventData.eventType === PostMessageMethods.REQUESTED_ENTITIES) {
        // Expected message: This message is handled in the visual-sdk to store fetched entities
        return;
      }
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

          updateTree(tree);
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
            changedValueType === 'BoundValue' && setDataSource(changedNode.data.dataSource);
            changedValueType === 'UnboundValue' &&
              setUnboundValues({
                ...unboundValues,
                ...changedNode.data.unboundValues,
              });
          } else {
            const { dataSource, unboundValues } = getDataFromTree(tree);
            setDataSource(dataSource);
            setUnboundValues(unboundValues);
          }
          break;
        }
        case INCOMING_EVENTS.DesignComponentsAdded: {
          const {
            designComponent,
            designComponentDefinition,
          }: {
            designComponent: Entry;
            designComponentDefinition?: ComponentRegistration['definition'];
          } = payload;
          entityStore?.updateEntity(designComponent);
          // Using a Map here to avoid setting state and rerending all existing design components when a new design component is added
          // TODO: Figure out if we can extend this love to data source and unbound values. Maybe that'll solve the blink
          // of all bound and unbound values when new values are added
          designComponentsRegistry.set(designComponent.sys.id, {
            sys: { id: designComponent.sys.id, linkType: 'Entry', type: 'Link' },
          } as Link<'Entry'>);
          if (designComponentDefinition) {
            addComponentRegistration({
              component: DesignComponent,
              definition: designComponentDefinition,
            });
          }
          break;
        }
        // case INCOMING_EVENTS.CanvasResized:
        // case INCOMING_EVENTS.SelectComponent: {
        //   const { selectedNodeId: nodeId } = payload;
        //   selectedNodeId.current = nodeId;
        //   sendSelectedComponentCoordinates(nodeId);
        //   break;
        // }
        case INCOMING_EVENTS.HoverComponent: {
          const { hoveredNodeId } = payload;
          sendHoveredComponentCoordinates(hoveredNodeId);
          break;
        }
        case INCOMING_EVENTS.ComponentDraggingChanged: {
          const { isDragging } = payload;

          if (!isDragging) {
            setComponentId('');
            dragState.reset();
          }
          break;
        }
        case INCOMING_EVENTS.UpdatedEntity: {
          const { entity } = payload;
          entity && entityStore?.updateEntity(entity);
          break;
        }
        case INCOMING_EVENTS.RequestEditorMode: {
          break;
        }
        case INCOMING_EVENTS.ComponentDragStarted: {
          dragState.updateIsDragStartedOnParent(true);
          setComponentId(payload.id || '');
          break;
        }
        case INCOMING_EVENTS.ComponentDragEnded: {
          dragState.reset();
          setComponentId('');
          break;
        }
        case INCOMING_EVENTS.SelectComponent: {
          const { selectedNodeId: nodeId } = payload;
          setSelectedNodeId(nodeId);
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
  }, [entityStore]);

  /*
   * Handles on scroll business
   */
  useEffect(() => {
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
  }, []);

  return initialized;
}
