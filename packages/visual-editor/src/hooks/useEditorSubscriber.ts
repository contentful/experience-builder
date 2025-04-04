import { useCallback, useEffect } from 'react';
import {
  sendMessage,
  getDataFromTree,
  doesMismatchMessageSchema,
  tryParseMessage,
  gatherDeepReferencesFromTree,
  DeepReference,
  isLink,
  EditorModeEntityStore,
} from '@contentful/experiences-core';
import {
  OUTGOING_EVENTS,
  INCOMING_EVENTS,
  SCROLL_STATES,
  PostMessageMethods,
} from '@contentful/experiences-core/constants';
import {
  ExperienceTree,
  ComponentRegistration,
  Link,
  ExperienceDataSource,
  ManagementEntity,
  IncomingMessage,
} from '@contentful/experiences-core/types';
import { sendSelectedComponentCoordinates } from '@/communication/sendSelectedComponentCoordinates';
import { useTreeStore } from '@/store/tree';
import { useEditorStore } from '@/store/editor';
import { useDraggedItemStore } from '@/store/draggedItem';
import { Assembly } from '@contentful/experiences-components-react';
import { addComponentRegistration, assembliesRegistry, setAssemblies } from '@/store/registries';
import { useEntityStore } from '@/store/entityStore';
import SimulateDnD from '@/utils/simulateDnD';
import { UnresolvedLink } from 'contentful';

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
  const resetEntityStore = useEntityStore((state) => state.resetEntityStore);
  const setComponentId = useDraggedItemStore((state) => state.setComponentId);
  const setHoveredComponentId = useDraggedItemStore((state) => state.setHoveredComponentId);
  const setDraggingOnCanvas = useDraggedItemStore((state) => state.setDraggingOnCanvas);
  const setMousePosition = useDraggedItemStore((state) => state.setMousePosition);
  const setScrollY = useDraggedItemStore((state) => state.setScrollY);

  const reloadApp = () => {
    sendMessage(OUTGOING_EVENTS.CanvasReload, undefined);
    // Wait a moment to ensure that the message was sent
    setTimeout(() => {
      // Received a hot reload message from webpack dev server -> reload the canvas
      window.location.reload();
    }, 50);
  };

  useEffect(() => {
    sendMessage(OUTGOING_EVENTS.RequestComponentTreeUpdate, undefined);
  }, []);

  /**
   * Fills up entityStore with entities from newDataSource and from the tree.
   * Also manages "entity status" variables (areEntitiesFetched, isFetchingEntities)
   */
  const fetchMissingEntities = useCallback(
    async (
      entityStore: EditorModeEntityStore,
      newDataSource: ExperienceDataSource,
      tree: ExperienceTree,
    ) => {
      // if we realize that there's nothing missing and nothing to fill-fetch before we do any async call,
      // then we can simply return and not lock the EntityStore at all.
      const startFetching = () => {
        setEntitiesFetched(false);
      };
      const endFetching = () => {
        setEntitiesFetched(true);
      };

      // Prepare L1 entities and deepReferences
      const entityLinksL1 = [
        ...Object.values(newDataSource),
        ...assembliesRegistry.values(), // we count assemblies here as "L1 entities", for convenience. Even though they're not headEntities.
      ];
      const deepReferences = gatherDeepReferencesFromTree(tree.root, newDataSource);

      /**
       * Checks only for _missing_ L1 entities
       * WARNING: Does NOT check for entity staleness/versions. If an entity is stale, it will NOT be considered missing.
       *          If ExperienceBuilder wants to update stale entities, it should post  `▼UPDATED_ENTITY` message to SDK.
       */
      const isMissingL1Entities = (entityLinks: UnresolvedLink<'Entry' | 'Asset'>[]): boolean => {
        const { missingAssetIds, missingEntryIds } = entityStore.getMissingEntityIds(entityLinks);
        return Boolean(missingAssetIds.length) || Boolean(missingEntryIds.length);
      };

      /**
       * PRECONDITION: all L1 entities are fetched
       */
      const isMissingL2Entities = (deepReferences: DeepReference[]): boolean => {
        const referentLinks = deepReferences
          .map((deepReference) => deepReference.extractReferent(entityStore))
          .filter(isLink);
        const { missingAssetIds, missingEntryIds } = entityStore.getMissingEntityIds(referentLinks);
        return Boolean(missingAssetIds.length) || Boolean(missingEntryIds.length);
      };

      /**
       * POST_CONDITION: entityStore is has all L1 entities (aka headEntities)
       */
      const fillupL1 = async ({
        entityLinksL1,
      }: {
        entityLinksL1: UnresolvedLink<'Entry' | 'Asset'>[];
      }) => {
        const { missingAssetIds, missingEntryIds } = entityStore.getMissingEntityIds(entityLinksL1);
        await entityStore.fetchEntities({ missingAssetIds, missingEntryIds });
      };

      /**
       * PRECONDITION: all L1 entites are fetched
       */
      const fillupL2 = async ({ deepReferences }: { deepReferences: DeepReference[] }) => {
        const referentLinks = deepReferences
          .map((deepReference) => deepReference.extractReferent(entityStore))
          .filter(isLink);
        const { missingAssetIds, missingEntryIds } = entityStore.getMissingEntityIds(referentLinks);
        await entityStore.fetchEntities({ missingAssetIds, missingEntryIds });
      };

      try {
        if (isMissingL1Entities(entityLinksL1)) {
          startFetching();
          await fillupL1({ entityLinksL1 });
        }
        if (isMissingL2Entities(deepReferences)) {
          startFetching();
          await fillupL2({ deepReferences });
        }
      } catch (error) {
        console.error('[experiences-sdk-react] Failed fetching entities');
        console.error(error);
        throw error; // TODO: The original catch didn't let's rethrow; for the moment throw to see if we have any errors
      } finally {
        endFetching();
      }
    },
    [setEntitiesFetched /* setFetchingEntities, assembliesRegistry */],
  );

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
            `[experiences-sdk-react::onMessage] Ignoring alien incoming message from origin [${event.origin}], due to: [${reason}]`,
            event,
          );
        }
        return;
      }

      const eventData = tryParseMessage(event);
      console.debug(
        `[experiences-sdk-react::onMessage] Received message [${eventData.eventType}]`,
        eventData,
      );

      if (eventData.eventType === PostMessageMethods.REQUESTED_ENTITIES) {
        // Expected message: This message is handled in the EntityStore to store fetched entities
        return;
      }

      switch (eventData.eventType) {
        case INCOMING_EVENTS.ExperienceUpdated: {
          const { tree, locale, changedNode, changedValueType, assemblies } = eventData.payload;

          // Make sure to first store the assemblies before setting the tree and thus triggering a rerender
          if (assemblies) {
            setAssemblies(assemblies);
            // If the assemblyEntry is not yet fetched, this will be done below by
            // the imperative calls to fetchMissingEntities.
          }

          let newEntityStore = entityStore;
          if (entityStore.locale !== locale) {
            newEntityStore = resetEntityStore(locale);
            setLocale(locale);
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
              await fetchMissingEntities(newEntityStore, newDataSource, tree);
            } else if (changedValueType === 'UnboundValue') {
              setUnboundValues({
                ...unboundValues,
                ...changedNode.data.unboundValues,
              });
            }
          } else {
            const { dataSource, unboundValues } = getDataFromTree(tree);
            setDataSource(dataSource);
            setUnboundValues(unboundValues);
            await fetchMissingEntities(newEntityStore, dataSource, tree);
          }
          // Update the tree when all necessary data is fetched and ready for rendering.
          updateTree(tree);
          break;
        }
        case INCOMING_EVENTS.AssembliesRegistered: {
          const { assemblies } = eventData.payload;

          assemblies.forEach((definition) => {
            addComponentRegistration({
              component: Assembly,
              definition,
            });
          });
          break;
        }
        case INCOMING_EVENTS.AssembliesAdded: {
          const {
            assembly,
            assemblyDefinition,
          }: {
            assembly: ManagementEntity;
            assemblyDefinition?: ComponentRegistration['definition'];
          } = eventData.payload;
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
          const { selectedNodeId } = eventData.payload;
          if (selectedNodeId) {
            sendSelectedComponentCoordinates(selectedNodeId);
          }
          break;
        }
        case INCOMING_EVENTS.HoverComponent: {
          const { hoveredNodeId } = eventData.payload;
          setHoveredComponentId(hoveredNodeId);
          break;
        }
        case INCOMING_EVENTS.ComponentDraggingChanged: {
          const { isDragging } = eventData.payload;

          if (!isDragging) {
            setComponentId('');
            setDraggingOnCanvas(false);
            SimulateDnD.reset();
          }
          break;
        }
        case INCOMING_EVENTS.UpdatedEntity: {
          const { entity: updatedEntity, shouldRerender } = eventData.payload;
          if (updatedEntity) {
            const storedEntity = entityStore.entities.find(
              (entity) => entity.sys.id === updatedEntity.sys.id,
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
          if (SimulateDnD.isDragging) {
            //simulate a mouseup event to cancel the drag
            SimulateDnD.endDrag(0, 0);
          }
          break;
        }
        case INCOMING_EVENTS.ComponentDragStarted: {
          const { id, isAssembly } = eventData.payload;
          SimulateDnD.setupDrag();
          setComponentId(`${id}:${isAssembly}` || '');
          setDraggingOnCanvas(true);

          sendMessage(OUTGOING_EVENTS.ComponentSelected, {
            nodeId: '',
          });
          break;
        }
        case INCOMING_EVENTS.ComponentDragEnded: {
          SimulateDnD.reset();
          setComponentId('');
          setDraggingOnCanvas(false);
          break;
        }
        case INCOMING_EVENTS.SelectComponent: {
          const { selectedNodeId: nodeId } = eventData.payload;
          setSelectedNodeId(nodeId);
          sendSelectedComponentCoordinates(nodeId);
          break;
        }
        case INCOMING_EVENTS.MouseMove: {
          const { mouseX, mouseY } = eventData.payload;
          setMousePosition(mouseX, mouseY);

          if (SimulateDnD.isDraggingOnParent && !SimulateDnD.isDragging) {
            SimulateDnD.startDrag(mouseX, mouseY);
          } else {
            SimulateDnD.updateDrag(mouseX, mouseY);
          }

          break;
        }
        case INCOMING_EVENTS.ComponentMoveEnded: {
          const { mouseX, mouseY } = eventData.payload;
          SimulateDnD.endDrag(mouseX, mouseY);
          break;
        }
        default:
          console.error(
            `[experiences-sdk-react::onMessage] Logic error, unsupported eventType: [${(eventData as IncomingMessage).eventType}]`,
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
    setMousePosition,
    resetEntityStore,
    setHoveredComponentId,
  ]);

  /*
   * Handles on scroll business
   */
  useEffect(() => {
    let timeoutId = 0;
    let isScrolling = false;

    const onScroll = () => {
      setScrollY(window.scrollY);
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
      window.removeEventListener('scroll', onScroll, { capture: true });
      clearTimeout(timeoutId);
    };
  }, [selectedNodeId, setScrollY]);
}
