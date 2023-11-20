import React from 'react';
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
import { useResolvedData } from '../../lib/use-resolved-data';
import DraggableContainer from './DraggableContainer';
import {
  INCOMING_EVENTS,
  tryParseMessage,
  doesMismatchMessageSchema,
  OUTGOING_EVENTS,
} from '@contentful/experience-builder';
import { sendMessage } from '@/communication/sendMessage';
export const tryParse = (data: any) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export function Puck({
  config,
  data: initialData = {
    content: [],
    root: { props: { title: '' }, title: '' },
  },
  onChange,
}: {
  config: Config;
  data: Data;
  onChange?: (data: Data) => void;
}) {
  const [reducer] = useState(() => createReducer({ config }));

  // useEffect(() => {

  // }, [])
  const [initialAppState] = useState<AppState>({
    ...defaultAppState,
    data: initialData,
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

  const { data, ui } = appState;

  const { resolveData, componentState } = useResolvedData(data, config, dispatch);

  const { itemSelector, leftSideBarVisible } = ui;

  const setItemSelector = useCallback((newItemSelector: ItemSelector | null) => {
    dispatch({
      type: 'setUi',
      ui: { itemSelector: newItemSelector },
    });
  }, []);

  const selectedItem = itemSelector ? getItem(itemSelector, data) : null;

  const Page = useCallback(
    (pageProps: any) =>
      config.root?.render
        ? config.root?.render({ ...pageProps, editMode: true })
        : pageProps.children,
    [config.root]
  );

  // const ComponentListWrapper = useCallback((props) => {
  //   const children = (
  //     <PluginRenderer
  //       plugins={plugins}
  //       renderMethod="renderComponentList"
  //       dispatch={props.dispatch}
  //       state={props.state}
  //     >
  //       {props.children}
  //     </PluginRenderer>
  //   );

  //   // User's render method wraps the plugin render methods
  //   return renderComponentList
  //     ? renderComponentList({
  //         children,
  //         dispatch,
  //         state: appState,
  //       })
  //     : children;
  // }, []);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const { onDragStartOrUpdate, placeholderStyle } = usePlaceholderStyle();

  const [draggedItem, setDraggedItem] = useState<DragStart & Partial<DragUpdate>>();

  // const componentList = useComponentList(config, appState.ui);

  // DEPRECATED
  useEffect(() => {
    if (Object.keys(data.root).length > 0 && !data.root.props) {
      console.error(
        'Warning: Defining props on `root` is deprecated. Please use `root.props`. This will be a breaking change in a future release.'
      );
    }
  }, []);

  const dragState = useRef({
    isDragging: false,
    dragStarted: false,
  });

  const [dragItem, setDragItem] = useState<string>();

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
      dragState.current.dragStarted = true;
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

    if (!dragState.current.dragStarted) {
      return;
    }

    let name = 'mousemove';

    if (!dragState.current.isDragging) {
      updateDraggableElement(coordX, coordY);

      name = 'mousedown';
      dragState.current.isDragging = true;
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
        //

        simulateMouseEvent(e.pageX, e.pageY);
      }}>
      <AppProvider value={{ state: appState, dispatch, config, componentState }}>
        <DragDropContext
          onDragUpdate={(update) => {
            setDraggedItem({ ...draggedItem, ...update });
            onDragStartOrUpdate(update);
          }}
          onBeforeDragStart={(start) => {
            onDragStartOrUpdate(start);
            setItemSelector(null);
          }}
          onDragEnd={(droppedItem) => {
            setDraggedItem(undefined);
            dragState.current = {
              isDragging: false,
              dragStarted: false,
            };

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
              const [_, componentId] = droppedItem.draggableId.split('::');

              dispatch({
                type: 'insert',
                componentType: componentId || droppedItem.draggableId,
                destinationIndex: droppedItem.destination!.index,
                destinationZone: droppedItem.destination.droppableId,
              });

              setItemSelector({
                index: droppedItem.destination!.index,
                zone: droppedItem.destination.droppableId,
              });

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

              setItemSelector({
                index: destination.index,
                zone: destination.droppableId,
              });
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
                        height: '100%',
                      }}
                      onClick={() => setItemSelector(null)}
                      id="puck-frame">
                      <div
                        className="puck-root"
                        style={{
                          height: '100%',
                          boxShadow: '0px 0px 0px 32px var(--puck-color-grey-10)',
                          // margin: 32,
                          zoom: 0.75,
                        }}>
                        <div
                          style={{
                            border: '1px solid var(--puck-color-grey-8)',
                          }}>
                          <Page dispatch={dispatch} state={appState} {...data.root}>
                            <DropZone zone={rootDroppableId} />
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
}
