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
  type InMemoryEntitiesStore,
  debug,
  treeVisit,
} from '@contentful/experiences-core';
import {
  OUTGOING_EVENTS,
  INCOMING_EVENTS,
  PostMessageMethods,
} from '@contentful/experiences-core/constants';
import {
  ExperienceTree,
  ComponentRegistration,
  ExperienceDataSource,
  ManagementEntity,
  IncomingMessage,
} from '@contentful/experiences-core/types';
import { useTreeStore } from '@/store/tree';
import { useEditorStore } from '@/store/editor';
import { Assembly } from '@contentful/experiences-components-react';
import { addComponentRegistration, getAllAssemblyRegistrations } from '@/store/registries';
import { UnresolvedLink } from 'contentful';

export function useEditorSubscriber(inMemoryEntitiesStore: InMemoryEntitiesStore) {
  const entityStore = inMemoryEntitiesStore((state) => state.entityStore);
  const areEntitiesFetched = inMemoryEntitiesStore((state) => state.areEntitiesFetched);
  const setEntitiesFetched = inMemoryEntitiesStore((state) => state.setEntitiesFetched);
  const resetEntityStore = inMemoryEntitiesStore((state) => state.resetEntityStore);

  const { updateTree, updateNodesByUpdatedEntity } = useTreeStore((state) => ({
    updateTree: state.updateTree,
    updateNodesByUpdatedEntity: state.updateNodesByUpdatedEntity,
  }));
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const dataSource = useEditorStore((state) => state.dataSource);
  const setLocale = useEditorStore((state) => state.setLocale);
  const setUnboundValues = useEditorStore((state) => state.setUnboundValues);
  const setDataSource = useEditorStore((state) => state.setDataSource);

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

      // Collect all used assemblies from the tree to fetch those
      const allAssemblyIds = getAllAssemblyRegistrations().map((reg) => reg.definition.id);
      const usedAssemblyIds = new Set<string>();
      treeVisit(tree.root, (node) => {
        if (allAssemblyIds.includes(node.data.blockId!)) {
          usedAssemblyIds.add(node.data.blockId!);
        }
      });
      const usedAssemblyLinks = Array.from(usedAssemblyIds).map(
        (id) => ({ sys: { id, linkType: 'Entry', type: 'Link' } }) as const,
      );

      // Prepare L1 entities and deepReferences
      const entityLinksL1 = [
        ...Object.values(newDataSource),
        ...usedAssemblyLinks, // we count assemblies here as "L1 entities", for convenience. Even though they're not headEntities.
      ];

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

        const deepReferences = gatherDeepReferencesFromTree(
          tree.root,
          newDataSource,
          entityStore.getEntityFromLink.bind(entityStore),
        );
        if (isMissingL2Entities(deepReferences)) {
          startFetching();
          await fillupL2({ deepReferences });
        }
      } catch (error) {
        debug.error(
          '[experiences-visual-editor-react::useEditorSubscriber] Failed fetching entities',
          { error },
        );
        throw error; // TODO: The original catch didn't let's rethrow; for the moment throw to see if we have any errors
      } finally {
        endFetching();
      }
    },
    [setEntitiesFetched /* setFetchingEntities */],
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
          debug.warn(
            `[experiences-visual-editor-react::onMessage] Ignoring alien incoming message from origin [${event.origin}], due to: [${reason}]`,
            event,
          );
        }
        return;
      }

      const eventData = tryParseMessage(event);
      debug.debug(
        `[experiences-visual-editor-react::onMessage] Received message [${eventData.eventType}]`,
        eventData,
      );

      if (eventData.eventType === PostMessageMethods.REQUESTED_ENTITIES) {
        // Expected message: This message is handled in the EntityStore to store fetched entities
        return;
      }

      switch (eventData.eventType) {
        case INCOMING_EVENTS.ExperienceUpdated: {
          const { tree, locale, changedNode, changedValueType } = eventData.payload;

          let newEntityStore = entityStore;
          if (entityStore.locale !== locale) {
            newEntityStore = new EditorModeEntityStore({ locale, entities: [] });
            setLocale(locale);
            resetEntityStore(newEntityStore);
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
              await fetchMissingEntities(
                newEntityStore as EditorModeEntityStore,
                newDataSource,
                tree,
              );
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
            await fetchMissingEntities(newEntityStore as EditorModeEntityStore, dataSource, tree);
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
          if (assemblyDefinition) {
            addComponentRegistration({
              component: Assembly,
              definition: assemblyDefinition,
            });
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
        default: {
          const knownEvents = Object.values(INCOMING_EVENTS);
          const isDeprecatedMessage = knownEvents.includes(eventData.eventType);
          if (!isDeprecatedMessage) {
            debug.error(
              `[experiences-visual-editor-react::onMessage] Logic error, unsupported eventType: [${(eventData as IncomingMessage).eventType}]`,
            );
          }
        }
      }
    };

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [
    entityStore,
    setDataSource,
    setLocale,
    dataSource,
    areEntitiesFetched,
    fetchMissingEntities,
    setUnboundValues,
    unboundValues,
    updateTree,
    updateNodesByUpdatedEntity,
    resetEntityStore,
  ]);
}
