import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import { sendHoveredComponentCoordinates } from '../../communication/sendHoveredComponentCoordinates';
import { sendMessage } from '../../communication/sendMessage';
import { sendSelectedComponentCoordinates } from '../../communication/sendSelectedComponentCoordinates';
import {
  addComponentRegistration,
  sendConnectedEventWithRegisteredComponents,
  sendRegisteredComponentsMessage,
} from '../../core/componentRegistry';
import { EditorModeEntityStore } from '../../core/editor/EditorModeEntityStore';
import {
  Breakpoint,
  ComponentRegistration,
  CompositionComponentNode,
  CompositionComponentPropValue,
  CompositionDataSource,
  CompositionTree,
  CompositionUnboundValues,
  InternalSDKMode,
  EntityStore,
  Link,
} from '../../types';
import { INCOMING_EVENTS, OUTGOING_EVENTS, SCROLL_STATES, INTERNAL_EVENTS } from '../../constants';
import { getDataFromTree } from '../../utils/utils';
import { doesMismatchMessageSchema, tryParseMessage } from '../../utils/validation';
import { Entry } from 'contentful';
import { DesignComponent } from '../../components/DesignComponent';
import { PostMessageMethods } from '@contentful/visual-sdk';

type VisualEditorContextType = {
  tree: CompositionTree | undefined;
  dataSource: CompositionDataSource;
  isDragging: boolean;
  locale: string | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string) => void;
  unboundValues: CompositionUnboundValues;
  breakpoints: Breakpoint[];
  entityStore: EditorModeEntityStore;
  areInitialEntitiesFetched: boolean;
};

export const VisualEditorContext = React.createContext<VisualEditorContextType>({
  tree: undefined,
  dataSource: {},
  unboundValues: {},
  isDragging: false,
  selectedNodeId: null,
  setSelectedNodeId: () => {
    /* noop */
  },
  locale: null,
  breakpoints: [],
  entityStore: {} as EditorModeEntityStore,
  areInitialEntitiesFetched: false,
});

type VisualEditorContextProviderProps = {
  initialLocale: string;
  mode: InternalSDKMode;
  children: ReactElement;
  previousEntityStore?: EntityStore;
};

// Note: During development, the hot reloading might empty this and it
// stays empty leading to not rendering design components. Ideally, this is
// integrated into the state machine to keep track of its state.
export const designComponentsRegistry = new Map<string, Link<'Entry'>>([]);
export const setDesignComponents = (designComponents: Link<'Entry'>[]) => {
  for (const designComponent of designComponents) {
    designComponentsRegistry.set(designComponent.sys.id, designComponent);
  }
};

export function VisualEditorContextProvider({
  initialLocale,
  mode,
  children,
  previousEntityStore,
}: VisualEditorContextProviderProps) {
  const hasConnectEventBeenSent = useRef(false);
  const [tree, setTree] = useState<CompositionTree>();
  const [dataSource, setDataSource] = useState<CompositionDataSource>({});
  const [unboundValues, setUnboundValues] = useState<CompositionUnboundValues>({});
  const [isDragging, setIsDragging] = useState(false);
  const selectedNodeId = useRef<string>('');
  const [locale, setLocale] = useState<string>(initialLocale);
  const [areInitialEntitiesFetched, setInitialEntitiesFetched] = useState(false);
  const [isFetchingEntities, setFetchingEntities] = useState(false);

  const [entityStore, setEntityStore] = useState<EditorModeEntityStore>(
    () =>
      new EditorModeEntityStore({
        // Initially, the SDK boots in preview mode and already fetches entities.
        // We utilizes the previosuly existing store to avoid loading twice and
        // have the entities ready as early as possible.
        entities: previousEntityStore?.entities ?? [],
        locale,
      })
  );

  // Reload the entity store when the locale changed
  useEffect(() => {
    const storeLocale = entityStore.locale;
    if (!locale || locale === storeLocale) return;
    console.debug(
      `[exp-builder.sdk] Resetting entity store because the locale changed from '${storeLocale}' to '${locale}'.`
    );
    setEntityStore(
      new EditorModeEntityStore({
        entities: [],
        locale: locale,
      })
    );
  }, [entityStore, locale]);

  // Either gets called when dataSource changed or designComponetsRegistry changed (manually)
  const fetchMissingEntities = useCallback(async () => {
    const entityLinks = [...Object.values(dataSource), ...designComponentsRegistry.values()];
    const { missingAssetIds, missingEntryIds } = entityStore.getMissingEntityIds(entityLinks);
    // Only continue and trigger rerendering when we need to fetch something and we're not fetching yet
    if (!missingAssetIds.length && !missingEntryIds.length) {
      setInitialEntitiesFetched(true);
      return;
    }
    setInitialEntitiesFetched(false);
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
      setInitialEntitiesFetched(true);
      setFetchingEntities(false);
    }
  }, [dataSource, entityStore]);

  // When the tree was updated, we store the dataSource and
  // afterward, this effect fetches the respective entities.
  useEffect(() => {
    if (areInitialEntitiesFetched || isFetchingEntities) return;
    fetchMissingEntities();
  }, [areInitialEntitiesFetched, fetchMissingEntities, isFetchingEntities]);

  const reloadApp = () => {
    sendMessage(OUTGOING_EVENTS.CanvasReload, {});
    // Wait a moment to ensure that the message was sent
    setTimeout(() => {
      // Received a hot reload message from webpack dev server -> reload the canvas
      window.location.reload();
    }, 50);
  };

  // sends component definitions to the web app
  // InternalEvents.COMPONENTS_REGISTERED is triggered by defineComponents function
  useEffect(() => {
    if (!hasConnectEventBeenSent.current) {
      // sending CONNECT but with the registered components now
      sendConnectedEventWithRegisteredComponents();
      hasConnectEventBeenSent.current = true;
    }

    const onComponentsRegistered = () => {
      sendRegisteredComponentsMessage();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(INTERNAL_EVENTS.ComponentsRegistered, onComponentsRegistered);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(INTERNAL_EVENTS.ComponentsRegistered, onComponentsRegistered);
      }
    };
  }, []);

  useEffect(() => {
    if (mode !== 'editor') {
      return;
    }

    // once switched to editor, we request the update from the web app to send the data to render on canvas
    sendMessage(OUTGOING_EVENTS.RequestComponentTreeUpdate);
  }, [mode]);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    // We only care about this communication when in editor mode
    if (mode !== 'editor') return;
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
      console.debug(
        `[exp-builder.sdk::onMessage] Received message [${eventData.eventType}]`,
        eventData
      );

      if (eventData.eventType === PostMessageMethods.REQUESTED_ENTITIES) {
        // Expected message: This message is handled in the visual-sdk to store fetched entities
        return;
      }

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
          // Make sure to first store the design components before setting the tree and thus triggering a rerender
          if (designComponents) {
            setDesignComponents(designComponents);
            // Since design components are stored outside of the React state, we need to manually update the entity store
            // TODO: Move designComponentsRegistry into React to avoid these async issues and manual tweaks
            await fetchMissingEntities();
          }
          setTree(tree);
          setLocale(locale);

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
        case INCOMING_EVENTS.CanvasResized:
        case INCOMING_EVENTS.SelectComponent: {
          const { selectedNodeId: nodeId } = payload;
          selectedNodeId.current = nodeId;
          sendSelectedComponentCoordinates(nodeId);
          break;
        }
        case INCOMING_EVENTS.HoverComponent: {
          const { hoveredNodeId } = payload;
          sendHoveredComponentCoordinates(hoveredNodeId);
          break;
        }
        case INCOMING_EVENTS.ComponentDraggingChanged: {
          const { isDragging } = payload;
          setIsDragging(isDragging);
          break;
        }
        case INCOMING_EVENTS.UpdatedEntity: {
          const { entity } = payload;
          if (entity) {
            entityStore.updateEntity(entity);
          }
          break;
        }
        case INCOMING_EVENTS.RequestEditorMode: {
          // do nothing cause we are already in editor mode
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
  }, [fetchMissingEntities, entityStore, mode]);

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
        sendSelectedComponentCoordinates(selectedNodeId.current);
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
        isDragging,
        selectedNodeId: selectedNodeId.current,
        setSelectedNodeId,
        locale,
        breakpoints: tree?.root.data.breakpoints ?? [],
        entityStore,
        areInitialEntitiesFetched,
      }}>
      {children}
    </VisualEditorContext.Provider>
  );
}
