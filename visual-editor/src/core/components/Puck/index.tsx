import React, { RefObject } from 'react';
import { createElement, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { DragDropContext, DragStart, DragUpdate, Draggable, Droppable } from '@hello-pangea/dnd';
import type { AppState, Config, Data } from '../../types/Config';
import { usePlaceholderStyle } from '../../lib/use-placeholder-style';
import { DropZone, DropZoneProvider, dropZoneContext } from '../DropZone';
import { rootDroppableId } from '../../lib/root-droppable-id';
import { ItemSelector, getItem } from '../../lib/get-item';
import { StateReducer, createReducer } from '../../reducer';
import { flushZones } from '../../lib/flush-zones';
import { AppProvider, defaultAppState } from './context';
import DraggableContainer from './DraggableContainer';
import {
  INCOMING_EVENTS,
  tryParseMessage,
  doesMismatchMessageSchema,
  OUTGOING_EVENTS,
} from '@contentful/experience-builder';
import type { EntityStore } from '@contentful/visual-sdk';
import { sendMessage } from '@/communication/sendMessage';
import { CompositionDataSource, CompositionUnboundValues } from '@/types';
import { ResolveDesignValueType } from '@/hooks/useBreakpoints';
import { useEditorContext } from '@components/editor/useEditorContext';
import dragState from '@/core/dragState';
export const tryParse = (data: any) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

interface Props {
  data: Data;

  dataSource: CompositionDataSource;
  unboundValues: CompositionUnboundValues;
  config: Config;
  resolveDesignValue: ResolveDesignValueType;
  entityStore: RefObject<EntityStore>;
  areEntitiesFetched: boolean;
  onChange?: (data: Data) => void;
}

export const Puck: React.FC<Props> = ({
  data,
  onChange,
  config,
  dataSource,
  unboundValues,
  resolveDesignValue,
  entityStore,
  areEntitiesFetched,
}) => {
  const [reducer] = useState(() => createReducer({ config }));
  const { setSelectedNodeId } = useEditorContext();
  const [initialAppState] = useState<AppState>({
    ...defaultAppState,
    data,
    ui: {
      ...defaultAppState.ui,

      // Store categories under componentList on state to allow render functions and plugins to modify
      componentList: config.categories
        ? Object.entries(config.categories).reduce((acc, [categoryName, category]) => {
            return {
              ...acc,
              [categoryName]: {
                title: category.title,
                components: category.components,
                expanded: category.defaultExpanded,
                visible: category.visible,
              },
            };
          }, {})
        : {},
    },
  });

  const [appState, dispatch] = useReducer<StateReducer>(reducer, flushZones(initialAppState));

  const { ui } = appState;

  const { itemSelector } = ui;

  const setItemSelector = useCallback((newItemSelector: ItemSelector | null) => {
    dispatch({
      type: 'setUi',
      ui: { itemSelector: newItemSelector },
    });
  }, []);

  const Page = useCallback(
    (pageProps: any) =>
      config.root?.render
        ? config.root?.render({ ...pageProps, editMode: true })
        : pageProps.children,
    [config.root]
  );

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const { onDragStartOrUpdate, placeholderStyle } = usePlaceholderStyle();

  const [draggedItem, setDraggedItem] = useState<DragStart & Partial<DragUpdate>>();

  const [dragItem, setDragItem] = useState<string>();

  useEffect(() => {
    dispatch({
      type: 'setData',
      data,
    });
  }, [data]);

  useEffect(() => {
    window.addEventListener('message', receiveMessage, false);

    return () => {
      window.removeEventListener('message', receiveMessage, false);
    };
  }, []);

  const receiveMessage = (event: any) => {
    // Check the origin of the message for security
    let reason;
    if ((reason = doesMismatchMessageSchema(event))) {
      if (
        event.origin.startsWith('http://localhost') &&
        `${event.data}`.includes('webpackHotUpdate')
      ) {
        // reloadApp();
        return;
      } else {
        console.warn(
          `[exp-builder.sdk::onMessage] Ignoring alien incoming message from origin [${event.origin}], due to: [${reason}]`,
          event
        );
      }
      return;
    }

    const eventData = tryParseMessage(event);

    const { payload } = eventData;

    if (eventData.eventType === INCOMING_EVENTS.ComponentDragStarted) {
      dragState.updateIsDragStartedOnParent(true);
      setDragItem(payload.id || 'Heading');
      return;
    }
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
      clientX: coordX,
      clientY: coordY,
    };

    if (!element) {
      return;
    }

    const event = new MouseEvent(name, options);
    element.dispatchEvent(event);
  }

  console.log(data);

  return (
    <div
      className="puck"
      style={{
        height: '100%',
      }}
      onMouseMove={(e: any) => {
        if (e.target?.id === 'item') {
          return;
        }

        if (!dragState.isDragStart) {
          return;
        }

        simulateMouseEvent(e.pageX, e.pageY);
      }}>
      <AppProvider value={{ state: appState, dispatch, config }}>
        <DragDropContext
          onDragUpdate={(update) => {
            setDraggedItem({ ...draggedItem, ...update });
            onDragStartOrUpdate(update);
          }}
          onBeforeDragStart={(start) => {
            onDragStartOrUpdate(start);
            setItemSelector(null);
            setSelectedNodeId('');
            sendMessage(OUTGOING_EVENTS.ComponentSelected, {
              nodeId: '',
            });
          }}
          onDragEnd={(droppedItem) => {
            setDraggedItem(undefined);
            dragState.reset();

            sendMessage(OUTGOING_EVENTS.MouseUp);
            // User cancel drag
            if (!droppedItem.destination) {
              return;
            }

            // New component
            if (
              droppedItem.source.droppableId.startsWith('component-list') &&
              droppedItem.destination
            ) {
              dispatch({
                type: 'insert',
                componentType: droppedItem.draggableId,
                destinationIndex: droppedItem.destination!.index,
                destinationZone: droppedItem.destination.droppableId,
              });
              // setItemSelector({
              //   id: droppedItem.
              // })

              // setItemSelector({
              //   index: droppedItem.destination!.index,
              //   zone: droppedItem.destination.droppableId,
              // });

              return;
            } else {
              const { source, destination } = droppedItem;

              if (source.droppableId === destination.droppableId) {
                dispatch({
                  type: 'reorder',
                  sourceIndex: source.index,
                  destinationIndex: destination.index,
                  destinationZone: destination.droppableId,
                });
              } else {
                dispatch({
                  type: 'move',
                  sourceZone: source.droppableId,
                  sourceIndex: source.index,
                  destinationIndex: destination.index,
                  destinationZone: destination.droppableId,
                });
              }

              // setItemSelector({
              //   index: destination.index,
              //   zone: destination.droppableId,
              // });
            }
          }}>
          <DropZoneProvider
            value={{
              data,
              itemSelector,
              setItemSelector,
              config,
              dispatch,
              draggedItem,
              placeholderStyle,
              mode: 'edit',
              areaId: 'root',
            }}>
            <dropZoneContext.Consumer>
              {(ctx) => {
                return (
                  <>
                    {dragItem && <DraggableContainer id={dragItem} />}
                    {/* <DraggableContainer
                      id="Heading"
                      initialX={0}
                      initialY={0}
                    /> */}
                    <div
                      style={{
                        overflowY: 'auto',
                        gridArea: 'editor',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onClick={() => setItemSelector(null)}
                      id="puck-frame">
                      <div
                        className="puck-root"
                        style={
                          {
                            // margin: 32,
                            // zoom: 0.75,
                          }
                        }>
                        <div
                          style={{
                            border: '1px solid transparent',
                          }}>
                          <Page dispatch={dispatch} state={appState} {...data.root}>
                            <DropZone
                              zone={rootDroppableId}
                              unboundValues={unboundValues}
                              areEntitiesFetched={areEntitiesFetched}
                              dataSource={dataSource}
                              resolveDesignValue={resolveDesignValue}
                              entityStore={entityStore}
                            />
                          </Page>
                        </div>
                      </div>
                      {/* Fill empty space under root */}
                    </div>
                  </>
                );
              }}
            </dropZoneContext.Consumer>
          </DropZoneProvider>
        </DragDropContext>
      </AppProvider>
    </div>
  );
};
