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
import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem } from '@/redux/draggedItemSlice';
import { RootState } from '@/redux/store';
import { DRAGGABLE_HEIGHT, DRAGGABLE_WIDTH } from '@/utils/constants';
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
  const { setSelectedNodeId, dragItem } = useEditorContext();
  const dispatch = useDispatch();
  const { draggedItem } = useSelector((state: RootState) => state.draggedItem);
  const [appState, appDispatch] = useReducer<StateReducer>(reducer, {
    ...defaultAppState,
    data,
  });

  const { ui } = appState;

  const { itemSelector } = ui;

  const setItemSelector = useCallback((newItemSelector: ItemSelector | null) => {
    appDispatch({
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

  useEffect(() => {
    appDispatch({
      type: 'setData',
      data,
    });
  }, [data]);

  console.log(data.children);

  return (
    <AppProvider value={{ state: appState, dispatch: appDispatch, config }}>
      <DragDropContext
        onDragUpdate={(update) => {
          const updatedItem = {
            destination: update.destination,
            id: update.draggableId,
            source: update.source,
          };
          const currentItem = {
            destination: draggedItem?.destination,
            id: draggedItem?.draggableId,
            source: draggedItem?.source,
          };

          if (isEqual(updatedItem, currentItem)) {
            return;
          }

          dispatch(updateItem(update));
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
          dispatch(updateItem(undefined));
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
            console.log('insert', droppedItem.destination);
            appDispatch({
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
              appDispatch({
                type: 'reorder',
                sourceIndex: source.index,
                destinationIndex: destination.index,
                destinationZone: destination.droppableId,
              });
            } else {
              appDispatch({
                type: 'move',
                sourceZone: source.droppableId,
                sourceIndex: source.index,
                destinationIndex: destination.index,
                destinationZone: destination.droppableId,
              });
            }
          }
        }}>
        <DropZoneProvider
          value={{
            data,
            itemSelector,
            setItemSelector,
            config,
            dispatch,
            placeholderStyle,
            mode: 'edit',
            areaId: 'root',
          }}>
          <dropZoneContext.Consumer>
            {(ctx) => (
              <>
                {dragItem && <DraggableContainer id={dragItem} />}
                <div
                  style={{
                    gridArea: 'editor',
                    position: 'relative',
                  }}
                  onClick={() => setItemSelector(null)}
                  id="puck-frame">
                  <div className="puck-root">
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
                </div>
              </>
            )}
          </dropZoneContext.Consumer>
        </DropZoneProvider>
      </DragDropContext>
    </AppProvider>
  );
};
