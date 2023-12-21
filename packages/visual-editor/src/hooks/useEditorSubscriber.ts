import { useEffect } from 'react';
import {
  sendMessage,
  getDataFromTree,
  doesMismatchMessageSchema,
  tryParseMessage,
} from '@contentful/experience-builder-core';
import {
  OUTGOING_EVENTS,
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
import { useEntityStore } from '@/store/entityStore';

export function useEditorSubscriber() {
  const areEntitesResolvedInParent = useEntityStore((state) => state.areEntitesResolvedInParent);
  const entityStore = useEntityStore((state) => state.entityStore);
  const setEntitiesResolvedInParent = useEntityStore((state) => state.setEntitiesResolvedInParent);
  const setEntitiesFetched = useEntityStore((state) => state.setEntitiesFetched);
  const updateTree = useTreeStore((state) => state.updateTree);
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const dataSource = useEditorStore((state) => state.dataSource);
  const setLocale = useEditorStore((state) => state.setLocale);
  const setUnboundValues = useEditorStore((state) => state.setUnboundValues);
  const setDataSource = useEditorStore((state) => state.setDataSource);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);

  const setComponentId = useDraggedItemStore((state) => state.setComponentId);

  const reloadApp = () => {
    sendMessage(OUTGOING_EVENTS.CanvasReload, {});
    // Wait a moment to ensure that the message was sent
    setTimeout(() => {
      // Received a hot reload message from webpack dev server -> reload the canvas
      window.location.reload();
    }, 50);
  };

  useEffect(() => {
    sendMessage(OUTGOING_EVENTS.RequestComponentTreeUpdate);
  }, []);

  useEffect(() => {
    if (!areEntitesResolvedInParent) {
      return;
    }
    const resolveEntities = async () => {
      const dataSourceEntityLinks = Object.values(dataSource || {});
      const entityLinks = [...dataSourceEntityLinks, ...(designComponentsRegistry.values() || [])];
      const fetchingResponse = entityStore.fetchEntities(entityLinks);
      // Only update the state and rerender when we're actually fetching something
      if (fetchingResponse === false) return;
      setEntitiesFetched(false);
      // Await until the fetching is done to update the state variable at the right moment
      await fetchingResponse;
      setEntitiesFetched(true);
    };

    resolveEntities();
  }, [dataSource, areEntitesResolvedInParent, entityStore]);

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
            entitiesResolved,
          }: {
            tree: CompositionTree;
            designComponents: Link<'Entry'>[];
            locale: string;
            entitiesResolved?: boolean;
            changedNode?: CompositionComponentNode;
            changedValueType?: CompositionComponentPropValue['type'];
          } = payload;

          // Make sure to first store the design components before setting the tree and thus triggering a rerender
          if (designComponents) {
            setDesignComponents(designComponents);
          }

          if (entitiesResolved) {
            setEntitiesResolvedInParent(entitiesResolved);
          }
          updateTree(tree);
          setLocale(locale);

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
        case INCOMING_EVENTS.DesignComponentsRegistered: {
          const { designComponents }: { designComponents: ComponentRegistration['definition'][] } =
            payload;

          designComponents.forEach((definition) => {
            addComponentRegistration({
              component: DesignComponent,
              definition,
            });
          });
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
          entityStore.updateEntity(designComponent);
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
        case INCOMING_EVENTS.EntitiesResolved: {
          setEntitiesResolvedInParent(true);
          break;
        }
        case INCOMING_EVENTS.CanvasResized: {
          break;
        }
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
          entity && entityStore.updateEntity(entity);
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
  }, []);

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
}
