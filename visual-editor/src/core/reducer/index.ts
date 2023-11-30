import { Reducer } from 'react';
import { AppState, Config } from '../types/Config';

import { reduceData, reduceDropZones } from './data';
import { Action } from './actions';
import { reduceUi } from './state';

export * from './actions';
export * from './data';

export type ActionType = 'insert' | 'reorder';

export type StateReducer = Reducer<AppState, Action>;

const storeInterceptor = (reducer: StateReducer) => {
  return (state: AppState, action: Action) => {
    const newAppState = reducer(state, action);

    // const isValidType = !['registerZone', 'unregisterZone', 'setData', 'setUi', 'set'].includes(
    //   action.type
    // );

    return newAppState;
  };
};

export const createReducer = ({ config }: { config: Config<any> }): StateReducer =>
  storeInterceptor((state, action) => {
    const data = reduceData(state.data, action, config);
    const ui = reduceUi(state.ui, action);
    const dropZones = reduceDropZones(state.dropZones, action, config);

    if (action.type === 'set') {
      return { ...state, ...action.state };
    }

    return { data, ui, dropZones };
  });
