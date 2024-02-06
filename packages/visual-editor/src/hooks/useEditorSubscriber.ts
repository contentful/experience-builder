import { useCallback, useEffect, useState } from 'react';
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
  PostMessageMethods,
} from '@contentful/experience-builder-core/constants';
import {
  CompositionTree,
  CompositionComponentNode,
  CompositionComponentPropValue,
  ComponentRegistration,
  Link,
  CompositionDataSource,
  ManagementEntity,
} from '@contentful/experience-builder-core/types';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';
import dragState from '@/utils/dragState';
import { useTreeStore } from '@/store/tree';
import { useEditorStore } from '@/store/editor';
import { useDraggedItemStore } from '@/store/draggedItem';
import { Assembly } from '@contentful/experience-builder-components';
import { addComponentRegistration, assembliesRegistry, setAssemblies } from '@/store/registries';
import { sendHoveredComponentCoordinates } from '@/communication/sendHoveredComponentCoordinates';
import { useEntityStore } from '@/store/entityStore';
import { simulateMouseEvent } from '@/utils/simulateMouseEvent';

export function useEditorSubscriber() {
  const entityStore = useEntityStore((state) => state.entityStore);
  const areEntitiesFetched = useEntityStore((state) => state.areEntitiesFetched);
  const setEntitiesFetched = useEntityStore((state) => state.setEntitiesFetched);
  const { updateTree, updateNodesByUpdatedEntity } = useTreeStore((state) => ({
    updateTree: state.updateTree,
    updateNodesByUpdatedEntity: state.updateNodesByUpdatedEntity,
  }));
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const dataSource = useEditorStore((state) => state.dataSource);
  const setLocale = useEditorStore((state) => state.setLocale);
  const setUnboundValues = useEditorStore((state) => state.setUnboundValues);
  const setDataSource = useEditorStore((state) => state.setDataSource);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);

  const setComponentId = useDraggedItemStore((state) => state.setComponentId);
  const setDraggingOnCanvas = useDraggedItemStore((state) => state.setDraggingOnCanvas);

  const [isFetchingEntities, setFetchingEntities] = useState(false);

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

  // Either gets called when dataSource changed or assembliesRegistry changed (manually)
  const fetchMissingEntities = useCallback(
    async (newDataSource?: CompositionDataSource) => {
      const entityLinks = [
        ...Object.values(newDataSource ?? dataSource),
        ...assembliesRegistry.values(),
      ];
      const { missingAssetIds, missingEntryIds } = entityStore.getMissingEntityIds(entityLinks);
      // Only continue and trigger rerendering when we need to fetch something and we're not fetching yet
      if (!missingAssetIds.length && !missingEntryIds.length) {
        setEntitiesFetched(true);
        return;
      }
      setEntitiesFetched(false);
      setFetchingEntities(true);
      try {
        // Await until the fetching is done to update the state variable at the right moment
        await entityStore.fetchEntities({ missingAssetIds, missingEntryIds });
        console.debug('[exp-builder.sdk] Finished fetching entities', { entityStore, entityLinks });
      } catch (error) {
        console.error('[exp-builder.sdk] Failed fetching entities');
        console.error(error);
      } finally {
        // Important to set this as it is the only state variable that triggers a rerendering
        // of the components (changes inside the entityStore are not part of the state)
        setEntitiesFetched(true);
        setFetchingEntities(false);
      }
    },
    [dataSource, entityStore, setEntitiesFetched]
  );
  // When the tree was updated, we store the dataSource and
  // afterward, this effect fetches the respective entities.
  useEffect(() => {
    if (areEntitiesFetched || isFetchingEntities) return;
    fetchMissingEntities();
  }, [areEntitiesFetched, fetchMissingEntities, isFetchingEntities]);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
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
        // Expected message: This message is handled in the EntityStore to store fetched entities
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
            assemblies,
          }: {
            tree: CompositionTree;
            assemblies: Link<'Entry'>[];
            locale: string;
            entitiesResolved?: boolean;
            changedNode?: CompositionComponentNode;
            changedValueType?: CompositionComponentPropValue['type'];
          } = payload;

          // Make sure to first store the assemblies before setting the tree and thus triggering a rerender
          if (assemblies) {
            setAssemblies(assemblies);
            // If the assemblyEntry is not yet fetched, this will be done below by
            // the imperative calls to fetchMissingEntities.
          }

          // Below are mutually exclusive cases
          if (changedNode) {
            /**
             * On single node updates, we want to skip the process of getting the data (datasource and unbound values)
             * from tree. Since we know the updated node, we can skip that recursion everytime the tree updates and
             * just update the relevant data we need from the relevant node.
             *
             * We still update the tree here so we don't have a stale "tree"
             */
            if (changedValueType === 'BoundValue') {
              const newDataSource = { ...dataSource, ...changedNode.data.dataSource };
              setDataSource(newDataSource);
              await fetchMissingEntities(newDataSource);
            } else if (changedValueType === 'UnboundValue') {
              setUnboundValues({
                ...unboundValues,
                ...changedNode.data.unboundValues,
              });
            }

            // Update the tree when all necessary data is fetched and ready for rendering.
            updateTree(tree);
            setLocale(locale);
          } else {
            const { dataSource, unboundValues } = getDataFromTree(tree);
            setDataSource(dataSource);
            setUnboundValues(unboundValues);
            await fetchMissingEntities(dataSource);
            // Update the tree when all necessary data is fetched and ready for rendering.
            updateTree(tree);
            setLocale(locale);
          }
          break;
        }
        case INCOMING_EVENTS.DesignComponentsRegistered:
          // Event was deprecated and support will be discontinued with version 5
          break;
        case INCOMING_EVENTS.AssembliesRegistered: {
          const { assemblies }: { assemblies: ComponentRegistration['definition'][] } = payload;

          assemblies.forEach((definition) => {
            addComponentRegistration({
              component: Assembly,
              definition,
            });
          });
          break;
        }
        case INCOMING_EVENTS.DesignComponentsAdded:
          // Event was deprecated and support will be discontinued with version 5
          break;
        case INCOMING_EVENTS.AssembliesAdded: {
          const {
            assembly,
            assemblyDefinition,
          }: {
            assembly: ManagementEntity;
            assemblyDefinition?: ComponentRegistration['definition'];
          } = payload;
          entityStore.updateEntity(assembly);
          // Using a Map here to avoid setting state and rerending all existing assemblies when a new assembly is added
          // TODO: Figure out if we can extend this love to data source and unbound values. Maybe that'll solve the blink
          // of all bound and unbound values when new values are added
          assembliesRegistry.set(assembly.sys.id, {
            sys: { id: assembly.sys.id, linkType: 'Entry', type: 'Link' },
          } as Link<'Entry'>);
          if (assemblyDefinition) {
            addComponentRegistration({
              component: Assembly,
              definition: assemblyDefinition,
            });
          }

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
            setDraggingOnCanvas(false);
            dragState.reset();
          }
          break;
        }
        case INCOMING_EVENTS.UpdatedEntity: {
          const { entity: updatedEntity, shouldRerender } = payload as {
            entity: ManagementEntity;
            shouldRerender?: boolean;
          };
          if (updatedEntity) {
            const storedEntity = entityStore.entities.find(
              (entity) => entity.sys.id === updatedEntity.sys.id
            ) as unknown as ManagementEntity | undefined;

            const didEntityChange = storedEntity?.sys.version !== updatedEntity.sys.version;
            entityStore.updateEntity(updatedEntity);
            // We traverse the whole tree, so this is a opt-in feature to only use it when required.
            if (shouldRerender && didEntityChange) {
              updateNodesByUpdatedEntity(updatedEntity.sys.id);
            }
          }
          break;
        }
        case INCOMING_EVENTS.RequestEditorMode: {
          break;
        }
        case INCOMING_EVENTS.ComponentDragCanceled: {
          if (dragState.isDragging) {
            //simulate a mouseup event to cancel the drag
            simulateMouseEvent(0, 0, 'mouseup');
          }
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
          setDraggingOnCanvas(false);
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
  }, [
    entityStore,
    setComponentId,
    setDraggingOnCanvas,
    setDataSource,
    setLocale,
    setSelectedNodeId,
    dataSource,
    areEntitiesFetched,
    fetchMissingEntities,
    setUnboundValues,
    unboundValues,
    updateTree,
    updateNodesByUpdatedEntity,
  ]);

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
        if (selectedNodeId) {
          sendSelectedComponentCoordinates(selectedNodeId);
        }
      }, 150);
    };

    window.addEventListener('scroll', onScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeoutId);
    };
  }, [selectedNodeId]);
}
