import { useCallback, useEffect, useState } from 'react';
import {
  sendMessage,
  getDataFromTree,
  doesMismatchMessageSchema,
  tryParseMessage,
  gatherDeepReferencesFromTree,
  DeepReference,
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

  const setComponentId = useDraggedItemStore((state) => state.setComponentId);
  const setDraggingOnCanvas = useDraggedItemStore((state) => state.setDraggingOnCanvas);

  // TODO: As we have disabled the useEffect, we can remove these states
  const [, /* isFetchingEntities */ setFetchingEntities] = useState(false);

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

  /**
   * Fills up entityStore with entities from newDataSource and from the tree.
   * Also manages "entity status" variables (areEntitiesFetched, isFetchingEntities)
   */
  const fetchMissingEntities = useCallback(
    async (newDataSource: CompositionDataSource, tree: CompositionTree) => {
      // if we realize that there's nothing missing and nothing to fill-fetch before we do any async call,
      // then we can simply return and not lock the EntityStore at all.
      const START_FETCHING = (): true => {
        setEntitiesFetched(false);
        setFetchingEntities(true);
        return true;
      };
      const END_FETCHING = (): true => {
        setEntitiesFetched(true);
        setFetchingEntities(false);
        return true;
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
        const extractReferent = (reference: DeepReference): Link<'Asset' | 'Entry'> | undefined => {
          const headEntity = entityStore.getEntityFromLink(reference.entityLink);
          const referentLink = headEntity!.fields[reference.field] as
            | Link<'Entry'>
            | Link<'Asset'>
            | undefined;
          return referentLink;
        };
        const referentLinks = deepReferences.map(extractReferent).filter(Boolean) as Link<
          'Asset' | 'Entry'
        >[];
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
        const extractReferent = (reference: DeepReference): Link<'Asset' | 'Entry'> | undefined => {
          const headEntity = entityStore.getEntityFromLink(reference.entityLink);
          const referentLink = headEntity!.fields[reference.field] as
            | Link<'Entry'>
            | Link<'Asset'>
            | undefined;
          return referentLink;
        };
        const referentLinks = deepReferences.map(extractReferent).filter(Boolean) as Link<
          'Asset' | 'Entry'
        >[];
        const { missingAssetIds, missingEntryIds } = entityStore.getMissingEntityIds(referentLinks);
        await entityStore.fetchEntities({ missingAssetIds, missingEntryIds });
      };

      try {
        isMissingL1Entities(entityLinksL1) &&
          START_FETCHING() &&
          (await fillupL1({ entityLinksL1 }));
        isMissingL2Entities(deepReferences) &&
          START_FETCHING() &&
          (await fillupL2({ deepReferences }));
      } catch (error) {
        console.error('[exp-builder.sdk] Failed fetching entities');
        console.error(error);
        throw error; // TODO: The original catch didn't let's rethrow; for the moment throw to see if we have any errors
      } finally {
        END_FETCHING();
      }
    },
    [
      /* dataSource, */ entityStore,
      setEntitiesFetched /* setFetchingEntities, assembliesRegistry */,
    ]
  );

  /*
  // this effect has weirdest race condition where it comes with areEntitiesFetched=false and isFetchinEntities=false 
  // despite the call below made within fetchMissingEntities()
  //       setEntitiesFetched(false);
  //       setFetchingEntities(true);
  // I disable it also, because it seems we don't need reactive wya to call fetchEntities()
  useEffect(() => {
    if (areEntitiesFetched || isFetchingEntities) return;
    fetchMissingEntities();
  }, [areEntitiesFetched, fetchMissingEntities, isFetchingEntities]);
  */
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
              await fetchMissingEntities(newDataSource, tree);
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
            await fetchMissingEntities(dataSource, tree);
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
      window.removeEventListener('scroll', onScroll, { capture: true });
      clearTimeout(timeoutId);
    };
  }, [selectedNodeId]);
}
